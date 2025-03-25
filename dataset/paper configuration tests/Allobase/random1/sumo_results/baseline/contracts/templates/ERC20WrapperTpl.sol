// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.8.3;

import '../interfaces/IERC20Tpl.sol';
import '../interfaces/IERC20WrapperTpl.sol';
import '../base/ERC20Base.sol';
import '../base/ManagerImmutableState.sol';

/// @title Wrapper of ERC20 with underlying nfts
contract ERC20WrapperTpl is IERC20WrapperTpl, ManagerImmutableState, ERC20Base {
    // The underlying erc20 token address
    IERC20Tpl public underlying;

    mapping(address => uint256) internal _balances;

    modifier onlyUnderlying() {
        require(_msgSender() == address(underlying), 'Not underlying');
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    /**
     * @notice Initializes the contract
     *
     * Sets the values for {name} and {symbol}.
     * Sets `manager_` to ManagerImmutableState.
     * Initializes EIP712 immutable vars.
     */
    function initialize(
        string memory name_,
        string memory symbol_,
        address manager_,
        address underlying_
    ) public override initializer {
        __ERC20Base_init(name_, symbol_, '1');
        __ManagerImmutableState_init(manager_);
        __ERC20WrapperTpl_init_unchained(underlying_);
    }

    /**
     * @notice Initializes the address of underlying.
     *
     * @dev Called once at time of deployment.
     */
    function __ERC20WrapperTpl_init_unchained(address underlying_) internal onlyInitializing {
        require(underlying_ != address(0), 'Underlying zero address');
        underlying = IERC20Tpl(underlying_);
    }

    /**
     * @dev See {IERC20-balanceOf}.
     */
    function balanceOf(address account) public view virtual override returns (uint256) {
        return _balances[account];
    }

    /**
     * @dev See {IERC20WrapperTpl-mintTo}.
     */
    function mintTo(address to, uint256 amount) public virtual override onlyUnderlying {
        _mint(to, amount);
    }

    /**
     * @dev See {IERC20WrapperTpl-burnFrom}.
     */
    function burnFrom(address from, uint256 amount) public virtual override onlyUnderlying {
        _burn(from, amount);
    }

    /**
     * @notice Triggers stopped state.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    function pause() external virtual override onlyManager {
        _pause();
    }

    /**
     * @notice Returns to normal state.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    function unpause() external virtual override onlyManager {
        _unpause();
    }

    /**
     * @dev See {IERC20Wrap-wrap}.
     */
    function wrap(uint256 underlyingAmount) public override returns (uint256 wrapperAmount) {
        uint256 shares;
        (wrapperAmount, shares) = getWrapperByUnderlying(underlyingAmount);
        require(shares > 0, 'Wrap zero');

        address sender = _msgSender();

        uint256 sharesBefore = underlying.sharesOf(address(this));

        underlying.transferShareFrom(sender, address(this), shares);

        require((sharesBefore + shares) <= underlying.sharesOf(address(this)), 'Wrap shares check');

        _mint(sender, wrapperAmount);

        emit Wrap(sender, underlyingAmount, wrapperAmount);
    }

    /**
     * @dev See {IERC20WrapperTpl-wrapWithPermit}.
     */
    function wrapWithPermit(
        uint256 underlyingAmount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external override returns (uint256 wrapperAmount) {
        underlying.permit(_msgSender(), address(this), underlyingAmount, deadline, v, r, s);
        wrapperAmount = wrap(underlyingAmount);
    }

    /**
     * @dev See {IERC20Wrap-unWrap}.
     */
    function unwrap(uint256 wrapperAmount) external override returns (uint256 underlyingAmount) {
        require(wrapperAmount > 0, 'Unwrap zero');

        uint256 shares;

        (underlyingAmount, shares) = getUnderlyingByWrapper(wrapperAmount);

        address sender = _msgSender();
        _burn(sender, wrapperAmount);
        underlying.transferShare(sender, shares);

        emit Unwrap(sender, underlyingAmount, wrapperAmount);
    }

    /**
     * @dev See {IERC20Wrap-getWrapperByUnderlying}.
     */
    function getWrapperByUnderlying(uint256 underlyingAmount)
        public
        view
        override
        returns (uint256 wrapperAmount, uint256 wrapperShares)
    {
        return underlying.getWrapperByUnderlying(underlyingAmount);
    }

    /**
     * @dev See {IERC20Wrap-getUnderlyingByWrapper}.
     */
    function getUnderlyingByWrapper(uint256 wrapperAmount)
        public
        view
        override
        returns (uint256 underlyingAmount, uint256 wrapperShares)
    {
        return underlying.getUnderlyingByWrapper(wrapperAmount);
    }

    /**
     * See {IERC20Freeze-freeze}.
     */
    function freeze(address addr_) external virtual override onlyManager {
        _freeze(addr_);
    }

    /**
     * See {IERC20Freeze-unfreeze}.
     */
    function unfreeze(address addr_) external virtual override onlyManager {
        _unfreeze(addr_);
    }

    /**
     * See {IERC20Freeze-isFrozen}.
     */
    function isFrozen(address addr) public view override returns (bool) {
        return _isFrozen(addr);
    }

    /**
     * See {IERC20Freeze-wipeFrozenAddress}.
     */
    function wipeFrozenAddress(address from, address to) external virtual override onlyManager {
        require(isFrozen(from), 'Wipe not frozen');
        uint256 amount = _balances[from];
        _transfer(from, to, amount);
        emit FrozenAddressWiped(from, to, amount);
    }

    /**
     * @notice Moves `amount` of tokens from `from` to `to`.
     *
     * Emits a {Transfer} event.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `from` must have a balance of at least `amount`.
     */
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        require(from != address(0), 'ERC20: transfer from the zero address');
        require(to != address(0), 'ERC20: transfer to the zero address');

        _beforeTokenTransfer(from, to, amount);

        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, 'ERC20: transfer amount exceeds balance');
        unchecked {
            _balances[from] = fromBalance - amount;
        }

        _balances[to] += amount;

        emit Transfer(from, to, amount);

        _afterTokenTransfer(from, to, amount);
    }

    /**
     * @notice Creates `amount` tokens and assigns them to `account`, increasing the total supply.
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     */
    function _mint(address account, uint256 amount) internal virtual override {
        require(account != address(0), 'ERC20: mint to the zero address');

        _beforeTokenTransfer(address(0), account, amount);

        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);

        _afterTokenTransfer(address(0), account, amount);
    }

    /**
     * @notice Destroys `amount` tokens from `account`, reducing the total supply.
     *
     * Emits a {Transfer} event with `to` set to the zero address.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     * - `account` must have at least `amount` tokens.
     */
    function _burn(address account, uint256 amount) internal virtual override {
        require(account != address(0), 'ERC20: burn from the zero address');

        _beforeTokenTransfer(account, address(0), amount);

        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, 'ERC20: burn amount exceeds balance');
        unchecked {
            _balances[account] = accountBalance - amount;
        }
        _totalSupply -= amount;

        emit Transfer(account, address(0), amount);

        _afterTokenTransfer(account, address(0), amount);
    }

    function _authorizeUpgrade(address) internal override onlyManager {}
}
