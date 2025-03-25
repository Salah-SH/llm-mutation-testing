// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.8.3;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import './interfaces/IFactory.sol';
import './interfaces/IERC721Tpl.sol';
import './interfaces/IERC20Tpl.sol';
import './interfaces/IERC20WrapperTpl.sol';
import './interfaces/ISync.sol';
import './templates/ERC1967Proxy.sol';

/// @title The implement for the Factory
contract Factory is IFactory, Initializable, UUPSUpgradeable {
    /**
     * @dev See {IFactory-manager}.
     */
    address public override manager;

    /**
     * @dev See {IFactory-ERC721Impl}.
     */
    address public override ERC721Impl;

    /**
     * @dev See {IFactory-ERC20Impl}.
     */
    address public override ERC20Impl;

    /**
     * @dev See {IFactory-ERC20WrapperImpl}.
     */
    address public override ERC20WrapperImpl;

    /**
     * @dev See {IFactory-syncImpl}.
     */
    address public override syncImpl;

    /**
     * @dev See {IFactory-getTriple}.
     */
    mapping(string => triple) public override getTriple;

    /**
     * @dev See {IFactory-allTriples}.
     */
    triple[] public override allTriples;

    /**
     * @dev See {IFactory-getSync}.
     */
    mapping(string => address) public override getSync;

    /**
     * @notice Emitted when ERC721Impl is set
     * @param oldAddr The old implementation address of ERC721Impl
     * @param newAddr The new implementation address of ERC721Impl
     */
    event ERC721ImplSet(address oldAddr, address newAddr);

    /**
     * @notice Emitted when ERC20Impl is set
     * @param oldAddr The old implementation address of ERC20Impl
     * @param newAddr The new implementation address of ERC20Impl
     */
    event ERC20ImplSet(address oldAddr, address newAddr);

    /**
     * @notice Emitted when ERC20WrapperImpl is set
     * @param oldAddr The old implementation address of ERC20WrapperImpl
     * @param newAddr The new implementation address of ERC20WrapperImpl
     */
    event ERC20WrapperImplSet(address oldAddr, address newAddr);

    /**
     * @notice Emitted when syncImpl is set
     * @param oldAddr The old contract address of syncImpl
     * @param newAddr The new contract address of syncImpl
     */
    event SyncImplSet(address oldAddr, address newAddr);

    /**
     * @notice Emitted when a triple is Created
     * @param symbol The symbol of the ERC20 token
     * @param erc721 The proxy address of the ERC721 token contract
     * @param erc20 The proxy address of the ERC20 token contract
     * @param erc20Wrapper The proxy address of the ERC20 wrapper token contract
     * @param triplesLength The count of the allTriples
     */
    event TripleCreated(string symbol, address erc721, address erc20, address erc20Wrapper, uint256 triplesLength);

    /**
     * @notice Emitted when a sync is Created
     * @param symbol The symbol of the ERC20 token
     * @param sync The contract address of the sync
     */
    event SyncCreated(string symbol, address sync);

    modifier onlyManager() {
        require(msg.sender == manager, 'onlyManager');
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    /**
     * @dev See {IFactory-initialize}.
     */
    function initialize(
        address _ERC721Impl,
        address _ERC20Impl,
        address _ERC20WrapperImpl,
        address _syncImpl,
        address _manager
    ) public override initializer {
        require(
            _ERC721Impl != address(0) &&
                _ERC20Impl != address(0) &&
                _ERC20WrapperImpl != address(0) &&
                _syncImpl != address(0),
            'zero address'
        );
        ERC721Impl = _ERC721Impl;
        ERC20Impl = _ERC20Impl;
        ERC20WrapperImpl = _ERC20WrapperImpl;
        syncImpl = _syncImpl;
        manager = _manager;
    }

    /**
     * @dev See {IFactory-setERC721Impl}.
     */
    function setERC721Impl(address newImpl) external override onlyManager {
        require(ERC721Impl != newImpl, 'can not be the same to the old address');
        require(newImpl != address(0), 'zero address');
        emit ERC721ImplSet(ERC721Impl, newImpl);
        ERC721Impl = newImpl;
    }

    /**
     * @dev See {IFactory-setERC20Impl}.
     */
    function setERC20Impl(address newImpl) external override onlyManager {
        require(ERC20Impl != newImpl, 'can not  be the same to the old address');
        require(newImpl != address(0), 'zero address');
        emit ERC20ImplSet(ERC20Impl, newImpl);
        ERC20Impl = newImpl;
    }

    /**
     * @dev See {IFactory-setERC20WrapperImpl}.
     */
    function setERC20WrapperImpl(address newImpl) external override onlyManager {
        require(ERC20WrapperImpl != newImpl, 'can not be the same to the old address');
        require(newImpl != address(0), 'zero address');
        emit ERC20WrapperImplSet(ERC20WrapperImpl, newImpl);
        ERC20WrapperImpl = newImpl;
    }

    /**
     * @dev See {IFactory-setSyncImpl}.
     */
    function setSyncImpl(address newImpl) external override onlyManager {
        require(syncImpl != newImpl, 'can not be the same to the old address');
        require(newImpl != address(0), 'zero address');
        emit SyncImplSet(syncImpl, newImpl);
        syncImpl = newImpl;
    }

    /**
     * @dev See {IFactory-getTriplesLength}.
     */
    function getTriplesLength() external view override returns (uint256) {
        return allTriples.length;
    }

    /**
     * @dev See {IFactory-createTriple}.
     */
    function createTriple(
        string calldata name,
        string calldata symbol,
        string calldata underlyingUnit
    )
        external
        override
        onlyManager
        returns (
            triple memory t,
            uint256 triplesLength,
            address s
        )
    {
        require(bytes(name).length > 0 && bytes(symbol).length > 0, 'empty string');
        require(getTriple[symbol].ERC721 == address(0), 'already exists');

        // create triple
        t = triple({
            ERC721: address(new ERC1967Proxy(ERC721Impl, new bytes(0))),
            ERC20: address(new ERC1967Proxy(ERC20Impl, new bytes(0))),
            ERC20Wrapper: address(new ERC1967Proxy(ERC20WrapperImpl, new bytes(0)))
        });
        getTriple[symbol] = t;
        allTriples.push(t);
        triplesLength = allTriples.length;
        emit TripleCreated(symbol, t.ERC721, t.ERC20, t.ERC20Wrapper, triplesLength);

        // create sync
        s = address(new ERC1967Proxy(syncImpl, new bytes(0)));
        getSync[symbol] = s;
        emit SyncCreated(symbol, s);

        // initialize
        IERC721Tpl(t.ERC721).initialize(
            string(abi.encodePacked(name, ' NFT')),
            string(abi.encodePacked(symbol, 'NFT')),
            manager,
            t.ERC20,
            underlyingUnit
        );

        IERC20Tpl(t.ERC20).initialize(name, symbol, manager, t.ERC721, t.ERC20Wrapper);

        IERC20WrapperTpl(t.ERC20Wrapper).initialize(
            string(abi.encodePacked(name, ' Wrapper')),
            string(abi.encodePacked('w', symbol)),
            manager,
            t.ERC20
        );

        ISync(s).initialize(symbol, manager);
    }

    function _authorizeUpgrade(address) internal override onlyManager {}

    function implementation() public view returns (address) {
        return _getImplementation();
    }
}
