// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.8.3;

import '../Factory.sol';

contract FactoryV2 is Factory {
    function name() public pure returns (string memory) {
        return 'factory v2';
    }
}
