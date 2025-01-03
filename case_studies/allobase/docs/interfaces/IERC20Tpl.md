# Solidity API

## IERC20Tpl

### Issued

```solidity
event Issued(address to, uint256 tokenAmount, uint256 shareAmount)
```

Emitted when `tokenAmount` tokens or `shareAmount` shares are newly issued to address (`to`).

_Param `tokenAmount` and `shareAmount` are both greater than 0 when emitted in `_mint` function.
Param `tokenAmount` is 0 when emitted in `_mintShare` function._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | The address to receive issued token |
| tokenAmount | uint256 | The amount of token issued |
| shareAmount | uint256 | The amount of share issued |

### Redeemed

```solidity
event Redeemed(address from, uint256 tokenAmount, uint256 shareAmount)
```

Emitted when `tokenAmount` tokens or `shareAmount` shares are redeemed from address (`from`).

_Param `shareAmount` is caculated via getSharesByToken(`tokenAmount`)_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | The address to redeeme from |
| tokenAmount | uint256 | The amount of token redeemed, must > 0 |
| shareAmount | uint256 | The amount of share redeemed, must > 0 |

### ChargeFeeRebase

```solidity
event ChargeFeeRebase(uint256 blockTimestamp, address rebaseFeeRecipient, uint256 rebaseFeeRate, uint256 feeTokens, uint256 feeShares)
```

Emitted when rebase happened to charge management fee.

_Param `feeTokens` is caculated via getTokenByShares(`feeShares`), shares are newly issued to `rebaseFeeRecipient`_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| blockTimestamp | uint256 | The block's timestamp |
| rebaseFeeRecipient | address | The address to receive management fee |
| rebaseFeeRate | uint256 | The rate of total shares to issue |
| feeTokens | uint256 | The amount of token charged |
| feeShares | uint256 | The amount of share issued to `rebaseFeeRecipient` |

### initialize

```solidity
function initialize(string name_, string symbol_, address manager_, address underlyingNFT_, address wrapper_) external
```

_Initialize the contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| name_ | string | The name of the token |
| symbol_ | string | The symbol of the token |
| manager_ | address | The address of manager |
| underlyingNFT_ | address | The address of underlying nft token |
| wrapper_ | address | The address of wrapped erc20 token |

### issue

```solidity
function issue(address to, uint256 amount) external
```

Issue `amount` tokens to address `to`

_Emits a {Issued} event_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | The receive address |
| amount | uint256 | The token amount to issue |

### redeem

```solidity
function redeem(uint256 amount, uint256[] nftIds) external
```

Redeem `amount` tokens from sender

_Emits a {Redeemed} event_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | The amount of erc20 token to burn |
| nftIds | uint256[] | The tokenIds of underlying nft to redeem |

### chargeFeeRebase

```solidity
function chargeFeeRebase(uint256 rebaseFeeRate, address rebaseFeeRecipient) external
```

Do rebase for management fee collection

_Emits a {ChargeFeeRebase} event.
Must be called by manager._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| rebaseFeeRate | uint256 | The fee rate |
| rebaseFeeRecipient | address | The address to receive fee |

### sharesOf

```solidity
function sharesOf(address account) external view returns (uint256)
```

Returns the amount of shares owned by `account`.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address if `account` |

### totalShares

```solidity
function totalShares() external view returns (uint256)
```

Returns the amount of shares in existence.

### shareBase

```solidity
function shareBase() external view returns (uint256)
```

Returns the amount of shares representing 1 token initially.

_Share base is used in two functions:
1.when issued initially
2.when wrap and unwrap_

### transferShareFrom

```solidity
function transferShareFrom(address from, address to, uint256 shareAmount) external returns (bool)
```

Directly moves `shareAmount` shares from `from` to `to` using the
allowance mechanism. The tokenAmount caculated with shareAmount is then deducted from the caller's
allowance.

_Emits a {Transfer} event._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | The address transfer from |
| to | address | The address transfer to |
| shareAmount | uint256 | The amount of share to transfer |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | The boolean value indicating whether the operation succeeded. |

### transferShare

```solidity
function transferShare(address to, uint256 shareAmount) external returns (bool)
```

Directly moves `shareAmount` shares from the caller's account to `to`.

_Emits a {Transfer} event._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | The address transfer to |
| shareAmount | uint256 | The amount of share to transfer |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | The boolean value indicating whether the operation succeeded. |

### getTokenByShares

```solidity
function getTokenByShares(uint256 shareAmount) external view returns (uint256)
```

Returns the amount of token caculated by `shareAmount` share.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| shareAmount | uint256 | The amount of share |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The amount of token |

### getSharesByToken

```solidity
function getSharesByToken(uint256 tokenAmount) external view returns (uint256)
```

Returns the amount of share caculated by `tokenAmount` token.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenAmount | uint256 | The amount of token |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The amount of share |

