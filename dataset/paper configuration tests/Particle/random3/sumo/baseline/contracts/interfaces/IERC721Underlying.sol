// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.8.3;

interface IERC721Underlying {
    /**
     * @notice Returns the total number of tokens in existence.
     * @dev Burned tokens will reduce the count.
     * @return The total number of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @notice Returns the total amount of underlying asset.
     * @return An uint256 indicating the underlying amount.
     */
    function totalUnderlying() external view returns (uint256);

    /**
     * @notice Returns the unit of underlying asset, eg "OZ".
     * @return A string indicating the unit.
     */
    function underlyingUnit() external view returns (string memory);

    /**
     * @notice Returns the number of decimals used to get the underlying's user representation.
     * For example, if `decimals` equals `2`, a underlying of `505` should
     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
     *
     * NOTE: This value must equal to ERC20Tpl.decimals()
     *
     * NOTE: This information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract
     *
     * @return The number of decimals.
     */
    function underlyingDecimals() external view returns (uint8);

    /**
     * @notice Returns the underlying amount of a _tokenId.
     * @return An uint256 indicating the underlying amount of a _tokenId.
     */
    function underlyingOf(uint256 _tokenId) external view returns (uint96);
}
