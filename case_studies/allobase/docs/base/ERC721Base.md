# Solidity API

## ERC721Base

support underlying data of token

_Implementation of https://eips.ethereum.org/EIPS/eip-721[ERC721] Non-Fungible Token Standard, including
the Metadata extension._

### TokenOwnerUnderlying

```solidity
struct TokenOwnerUnderlying {
  address addr;
  uint96 underlying;
}
```

### SetTokenUri

```solidity
event SetTokenUri(uint256 tokenId, string tokenURI)
```

### __ERC721Base_init

```solidity
function __ERC721Base_init(string name_, string symbol_) internal
```

### __ERC721Base_init_unchained

```solidity
function __ERC721Base_init_unchained(string name_, string symbol_) internal
```

### _startTokenId

```solidity
function _startTokenId() internal view virtual returns (uint256)
```

_Returns the starting token ID.
To change the starting token ID, please override this function._

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool)
```

_See {IERC165-supportsInterface}._

### balanceOf

```solidity
function balanceOf(address owner) public view virtual returns (uint256)
```

_See {IERC721-balanceOf}._

### ownerOf

```solidity
function ownerOf(uint256 tokenId) public view virtual returns (address)
```

_See {IERC721-ownerOf}._

### name

```solidity
function name() public view virtual returns (string)
```

_See {IERC721Metadata-name}._

### symbol

```solidity
function symbol() public view virtual returns (string)
```

_See {IERC721Metadata-symbol}._

### tokenURI

```solidity
function tokenURI(uint256 tokenId) public view virtual returns (string)
```

_See {IERC721Metadata-tokenURI}._

### totalSupply

```solidity
function totalSupply() public view virtual returns (uint256)
```

_Returns the total number of tokens in existence.
Burned tokens will reduce the count._

### _baseURI

```solidity
function _baseURI() internal view virtual returns (string)
```

_Base URI for computing {tokenURI}. If set, the resulting URI for each
token will be the concatenation of the `baseURI` and the `tokenId`. Empty
by default, can be overridden in child contracts._

### approve

```solidity
function approve(address to, uint256 tokenId) public virtual
```

_See {IERC721-approve}._

### getApproved

```solidity
function getApproved(uint256 tokenId) public view virtual returns (address)
```

_See {IERC721-getApproved}._

### setApprovalForAll

```solidity
function setApprovalForAll(address operator, bool approved) public virtual
```

_See {IERC721-setApprovalForAll}._

### isApprovedForAll

```solidity
function isApprovedForAll(address owner, address operator) public view virtual returns (bool)
```

_See {IERC721-isApprovedForAll}._

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 tokenId) public virtual
```

_See {IERC721-transferFrom}._

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId) public virtual
```

_See {IERC721-safeTransferFrom}._

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId, bytes data) public virtual
```

_See {IERC721-safeTransferFrom}._

### _safeTransfer

```solidity
function _safeTransfer(address from, address to, uint256 tokenId, bytes data) internal virtual
```

_Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
are aware of the ERC721 protocol to prevent tokens from being forever locked.

`data` is additional data, it has no specified format and it is sent in call to `to`.

This internal function is equivalent to {safeTransferFrom}, and can be used to e.g.
implement alternative mechanisms to perform token transfer, such as signature-based.

Requirements:

- `from` cannot be the zero address.
- `to` cannot be the zero address.
- `tokenId` token must exist and be owned by `from`.
- If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.

Emits a {Transfer} event._

### _exists

```solidity
function _exists(uint256 tokenId) internal view virtual returns (bool)
```

_Returns whether `tokenId` exists.

Tokens can be managed by their owner or approved accounts via {approve} or {setApprovalForAll}.

Tokens start existing when they are minted (`_mint`),
and stop existing when they are burned (`_burn`)._

### _isApprovedOrOwner

```solidity
function _isApprovedOrOwner(address spender, uint256 tokenId) internal view virtual returns (bool)
```

_Returns whether `spender` is allowed to manage `tokenId`.

Requirements:

- `tokenId` must exist._

### _safeMint

```solidity
function _safeMint(address to, uint256[] underlyings, string[] tokenURIs) internal virtual
```

_Safely mints tokens with `underlyings` and transfers them to `to`.

Requirements:

- `underlyings` cannot be empty, each `underlying` cannot be zero
- If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.

Emits {Transfer} events._

### _safeMint

```solidity
function _safeMint(address to, uint256[] underlyings, string[] tokenURIs, bytes data) internal virtual
```

_Same as {xref-ERC721-_safeMint-address-uint256-}[`_safeMint`], with an additional `data` parameter which is
forwarded in {IERC721Receiver-onERC721Received} to contract recipients._

### _mint

```solidity
function _mint(address to, uint256[] underlyings, string[] tokenURIs) internal virtual returns (uint256 newUnderlyings)
```

_Mints `tokens` with underlyings and transfers them to `to`.

WARNING: Usage of this method is discouraged, use {_safeMint} whenever possible

Requirements:

- `to` cannot be the zero address.
- length of `underlyings` must be in range (0, 100) and each `underlying` must be in range (0, 1 << 96)

Emits {Transfer} events._

### _burn

```solidity
function _burn(address from, uint256[] tokenIds) internal virtual returns (uint256 burnedUnderlyings)
```

_Destroys `tokenIds` owned by `from`
The approval is cleared when the token is burned.

Requirements:

- `tokenIds` cannot be empty and each tokenId must exist.
- `tokenIds` must be owned by `from`.
- length of `tokenIds` must be in range (0, 100).
Emits a {Transfer} event._

### _transfer

```solidity
function _transfer(address from, address to, uint256 tokenId) internal virtual
```

_Transfers `tokenId` from `from` to `to`.
 As opposed to {transferFrom}, this imposes no restrictions on msg.sender.

Requirements:

- `to` cannot be the zero address.
- `tokenId` token must be owned by `from`.

Emits a {Transfer} event._

### _approve

```solidity
function _approve(address to, uint256 tokenId) internal virtual
```

_Approve `to` to operate on `tokenId`

Emits an {Approval} event._

### _setApprovalForAll

```solidity
function _setApprovalForAll(address owner, address operator, bool approved) internal virtual
```

_Approve `operator` to operate on all of `owner` tokens

Emits an {ApprovalForAll} event._

### _setTokenURI

```solidity
function _setTokenURI(uint256 tokenId, string _tokenURI) internal virtual
```

_Sets `_tokenURI` as the tokenURI of `tokenId`.

Requirements:

- `tokenId` must exist._

### _requireMinted

```solidity
function _requireMinted(uint256 tokenId) internal view virtual
```

_Reverts if the `tokenId` has not been minted yet._

### _beforeTokenTransfers

```solidity
function _beforeTokenTransfers(address from, address to, uint256 startTokenId, uint256 quantity) internal virtual
```

_Hook that is called before a set of serially-ordered token IDs
are about to be transferred. This includes minting.
And also called before burning one token.

`startTokenId` - the first token ID to be transferred.
`quantity` - the amount to be transferred.

Calling conditions:

- When `from` and `to` are both non-zero, `from`'s `tokenId` will be
transferred to `to`.
- When `from` is zero, `tokenId` will be minted for `to`.
- When `to` is zero, `tokenId` will be burned by `from`.
- `from` and `to` are never both zero._

### _afterTokenTransfers

```solidity
function _afterTokenTransfers(address from, address to, uint256 startTokenId, uint256 quantity) internal virtual
```

_Hook that is called after a set of serially-ordered token IDs
have been transferred. This includes minting.
And also called after one token has been burned.

`startTokenId` - the first token ID to be transferred.
`quantity` - the amount to be transferred.

Calling conditions:

- When `from` and `to` are both non-zero, `from`'s `tokenId` has been
transferred to `to`.
- When `from` is zero, `tokenId` has been minted for `to`.
- When `to` is zero, `tokenId` has been burned by `from`.
- `from` and `to` are never both zero._

### _ownerUnderlyingOf

```solidity
function _ownerUnderlyingOf(uint256 tokenId) internal view virtual returns (struct ERC721Base.TokenOwnerUnderlying)
```

_Returns the unpacked `TokenOwnerUnderlying` struct of `tokenId`._

### underlyingDecimals

```solidity
function underlyingDecimals() public pure returns (uint8)
```

_Returns the number of decimals used to get its user representation of underlying amount.
For example, if `decimals` equals `2`, and underlyingUnit() equals `kg`
a underlying of `505` tokens should be displayed to a user as `5.05kg` (`505 / 10 ** 2 kg`)._

### underlyingOf

```solidity
function underlyingOf(uint256 tokenId) public view returns (uint96)
```

_Returns the amount of underlyings of `tokenId`._

### totalUnderlying

```solidity
function totalUnderlying() public view returns (uint256)
```

_Returns the amount of total underlyings in existence._

### implementation

```solidity
function implementation() public view returns (address)
```

