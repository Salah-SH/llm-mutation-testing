# Solidity API

## IERC20Freeze

### freeze

```solidity
function freeze(address addr) external
```

_Freezes an address balance from being transferred._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| addr | address | The new address to freeze. |

### unfreeze

```solidity
function unfreeze(address addr) external
```

_Unfreezes an address balance allowing transfer._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| addr | address | The new address to unfreeze. |

### wipeFrozenAddress

```solidity
function wipeFrozenAddress(address addr, address to) external
```

_Wipes the balance of a frozen address to address `to`_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| addr | address | The new frozen address to wipe. |
| to | address |  |

### isFrozen

```solidity
function isFrozen(address addr) external view returns (bool)
```

_Gets whether the address is currently frozen._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| addr | address | The address to check if frozen. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | A bool representing whether the given address is frozen. |

