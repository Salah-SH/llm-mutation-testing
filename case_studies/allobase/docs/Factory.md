# Solidity API

## Factory

### manager

```solidity
address manager
```

_See {IFactory-manager}._

### ERC721Impl

```solidity
address ERC721Impl
```

_See {IFactory-ERC721Impl}._

### ERC20Impl

```solidity
address ERC20Impl
```

_See {IFactory-ERC20Impl}._

### ERC20WrapperImpl

```solidity
address ERC20WrapperImpl
```

_See {IFactory-ERC20WrapperImpl}._

### syncImpl

```solidity
address syncImpl
```

_See {IFactory-syncImpl}._

### getTriple

```solidity
mapping(string => struct IFactory.triple) getTriple
```

_See {IFactory-getTriple}._

### allTriples

```solidity
struct IFactory.triple[] allTriples
```

_See {IFactory-allTriples}._

### getSync

```solidity
mapping(string => address) getSync
```

_See {IFactory-getSync}._

### ERC721ImplSet

```solidity
event ERC721ImplSet(address oldAddr, address newAddr)
```

Emitted when ERC721Impl is set

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| oldAddr | address | The old implementation address of ERC721Impl |
| newAddr | address | The new implementation address of ERC721Impl |

### ERC20ImplSet

```solidity
event ERC20ImplSet(address oldAddr, address newAddr)
```

Emitted when ERC20Impl is set

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| oldAddr | address | The old implementation address of ERC20Impl |
| newAddr | address | The new implementation address of ERC20Impl |

### ERC20WrapperImplSet

```solidity
event ERC20WrapperImplSet(address oldAddr, address newAddr)
```

Emitted when ERC20WrapperImpl is set

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| oldAddr | address | The old implementation address of ERC20WrapperImpl |
| newAddr | address | The new implementation address of ERC20WrapperImpl |

### SyncImplSet

```solidity
event SyncImplSet(address oldAddr, address newAddr)
```

Emitted when syncImpl is set

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| oldAddr | address | The old contract address of syncImpl |
| newAddr | address | The new contract address of syncImpl |

### TripleCreated

```solidity
event TripleCreated(string symbol, address erc721, address erc20, address erc20Wrapper, uint256 triplesLength)
```

Emitted when a triple is Created

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| symbol | string | The symbol of the ERC20 token |
| erc721 | address | The proxy address of the ERC721 token contract |
| erc20 | address | The proxy address of the ERC20 token contract |
| erc20Wrapper | address | The proxy address of the ERC20 wrapper token contract |
| triplesLength | uint256 | The count of the allTriples |

### SyncCreated

```solidity
event SyncCreated(string symbol, address sync)
```

Emitted when a sync is Created

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| symbol | string | The symbol of the ERC20 token |
| sync | address | The contract address of the sync |

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
function initialize(address _ERC721Impl, address _ERC20Impl, address _ERC20WrapperImpl, address _syncImpl, address _manager) public
```

_See {IFactory-initialize}._

### setERC721Impl

```solidity
function setERC721Impl(address newImpl) external
```

_See {IFactory-setERC721Impl}._

### setERC20Impl

```solidity
function setERC20Impl(address newImpl) external
```

_See {IFactory-setERC20Impl}._

### setERC20WrapperImpl

```solidity
function setERC20WrapperImpl(address newImpl) external
```

_See {IFactory-setERC20WrapperImpl}._

### setSyncImpl

```solidity
function setSyncImpl(address newImpl) external
```

_See {IFactory-setSyncImpl}._

### getTriplesLength

```solidity
function getTriplesLength() external view returns (uint256)
```

_See {IFactory-getTriplesLength}._

### createTriple

```solidity
function createTriple(string name, string symbol, string underlyingUnit) external returns (struct IFactory.triple t, uint256 triplesLength, address s)
```

_See {IFactory-createTriple}._

### _authorizeUpgrade

```solidity
function _authorizeUpgrade(address) internal
```

### implementation

```solidity
function implementation() public view returns (address)
```

