// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.8.3;

import '@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol';

/**
 * @dev Immutable state of manager used by ERC20, ERC721 tokens
 */
abstract contract ManagerImmutableState is ContextUpgradeable {
    address public manager;

    function __ManagerImmutableState_init(address manager_) internal onlyInitializing {
        __ManagerImmutableState_init_unchained(manager_);
    }

    function __ManagerImmutableState_init_unchained(address manager_) internal onlyInitializing {
        manager = manager_;
    }

    modifier onlyManager() {
        require(_msgSender() == manager, 'Not manager');
        _;
    }
}
