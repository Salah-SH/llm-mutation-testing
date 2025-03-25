// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.8.3;

import '../Manager.sol';

contract ManagerV2 is Manager {
    function name() public pure returns (string memory) {
        return 'manager v2';
    }
}
