// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.8.3;

import '@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-IERC20PermitUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol';

import './IERC20Wrap.sol';
import './IERC20Freeze.sol';
import './IPause.sol';

interface IERC20Tpl is IERC20MetadataUpgradeable, IERC20PermitUpgradeable, IERC20Wrap, IERC20Freeze, IPause {
    /**
     * @notice Emitted when `tokenAmount` tokens or `shareAmount` shares are newly issued to address (`to`).
     * @dev Param `tokenAmount` and `shareAmount` are both greater than 0 when emitted in `_mint` function.
     * @dev Param `tokenAmount` is 0 when emitted in `_mintShare` function.
     * @param to The address to receive issued token
     * @param tokenAmount The amount of token issued
     * @param shareAmount The amount of share issued
     */
    event Issued(address indexed to, uint256 tokenAmount, uint256 shareAmount);

    /**
     * @notice Emitted when `tokenAmount` tokens or `shareAmount` shares are redeemed from address (`from`).
     * @dev Param `shareAmount` is caculated via getSharesByToken(`tokenAmount`)
     * @param from The address to redeeme from
     * @param tokenAmount The amount of token redeemed, must > 0
     * @param shareAmount The amount of share redeemed, must > 0
     */
    event Redeemed(address indexed from, uint256 tokenAmount, uint256 shareAmount);

    /**
     * @notice Emitted when rebase happened to charge management fee.
     * @dev Param `feeTokens` is caculated via getTokenByShares(`feeShares`), shares are newly issued to `rebaseFeeRecipient`
     * @param blockTimestamp The block's timestamp
     * @param rebaseFeeRecipient The address to receive management fee
     * @param rebaseFeeRate The rate of total shares to issue
     * @param feeTokens The amount of token charged
     * @param feeShares The amount of share issued to `rebaseFeeRecipient`
     */
    event ChargeFeeRebase(
        uint256 indexed blockTimestamp,
        address indexed rebaseFeeRecipient,
        uint256 rebaseFeeRate,
        uint256 feeTokens,
        uint256 feeShares
    );

    /**
     * @dev Initialize the contract
     * @param name_ The name of the token
     * @param symbol_ The symbol of the token
     * @param manager_ The address of manager
     * @param underlyingNFT_ The address of underlying nft token
     * @param wrapper_ The address of wrapped erc20 token
     */
    function initialize(
        string memory name_,
        string memory symbol_,
        address manager_,
        address underlyingNFT_,
        address wrapper_
    ) external;

    /**
     * @notice Issue `amount` tokens to address `to`
     * @dev Emits a {Issued} event
     * @param to The receive address
     * @param amount The token amount to issue
     */
    function issue(address to, uint256 amount) external;

    /**
     * @notice Redeem `amount` tokens from sender
     * @dev Emits a {Redeemed} event
     * @param amount The amount of erc20 token to burn
     * @param nftIds The tokenIds of underlying nft to redeem
     */
    function redeem(uint256 amount, uint256[] calldata nftIds) external;

    // =============================================================
    //                            rebase
    // =============================================================

    /**
     * @notice Do rebase for management fee collection
     * @dev Emits a {ChargeFeeRebase} event.
     * @dev Must be called by manager.
     * @param rebaseFeeRate The fee rate
     * @param rebaseFeeRecipient The address to receive fee
     */
    function chargeFeeRebase(uint256 rebaseFeeRate, address rebaseFeeRecipient) external;

    // =============================================================
    //                            shares for rebase
    // =============================================================

    /**
     * @notice Returns the amount of shares owned by `account`.
     * @param account The address if `account`
     */
    function sharesOf(address account) external view returns (uint256);

    /**
     * @notice Returns the amount of shares in existence.
     */
    function totalShares() external view returns (uint256);

    /**
     * @notice Returns the amount of shares representing 1 token initially.
     * @dev Share base is used in two functions:
     * @dev 1.when issued initially
     * @dev 2.when wrap and unwrap
     */
    function shareBase() external view returns (uint256);

    /**
     * @notice Directly moves `shareAmount` shares from `from` to `to` using the
     * allowance mechanism. The tokenAmount caculated with shareAmount is then deducted from the caller's
     * allowance.
     * @dev Emits a {Transfer} event.
     * @param from The address transfer from
     * @param to The address transfer to
     * @param shareAmount The amount of share to transfer
     * @return The boolean value indicating whether the operation succeeded.
     */
    function transferShareFrom(
        address from,
        address to,
        uint256 shareAmount
    ) external returns (bool);

    /**
     * @notice Directly moves `shareAmount` shares from the caller's account to `to`.
     * @dev Emits a {Transfer} event.
     * @param to The address transfer to
     * @param shareAmount The amount of share to transfer
     * @return The boolean value indicating whether the operation succeeded.
     */
    function transferShare(address to, uint256 shareAmount) external returns (bool);

    /**
     * @notice Returns the amount of token caculated by `shareAmount` share.
     * @param shareAmount The amount of share
     * @return  The amount of token
     */
    function getTokenByShares(uint256 shareAmount) external view returns (uint256);

    /**
     * @notice Returns the amount of share caculated by `tokenAmount` token.
     * @param tokenAmount The amount of token
     * @return  The amount of share
     */
    function getSharesByToken(uint256 tokenAmount) external view returns (uint256);
}
