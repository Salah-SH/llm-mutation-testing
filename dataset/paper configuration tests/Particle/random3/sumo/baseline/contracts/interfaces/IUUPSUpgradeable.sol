// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.8.3;

/// @title The interface for the UUPSUpgradeable
interface IUUPSUpgradeable {
    /**
     * @dev Upgrade the implementation of the proxy to `newImplementation`.
     * @param newImplementation The new implementation
     */
    function upgradeTo(address newImplementation) external;

    function implementation() external view returns (address);
}
