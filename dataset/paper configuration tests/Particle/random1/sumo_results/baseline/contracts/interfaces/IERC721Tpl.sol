// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.8.3;

import '@openzeppelin/contracts-upgradeable/token/ERC721/extensions/IERC721MetadataUpgradeable.sol';

import './IERC721Underlying.sol';
import './IPause.sol';

interface IERC721Tpl is IERC721MetadataUpgradeable, IERC721Underlying, IPause {
    /**
     * @notice Initialize the contract.
     * @param name_ The name of the token
     * @param symbol_ The symbol of the token
     * @param manager_ The address of manager
     * @param erc20_ The address of erc20 token for erc20 tokenizing
     * @param underlyingUnit_ The unit of underlying
     */
    function initialize(
        string memory name_,
        string memory symbol_,
        address manager_,
        address erc20_,
        string memory underlyingUnit_
    ) external;

    /**
     * @notice Sets `baseUri_` as the baseUri of tokens.
     * @dev The baseUri must not be empty, or the tokenURI of tokens will not be shown.
     * @param baseUri_ The new baseUri
     */
    function setBaseURI(string memory baseUri_) external;

    /**
     * @notice Sets `tokenUri` as the tokenURI of `tokenId`.
     *
     * @dev Requirements: `tokenId` must exist.
     * @param tokenId The id of token to be set
     * @param tokenUri The new tokenUri
     */
    function setTokenURI(uint256 tokenId, string memory tokenUri) external;

    /**
     * @notice Issue `tokens` with `underlyings` and `tokenURIs`, transfers them to `to`.
     * @dev Must be called by manager.
     * WARNING: Usage of this method is discouraged, use {safeIssue} whenever possible.
     * @param to The address to issue to
     * @param underlyings The underlying amount of tokens
     * @param tokenURIs The token uris, must be same length with `underlyings`
     */
    function issue(
        address to,
        uint256[] calldata underlyings,
        string[] calldata tokenURIs
    ) external;

    /**
     * @notice Safely issue tokens with `underlyings` and `tokenURIs`, transfers them to `to`.
     * @dev Must be called by manager.
     * @param to The address to issue to
     * @param underlyings The underlying amount of tokens
     * @param tokenURIs The token uris, must be same length with `underlyings`
     * @param data Bytes optional data to send along with the call
     */
    function safeIssue(
        address to,
        uint256[] calldata underlyings,
        string[] calldata tokenURIs,
        bytes memory data
    ) external;

    /**
     * @notice Redeem multi tokens by burning them.
     * @dev Must be called by manager or the erc20 contract.
     * @dev Tokens to redeem must be owned by caller.
     * @param tokenIds The token ids to burn
     */
    function redeem(uint256[] calldata tokenIds) external;
}
