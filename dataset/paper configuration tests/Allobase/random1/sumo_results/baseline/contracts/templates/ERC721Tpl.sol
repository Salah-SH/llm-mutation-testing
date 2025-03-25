// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.8.3;

import '../base/ERC721Base.sol';
import '../base/ManagerImmutableState.sol';
import '../interfaces/IERC721Tpl.sol';
import '../interfaces/IERC20Tpl.sol';

/**
 * @title ERC721Tpl
 *
 * @notice Implementation of the [ERC721](https://eips.ethereum.org/EIPS/eip-721)
 * Non-Fungible Token Standard, including the Metadata extension.
 * Optimized for lower gas during batch mints.
 *
 * Token IDs are minted in sequential order (e.g. 0, 1, 2, 3, ...)
 * starting from `_startTokenId()`.
 *
 * Token has underlying info: `underlyingOf()`, `underlyingUnit()`
 * Assumptions:
 * - An underlying of token cannot be more than 2**96 - 1 (max value of uint96).
 *
 */
contract ERC721Tpl is IERC721Tpl, ManagerImmutableState, ERC721Base {
    // The erc20 address for erc20 tokenized
    IERC20Tpl public ERC20;

    // The baseUri for this tpl
    string private _baseUri;

    // unit of underlyings
    string private _underlyingUnit;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    /**
     * @notice Initializes the contract.
     *
     * Set a `name_` and a `symbol_` to the token collection.
     * Set `manager_` to ManagerImmutableState.
     * Initializes ERC721Tpl immutable vars.
     */
    function initialize(
        string memory name_,
        string memory symbol_,
        address manager_,
        address erc20_,
        string memory underlyingUnit_
    ) public override initializer {
        __ERC721Base_init(name_, symbol_);
        __ManagerImmutableState_init(manager_);
        __ERC721Tpl_init_unchained(erc20_, underlyingUnit_);
    }

    /**
     * @notice Initializes the address of (ERC20) and _underlyingUnit.
     *
     * @dev Called once at time of deployment.
     */
    function __ERC721Tpl_init_unchained(address erc20_, string memory underlyingUnit_) internal onlyInitializing {
        require(erc20_ != address(0), 'Erc20 zero address');
        ERC20 = IERC20Tpl(erc20_);
        _underlyingUnit = underlyingUnit_;
    }

    /**
     * @dev See {IERC721Tpl-setBaseURI}.
     */
    function setBaseURI(string memory baseUri_) external override onlyManager {
        _baseUri = baseUri_;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseUri;
    }

    /**
     * @dev See {IERC721Underlying-underlyingUnit}.
     */
    function underlyingUnit() public view virtual override returns (string memory) {
        return _underlyingUnit;
    }

    /**
     * @dev See {IERC721Tpl-setTokenURI}.
     */
    function setTokenURI(uint256 tokenId, string memory tokenUri) external override onlyManager {
        _setTokenURI(tokenId, tokenUri);
    }

    /**
     * @dev See {IERC721Tpl-issue}.
     */
    function issue(
        address to,
        uint256[] calldata underlyings,
        string[] calldata tokenURIs
    ) external override whenNotPaused onlyManager {
        _mint(to, underlyings, tokenURIs);
    }

    /**
     * @dev See {IERC721Tpl-safeIssue}.
     */
    function safeIssue(
        address to,
        uint256[] calldata underlyings,
        string[] calldata tokenURIs,
        bytes memory data
    ) external override whenNotPaused onlyManager {
        _safeMint(to, underlyings, tokenURIs, data);
    }

    /**
     * @dev See {IERC721Tpl-redeem}.
     */
    function redeem(uint256[] calldata tokenIds) external override whenNotPaused {
        address from = _msgSender();
        require(from == manager || from == address(ERC20), 'Not manager or ERC20 token tokenized');
        _burn(from, tokenIds);
    }

    /**
     * @notice Triggers stopped state.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    function pause() external override onlyManager {
        _pause();
    }

    /**
     * @notice Returns to normal state.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    function unpause() external override onlyManager {
        _unpause();
    }

    function _authorizeUpgrade(address) internal override onlyManager {}
}
