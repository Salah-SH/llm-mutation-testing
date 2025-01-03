# Solidity API

## ERC721Tpl

Implementation of the [ERC721](https://eips.ethereum.org/EIPS/eip-721)
Non-Fungible Token Standard, including the Metadata extension.
Optimized for lower gas during batch mints.

Token IDs are minted in sequential order (e.g. 0, 1, 2, 3, ...)
starting from `_startTokenId()`.

Token has underlying info: `underlyingOf()`, `underlyingUnit()`
Assumptions:
- An underlying of token cannot be more than 2**96 - 1 (max value of uint96).

### ERC20

```solidity
contract IERC20Tpl ERC20
```

### constructor

```solidity
constructor() public
```

### initialize

```solidity
function initialize(string name_, string symbol_, address manager_, address erc20_, string underlyingUnit_) public
```

Initializes the contract.

Set a `name_` and a `symbol_` to the token collection.
Set `manager_` to ManagerImmutableState.
Initializes ERC721Tpl immutable vars.

### __ERC721Tpl_init_unchained

```solidity
function __ERC721Tpl_init_unchained(address erc20_, string underlyingUnit_) internal
```

Initializes the address of (ERC20) and _underlyingUnit.

_Called once at time of deployment._

### setBaseURI

```solidity
function setBaseURI(string baseUri_) external
```

_See {IERC721Tpl-setBaseURI}._

### _baseURI

```solidity
function _baseURI() internal view virtual returns (string)
```

_Base URI for computing {tokenURI}. If set, the resulting URI for each
token will be the concatenation of the `baseURI` and the `tokenId`. Empty
by default, can be overridden in child contracts._

### underlyingUnit

```solidity
function underlyingUnit() public view virtual returns (string)
```

_See {IERC721Underlying-underlyingUnit}._

### setTokenURI

```solidity
function setTokenURI(uint256 tokenId, string tokenUri) external
```

_See {IERC721Tpl-setTokenURI}._

### issue

```solidity
function issue(address to, uint256[] underlyings, string[] tokenURIs) external
```

_See {IERC721Tpl-issue}._

### safeIssue

```solidity
function safeIssue(address to, uint256[] underlyings, string[] tokenURIs, bytes data) external
```

_See {IERC721Tpl-safeIssue}._

### redeem

```solidity
function redeem(uint256[] tokenIds) external
```

_See {IERC721Tpl-redeem}._

### pause

```solidity
function pause() external
```

Triggers stopped state.

Requirements:

- The contract must not be paused.

### unpause

```solidity
function unpause() external
```

Returns to normal state.

Requirements:

- The contract must be paused.

### _authorizeUpgrade

```solidity
function _authorizeUpgrade(address) internal
```

