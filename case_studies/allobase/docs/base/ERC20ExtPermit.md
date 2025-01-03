# Solidity API

## ERC20ExtPermit

### __ERC20ExtPermit_init

```solidity
function __ERC20ExtPermit_init(string name) internal
```

_Initializes the {EIP712} domain separator using the `name` parameter, and setting `version` to `"1"`.

It's a good idea to use the same `name` that is defined as the ERC20 token name._

### __ERC20ExtPermit_init_unchained

```solidity
function __ERC20ExtPermit_init_unchained(string) internal
```

### permit

```solidity
function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) public virtual
```

_See {IERC20Permit-permit}._

### nonces

```solidity
function nonces(address owner) public view virtual returns (uint256)
```

_See {IERC20Permit-nonces}._

### DOMAIN_SEPARATOR

```solidity
function DOMAIN_SEPARATOR() external view returns (bytes32)
```

_See {IERC20Permit-DOMAIN_SEPARATOR}._

### _useNonce

```solidity
function _useNonce(address owner) internal virtual returns (uint256 current)
```

_"Consume a nonce": return the current value and increment.

_Available since v4.1.__

### _approve

```solidity
function _approve(address owner, address spender, uint256 amount) internal virtual
```

