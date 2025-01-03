# Solidity API

## IFactory

### triple

```solidity
struct triple {
  address ERC721;
  address ERC20;
  address ERC20Wrapper;
}
```

### manager

```solidity
function manager() external view returns (address)
```

Returns the current manager of the factory

_Can not be changed any more_

### ERC721Impl

```solidity
function ERC721Impl() external view returns (address)
```

Returns the current ERC721 implementation of the factory

_Can be changed by the current manager via setERC721Impl_

### ERC20Impl

```solidity
function ERC20Impl() external view returns (address)
```

Returns the current ERC20 implementation of the factory

_Can be changed by the current manager via setERC20Impl_

### ERC20WrapperImpl

```solidity
function ERC20WrapperImpl() external view returns (address)
```

Returns the current ERC20 wrapper implementation of the factory

_Can be changed by the current manager via setERC20WrapperImpl_

### syncImpl

```solidity
function syncImpl() external view returns (address)
```

Returns the current sync implementation of the factory

_Can be changed by the current manager via setSyncImpl_

### initialize

```solidity
function initialize(address _ERC721Impl, address _ERC20Impl, address _ERC20WrapperImpl, address _syncImpl, address _manager) external
```

_initialize the contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _ERC721Impl | address | The ERC721 implementation of the factory |
| _ERC20Impl | address | The ERC20 implementation of the factory |
| _ERC20WrapperImpl | address | The ERC20 wrapper implementation of the factory |
| _syncImpl | address | The sync implementation of the factory |
| _manager | address | The manager of the factory |

### setERC721Impl

```solidity
function setERC721Impl(address newImpl) external
```

Updates the ERC721 implementation of the factory

_Must be called by the current manager_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newImpl | address | The new ERC721 implementation of the factory |

### setERC20Impl

```solidity
function setERC20Impl(address newImpl) external
```

Updates the ERC20 implementation of the factory

_Must be called by the current manager_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newImpl | address | The new ERC20 implementation of the factory |

### setERC20WrapperImpl

```solidity
function setERC20WrapperImpl(address newImpl) external
```

Updates the ERC20 wrapper implementation of the factory

_Must be called by the current manager_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newImpl | address | The new ERC20 wrapper implementation of the factory |

### setSyncImpl

```solidity
function setSyncImpl(address newImpl) external
```

Updates the sync implementation of the factory

_Must be called by the current manager_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newImpl | address | The new sync implementation of the factory |

### getTriple

```solidity
function getTriple(string symbol) external view returns (address ERC721, address ERC20, address ERC20Wrapper)
```

_Returns the ERC721/ERC20/ERC20Wrapper proxy addresses for a given symbol, or addresses 0/0/0 if it does not exist_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| symbol | string | The symbol of the ERC20 token |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| ERC721 | address | The proxy address of the ERC721 token contract |
| ERC20 | address | The proxy address of the ERC20 token contract |
| ERC20Wrapper | address | The proxy address of the ERC20 wrapper token contract |

### allTriples

```solidity
function allTriples(uint256 index) external view returns (address ERC721, address ERC20, address ERC20Wrapper)
```

_Returns the ERC721/ERC20/ERC20Wrapper proxy addresses for a given index_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| index | uint256 | The index of the triple array |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| ERC721 | address | The proxy address of the ERC721 token contract |
| ERC20 | address | The proxy address of the ERC20 token contract |
| ERC20Wrapper | address | The proxy address of the ERC20 wrapper token contract |

### getTriplesLength

```solidity
function getTriplesLength() external view returns (uint256)
```

_Returns the allTriples count_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The count of the allTriples |

### getSync

```solidity
function getSync(string symbol) external view returns (address)
```

_Returns the sync proxy address for a given symbol, or address 0 if it does not exist_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address | The proxy address of the sync contract |

### createTriple

```solidity
function createTriple(string name, string symbol, string underlyingUnit) external returns (struct IFactory.triple t, uint256 triplesLength, address s)
```

Create a new triple

_Must be called by the current manager_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| name | string | The ERC20 token name |
| symbol | string | The ERC20 token symbol |
| underlyingUnit | string | The unit of underlying amount, eg `kg`, `oz` |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| t | struct IFactory.triple | The triple of erc721/erc20/erc20Wrapper proxy addresses |
| triplesLength | uint256 | The count of the allTriples |
| s | address | The proxy address of the Sync contract |

