# Solidity API

## ERC20Tpl

### FEE_BASE

```solidity
uint256 FEE_BASE
```

### wrappedToken

```solidity
contract IERC20WrapperTpl wrappedToken
```

### underlyingNFT

```solidity
contract IERC721Tpl underlyingNFT
```

### _shares

```solidity
mapping(address => uint256) _shares
```

### _totalShares

```solidity
uint256 _totalShares
```

### constructor

```solidity
constructor() public
```

### initialize

```solidity
function initialize(string name_, string symbol_, address manager_, address underlyingNFT_, address wrapper_) public
```

Initializes the contract.

Sets the values for {name} and {symbol}.
Sets `manager_` to ManagerImmutableState.
Initializes EIP712 immutable vars.

### __ERC20Tpl_init_unchained

```solidity
function __ERC20Tpl_init_unchained(address underlyingNFT_, address wrapper_) internal
```

_Initializes the address of (underlyingNFT, wrappedToken).
Called once at time of deployment._

### balanceOf

```solidity
function balanceOf(address account) public view virtual returns (uint256)
```

_See {IERC20-balanceOf}._

### sharesOf

```solidity
function sharesOf(address account) public view virtual returns (uint256)
```

_See {IERC20Tpl-sharesOf}._

### totalShares

```solidity
function totalShares() public view virtual returns (uint256)
```

_See {IERC20Tpl-totalShares}._

### transferShare

```solidity
function transferShare(address to, uint256 shareAmount) public virtual returns (bool)
```

_See {IERC20Tpl-transferShare}._

### transferShareFrom

```solidity
function transferShareFrom(address from, address to, uint256 shareAmount) public virtual returns (bool)
```

_See {IERC20Tpl-transferShareFrom}._

### shareBase

```solidity
function shareBase() public view virtual returns (uint256)
```

_See {IERC20Tpl-shareBase}._

### getTokenByShares

```solidity
function getTokenByShares(uint256 shareAmount) public view returns (uint256)
```

_See {IERC20Tpl-getTokenByShares}._

### getSharesByToken

```solidity
function getSharesByToken(uint256 tokenAmount) public view returns (uint256)
```

_See {IERC20Tpl-getSharesByToken}._

### issue

```solidity
function issue(address to, uint256 amount) external virtual
```

_See {IERC20Tpl-issue}._

### redeem

```solidity
function redeem(uint256 amount, uint256[] nftIds) external virtual
```

Will burn both erc20 and erc721 token.

_See {IERC20Tpl-redeem}._

### _redeem

```solidity
function _redeem(address account, uint256 amount, uint256[] nftIds) internal virtual
```

Redeem `amount` tokens from `account`.

_Will burn both erc20 and erc721 token._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address to redeem from |
| amount | uint256 | The amount of erc20 token to burn |
| nftIds | uint256[] | The tokenIds of underlying nft to redeem, which were locked on this contract. |

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
function wrap(uint256 underlyingAmount) external returns (uint256 wrapperAmount)
```

_See {IERC20Wrap-wrap}._

### unwrap

```solidity
function unwrap(uint256 wrapperAmount) external returns (uint256 underlyingAmount)
```

_See {IERC20Wrap-unwrap}._

### getWrapperByUnderlying

```solidity
function getWrapperByUnderlying(uint256 underlyingAmount) public view returns (uint256 wrapperAmount, uint256 underlyingShares)
```

_See {IERC20Wrap-getWrapperByUnderlying}._

### getUnderlyingByWrapper

```solidity
function getUnderlyingByWrapper(uint256 wrapperAmount) public view returns (uint256 underlyingAmount, uint256 underlyingShares)
```

_See {IERC20Wrap-getUnderlyingByWrapper}._

### chargeFeeRebase

```solidity
function chargeFeeRebase(uint256 rebaseFeeRate, address rebaseFeeRecipient) external
```

See {IERC20Tpl-chargeFeeRebase}.
Collect management fee by rebase, directly {_mintShare} to `rebaseFeeRecipient`

### freeze

```solidity
function freeze(address addr) external virtual
```

See {IERC20Freeze-freeze}.

### unfreeze

```solidity
function unfreeze(address addr) external virtual
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

_Transfer total shares of `from` to `to`._

### _transfer

```solidity
function _transfer(address from, address to, uint256 tokenAmount) internal virtual
```

Moves `tokenAmount` of tokens from `from` to `to`.

Requirements:

- `from` cannot be the zero address.
- `to` cannot be the zero address.

### _transferShare

```solidity
function _transferShare(address from, address to, uint256 shareAmount) internal virtual
```

Moves `shareAmount` of shares from `from` to `to`.

Requirements:
- `from` cannot be the zero address.
- `to` cannot be the zero address.

### _transferShareRaw

```solidity
function _transferShareRaw(address from, address to, uint256 tokenAmount, uint256 shareAmount) internal virtual
```

Moves `shareAmount` of shares from `from` to `to`.

Emits a {Transfer} event.

Requirements:
- `from` must have shares of at least `shareAmount`.

### _mint

```solidity
function _mint(address account, uint256 tokenAmount) internal virtual
```

Creates `tokenAmount` tokens and assigns equivalent shares to `account`
Increases the total supply.
Increases the total shares.
If new shares to mint is zero, use {shareBase} as a multiplier.

Emits a {Transfer} event with `from` set to the zero address.

Emits a {Mint} event including `shareAmount`.

Requirements:

- `account` cannot be the zero address.
- `tokenAmount` cannot be zero.

### _mintShare

```solidity
function _mintShare(address account, uint256 shareAmount) internal virtual returns (uint256 tokenAmount)
```

Creates `shareAmount` shares and assigns them to `account`
Increasing the total shares.

Emits a {Transfer} event with `from` set to the zero address.
Emits a {Mint} event with `shareAmount`

Requirements:

- `account` cannot be the zero address.
- `shareAmount` cannot be zero.

### _burn

```solidity
function _burn(address account, uint256 tokenAmount) internal virtual
```

Destroys `tokenAmount` tokens from `account` by reducing equivalent shares.
Reduces the total supply.
Reduces the total shares.

Emits a {Transfer} event with `to` set to the zero address.
Emits a {Burn} event including `shareAmount`

Requirements:

- `account` cannot be the zero address.
- `account` must have at least `shareAmount` shares caculated by `tokenAmount` tokens.

### _authorizeUpgrade

```solidity
function _authorizeUpgrade(address) internal
```

