# Solidity API

## Freezable

### _frozen

```solidity
mapping(address => bool) _frozen
```

### Frozen

```solidity
event Frozen(address addr)
```

### Unfrozen

```solidity
event Unfrozen(address addr)
```

### FrozenAddressWiped

```solidity
event FrozenAddressWiped(address from, address to, uint256 amount)
```

### _freeze

```solidity
function _freeze(address addr) internal virtual
```

_Freezes an address balance from being transferred._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| addr | address | The new address to freeze. |

### _unfreeze

```solidity
function _unfreeze(address addr) internal virtual
```

_Unfreezes an address balance allowing transfer._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| addr | address | The new address to unfreeze. |

### _isFrozen

```solidity
function _isFrozen(address addr) internal view returns (bool)
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

### _requireNotFrozen

```solidity
function _requireNotFrozen(address from, address to) internal view
```

