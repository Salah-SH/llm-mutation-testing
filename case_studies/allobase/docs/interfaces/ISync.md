# Solidity API

## ISync

### symbol

```solidity
function symbol() external view returns (string)
```

_Returns the symbol of the sync_

### manager

```solidity
function manager() external view returns (address)
```

_Returns the current manager_

### initialize

```solidity
function initialize(string _symbol, address _factory) external
```

_initialize the contract_

### contains

```solidity
function contains(address pair) external view returns (bool)
```

_Returns true if the pair exists._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| pair | address | The defi pair address |

### allDefiPairs

```solidity
function allDefiPairs(uint256 index) external view returns (address pair)
```

_Returns the defi pair address for a given index_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| index | uint256 | The index of the pair array |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| pair | address | the defi pair (eg. unswap V2 pair) |

### getDefiPairsLength

```solidity
function getDefiPairsLength() external view returns (uint256)
```

_Returns the allDefiPairs count_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The count of the allDefiPairs |

### setDefiPair

```solidity
function setDefiPair(address pair) external
```

Inserts defi pair(eg. uniswap V2 pair) address into sync contract

_Must be called by the current manager_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| pair | address | The defi pair(eg. uniswap V2 pair) |

### delDefiPair

```solidity
function delDefiPair(address pair) external
```

Deletes defi pair(eg. uniswap V2 pair) address from sync contract

_Must be called by the current manager_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| pair | address | The defi pair(eg. uniswap V2 pair) |

### sync

```solidity
function sync() external
```

force reserves to match balances

_eg. call uniswapV2 sync()_

