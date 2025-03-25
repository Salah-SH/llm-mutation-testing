// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.8.3;

import '../templates/ERC20WrapperTpl.sol';

contract ERC20WrapperTplV2 is ERC20WrapperTpl {
    function name() public view virtual override returns (string memory) {
        return string(abi.encodePacked(super.name(), 'v2'));
    }
}
