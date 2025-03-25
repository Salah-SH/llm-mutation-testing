// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.8.3;

abstract contract Freezable {
    mapping(address => bool) internal _frozen;

    event Frozen(address indexed addr);
    event Unfrozen(address indexed addr);
    event FrozenAddressWiped(address indexed from, address indexed to, uint256 amount);

    /**
     * @dev Freezes an address balance from being transferred.
     * @param addr The new address to freeze.
     */
    function _freeze(address addr) internal virtual {
        require(!_frozen[addr], 'Address already frozen');
        _frozen[addr] = true;
        emit Frozen(addr);
    }

    /**
     * @dev Unfreezes an address balance allowing transfer.
     * @param addr The new address to unfreeze.
     */
    function _unfreeze(address addr) internal virtual {
        require(_frozen[addr], 'Address already unfrozen');
        _frozen[addr] = false;
        emit Unfrozen(addr);
    }

    /**
     * @dev Gets whether the address is currently frozen.
     * @param addr The address to check if frozen.
     * @return A bool representing whether the given address is frozen.
     */
    function _isFrozen(address addr) internal view returns (bool) {
        return _frozen[addr];
    }

    function _requireNotFrozen(address from, address to) internal view {
        require(!_frozen[from] && !_frozen[to], 'Address frozen');
    }
}
