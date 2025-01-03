# Solidity API

## ERC20WrapperTpl

### underlying

```solidity
contract IERC20Tpl underlying
```

### _balances

```solidity
mapping(address => uint256) _balances
```

### onlyUnderlying

```solidity
modifier onlyUnderlying()
```

### constructor

```solidity
constructor() public
```

### initialize

```solidity
function initialize(string name_, string symbol_, address manager_, address underlying_) public
```

Initializes the contract

Sets the values for {name} and {symbol}.
Sets `manager_` to ManagerImmutableState.
Initializes EIP712 immutable vars.

### __ERC20WrapperTpl_init_unchained

```solidity
function __ERC20WrapperTpl_init_unchained(address underlying_) internal
```

Initializes the address of underlying.

_Called once at time of deployment._

### balanceOf

```solidity
function balanceOf(address account) public view virtual returns (uint256)
```

_See {IERC20-balanceOf}._

### mintTo

```solidity
function mintTo(address to, uint256 amount) public virtual
```

_See {IERC20WrapperTpl-mintTo}._

### burnFrom

```solidity
function burnFrom(address from, uint256 amount) public virtual
```

_See {IERC20WrapperTpl-burnFrom}._

### pause

```solidity
function pause() external virtual
```

Triggers stopped state.

Requirements:

- The contract must not be paused.

### unpause

```solidity
function unpause() external virtual
```

Returns to normal state.

Requirements:

- The contract must be paused.

### wrap

```solidity
function wrap(uint256 underlyingAmount) public returns (uint256 wrapperAmount)
```

_See {IERC20Wrap-wrap}._

### wrapWithPermit

```solidity
function wrapWithPermit(uint256 underlyingAmount, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external returns (uint256 wrapperAmount)
```

_See {IERC20WrapperTpl-wrapWithPermit}._

### unwrap

```solidity
function unwrap(uint256 wrapperAmount) external returns (uint256 underlyingAmount)
```

_See {IERC20Wrap-unWrap}._

### getWrapperByUnderlying

```solidity
function getWrapperByUnderlying(uint256 underlyingAmount) public view returns (uint256 wrapperAmount, uint256 wrapperShares)
```

_See {IERC20Wrap-getWrapperByUnderlying}._

### getUnderlyingByWrapper

```solidity
function getUnderlyingByWrapper(uint256 wrapperAmount) public view returns (uint256 underlyingAmount, uint256 wrapperShares)
```

_See {IERC20Wrap-getUnderlyingByWrapper}._

### freeze

```solidity
function freeze(address addr_) external virtual
```

See {IERC20Freeze-freeze}.

### unfreeze

```solidity
function unfreeze(address addr_) external virtual
```

See {IERC20Freeze-unfreeze}.

### isFrozen

```solidity
function isFrozen(address addr) public view returns (bool)
```

See {IERC20Freeze-isFrozen}.

### wipeFrozenAddress

```solidity
function wipeFrozenAddress(address from, address to) external virtual
```

See {IERC20Freeze-wipeFrozenAddress}.

### _transfer

```solidity
function _transfer(address from, address to, uint256 amount) internal virtual
```

Moves `amount` of tokens from `from` to `to`.

Emits a {Transfer} event.

Requirements:

- `from` cannot be the zero address.
- `to` cannot be the zero address.
- `from` must have a balance of at least `amount`.

### _mint

```solidity
function _mint(address account, uint256 amount) internal virtual
```

Creates `amount` tokens and assigns them to `account`, increasing the total supply.

Emits a {Transfer} event with `from` set to the zero address.

Requirements:

- `account` cannot be the zero address.

### _burn

```solidity
function _burn(address account, uint256 amount) internal virtual
```

Destroys `amount` tokens from `account`, reducing the total supply.

Emits a {Transfer} event with `to` set to the zero address.

Requirements:

- `account` cannot be the zero address.
- `account` must have at least `amount` tokens.

### _authorizeUpgrade

```solidity
function _authorizeUpgrade(address) internal
```

