// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.8.3;

import '../templates/SyncTpl.sol';

contract SyncTplV2 is SyncTpl {
    function name() public view returns (string memory) {
        return string(abi.encodePacked(symbol, 'v2'));
    }
}
