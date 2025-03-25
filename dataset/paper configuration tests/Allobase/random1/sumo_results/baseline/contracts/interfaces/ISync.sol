// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.8.3;

/// @title The interface for the Sync
interface ISync {
    /**
     * @dev Returns the symbol of the sync
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the current manager
     */
    function manager() external view returns (address);

    /**
     * @dev initialize the contract
     */
    function initialize(string memory _symbol, address _factory) external;

    /**
     * @dev Returns true if the pair exists.
     * @param pair The defi pair address
     */
    function contains(address pair) external view returns (bool);

    /**
     * @dev Returns the defi pair address for a given index
     * @param index The index of the pair array
     * @return pair the defi pair (eg. unswap V2 pair)
     */
    function allDefiPairs(uint256 index) external view returns (address pair);

    /**
     * @dev Returns the allDefiPairs count
     * @return The count of the allDefiPairs
     */
    function getDefiPairsLength() external view returns (uint256);

    /**
     * @notice Inserts defi pair(eg. uniswap V2 pair) address into sync contract
     * @dev Must be called by the current manager
     * @param pair The defi pair(eg. uniswap V2 pair)
     */
    function setDefiPair(address pair) external;

    /**
     * @notice Deletes defi pair(eg. uniswap V2 pair) address from sync contract
     * @dev Must be called by the current manager
     * @param pair The defi pair(eg. uniswap V2 pair)
     */
    function delDefiPair(address pair) external;

    /**
     * @notice force reserves to match balances
     * @dev eg. call uniswapV2 sync()
     */
    function sync() external;
}
