// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.8.3;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol';
import './interfaces/IManager.sol';
import './interfaces/IFactory.sol';
import './interfaces/IERC721Tpl.sol';
import './interfaces/IERC20Tpl.sol';
import './interfaces/IERC20WrapperTpl.sol';
import './interfaces/ISync.sol';
import './interfaces/IUUPSUpgradeable.sol';
import './interfaces/IPause.sol';
import './interfaces/IERC20Freeze.sol';
import './interfaces/external/IERC1271.sol';

/// @title The implement for the Manager
contract Manager is IManager, Initializable, UUPSUpgradeable {
    /**
     * @dev See {IManager-factory}.
     */
    IFactory public override factory;

    /**
     * @dev See {IManager-issueFeeRecipient}.
     */
    address public override issueFeeRecipient;

    /**
     * @dev See {IManager-redeemFeeRecipient}.
     */
    address public override redeemFeeRecipient;

    /**
     * @dev See {IManager-managementFeeRecipient}.
     */
    address public override managementFeeRecipient;

    /**
     * @dev See {IManager-factoryController}.
     */
    address public override factoryController;

    /**
     * @dev See {IManager-feeController}.
     */
    address public override feeController;

    /**
     * @dev See {IManager-assetController}.
     */
    address public override assetController;

    /**
     * @dev See {IManager-syncController}.
     */
    address public override syncController;

    /**
     * @dev See {IManager-rebaseController}.
     */
    address public override rebaseController;

    /**
     * @dev See {IManager-rebaseInterval}.
     */
    uint256 public override rebaseInterval;

    /**
     * @dev See {IManager-rebaseFeeRates}.
     */
    mapping(string => uint256) public override rebaseFeeRates;

    /**
     * @dev See {IManager-rebaseHistories}.
     */
    mapping(string => uint256) public override rebaseHistories;

    /**
     * @dev Returns the domain separator used in the encoding of the signature for {validateRedemption}, as defined by {EIP712}.
     */
    bytes32 public DOMAIN_SEPARATOR;

    // keccak256('Redeem(address owner,uint256 value,uint256[] tokenIds,uint256 nonce,uint256 deadline)');
    bytes32 public constant REDEEM_TYPEHASH = 0xa96aa8ecbda4b2f95313da086ee125547a81d1709e7c3e73b6ce62683cb254e1;

    /**
     * @dev Returns the current nonce for `owner`. This value must be
     * included whenever a signature is generated for {validateRedemption}.
     *
     * Every successful call to {validateRedemption} increases ``owner``'s nonce by one. This
     * prevents a signature from being used multiple times.
     */
    mapping(address => uint256) public nonces;

    /**
     * @notice Emitted when factory is set
     * @param oldAddr The old address of factory
     * @param newAddr The new address of factory
     */
    event FactorySet(address oldAddr, address newAddr);

    /**
     * @notice Emitted when issue fee recipient is set
     * @param oldAddr The old address of issue fee recipient
     * @param newAddr The new address of issue fee recipient
     */
    event IssueFeeRecipientSet(address oldAddr, address newAddr);

    /**
     * @notice Emitted when redeem fee recipient is set
     * @param oldAddr The old address of redeem fee recipient
     * @param newAddr The new address of redeem fee recipient
     */
    event RedeemFeeRecipientSet(address oldAddr, address newAddr);

    /**
     * @notice Emitted when management fee recipient is set
     * @param oldAddr The old address of management fee recipient
     * @param newAddr The new address of management fee recipient
     */
    event ManagementFeeRecipientSet(address oldAddr, address newAddr);

    /**
     * @notice Emitted when factory controller is set
     * @param oldAddr The old address of factory controller
     * @param newAddr The new address of factory controller
     */
    event FactoryControllerSet(address oldAddr, address newAddr);

    /**
     * @notice Emitted when fee controller is set
     * @param oldAddr The old address of fee controller
     * @param newAddr The new address of fee controller
     */
    event FeeControllerSet(address oldAddr, address newAddr);

    /**
     * @notice Emitted when asset controller is set
     * @param oldAddr The old address of asset controller
     * @param newAddr The new address of asset controller
     */
    event AssetControllerSet(address oldAddr, address newAddr);

    /**
     * @notice Emitted when sync controller is set
     * @param oldAddr The old address of sync controller
     * @param newAddr The new address of sync controller
     */
    event SyncControllerSet(address oldAddr, address newAddr);

    /**
     * @notice Emitted when rebase controller is set
     * @param oldAddr The old address of rebase controller
     * @param newAddr The new address of rebase controller
     */
    event RebaseControllerSet(address oldAddr, address newAddr);

    /**
     * @notice Emitted when rebase interval is set
     * @param oldInterval The old interval of rebase
     * @param newInterval The new interval of rebase
     */
    event RebaseIntervalSet(uint256 oldInterval, uint256 newInterval);

    /**
     * @notice Emitted when issue fee rate is set
     * @param symbol The ERC20 token symbol
     * @param oldRate The old rate of issue fee
     * @param newRate The new rate of issue fee
     */
    event IssueFeeRateSetTo(string symbol, uint256 oldRate, uint256 newRate);

    /**
     * @notice Emitted when redeem fee rate is set
     * @param symbol The ERC20 token symbol
     * @param oldRate The old rate of redeem fee
     * @param newRate The new rate of redeem fee
     */
    event RedeemFeeRateSetTo(string symbol, uint256 oldRate, uint256 newRate);

    /**
     * @notice Emitted when rebase fee rate is set
     * @param symbol The ERC20 token symbol
     * @param oldRate The old rate of rebase fee
     * @param newRate The new rate of rebase fee
     */
    event RebaseFeeRateSetTo(string symbol, uint256 oldRate, uint256 newRate);

    /**
     * @notice Emitted when rebase executed
     * @param symbol The ERC20 token symbol
     * @param timestamp The timestamp when rebase executed
     */
    event RebasedTo(string indexed symbol, uint256 timestamp);

    /**
     * @notice Emitted when baseURI is set
     * @param tokenAddr The ERC721 contract address
     * @param baseURI The new baseURI
     */
    event BaseURISetTo(address tokenAddr, string baseURI);

    /**
     * @notice Emitted when tokenURI is set
     * @param tokenAddr The ERC721 contract address
     * @param tokenIds The tokenIds need to be updated
     * @param tokenURIs The new tokenURIs
     */
    event TokenURISetTo(address tokenAddr, uint256[] tokenIds, string[] tokenURIs);

    /**
     * @notice Emitted when ERC721 token is issued
     * @param symbol The ERC20 token symbol
     * @param toAddr The receive address
     * @param erc20Amounts The ERC20 token amounts
     * @param tokenURIs The ERC721 tokenURIs
     */
    event Erc721IssuedTo(string symbol, address toAddr, uint256[] erc20Amounts, string[] tokenURIs);

    /**
     * @notice Emitted when ERC721 token is redeemed
     * @param symbol The ERC20 token symbol
     * @param fromAddr The address to be redeemed from
     * @param tokenIds The ERC721 tokenId to be redeemed
     */
    event Erc721RedeemedFrom(string symbol, address fromAddr, uint256[] tokenIds);

    /**
     * @notice Emitted when ERC20 token is issued
     * @param symbol The ERC20 token symbol
     * @param toAddr The receive address
     * @param amount The ERC20 token amount to be issued
     */
    event Erc20IssuedTo(string symbol, address toAddr, uint256 amount);

    /**
     * @notice Emitted when ERC20 token is redeemed
     * @param symbol The ERC20 token symbol
     * @param fromAddr The address to be redeemed from
     * @param amount The ERC20 token amount to be redeemed
     */
    event Erc20RedeemedFrom(string symbol, address fromAddr, uint256 amount);

    /**
     * @notice Emitted when pause executed
     * @param tokenAddr The ERC20 or ERC20Wrapper contract address
     */
    event PausedTo(address tokenAddr);

    /**
     * @notice Emitted when unpause executed
     * @param tokenAddr The ERC20 or ERC20Wrapper contract address
     */
    event UnpausedTo(address tokenAddr);

    /**
     * @notice Emitted when proxy upgraded
     * @param proxy The proxy contract
     * @param oldImpl The old implementation
     * @param newImpl The new implementation
     */
    event UpgradedTo(address proxy, address oldImpl, address newImpl);

    modifier onlyFeeController() {
        require(msg.sender == feeController, 'onlyFeeController');
        _;
    }

    modifier onlyAssetController() {
        require(msg.sender == assetController, 'onlyAssetController');
        _;
    }

    modifier onlyFactoryController() {
        require(msg.sender == factoryController, 'onlyFactoryController');
        _;
    }

    modifier onlySyncController() {
        require(msg.sender == syncController, 'onlySyncController');
        _;
    }

    modifier onlyRebaseController() {
        require(msg.sender == rebaseController, 'onlyRebaseController');
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    /**
     * @dev See {IManager-initialize}.
     */
    function initialize(
        address _issueFeeRecipient,
        address _redeemFeeRecipient,
        address _managementFeeRecipient,
        address _feeController,
        address _assetController,
        address _factoryController,
        address _syncController,
        address _rebaseController,
        address _factory
    ) public override initializer {
        require(
            _issueFeeRecipient != address(0) &&
                _redeemFeeRecipient != address(0) &&
                _managementFeeRecipient != address(0) &&
                _feeController != address(0) &&
                _assetController != address(0) &&
                _factoryController != address(0) &&
                _syncController != address(0) &&
                _rebaseController != address(0) &&
                _factory != address(0),
            'zero address'
        );

        issueFeeRecipient = _issueFeeRecipient;
        redeemFeeRecipient = _redeemFeeRecipient;
        managementFeeRecipient = _managementFeeRecipient;
        feeController = _feeController;
        assetController = _assetController;
        factoryController = _factoryController;
        syncController = _syncController;
        rebaseController = _rebaseController;
        factory = IFactory(_factory);

        rebaseInterval = 3600 * 8;

        require(
            keccak256('Redeem(address owner,uint256 value,uint256[] tokenIds,uint256 nonce,uint256 deadline)') ==
                REDEEM_TYPEHASH,
            'invalid REDEEM_TYPEHASH'
        );

        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)'),
                keccak256(bytes('manager')),
                keccak256(bytes('1')),
                block.chainid,
                address(this)
            )
        );
    }

    /**
     * @dev See {IManager-feeBase}.
     */
    function feeBase() public pure override returns (uint256) {
        return 10**12;
    }

    /**
     * @dev See {IManager-setIssueFeeRecipient}.
     */
    function setIssueFeeRecipient(address newRecipient) external override onlyFeeController {
        require(issueFeeRecipient != newRecipient, 'can not be the same to the old address');
        require(newRecipient != address(0), 'zero address');
        emit IssueFeeRecipientSet(issueFeeRecipient, newRecipient);
        issueFeeRecipient = newRecipient;
    }

    /**
     * @dev See {IManager-setRedeemFeeRecipient}.
     */
    function setRedeemFeeRecipient(address newRecipient) external override onlyFeeController {
        require(redeemFeeRecipient != newRecipient, 'can not be the same to the old address');
        require(newRecipient != address(0), 'zero address');
        emit RedeemFeeRecipientSet(redeemFeeRecipient, newRecipient);
        redeemFeeRecipient = newRecipient;
    }

    /**
     * @dev See {IManager-setManagementFeeRecipient}.
     */
    function setManagementFeeRecipient(address newRecipient) external override onlyFeeController {
        require(managementFeeRecipient != newRecipient, 'can not be the same to the old address');
        require(newRecipient != address(0), 'zero address');
        emit ManagementFeeRecipientSet(managementFeeRecipient, newRecipient);
        managementFeeRecipient = newRecipient;
    }

    /**
     * @dev See {IManager-setFactoryController}.
     */
    function setFactoryController(address newController) external override onlyFactoryController {
        require(factoryController != newController, 'can not be the same to the old address');
        require(newController != address(0), 'zero address');
        emit FactoryControllerSet(factoryController, newController);
        factoryController = newController;
    }

    /**
     * @dev See {IManager-setFeeController}.
     */
    function setFeeController(address newController) external override onlyFeeController {
        require(feeController != newController, 'can not be the same to the old address');
        require(newController != address(0), 'zero address');
        emit FeeControllerSet(feeController, newController);
        feeController = newController;
    }

    /**
     * @dev See {IManager-setAssetController}.
     */
    function setAssetController(address newController) external override onlyAssetController {
        require(assetController != newController, 'can not be the same to the old address');
        require(newController != address(0), 'zero address');
        emit AssetControllerSet(assetController, newController);
        assetController = newController;
    }

    /**
     * @dev See {IManager-setSyncController}.
     */
    function setSyncController(address newController) external override onlySyncController {
        require(syncController != newController, 'can not be the same to the old address');
        require(newController != address(0), 'zero address');
        emit SyncControllerSet(syncController, newController);
        syncController = newController;
    }

    /**
     * @dev See {IManager-setRebaseController}.
     */
    function setRebaseController(address newController) external override onlyRebaseController {
        require(rebaseController != newController, 'can not be the same to the old address');
        require(newController != address(0), 'zero address');
        emit RebaseControllerSet(rebaseController, newController);
        rebaseController = newController;
    }

    /**
     * @dev See {IManager-setRebaseInterval}.
     */
    function setRebaseInterval(uint256 newInterval) external override onlyFeeController {
        require(newInterval > 0, 'zero interval');
        emit RebaseIntervalSet(rebaseInterval, newInterval);
        rebaseInterval = newInterval;
    }

    function checkTriple(string calldata symbol) internal view returns (IFactory.triple memory t) {
        require(bytes(symbol).length > 0, 'empty symbol string');
        (t.ERC721, t.ERC20, t.ERC20Wrapper) = factory.getTriple(symbol);
        require(t.ERC20 != address(0), 'triple not exists');
    }

    function checkFeeRate(uint256 feeRate) internal pure {
        require(feeRate <= feeBase(), 'cannot set fee rate above 100%');
    }

    /**
     * @dev See {IManager-setRebaseFeeRateTo}.
     */
    function setRebaseFeeRateTo(string calldata symbol, uint256 feeRate) external override onlyFeeController {
        checkFeeRate(feeRate);
        checkTriple(symbol);
        emit RebaseFeeRateSetTo(symbol, rebaseFeeRates[symbol], feeRate);
        rebaseFeeRates[symbol] = feeRate;
    }

    /**
     * @dev See {IManager-rebaseTo}.
     */
    function rebaseTo(string calldata symbol) external override onlyRebaseController {
        IFactory.triple memory t = checkTriple(symbol);
        require(managementFeeRecipient != address(0), 'zero managementFeeRecipient');
        uint256 rebaseFeeRate = rebaseFeeRates[symbol];
        require(rebaseFeeRate > 0, 'zero rebaseFeeRate');

        uint256 lastRebaseTimestamp = rebaseHistories[symbol];
        uint256 blockTimestamp = block.timestamp;
        if (lastRebaseTimestamp > 0) {
            require(blockTimestamp - lastRebaseTimestamp >= rebaseInterval, 'Rebase too frequently');
            rebaseHistories[symbol] += rebaseInterval;
        } else {
            rebaseHistories[symbol] = blockTimestamp;
        }

        // rebase
        IERC20Tpl(t.ERC20).chargeFeeRebase(rebaseFeeRate, managementFeeRecipient);

        // sync
        address s = factory.getSync(symbol);
        require(s != address(0), 'zero sync address');
        ISync(s).sync();

        emit RebasedTo(symbol, blockTimestamp);
    }

    /**
     * @dev See {IManager-pauseTo}.
     */
    function pauseTo(address tokenAddr) external override onlyAssetController {
        require(tokenAddr != address(0), 'zero address');
        IPause(tokenAddr).pause();
    }

    /**
     * @dev See {IManager-unpauseTo}.
     */
    function unpauseTo(address tokenAddr) external override onlyAssetController {
        require(tokenAddr != address(0), 'zero address');
        IPause(tokenAddr).unpause();
    }

    /**
     * @dev See {IManager-freezeTo}.
     */
    function freezeTo(address tokenAddr, address addr) external override onlyAssetController {
        require(tokenAddr != address(0), 'zero address');
        IERC20Freeze(tokenAddr).freeze(addr);
    }

    /**
     * @dev See {IManager-unfreezeTo}.
     */
    function unfreezeTo(address tokenAddr, address addr) external override onlyAssetController {
        require(tokenAddr != address(0), 'zero address');
        IERC20Freeze(tokenAddr).unfreeze(addr);
    }

    /**
     * @dev See {IManager-freezeToBoth}.
     */
    function freezeToBoth(string calldata symbol, address addr) external override onlyAssetController {
        IFactory.triple memory t = checkTriple(symbol);

        IERC20Freeze(t.ERC20).freeze(addr);

        IERC20Freeze(t.ERC20Wrapper).freeze(addr);
    }

    /**
     * @dev See {IManager-unfreezeToBoth}.
     */
    function unfreezeToBoth(string calldata symbol, address addr) external override onlyAssetController {
        IFactory.triple memory t = checkTriple(symbol);

        IERC20Freeze(t.ERC20).unfreeze(addr);

        IERC20Freeze(t.ERC20Wrapper).unfreeze(addr);
    }

    /**
     * @dev See {IManager-wipeFrozenAddressTo}.
     */
    function wipeFrozenAddressTo(
        address tokenAddr,
        address fromAddr,
        address toAddr
    ) external override onlyAssetController {
        require(tokenAddr != address(0), 'zero address');
        IERC20Freeze(tokenAddr).wipeFrozenAddress(fromAddr, toAddr);
    }

    /**
     * @dev See {IManager-wipeFrozenAddressToBoth}.
     */
    function wipeFrozenAddressToBoth(
        string calldata symbol,
        address fromAddr,
        address toAddr
    ) external override onlyAssetController {
        IFactory.triple memory t = checkTriple(symbol);

        IERC20Freeze(t.ERC20).wipeFrozenAddress(fromAddr, toAddr);

        IERC20Freeze(t.ERC20Wrapper).wipeFrozenAddress(fromAddr, toAddr);
    }

    /**
     * @dev See {IManager-setBaseURITo}.
     */
    function setBaseURITo(address tokenAddr, string calldata baseURI) external override onlyAssetController {
        require(tokenAddr != address(0), 'zero address');
        require(bytes(baseURI).length > 0, 'empty baseURI');
        IERC721Tpl(tokenAddr).setBaseURI(baseURI);
        emit BaseURISetTo(tokenAddr, baseURI);
    }

    /**
     * @dev See {IManager-setTokenURITo}.
     */
    function setTokenURITo(
        address tokenAddr,
        uint256[] calldata tokenIds,
        string[] calldata tokenURIs
    ) external override onlyAssetController {
        require(tokenAddr != address(0), 'zero address');
        require(tokenIds.length > 0 && tokenIds.length == tokenURIs.length, 'invalid token params length');
        for (uint256 i = 0; i < tokenIds.length; ) {
            IERC721Tpl(tokenAddr).setTokenURI(tokenIds[i], tokenURIs[i]);
            unchecked {
                i++;
            }
        }
        emit TokenURISetTo(tokenAddr, tokenIds, tokenURIs);
    }

    /**
     * @dev See {IManager-createTriple}.
     */
    function createTriple(
        string calldata name,
        string calldata symbol,
        string calldata underlyingUnit
    ) external override onlyFactoryController returns (IFactory.triple memory t, address s) {
        (t, , s) = factory.createTriple(name, symbol, underlyingUnit);
    }

    /**
     * @dev See {IManager-issueTo}.
     */
    function issueTo(
        string calldata symbol,
        address toAddr,
        uint256 issueFeeRate,
        string[] calldata tokenURIs,
        uint256[] calldata erc20Amounts
    ) external override onlyAssetController {
        checkFeeRate(issueFeeRate);
        IFactory.triple memory t = checkTriple(symbol);
        require(toAddr != address(0), 'zero address');
        require(erc20Amounts.length > 0, 'empty erc20Amounts');

        if (tokenURIs.length > 0) {
            require(tokenURIs.length == erc20Amounts.length, 'tokenURIs.length != erc20Amounts.length');
        }

        uint256 allAmount = 0;
        for (uint256 i = 0; i < erc20Amounts.length; ) {
            require(erc20Amounts[i] > 0, 'zero amount');
            allAmount += erc20Amounts[i];
            unchecked {
                i++;
            }
        }

        // calc issue fee
        uint256 issueFee = 0;
        if (issueFeeRate > 0 && issueFeeRecipient != address(0)) {
            issueFee = (allAmount * issueFeeRate) / feeBase();
        }

        // issue erc721
        IERC721Tpl(t.ERC721).issue(t.ERC20, erc20Amounts, tokenURIs);
        emit Erc721IssuedTo(symbol, t.ERC20, erc20Amounts, tokenURIs);

        // issue erc20
        uint256 diffAmount = allAmount - issueFee;
        IERC20Tpl(t.ERC20).issue(toAddr, diffAmount);
        emit Erc20IssuedTo(symbol, toAddr, diffAmount);

        if (issueFee > 0) {
            // collect issue fee
            IERC20Tpl(t.ERC20).issue(issueFeeRecipient, issueFee);
            emit Erc20IssuedTo(symbol, issueFeeRecipient, issueFee);
        }
    }

    /**
     * @dev Gets ERC721 token underlying weight:kg/oz
     * @param t The triple
     * @param erc721TokenIds The ERC721 tokenIds
     * @return tokenWeights The underlying token weight
     */
    function getTokenWeights(IFactory.triple memory t, uint256[] calldata erc721TokenIds)
        internal
        view
        returns (uint256 tokenWeights)
    {
        uint96 tokenWeight;
        uint256 tokenId;
        for (uint256 i = 0; i < erc721TokenIds.length; ) {
            tokenId = erc721TokenIds[i];
            tokenWeight = IERC721Tpl(t.ERC721).underlyingOf(tokenId);
            tokenWeights += uint256(tokenWeight);

            unchecked {
                i++;
            }
        }
    }

    /**
     * @dev See {IManager-redeemFrom}.
     */
    function redeemFrom(
        string calldata symbol,
        address fromAddr,
        uint256 redeemFeeRate,
        uint256[2] calldata amount, // 0: permit, 1: redemption
        uint256[2] calldata deadline, // 0: permit, 1: redemption
        uint8[2] calldata v, // 0: permit v, 1: redemption v
        bytes32[4] calldata rs, // 0: permit r, 1: permit s, 2 redemption r, 3 redemption s
        uint256[] calldata erc721TokenIds
    ) external override onlyAssetController {
        checkFeeRate(redeemFeeRate);
        IFactory.triple memory t = checkTriple(symbol);
        require(fromAddr != address(0), 'zero address');
        require(erc721TokenIds.length > 0, 'empty erc721TokenIds');

        // check and get erc721 tokenWeights
        uint256 tokenWeights = getTokenWeights(t, erc721TokenIds);
        require(amount[1] == tokenWeights, 'invalid redeem amount');

        // calc redeem fee
        uint256 redeemFee = 0;
        if (redeemFeeRate > 0 && redeemFeeRecipient != address(0)) {
            redeemFee = (tokenWeights * redeemFeeRate) / feeBase();
        }

        uint256 needAmount = tokenWeights + redeemFee;
        require(IERC20Tpl(t.ERC20).balanceOf(fromAddr) >= needAmount, 'insufficient balance');
        require(amount[0] >= needAmount, 'insufficient amount for approval');

        // validate redemption
        validateRedemption(fromAddr, tokenWeights, erc721TokenIds, deadline[1], v[1], rs[2], rs[3]);

        // permit approving
        IERC20Tpl(t.ERC20).permit(fromAddr, address(this), amount[0], deadline[0], v[0], rs[0], rs[1]);
        if (!IERC20Tpl(t.ERC20).transferFrom(fromAddr, address(this), needAmount)) {
            revert('permit approving error');
        }

        // collect redeem fee
        if (redeemFee > 0 && !IERC20Tpl(t.ERC20).transfer(redeemFeeRecipient, redeemFee)) {
            revert('redeem fee collection error');
        }

        // redeem erc721 and erc20
        IERC20Tpl(t.ERC20).redeem(amount[1], erc721TokenIds);
        emit Erc721RedeemedFrom(symbol, fromAddr, erc721TokenIds);
        emit Erc20RedeemedFrom(symbol, fromAddr, tokenWeights);
    }

    function validateRedemption(
        address owner,
        uint256 value,
        uint256[] memory tokenIds,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        require(deadline >= block.timestamp, 'deadline expired');
        bytes32 digest = keccak256(
            abi.encodePacked(
                '\x19\x01',
                DOMAIN_SEPARATOR,
                keccak256(
                    abi.encode(
                        REDEEM_TYPEHASH,
                        owner,
                        value,
                        keccak256(abi.encodePacked(tokenIds)),
                        nonces[owner]++,
                        deadline
                    )
                )
            )
        );
        if (AddressUpgradeable.isContract(owner)) {
            require(IERC1271(owner).isValidSignature(digest, abi.encodePacked(r, s, v)) == 0x1626ba7e, 'Unauthorized');
        } else {
            address recoveredAddress = ECDSAUpgradeable.recover(digest, v, r, s);
            require(recoveredAddress != address(0) && recoveredAddress == owner, 'invalid signature');
        }
    }

    /**
     * @dev See {IManager-setDefiPairTo}.
     */
    function setDefiPairTo(address syncAddr, address pair) external override onlySyncController {
        require(syncAddr != address(0) && pair != address(0), 'zero address');
        ISync(syncAddr).setDefiPair(pair);
    }

    /**
     * @dev See {IManager-delDefiPairTo}.
     */
    function delDefiPairTo(address syncAddr, address pair) external override onlySyncController {
        require(syncAddr != address(0) && pair != address(0), 'zero address');
        ISync(syncAddr).delDefiPair(pair);
    }

    /**
     * @dev See {IManager-setERC721Impl}.
     */
    function setERC721Impl(address newImpl) external override onlyFactoryController {
        require(address(factory) != address(0) && newImpl != address(0), 'zero address');
        factory.setERC721Impl(newImpl);
    }

    /**
     * @dev See {IManager-setERC20Impl}.
     */
    function setERC20Impl(address newImpl) external override onlyFactoryController {
        require(address(factory) != address(0) && newImpl != address(0), 'zero address');
        factory.setERC20Impl(newImpl);
    }

    /**
     * @dev See {IManager-setERC20WrapperImpl}.
     */
    function setERC20WrapperImpl(address newImpl) external override onlyFactoryController {
        require(address(factory) != address(0) && newImpl != address(0), 'zero address');
        factory.setERC20WrapperImpl(newImpl);
    }

    /**
     * @dev See {IManager-setSyncImpl}.
     */
    function setSyncImpl(address newImpl) external override onlyFactoryController {
        require(address(factory) != address(0) && newImpl != address(0), 'zero address');
        factory.setSyncImpl(newImpl);
    }

    /**
     * @dev See {IManager-upgradeImplTo}.
     */
    function upgradeImplTo(address proxy, address newImpl) external override onlyFactoryController {
        require(proxy != address(0) && newImpl != address(0), 'zero address');
        if (proxy == address(this)) {
            emit UpgradedTo(proxy, _getImplementation(), newImpl);
            _upgradeSelf(newImpl);
        } else {
            emit UpgradedTo(proxy, IUUPSUpgradeable(proxy).implementation(), newImpl);
            IUUPSUpgradeable(proxy).upgradeTo(newImpl);
        }
    }

    /**
     * @dev Upgrade the implementation of the proxy to `newImplementation`.
     *
     * Calls {_authorizeUpgrade}.
     *
     * Emits an {Upgraded} event.
     */
    function _upgradeSelf(address newImplementation) internal virtual onlyProxy {
        _authorizeUpgrade(newImplementation);
        _upgradeToAndCallUUPS(newImplementation, new bytes(0), false);
    }

    function _authorizeUpgrade(address) internal override onlyFactoryController {}

    function implementation() public view returns (address) {
        return _getImplementation();
    }
}
