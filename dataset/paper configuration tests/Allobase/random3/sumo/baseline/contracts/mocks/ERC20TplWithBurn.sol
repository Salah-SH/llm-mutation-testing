// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.8.3;

import '../templates/ERC20Tpl.sol';

contract ERC20TplWithBurn is ERC20Tpl {
    function burn(uint256 amount) external onlyManager {
        _burn(_msgSender(), amount);
    }
}
