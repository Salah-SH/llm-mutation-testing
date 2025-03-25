// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.8.3;

contract UniswapV2PairMock {
    // force reserves to match balances
    uint256 public reserve0;
    uint256 public reserve1;

    function sync() external {
        reserve0 = 1;
        reserve1 = 2;
    }
}
