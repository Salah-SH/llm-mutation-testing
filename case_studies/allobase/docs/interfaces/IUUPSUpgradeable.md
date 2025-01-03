# Solidity API

## IUUPSUpgradeable

### upgradeTo

```solidity
function upgradeTo(address newImplementation) external
```

_Upgrade the implementation of the proxy to `newImplementation`._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newImplementation | address | The new implementation |

### implementation

```solidity
function implementation() external view returns (address)
```

