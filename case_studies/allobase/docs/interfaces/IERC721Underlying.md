# Solidity API

## IERC721Underlying

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```

Returns the total number of tokens in existence.

_Burned tokens will reduce the count._

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The total number of tokens in existence. |

### totalUnderlying

```solidity
function totalUnderlying() external view returns (uint256)
```

Returns the total amount of underlying asset.

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | An uint256 indicating the underlying amount. |

### underlyingUnit

```solidity
function underlyingUnit() external view returns (string)
```

Returns the unit of underlying asset, eg "OZ".

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | A string indicating the unit. |

### underlyingDecimals

```solidity
function underlyingDecimals() external view returns (uint8)
```

Returns the number of decimals used to get the underlying's user representation.
For example, if `decimals` equals `2`, a underlying of `505` should
be displayed to a user as `5.05` (`505 / 10 ** 2`).

NOTE: This value must equal to ERC20Tpl.decimals()

NOTE: This information is only used for _display_ purposes: it in
no way affects any of the arithmetic of the contract

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint8 | The number of decimals. |

### underlyingOf

```solidity
function underlyingOf(uint256 _tokenId) external view returns (uint96)
```

Returns the underlying amount of a _tokenId.

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint96 | An uint256 indicating the underlying amount of a _tokenId. |

