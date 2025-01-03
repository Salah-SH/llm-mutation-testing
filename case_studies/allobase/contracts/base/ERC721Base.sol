// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.8.3;

import '@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC721/extensions/IERC721MetadataUpgradeable.sol';

import '@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';

import '../interfaces/IERC721Underlying.sol';

/**
 * @dev Implementation of https://eips.ethereum.org/EIPS/eip-721[ERC721] Non-Fungible Token Standard, including
 * the Metadata extension.
 *
 * @notice support underlying data of token
 */
abstract contract ERC721Base is
    ContextUpgradeable,
    IERC721MetadataUpgradeable,
    IERC721Underlying,
    UUPSUpgradeable,
    ERC165Upgradeable,
    PausableUpgradeable
{
    using AddressUpgradeable for address;
    using StringsUpgradeable for uint256;

    struct TokenOwnerUnderlying {
        // The address of the owner.
        address addr;
        // Stores the underlying amount.
        uint96 underlying;
    }

    event SetTokenUri(uint256 indexed tokenId, string tokenURI);

    // =============================================================
    //                           CONSTANTS
    // =============================================================

    // The mask of the lower 160 bits for addresses.
    uint256 private constant _BITMASK_ADDRESS = (1 << 160) - 1;

    // The bit position of `underlying` in packed ownerunderlying data.
    uint256 private constant _BITPOS_UNDERLYING = 160;

    // The mask of the upper 96 bits for underlyings.
    uint256 private constant _BITMASK_UNDERLYING = ((1 << 96) - 1) << 160;

    // =============================================================
    //                            STORAGE
    // =============================================================

    // Token name
    string private _name;

    // Token symbol
    string private _symbol;

    // The next token ID to be minted.
    uint256 private _currentIndex;

    // The number of tokens burned.
    uint256 private _burnCounter;

    // Mapping from token ID to owner&underlying details
    // See {_ownerUnderlyingOf} implementation for details.
    //
    // Bits Layout:
    // - [0..159]   `addr`
    // - [160..255] `underlying`
    mapping(uint256 => uint256) private _packedOwnerUnderlyings;

    // total amount of underlyings
    uint256 private _underlyingTotal;

    // Mapping owner address to token count
    mapping(address => uint256) private _balances;

    // Mapping from token ID to approved address
    mapping(uint256 => address) private _tokenApprovals;

    // Mapping from owner to operator approvals
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;

    // =============================================================
    //                          INIT
    // =============================================================

    function __ERC721Base_init(string memory name_, string memory symbol_) internal onlyInitializing {
        __ERC721Base_init_unchained(name_, symbol_);
        __Pausable_init_unchained();
    }

    function __ERC721Base_init_unchained(string memory name_, string memory symbol_) internal onlyInitializing {
        _name = name_;
        _symbol = symbol_;
        _currentIndex = _startTokenId();
    }

    // =============================================================
    //                   TOKEN COUNTING OPERATIONS
    // =============================================================

    /**
     * @dev Returns the starting token ID.
     * To change the starting token ID, please override this function.
     */
    function _startTokenId() internal view virtual returns (uint256) {
        return 1;
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC165Upgradeable, IERC165Upgradeable)
        returns (bool)
    {
        return
            interfaceId == type(IERC721Upgradeable).interfaceId ||
            interfaceId == type(IERC721MetadataUpgradeable).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /**
     * @dev See {IERC721-balanceOf}.
     */
    function balanceOf(address owner) public view virtual override returns (uint256) {
        require(owner != address(0), 'ERC721: address zero is not a valid owner');
        return _balances[owner];
    }

    /**
     * @dev See {IERC721-ownerOf}.
     */
    function ownerOf(uint256 tokenId) public view virtual override returns (address) {
        address owner = address(uint160(_packedOwnerUnderlyings[tokenId]));
        require(owner != address(0), 'ERC721: invalid token ID');
        return owner;
    }

    /**
     * @dev See {IERC721Metadata-name}.
     */
    function name() public view virtual override returns (string memory) {
        return _name;
    }

    /**
     * @dev See {IERC721Metadata-symbol}.
     */
    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireMinted(tokenId);

        string memory base = _baseURI();

        // _baseUri() must exist
        if (bytes(base).length == 0) {
            return '';
        }

        string memory _tokenURI = _tokenURIs[tokenId];
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }

        return string(abi.encodePacked(base, tokenId.toString()));
    }

    /**
     * @dev Returns the total number of tokens in existence.
     * Burned tokens will reduce the count.
     */
    function totalSupply() public view virtual override returns (uint256) {
        // Counter underflow is impossible as _burnCounter cannot be incremented
        // more than `_currentIndex - _startTokenId()` times.
        unchecked {
            return _currentIndex - _burnCounter - _startTokenId();
        }
    }

    /**
     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`. Empty
     * by default, can be overridden in child contracts.
     */
    function _baseURI() internal view virtual returns (string memory) {
        return '';
    }

    /**
     * @dev See {IERC721-approve}.
     */
    function approve(address to, uint256 tokenId) public virtual override {
        address owner = ownerOf(tokenId);
        require(to != owner, 'ERC721: approval to current owner');

        require(
            _msgSender() == owner || isApprovedForAll(owner, _msgSender()),
            'ERC721: approve caller is not token owner nor approved for all'
        );

        _approve(to, tokenId);
    }

    /**
     * @dev See {IERC721-getApproved}.
     */
    function getApproved(uint256 tokenId) public view virtual override returns (address) {
        _requireMinted(tokenId);

        return _tokenApprovals[tokenId];
    }

    /**
     * @dev See {IERC721-setApprovalForAll}.
     */
    function setApprovalForAll(address operator, bool approved) public virtual override {
        _setApprovalForAll(_msgSender(), operator, approved);
    }

    /**
     * @dev See {IERC721-isApprovedForAll}.
     */
    function isApprovedForAll(address owner, address operator) public view virtual override returns (bool) {
        return _operatorApprovals[owner][operator];
    }

    /**
     * @dev See {IERC721-transferFrom}.
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(_msgSender(), tokenId), 'ERC721: caller is not token owner nor approved');

        _transfer(from, to, tokenId);
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        safeTransferFrom(from, to, tokenId, '');
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public virtual override {
        require(_isApprovedOrOwner(_msgSender(), tokenId), 'ERC721: caller is not token owner nor approved');
        _safeTransfer(from, to, tokenId, data);
    }

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
     * are aware of the ERC721 protocol to prevent tokens from being forever locked.
     *
     * `data` is additional data, it has no specified format and it is sent in call to `to`.
     *
     * This internal function is equivalent to {safeTransferFrom}, and can be used to e.g.
     * implement alternative mechanisms to perform token transfer, such as signature-based.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must exist and be owned by `from`.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function _safeTransfer(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) internal virtual {
        _transfer(from, to, tokenId);
        require(_checkOnERC721Received(from, to, tokenId, data), 'ERC721: transfer to non ERC721Receiver implementer');
    }

    /**
     * @dev Returns whether `tokenId` exists.
     *
     * Tokens can be managed by their owner or approved accounts via {approve} or {setApprovalForAll}.
     *
     * Tokens start existing when they are minted (`_mint`),
     * and stop existing when they are burned (`_burn`).
     */
    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return
            _startTokenId() <= tokenId &&
            tokenId < _currentIndex && // If within bounds,
            _packedOwnerUnderlyings[tokenId] != 0; // and has owner&underlying.
    }

    /**
     * @dev Returns whether `spender` is allowed to manage `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view virtual returns (bool) {
        address owner = ownerOf(tokenId);
        return (spender == owner || isApprovedForAll(owner, spender) || getApproved(tokenId) == spender);
    }

    /**
     * @dev Safely mints tokens with `underlyings` and transfers them to `to`.
     *
     * Requirements:
     *
     * - `underlyings` cannot be empty, each `underlying` cannot be zero
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits {Transfer} events.
     */
    function _safeMint(
        address to,
        uint256[] calldata underlyings,
        string[] calldata tokenURIs
    ) internal virtual {
        _safeMint(to, underlyings, tokenURIs, '');
    }

    /**
     * @dev Same as {xref-ERC721-_safeMint-address-uint256-}[`_safeMint`], with an additional `data` parameter which is
     * forwarded in {IERC721Receiver-onERC721Received} to contract recipients.
     */
    function _safeMint(
        address to,
        uint256[] calldata underlyings,
        string[] calldata tokenURIs,
        bytes memory data
    ) internal virtual {
        _mint(to, underlyings, tokenURIs);

        uint256 quantity = underlyings.length;
        unchecked {
            if (to.isContract()) {
                uint256 end = _currentIndex;
                uint256 index = end - quantity;
                do {
                    require(
                        _checkOnERC721Received(address(0), to, index++, data),
                        'ERC721: transfer to non ERC721Receiver implementer'
                    );
                } while (index < end);
                // Reentrancy protection.
                if (_currentIndex != end) revert();
            }
        }
    }

    /**
     * @dev Mints `tokens` with underlyings and transfers them to `to`.
     *
     * WARNING: Usage of this method is discouraged, use {_safeMint} whenever possible
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - length of `underlyings` must be in range (0, 100) and each `underlying` must be in range (0, 1 << 96)
     *
     * Emits {Transfer} events.
     */
    function _mint(
        address to,
        uint256[] calldata underlyings,
        string[] calldata tokenURIs
    ) internal virtual returns (uint256 newUnderlyings) {
        require(to != address(0), 'ERC721: mint to the zero address');
        uint256 quantity = underlyings.length;
        require(quantity > 0 && quantity <= 100, 'ERC721: mint quantity out of bounds');
        require(quantity == tokenURIs.length, 'ERC721: mint underlyings length diff with tokenURIs length');

        uint256 startTokenId = _currentIndex;
        uint256 tokenId = startTokenId;

        _beforeTokenTransfers(address(0), to, startTokenId, quantity);
        unchecked {
            for (uint256 i = 0; i < quantity; i++) {
                uint256 underlying256 = underlyings[i];
                require(underlying256 > 0 && underlying256 < (1 << 96), 'ERC721: mint underlying out of bounds');
                uint96 underlying = uint96(underlying256);

                // Updates:
                // - `address` to the owner.
                // - `underlying` to the underlying.
                _packedOwnerUnderlyings[tokenId] = _packOwnerUnderlyingData(to, underlying);
                emit Transfer(address(0), to, tokenId);

                if (bytes(tokenURIs[i]).length != 0) {
                    _tokenURIs[tokenId] = tokenURIs[i];
                    emit SetTokenUri(tokenId, tokenURIs[i]);
                }
                newUnderlyings += underlying;
                tokenId++;
            }

            _balances[to] += quantity;
        }

        _underlyingTotal += newUnderlyings;
        _currentIndex = tokenId;

        _afterTokenTransfers(address(0), to, startTokenId, quantity);
    }

    /**
     * @dev Destroys `tokenIds` owned by `from`
     * The approval is cleared when the token is burned.
     *
     * Requirements:
     *
     * - `tokenIds` cannot be empty and each tokenId must exist.
     * - `tokenIds` must be owned by `from`.
     * - length of `tokenIds` must be in range (0, 100).
     * Emits a {Transfer} event.
     */
    function _burn(address from, uint256[] calldata tokenIds) internal virtual returns (uint256 burnedUnderlyings) {
        require(from != address(0), 'ERC721: burn from the zero address');
        uint256 quantity = tokenIds.length;
        require(quantity > 0 && quantity <= 100, 'ERC721: burn quantity out of bounds');

        for (uint256 i = 0; i < quantity; ) {
            uint256 tokenId = tokenIds[i];
            TokenOwnerUnderlying memory ownerUnderlying = _ownerUnderlyingOf(tokenId);
            // check the owner and exist of tokenId
            require(from == ownerUnderlying.addr, 'ERC721: burn not owner');

            _beforeTokenTransfers(from, address(0), tokenId, 1);

            uint256 underlying = ownerUnderlying.underlying;

            // Clear approvals
            _approve(address(0), tokenId);

            // Clear tokenUri if exist
            if (bytes(_tokenURIs[tokenId]).length != 0) {
                delete _tokenURIs[tokenId];
            }

            // Clear owner and underlying
            delete _packedOwnerUnderlyings[tokenId];
            unchecked {
                burnedUnderlyings += underlying;
                i++;
            }

            emit Transfer(from, address(0), tokenId);
            _afterTokenTransfers(from, address(0), tokenId, 1);
        }

        unchecked {
            _underlyingTotal -= burnedUnderlyings;
            _balances[from] -= quantity;
            _burnCounter += quantity;
        }
    }

    /**
     * @dev Transfers `tokenId` from `from` to `to`.
     *  As opposed to {transferFrom}, this imposes no restrictions on msg.sender.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - `tokenId` token must be owned by `from`.
     *
     * Emits a {Transfer} event.
     */
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual whenNotPaused {
        require(to != address(0), 'ERC721: transfer to the zero address');

        uint256 prevOwnerUnderlyingPacked = _packedOwnerUnderlyings[tokenId];
        require(address(uint160(prevOwnerUnderlyingPacked)) == from, 'ERC721: transfer from incorrect owner');

        _beforeTokenTransfers(from, to, tokenId, 1);

        // Clear approvals from the previous owner
        _approve(address(0), tokenId);

        _balances[from] -= 1;
        _balances[to] += 1;

        uint256 postOwnerUnderlyingPacked;

        // Updates:
        // - `to` to the next owner.
        // - `unerlying` not change.
        assembly {
            // Mask `prevOwnerUnderlyingPacked` to the upper 96 bits | Mask `to` to the lower 160 bits, in case the upper bits somehow aren't clean.
            postOwnerUnderlyingPacked := or(
                and(prevOwnerUnderlyingPacked, _BITMASK_UNDERLYING),
                and(to, _BITMASK_ADDRESS)
            )
        }
        _packedOwnerUnderlyings[tokenId] = postOwnerUnderlyingPacked;

        emit Transfer(from, to, tokenId);

        _afterTokenTransfers(from, to, tokenId, 1);
    }

    /**
     * @dev Approve `to` to operate on `tokenId`
     *
     * Emits an {Approval} event.
     */
    function _approve(address to, uint256 tokenId) internal virtual {
        _tokenApprovals[tokenId] = to;
        emit Approval(ownerOf(tokenId), to, tokenId);
    }

    /**
     * @dev Approve `operator` to operate on all of `owner` tokens
     *
     * Emits an {ApprovalForAll} event.
     */
    function _setApprovalForAll(
        address owner,
        address operator,
        bool approved
    ) internal virtual {
        require(owner != operator, 'ERC721: approve to caller');
        _operatorApprovals[owner][operator] = approved;
        emit ApprovalForAll(owner, operator, approved);
    }

    /**
     * @dev Sets `_tokenURI` as the tokenURI of `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        _requireMinted(tokenId);
        _tokenURIs[tokenId] = _tokenURI;
        emit SetTokenUri(tokenId, _tokenURI);
    }

    /**
     * @dev Reverts if the `tokenId` has not been minted yet.
     */
    function _requireMinted(uint256 tokenId) internal view virtual {
        require(_exists(tokenId), 'ERC721: invalid token ID');
    }

    /**
     * @dev Internal function to invoke {IERC721Receiver-onERC721Received} on a target address.
     * The call is not executed if the target address is not a contract.
     *
     * @param from address representing the previous owner of the given token ID
     * @param to target address that will receive the tokens
     * @param tokenId uint256 ID of the token to be transferred
     * @param data bytes optional data to send along with the call
     * @return bool whether the call correctly returned the expected magic value
     */
    function _checkOnERC721Received(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) private returns (bool) {
        if (to.isContract()) {
            try IERC721ReceiverUpgradeable(to).onERC721Received(_msgSender(), from, tokenId, data) returns (
                bytes4 retval
            ) {
                return retval == IERC721ReceiverUpgradeable.onERC721Received.selector;
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert('ERC721: transfer to non ERC721Receiver implementer');
                } else {
                    /// @solidity memory-safe-assembly
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        } else {
            return true;
        }
    }

    /**
     * @dev Hook that is called before a set of serially-ordered token IDs
     * are about to be transferred. This includes minting.
     * And also called before burning one token.
     *
     * `startTokenId` - the first token ID to be transferred.
     * `quantity` - the amount to be transferred.
     *
     * Calling conditions:
     *
     * - When `from` and `to` are both non-zero, `from`'s `tokenId` will be
     * transferred to `to`.
     * - When `from` is zero, `tokenId` will be minted for `to`.
     * - When `to` is zero, `tokenId` will be burned by `from`.
     * - `from` and `to` are never both zero.
     */
    function _beforeTokenTransfers(
        address from,
        address to,
        uint256 startTokenId,
        uint256 quantity
    ) internal virtual {}

    /**
     * @dev Hook that is called after a set of serially-ordered token IDs
     * have been transferred. This includes minting.
     * And also called after one token has been burned.
     *
     * `startTokenId` - the first token ID to be transferred.
     * `quantity` - the amount to be transferred.
     *
     * Calling conditions:
     *
     * - When `from` and `to` are both non-zero, `from`'s `tokenId` has been
     * transferred to `to`.
     * - When `from` is zero, `tokenId` has been minted for `to`.
     * - When `to` is zero, `tokenId` has been burned by `from`.
     * - `from` and `to` are never both zero.
     */
    function _afterTokenTransfers(
        address from,
        address to,
        uint256 startTokenId,
        uint256 quantity
    ) internal virtual {}

    /**
     * @dev Returns the unpacked `TokenOwnerUnderlying` struct of `tokenId`.
     */
    function _ownerUnderlyingOf(uint256 tokenId) internal view virtual returns (TokenOwnerUnderlying memory) {
        return _unpackedOwnership(_packedOwnerUnderlyings[tokenId]);
    }

    /**
     * @dev Returns the unpacked `TokenOwnerUnderlying` struct from `packed`.
     */
    function _unpackedOwnership(uint256 packed) private pure returns (TokenOwnerUnderlying memory ownerUnderlying) {
        ownerUnderlying.addr = address(uint160(packed));
        ownerUnderlying.underlying = uint96(packed >> _BITPOS_UNDERLYING);
    }

    /**
     * @dev Packs owner&underlying data into a single uint256.
     */
    function _packOwnerUnderlyingData(address owner, uint96 underlying) private pure returns (uint256 result) {
        assembly {
            // Mask `owner` to the lower 160 bits, in case the upper bits somehow aren't clean.
            owner := and(owner, _BITMASK_ADDRESS)
            // `owner | (underlying << _BITPOS_UNDERLYING)`.
            result := or(owner, shl(_BITPOS_UNDERLYING, underlying))
        }
    }

    /**
     * @dev Returns the number of decimals used to get its user representation of underlying amount.
     * For example, if `decimals` equals `2`, and underlyingUnit() equals `kg`
     * a underlying of `505` tokens should be displayed to a user as `5.05kg` (`505 / 10 ** 2 kg`).
     */
    function underlyingDecimals() public pure override returns (uint8) {
        return 18;
    }

    /**
     * @dev Returns the amount of underlyings of `tokenId`.
     */
    function underlyingOf(uint256 tokenId) public view override returns (uint96) {
        _requireMinted(tokenId);
        uint256 packed = _packedOwnerUnderlyings[tokenId];
        return uint96(packed >> _BITPOS_UNDERLYING);
    }

    /**
     * @dev Returns the amount of total underlyings in existence.
     */
    function totalUnderlying() public view override returns (uint256) {
        return _underlyingTotal;
    }

    function implementation() public view returns (address) {
        return _getImplementation();
    }
}
