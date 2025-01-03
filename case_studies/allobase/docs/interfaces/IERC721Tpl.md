# Solidity API

## IERC721Tpl

### initialize

```solidity
function initialize(string name_, string symbol_, address manager_, address erc20_, string underlyingUnit_) external
```

Initialize the contract.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| name_ | string | The name of the token |
| symbol_ | string | The symbol of the token |
| manager_ | address | The address of manager |
| erc20_ | address | The address of erc20 token for erc20 tokenizing |
| underlyingUnit_ | string | The unit of underlying |

### setBaseURI

```solidity
function setBaseURI(string baseUri_) external
```

Sets `baseUri_` as the baseUri of tokens.

_The baseUri must not be empty, or the tokenURI of tokens will not be shown._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| baseUri_ | string | The new baseUri |

### setTokenURI

```solidity
function setTokenURI(uint256 tokenId, string tokenUri) external
```

Sets `tokenUri` as the tokenURI of `tokenId`.

_Requirements: `tokenId` must exist._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The id of token to be set |
| tokenUri | string | The new tokenUri |

### issue

```solidity
function issue(address to, uint256[] underlyings, string[] tokenURIs) external
```

Issue `tokens` with `underlyings` and `tokenURIs`, transfers them to `to`.

_Must be called by manager.
WARNING: Usage of this method is discouraged, use {safeIssue} whenever possible._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | The address to issue to |
| underlyings | uint256[] | The underlying amount of tokens |
| tokenURIs | string[] | The token uris, must be same length with `underlyings` |

### safeIssue

```solidity
function safeIssue(address to, uint256[] underlyings, string[] tokenURIs, bytes data) external
```

Safely issue tokens with `underlyings` and `tokenURIs`, transfers them to `to`.

_Must be called by manager._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | The address to issue to |
| underlyings | uint256[] | The underlying amount of tokens |
| tokenURIs | string[] | The token uris, must be same length with `underlyings` |
| data | bytes | Bytes optional data to send along with the call |

### redeem

```solidity
function redeem(uint256[] tokenIds) external
```

Redeem multi tokens by burning them.

_Must be called by manager or the erc20 contract.
Tokens to redeem must be owned by caller._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenIds | uint256[] | The token ids to burn |

