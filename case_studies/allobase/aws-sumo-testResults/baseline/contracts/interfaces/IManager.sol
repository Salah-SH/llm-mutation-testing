// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.8.3;

import './IFactory.sol';

/// @title The interface for the Manager
interface IManager {
    /**
     * @notice Returns the current factory contract address
     * @dev Can not be changed any more
     */
    function factory() external view returns (IFactory);

    /**
     * @notice Returns the current issue fee recipient
     * @dev Can be changed by the current fee controller via setIssueFeeRecipient
     */
    function issueFeeRecipient() external view returns (address);

    /**
     * @notice Returns the current redeem fee recipient
     * @dev Can be changed by the current fee controller via setRedeemFeeRecipient
     */
    function redeemFeeRecipient() external view returns (address);

    /**
     * @notice Returns the current management fee recipient
     * @dev Can be changed by the current fee controller via setManagementFeeRecipient
     */
    function managementFeeRecipient() external view returns (address);

    /**
     * @notice Returns the current factory controller
     * @dev Can be changed by the current factory controller via setFactoryController
     */
    function factoryController() external view returns (address);

    /**
     * @notice Returns the current fee controller
     * @dev Can be changed by the current fee controller via setFeeController
     */
    function feeController() external view returns (address);

    /**
     * @notice Returns the current asset controller
     * @dev Can be changed by the current asset controller via setAssetController
     */
    function assetController() external view returns (address);

    /**
     * @notice Returns the current sync controller
     * @dev Can be changed by the current sync controller via setSyncController
     */
    function syncController() external view returns (address);

    /**
     * @notice Returns the current rebase controller
     * @dev Can be changed by the current rebase controller via setRebaseController
     */
    function rebaseController() external view returns (address);

    /**
     * @notice Returns the current rebase interval
     * @dev Can be changed by the current fee controller via setRebaseInterval
     */
    function rebaseInterval() external view returns (uint256);

    /**
     * @notice Returns the fee base
     */
    function feeBase() external pure returns (uint256);

    /**
     * @notice Returns the rebase fee rate for a given symbol, or 0 if it does not exist
     * @dev Can be changed by the current fee controller via setRebaseFeeRate
     * @param symbol The symbol of the ERC20 token
     */
    function rebaseFeeRates(string calldata symbol) external view returns (uint256);

    /**
     * @notice Returns the rebase history timestamp for a given symbol, or 0 if it does not exist
     * @param symbol The symbol of the ERC20 token
     */
    function rebaseHistories(string calldata symbol) external view returns (uint256);

    /**
     * @dev initialize the contract
     * @param _issueFeeRecipient The issue fee recipient
     * @param _redeemFeeRecipient The redeem fee recipient
     * @param _managementFeeRecipient The management fee recipient
     * @param _feeController The fee controller
     * @param _assetController The asset controller
     * @param _factoryController The factory controller
     * @param _syncController The sync controller
     * @param _rebaseController The rebase controller
     * @param _factory The factory contract address
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
    ) external;

    /**
     * @notice Updates the current issue fee recipient
     * @dev Must be called by the current fee controller
     * @param newRecipient The new issue fee recipient
     */
    function setIssueFeeRecipient(address newRecipient) external;

    /**
     * @notice Updates the current redeem fee recipient
     * @dev Must be called by the current fee controller
     * @param newRecipient The new redeem fee recipient
     */
    function setRedeemFeeRecipient(address newRecipient) external;

    /**
     * @notice Updates the current management fee recipient
     * @dev Must be called by the current fee controller
     * @param newRecipient The new management fee recipient
     */
    function setManagementFeeRecipient(address newRecipient) external;

    /**
     * @notice Updates the current factory controller
     * @dev Must be called by the current factory controller
     * @param newController The new factory controller
     */
    function setFactoryController(address newController) external;

    /**
     * @notice Updates the current fee controller
     * @dev Must be called by the current fee controller
     * @param newController The new fee controller
     */
    function setFeeController(address newController) external;

    /**
     * @notice Updates the current asset controller
     * @dev Must be called by the current asset controller
     * @param newController The new asset controller
     */
    function setAssetController(address newController) external;

    /**
     * @notice Updates the current sync controller
     * @dev Must be called by the current sync controller
     * @param newController The new sync controller
     */
    function setSyncController(address newController) external;

    /**
     * @notice Updates the current rebase controller
     * @dev Must be called by the current rebase controller
     * @param newController The new rebase controller
     */
    function setRebaseController(address newController) external;

    /**
     * @notice Updates the current rebase interval
     * @dev Must be called by the current fee controller
     * @param newInterval The new rebase interval
     */
    function setRebaseInterval(uint256 newInterval) external;

    /**
     * @notice Updates the current rebase fee rate for a given symbol
     * @dev Must be called by the current fee controller
     * @param symbol The symbol of the ERC20 token
     * @param feeRate The new rebase fee rate
     */
    function setRebaseFeeRateTo(string calldata symbol, uint256 feeRate) external;

    /**
     * @notice Does rebase for management fee collection for a given symbol
     * @dev Must be called by the current asset controller
     * @param symbol The symbol of the ERC20 token
     */
    function rebaseTo(string calldata symbol) external;

    /**
     * @notice Triggers stopped state
     * @dev Must be called by the current asset controller
     * @param tokenAddr The ERC20 or ERC20Wrapper contract address
     */
    function pauseTo(address tokenAddr) external;

    /**
     * @notice Returns to normal state
     * @dev Must be called by the current asset controller
     * @param tokenAddr The ERC20 or ERC20Wrapper contract address
     */
    function unpauseTo(address tokenAddr) external;

    /**
     * @notice Freezes an address balance
     * @dev Must be called by the current asset controller
     * @param tokenAddr The ERC20 or ERC20Wrapper contract address
     * @param addr The address to freeze
     */
    function freezeTo(address tokenAddr, address addr) external;

    /**
     * @notice Unfreezes an address balance
     * @dev Must be called by the current asset controller
     * @param tokenAddr The ERC20 or ERC20Wrapper contract address
     * @param addr The address to unfreeze
     */
    function unfreezeTo(address tokenAddr, address addr) external;

    /**
     * @notice Freezes an address balance both on ERC20 and ERC20 wrapper contract
     * @dev Must be called by the current asset controller
     * @param symbol The symbol of the ERC20 token
     * @param addr The address to freeze
     */
    function freezeToBoth(string calldata symbol, address addr) external;

    /**
     * @notice Unfreezes an address balance both on ERC20 and ERC20 wrapper contract
     * @dev Must be called by the current asset controller
     * @param symbol The symbol of the ERC20 token
     * @param addr The address to freeze
     */
    function unfreezeToBoth(string calldata symbol, address addr) external;

    /**
     * @notice Wipes the balance of a frozen address
     * @dev Must be called by the current asset controller
     * @param tokenAddr The ERC20 or ERC20Wrapper contract address
     * @param fromAddr The frozen address to wipe
     * @param toAddr The address to receive the wiped token
     */
    function wipeFrozenAddressTo(
        address tokenAddr,
        address fromAddr,
        address toAddr
    ) external;

    /**
     * @notice Wipes the balance of a frozen address both on ERC20 and ERC20 wrapper contract
     * @dev Must be called by the current asset controller
     *  @param symbol The symbol of the ERC20 token
     * @param fromAddr The frozen address to wipe
     * @param toAddr The address to receive the wiped token
     */
    function wipeFrozenAddressToBoth(
        string calldata symbol,
        address fromAddr,
        address toAddr
    ) external;

    /**
     * @notice Create a new triple
     * @dev Must be called by the current factory controller
     * @param name The ERC20 token name
     * @param symbol The ERC20 token symbol
     * @param underlyingUnit The unit of underlying amount, eg `kg`, `oz`
     * @return t The erc721/erc20/erc20Wrapper address triple
     * @return s The address of the Sync contract
     */
    function createTriple(
        string calldata name,
        string calldata symbol,
        string calldata underlyingUnit
    ) external returns (IFactory.triple memory t, address s);

    /**
     * @notice Updates the current baseURI for a given symbol
     * @dev Must be called by the current asset controller
     * @param tokenAddr The ERC721 contract address
     * @param baseURI The new baseURI
     */
    function setBaseURITo(address tokenAddr, string calldata baseURI) external;

    /**
     * @notice Updates the tokenURI for a given symbol
     * @dev Must be called by the current asset controller
     * @param tokenAddr The ERC721 contract address
     * @param tokenIds The tokenIds need to be updated
     * @param tokenURIs The new tokenURIs
     */
    function setTokenURITo(
        address tokenAddr,
        uint256[] calldata tokenIds,
        string[] calldata tokenURIs
    ) external;

    /**
     * @notice Issues ERC721 and ERC20 token for a given symbol
     * @dev Must be called by the current asset controller
     * @param symbol The ERC20 token symbol
     * @param toAddr The receive address
     * @param issueFeeRate The issue fee rate
     * @param tokenURIs The ERC721 tokenURIs
     * @param erc20Amounts The ERC20 token amounts
     */
    function issueTo(
        string calldata symbol,
        address toAddr,
        uint256 issueFeeRate,
        string[] calldata tokenURIs,
        uint256[] calldata erc20Amounts
    ) external;

    /**
     * @notice Redeems ERC721 and ERC20 token for a given symbol
     * @dev Must be called by the current asset controller
     * @param symbol The ERC20 token symbol
     * @param fromAddr The address that redeem from
     * @param redeemFeeRate The redeem fee rate
     * @param amount The permit and redemption ERC20 token amount, 0: permit, 1: redemption
     * @param deadline The permit and redemption deadline, 0: permit, 1: redemption
     * @param v The permit and redemption signature v, 0: permit, 1: redemption
     * @param rs The permit and redemption signature r/s, 0: permit r, 1: permit s, 2 redemption r, 3 redemption s
     * @param erc721TokenIds The ERC721 tokenIds
     */
    function redeemFrom(
        string calldata symbol,
        address fromAddr,
        uint256 redeemFeeRate,
        uint256[2] calldata amount,
        uint256[2] calldata deadline,
        uint8[2] calldata v,
        bytes32[4] calldata rs,
        uint256[] calldata erc721TokenIds
    ) external;

    /**
     * @notice Inserts defi pair(eg. uniswap V2 pair) address into sync contract
     * @dev Must be called by the current sync controller
     * @param syncAddr The sync contract address
     * @param pair The defi pair(eg. uniswap V2 pair)
     */
    function setDefiPairTo(address syncAddr, address pair) external;

    /**
     * @notice Deletes defi pair(eg. uniswap V2 pair) address from sync contract
     * @dev Must be called by the current sync controller
     * @param syncAddr The sync contract address
     * @param pair The defi pair(eg. uniswap V2 pair)
     */
    function delDefiPairTo(address syncAddr, address pair) external;

    /**
     * @notice Updates the ERC721 implementation of the factory
     * @dev Must be called by the current factory controller
     * @param newImpl The new ERC721 implementation of the factory
     */
    function setERC721Impl(address newImpl) external;

    /**
     * @notice Updates the ERC20 implementation of the factory
     * @dev Must be called by the current factory controller
     * @param newImpl The new ERC20 implementation of the factory
     */
    function setERC20Impl(address newImpl) external;

    /**
     * @notice Updates the ERC20 wrapper implementation of the factory
     * @dev Must be called by the current factory controller
     * @param newImpl The new ERC20 wrapper implementation of the factory
     */
    function setERC20WrapperImpl(address newImpl) external;

    /**
     * @notice Updates the Sync implementation of the factory
     * @dev Must be called by the current factory controller
     * @param newImpl The new Sync implementation of the factory
     */
    function setSyncImpl(address newImpl) external;

    /**
     * @notice Upgrade the implementation of the proxy to `newImplementation`
     * @dev Must be called by the current factory controller
     * @param proxy The proxy contract
     * @param newImpl The new implementation
     */
    function upgradeImplTo(address proxy, address newImpl) external;
}
