// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.8.3;

interface IERC20Freeze {
    /**
     * @dev Freezes an address balance from being transferred.
     * @param addr The new address to freeze.
     */
    function freeze(address addr) external;

    /**
     * @dev Unfreezes an address balance allowing transfer.
     * @param addr The new address to unfreeze.
     */
    function unfreeze(address addr) external;

    /**
     * @dev Wipes the balance of a frozen address to address `to`
     * @param addr The new frozen address to wipe.
     * @param addr The address to receive wipe balance.
     */
    function wipeFrozenAddress(address addr, address to) external;

    /**
     * @dev Gets whether the address is currently frozen.
     * @param addr The address to check if frozen.
     * @return A bool representing whether the given address is frozen.
     */
    function isFrozen(address addr) external view returns (bool);
}
