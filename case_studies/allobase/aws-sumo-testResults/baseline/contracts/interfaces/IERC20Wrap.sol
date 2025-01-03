// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.8.3;

interface IERC20Wrap {
    /**
     * @notice Emitted when `underlyingAmount` tokens are wrapped to `wrapperAmount` wrapped tokens.
     * @param account The address called wrap
     * @param underlyingAmount The amount of token to wrap
     * @param wrapperAmount The amount of wrapped token after wrap
     */
    event Wrap(address indexed account, uint256 underlyingAmount, uint256 wrapperAmount);

    /**
     * @notice Emitted when `wrapperAmount` wrapped tokens are unwrapped to `underlyingAmount` tokens.
     * @param account The address called unwrap
     * @param underlyingAmount The amount of token after unwrap
     * @param wrapperAmount The amount of wrapped token to unwrap
     */
    event Unwrap(address indexed account, uint256 underlyingAmount, uint256 wrapperAmount);

    /**
     * @notice Exchanges underlying erc20 token to wrapped erc20 token.
     * @dev Emits a {Wrap} event
     * @param underlyingAmount The amount of underlying erc20 token to wrap.
     * @return wrapperAmount The amount of wrapped erc20 token user receives after wrap.
     */
    function wrap(uint256 underlyingAmount) external returns (uint256 wrapperAmount);

    /**
     * @notice Exchanges wrapped erc20 token to underlying erc20 token.
     * @dev Emits a {Unwrap} event
     * @param wrapperAmount The amount of wrapped erc20 token to unwrap.
     * @return underlyingAmount The amount of underlying erc20 token user receives after unwrap.
     */
    function unwrap(uint256 wrapperAmount) external returns (uint256 underlyingAmount);

    /**
     * @dev Get amount of wrapped erc20 token for a given amount of underlying erc20 token
     * @param underlyingAmount The amount of underlying erc20 token
     * @return wrapperAmount The amount of wrapped erc20 token user receives after wrap
     * @return underlyingShares The amount of underlying shares locks after wrap
     */
    function getWrapperByUnderlying(uint256 underlyingAmount)
        external
        view
        returns (uint256 wrapperAmount, uint256 underlyingShares);

    /**
     * @dev Get amount of underlying erc20 token for a given amount of wrapped erc20 token
     * @param wrapperAmount The amount of wrapped erc20 token
     * @return underlyingAmount The amount of underlying erc20 token user receives after unwrap
     * @return underlyingShares The amount of underlying shares user receives after unwrap
     */
    function getUnderlyingByWrapper(uint256 wrapperAmount)
        external
        view
        returns (uint256 underlyingAmount, uint256 underlyingShares);
}
