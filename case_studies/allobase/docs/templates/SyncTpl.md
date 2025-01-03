# Solidity API

## SyncTpl

### symbol

```solidity
string symbol
```

_See {ISync-symbol}._

### manager

```solidity
address manager
```

_See {ISync-manager}._

### addressSet

```solidity
struct EnumerableSet.AddressSet addressSet
```

### PairSet

```solidity
event PairSet(address addr)
```

Emitted when pair is set

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| addr | address | The new defi pair |

### PairDel

```solidity
event PairDel(address addr)
```

Emitted when pair is deleted

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| addr | address | The deleted defi pair |

### PairSynced

```solidity
event PairSynced(address addr)
```

Emitted when pair is synced

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| addr | address | The synced defi pair |

### onlyManager

```solidity
modifier onlyManager()
```

### constructor

```solidity
constructor() public
```

### initialize

```solidity
function initialize(string _symbol, address _manager) public
```

_See {ISync-initialize}._

### contains

```solidity
function contains(address pair) external view returns (bool)
```

_See {ISync-contains}._

### allDefiPairs

```solidity
function allDefiPairs(uint256 index) external view returns (address)
```

_See {ISync-allDefiPairs}._

### getDefiPairsLength

```solidity
function getDefiPairsLength() external view returns (uint256)
```

_See {ISync-getDefiPairsLength}._

### setDefiPair

```solidity
function setDefiPair(address pair) external
```

_See {ISync-setDefiPair}._

### delDefiPair

```solidity
function delDefiPair(address pair) external
```

_See {ISync-delDefiPair}._

### sync

```solidity
function sync() external
```

_See {ISync-sync}._

### _authorizeUpgrade

```solidity
function _authorizeUpgrade(address) internal
```

### implementation

```solidity
function implementation() public view returns (address)
```

