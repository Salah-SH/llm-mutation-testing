// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.8.3;

import '../templates/ERC721Tpl.sol';

contract ERC721TplV2 is ERC721Tpl {
    function name() public view virtual override returns (string memory) {
        return string(abi.encodePacked(super.name(), 'v2'));
    }
}
