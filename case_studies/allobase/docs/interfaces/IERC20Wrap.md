# Solidity API

## IERC20Wrap

### Wrap

```solidity
event Wrap(address account, uint256 underlyingAmount, uint256 wrapperAmount)
```

Emitted when `underlyingAmount` tokens are wrapped to `wrapperAmount` wrapped tokens.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address called wrap |
| underlyingAmount | uint256 | The amount of token to wrap |
| wrapperAmount | uint256 | The amount of wrapped token after wrap |

### Unwrap

```solidity
event Unwrap(address account, uint256 underlyingAmount, uint256 wrapperAmount)
```

Emitted when `wrapperAmount` wrapped tokens are unwrapped to `underlyingAmount` tokens.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address called unwrap |
| underlyingAmount | uint256 | The amount of token after unwrap |
| wrapperAmount | uint256 | The amount of wrapped token to unwrap |

### wrap

```solidity
function wrap(uint256 underlyingAmount) external returns (uint256 wrapperAmount)
```

Exchanges underlying erc20 token to wrapped erc20 token.

_Emits a {Wrap} event_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| underlyingAmount | uint256 | The amount of underlying erc20 token to wrap. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| wrapperAmount | uint256 | The amount of wrapped erc20 token user receives after wrap. |

### unwrap

```solidity
function unwrap(uint256 wrapperAmount) external returns (uint256 underlyingAmount)
```

Exchanges wrapped erc20 token to underlying erc20 token.

_Emits a {Unwrap} event_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| wrapperAmount | uint256 | The amount of wrapped erc20 token to unwrap. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| underlyingAmount | uint256 | The amount of underlying erc20 token user receives after unwrap. |

### getWrapperByUnderlying

```solidity
function getWrapperByUnderlying(uint256 underlyingAmount) external view returns (uint256 wrapperAmount, uint256 underlyingShares)
```

_Get amount of wrapped erc20 token for a given amount of underlying erc20 token_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| underlyingAmount | uint256 | The amount of underlying erc20 token |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| wrapperAmount | uint256 | The amount of wrapped erc20 token user receives after wrap |
| underlyingShares | uint256 | The amount of underlying shares locks after wrap |

### getUnderlyingByWrapper

```solidity
function getUnderlyingByWrapper(uint256 wrapperAmount) external view returns (uint256 underlyingAmount, uint256 underlyingShares)
```

_Get amount of underlying erc20 token for a given amount of wrapped erc20 token_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| wrapperAmount | uint256 | The amount of wrapped erc20 token |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| underlyingAmount | uint256 | The amount of underlying erc20 token user receives after unwrap |
| underlyingShares | uint256 | The amount of underlying shares user receives after unwrap |

