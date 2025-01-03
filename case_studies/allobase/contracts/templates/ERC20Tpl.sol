// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.8.3;

import '../interfaces/IERC20Tpl.sol';
import '../interfaces/IERC20WrapperTpl.sol';
import '../interfaces/IERC721Tpl.sol';

import '../base/ManagerImmutableState.sol';
import '../base/ERC20Base.sol';

/// @title ERC20 with underlying nfts
contract ERC20Tpl is IERC20Tpl, ManagerImmutableState, ERC20Base {
    uint256 public constant FEE_BASE = 10**12;

    // The erc20 token address after wrapping
    IERC20WrapperTpl public wrappedToken;

    // The underlying nft token address
    IERC721Tpl public underlyingNFT;

    mapping(address => uint256) internal _shares;
    uint256 internal _totalShares;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    /**
     * @notice Initializes the contract.
     *
     * Sets the values for {name} and {symbol}.
     * Sets `manager_` to ManagerImmutableState.
     * Initializes EIP712 immutable vars.
     */
    function initialize(
        string memory name_,
        string memory symbol_,
        address manager_,
        address underlyingNFT_,
        address wrapper_
    ) public override initializer {
        __ERC20Base_init(name_, symbol_, '1');
        __ManagerImmutableState_init(manager_);
        __ERC20Tpl_init_unchained(underlyingNFT_, wrapper_);
    }

    /**
     * @dev Initializes the address of (underlyingNFT, wrappedToken).
     * @dev Called once at time of deployment.
     */
    function __ERC20Tpl_init_unchained(address underlyingNFT_, address wrapper_) internal onlyInitializing {
        require(underlyingNFT_ != address(0), 'Underlying zero address');
        require(wrapper_ != address(0), 'Wrapper zero address');

        underlyingNFT = IERC721Tpl(underlyingNFT_);
        wrappedToken = IERC20WrapperTpl(wrapper_);
    }

    /**
     * @dev See {IERC20-balanceOf}.
     */
    function balanceOf(address account) public view virtual override returns (uint256) {
        return getTokenByShares(_shares[account]);
    }

    /**
     * @dev See {IERC20Tpl-sharesOf}.
     */
    function sharesOf(address account) public view virtual override returns (uint256) {
        return _shares[account];
    }

    /**
     * @dev See {IERC20Tpl-totalShares}.
     */
    function totalShares() public view virtual override returns (uint256) {
        return _totalShares;
    }

    /**
     * @dev See {IERC20Tpl-transferShare}.
     */
    function transferShare(address to, uint256 shareAmount) public virtual override returns (bool) {
        address owner = _msgSender();
        _requireNotFrozen(owner, to);
        _transferShare(owner, to, shareAmount);
        return true;
    }

    /**
     * @dev See {IERC20Tpl-transferShareFrom}.
     */
    function transferShareFrom(
        address from,
        address to,
        uint256 shareAmount
    ) public virtual override returns (bool) {
        _requireNotFrozen(from, to);
        address spender = _msgSender();
        uint256 tokenAmount = getTokenByShares(shareAmount);
        _spendAllowance(from, spender, tokenAmount);
        _transferShare(from, to, shareAmount);
        return true;
    }

    /**
     * @dev See {IERC20Tpl-shareBase}.
     */
    function shareBase() public view virtual override returns (uint256) {
        return 10**8;
    }

    /**
     * @dev See {IERC20Tpl-getTokenByShares}.
     */
    function getTokenByShares(uint256 shareAmount) public view override returns (uint256) {
        uint256 totalShare = _totalShares;
        if (totalShare == 0) {
            return 0;
        } else {
            return (shareAmount * _totalSupply) / totalShare;
        }
    }

    /**
     * @dev See {IERC20Tpl-getSharesByToken}.
     */
    function getSharesByToken(uint256 tokenAmount) public view override returns (uint256) {
        uint256 totalSupply = _totalSupply;
        if (totalSupply == 0) {
            return 0;
        } else {
            return (tokenAmount * _totalShares) / totalSupply;
        }
    }

    /**
     * @dev See {IERC20Tpl-issue}.
     */
    function issue(address to, uint256 amount) external virtual override onlyManager {
        _mint(to, amount);
    }

    /**
     * @dev See {IERC20Tpl-redeem}.
     * @notice Will burn both erc20 and erc721 token.
     */
    function redeem(uint256 amount, uint256[] calldata nftIds) external virtual override onlyManager {
        _redeem(_msgSender(), amount, nftIds);
    }

    /**
     * @notice Redeem `amount` tokens from `account`.
     * @dev Will burn both erc20 and erc721 token.
     * @param account The address to redeem from
     * @param amount The amount of erc20 token to burn
     * @param nftIds The tokenIds of underlying nft to redeem, which were locked on this contract.
     */
    function _redeem(
        address account,
        uint256 amount,
        uint256[] calldata nftIds
    ) internal virtual {
        uint256 underlyings;
        unchecked {
            for (uint256 i = 0; i < nftIds.length; i++) {
                underlyings += underlyingNFT.underlyingOf(nftIds[i]);
            }
        }
        require(amount == underlyings, 'Redeem underlyings amount check');
        _burn(account, amount);

        underlyingNFT.redeem(nftIds);
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
    function wrap(uint256 underlyingAmount) external override returns (uint256 wrapperAmount) {
        uint256 shares;
        (wrapperAmount, shares) = getWrapperByUnderlying(underlyingAmount);

        require(shares > 0, 'Wrap zero');

        address sender = _msgSender();

        _transferShare(sender, address(wrappedToken), shares); // lock shares to ERC20Wrapper
        wrappedToken.mintTo(sender, wrapperAmount);

        emit Wrap(sender, underlyingAmount, wrapperAmount);
    }

    /**
     * @dev See {IERC20Wrap-unwrap}.
     */
    function unwrap(uint256 wrapperAmount) external override returns (uint256 underlyingAmount) {
        require(wrapperAmount > 0, 'Unwrap zero');
        uint256 shares;
        (underlyingAmount, shares) = getUnderlyingByWrapper(wrapperAmount);

        address sender = _msgSender();
        wrappedToken.burnFrom(sender, wrapperAmount);
        _transferShare(address(wrappedToken), sender, shares);

        emit Unwrap(sender, underlyingAmount, wrapperAmount);
    }

    /**
     * @dev See {IERC20Wrap-getWrapperByUnderlying}.
     */
    function getWrapperByUnderlying(uint256 underlyingAmount)
        public
        view
        override
        returns (uint256 wrapperAmount, uint256 underlyingShares)
    {
        uint256 shares = getSharesByToken(underlyingAmount);
        uint256 base = shareBase();
        wrapperAmount = shares / base;
        underlyingShares = wrapperAmount * base;
    }

    /**
     * @dev See {IERC20Wrap-getUnderlyingByWrapper}.
     */
    function getUnderlyingByWrapper(uint256 wrapperAmount)
        public
        view
        override
        returns (uint256 underlyingAmount, uint256 underlyingShares)
    {
        underlyingShares = wrapperAmount * shareBase();
        underlyingAmount = getTokenByShares(underlyingShares);
    }

    /**
     * See {IERC20Tpl-chargeFeeRebase}.
     * Collect management fee by rebase, directly {_mintShare} to `rebaseFeeRecipient`
     */
    function chargeFeeRebase(uint256 rebaseFeeRate, address rebaseFeeRecipient) external override onlyManager {
        require(rebaseFeeRate > 0 && rebaseFeeRate < FEE_BASE, 'Rebase fee rate out of bound');
        require(rebaseFeeRecipient != address(0), 'Rebase fee recipient zero address');

        uint256 feeShares = (_totalShares * rebaseFeeRate) / FEE_BASE;
        uint256 feeTokens = _mintShare(rebaseFeeRecipient, feeShares);

        emit ChargeFeeRebase(block.timestamp, rebaseFeeRecipient, rebaseFeeRate, feeTokens, feeShares);
    }

    /**
     * See {IERC20Freeze-freeze}.
     */
    function freeze(address addr) external virtual override onlyManager {
        _freeze(addr);
    }

    /**
     * See {IERC20Freeze-unfreeze}.
     */
    function unfreeze(address addr) external virtual override onlyManager {
        _unfreeze(addr);
    }

    /**
     * See {IERC20Freeze-isFrozen}.
     */
    function isFrozen(address addr) public view override returns (bool) {
        return _isFrozen(addr);
    }

    /**
     * See {IERC20Freeze-wipeFrozenAddress}.
     * @dev Transfer total shares of `from` to `to`.
     */
    function wipeFrozenAddress(address from, address to) external virtual override onlyManager {
        require(isFrozen(from), 'Wipe not frozen');
        uint256 shares = _shares[from];
        _transferShare(from, to, shares);
        emit FrozenAddressWiped(from, to, getTokenByShares(shares));
    }

    /**
     * @notice Moves `tokenAmount` of tokens from `from` to `to`.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     */
    function _transfer(
        address from,
        address to,
        uint256 tokenAmount
    ) internal virtual override {
        require(from != address(0), 'ERC20: transfer from the zero address');
        require(to != address(0), 'ERC20: transfer to the zero address');

        _beforeTokenTransfer(from, to, tokenAmount);

        uint256 shareAmount = getSharesByToken(tokenAmount);
        require(shareAmount > 0, 'ERC20: transfer zero');

        _transferShareRaw(from, to, tokenAmount, shareAmount);

        _afterTokenTransfer(from, to, tokenAmount);
    }

    /**
     * @notice Moves `shareAmount` of shares from `from` to `to`.
     *
     * Requirements:
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     */
    function _transferShare(
        address from,
        address to,
        uint256 shareAmount
    ) internal virtual {
        require(from != address(0), 'ERC20: transfer from the zero address');
        require(to != address(0), 'ERC20: transfer to the zero address');

        uint256 tokenAmount = getTokenByShares(shareAmount);
        _beforeTokenTransfer(from, to, tokenAmount);

        _transferShareRaw(from, to, tokenAmount, shareAmount);

        _afterTokenTransfer(from, to, tokenAmount);
    }

    /**
     * @notice Moves `shareAmount` of shares from `from` to `to`.
     *
     * Emits a {Transfer} event.
     *
     * Requirements:
     * - `from` must have shares of at least `shareAmount`.
     */
    function _transferShareRaw(
        address from,
        address to,
        uint256 tokenAmount,
        uint256 shareAmount
    ) internal virtual {
        uint256 fromShare = _shares[from];
        require(fromShare >= shareAmount, 'ERC20: transfer amount exceeds balance');
        unchecked {
            _shares[from] = fromShare - shareAmount;
        }

        _shares[to] += shareAmount;
        emit Transfer(from, to, tokenAmount);
    }

    /**
     * @notice Creates `tokenAmount` tokens and assigns equivalent shares to `account`
     * Increases the total supply.
     * Increases the total shares.
     * If new shares to mint is zero, use {shareBase} as a multiplier.
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     *
     * Emits a {Mint} event including `shareAmount`.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     * - `tokenAmount` cannot be zero.
     */
    function _mint(address account, uint256 tokenAmount) internal virtual override {
        require(account != address(0), 'ERC20: mint to the zero address');
        require(tokenAmount > 0, 'ERC20: mint zero amount');

        _beforeTokenTransfer(address(0), account, tokenAmount);

        uint256 shareAmount = getSharesByToken(tokenAmount);

        if (shareAmount == 0) {
            // total supply is 0: either the first-ever mint or complete slashing
            // just caculate shareAmount by tokenAmount and {shareBase}
            shareAmount = tokenAmount * shareBase();
        }

        _totalSupply += tokenAmount;
        _totalShares += shareAmount;
        _shares[account] += shareAmount;
        emit Issued(account, tokenAmount, shareAmount);
        emit Transfer(address(0), account, tokenAmount);

        _afterTokenTransfer(address(0), account, tokenAmount);
    }

    /**
     * @notice Creates `shareAmount` shares and assigns them to `account`
     * Increasing the total shares.
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     * Emits a {Mint} event with `shareAmount`
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     * - `shareAmount` cannot be zero.
     */
    function _mintShare(address account, uint256 shareAmount) internal virtual returns (uint256 tokenAmount) {
        require(account != address(0), 'ERC20: mint to the zero address');
        require(shareAmount > 0, 'ERC20: mint zero shares');

        _totalShares += shareAmount; // pre-add {_totalShares} for accurately get tokenAmount
        tokenAmount = getTokenByShares(shareAmount);
        _beforeTokenTransfer(address(0), account, tokenAmount);

        _shares[account] += shareAmount;
        emit Issued(account, 0, shareAmount);
        emit Transfer(address(0), account, tokenAmount);

        _afterTokenTransfer(address(0), account, tokenAmount);
    }

    /**
     * @notice Destroys `tokenAmount` tokens from `account` by reducing equivalent shares.
     * Reduces the total supply.
     * Reduces the total shares.
     *
     * Emits a {Transfer} event with `to` set to the zero address.
     * Emits a {Burn} event including `shareAmount`
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     * - `account` must have at least `shareAmount` shares caculated by `tokenAmount` tokens.
     */
    function _burn(address account, uint256 tokenAmount) internal virtual override {
        require(account != address(0), 'ERC20: burn from the zero address');

        _beforeTokenTransfer(account, address(0), tokenAmount);

        uint256 shareAmount = getSharesByToken(tokenAmount);
        require(shareAmount > 0, 'ERC20: burn zero share');

        uint256 accountShare = _shares[account];
        require(accountShare >= shareAmount, 'ERC20: burn amount exceeds balance');
        unchecked {
            _shares[account] = accountShare - shareAmount;
        }
        _totalSupply -= tokenAmount;
        _totalShares -= shareAmount;

        emit Redeemed(account, tokenAmount, shareAmount);
        emit Transfer(account, address(0), tokenAmount);

        _afterTokenTransfer(account, address(0), tokenAmount);
    }

    function _authorizeUpgrade(address) internal override onlyManager {}
}
