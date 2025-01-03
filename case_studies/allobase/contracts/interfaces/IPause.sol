// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.8.3;

interface IPause {
    /**
     * @dev Triggers stopped state.
     */
    function pause() external;

    /**
     * @dev Returns to normal state.
     */
    function unpause() external;
}
