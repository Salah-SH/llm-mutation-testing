# Solidity API

## ERC1967Proxy

### constructor

```solidity
constructor(address _logic, bytes _data) public payable
```

_Initializes the upgradeable proxy with an initial implementation specified by `_logic`.

If `_data` is nonempty, it's used as data in a delegate call to `_logic`. This will typically be an encoded
function call, and allows initializing the storage of the proxy like a Solidity constructor._

### _implementation

```solidity
function _implementation() internal view virtual returns (address impl)
```

_Returns the current implementation address._

