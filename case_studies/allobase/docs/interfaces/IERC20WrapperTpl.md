# Solidity API

## IERC20WrapperTpl

### initialize

```solidity
function initialize(string name_, string symbol_, address manager_, address underlying_) external
```

Initialize the contract.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| name_ | string | The name of the token |
| symbol_ | string | The symbol of the token |
| manager_ | address | The address of manager |
| underlying_ | address | The address of underlying erc20 token |

### wrapWithPermit

```solidity
function wrapWithPermit(uint256 underlyingAmount, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external returns (uint256 wrapperAmount)
```

Exchanges underlying erc20 token to wrapped erc20 token with approvals to be made via signatures

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| underlyingAmount | uint256 | The amount of underlying erc20 token to wrap. |
| deadline | uint256 | The expiration of signature, a timestamp in the future. |
| v | uint8 | The signature fields |
| r | bytes32 | The signature fields |
| s | bytes32 | The signature fields |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| wrapperAmount | uint256 | The amount of wrapped erc20 token user receives after wrap. |

### mintTo

```solidity
function mintTo(address to, uint256 amount) external
```

Mint `amount` tokens to the `to`.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | The address to mint to |
| amount | uint256 | The amount of token to mint |

### burnFrom

```solidity
function burnFrom(address from, uint256 amount) external
```

Burn `amount` tokens from `account`.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | The address to burn from |
| amount | uint256 | The amount of token to burn |

