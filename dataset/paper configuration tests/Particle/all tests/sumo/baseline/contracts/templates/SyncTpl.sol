// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.8.3;

import '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '../libraries/EnumerableSet.sol';
import '../interfaces/ISync.sol';
import '../interfaces/IFactory.sol';
import '../interfaces/IUniswapV2Sync.sol';

/// @title The implement for the Sync
contract SyncTpl is ISync, Initializable, UUPSUpgradeable, ReentrancyGuardUpgradeable {
    using EnumerableSet for EnumerableSet.AddressSet;

    /**
     * @dev See {ISync-symbol}.
     */
    string public override symbol;

    /**
     * @dev See {ISync-manager}.
     */
    address public override manager;

    EnumerableSet.AddressSet internal addressSet;

    /**
     * @notice Emitted when pair is set
     * @param addr The new defi pair
     */
    event PairSet(address addr);

    /**
     * @notice Emitted when pair is deleted
     * @param addr The deleted defi pair
     */
    event PairDel(address addr);

    /**
     * @notice Emitted when pair is synced
     * @param addr The synced defi pair
     */
    event PairSynced(address indexed addr);

    modifier onlyManager() {
        require(msg.sender == manager, 'onlyManager');
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    /**
     * @dev See {ISync-initialize}.
     */
    function initialize(string memory _symbol, address _manager) public override initializer {
        require(bytes(_symbol).length > 0, 'empty symbol');
        require(_manager != address(0), 'zero address');
        symbol = _symbol;
        manager = _manager;
    }

    /**
     * @dev See {ISync-contains}.
     */
    function contains(address pair) external view override returns (bool) {
        return addressSet.contains(pair);
    }

    /**
     * @dev See {ISync-allDefiPairs}.
     */
    function allDefiPairs(uint256 index) external view override returns (address) {
        return addressSet.at(index);
    }

    /**
     * @dev See {ISync-getDefiPairsLength}.
     */
    function getDefiPairsLength() external view override returns (uint256) {
        return addressSet.length();
    }

    /**
     * @dev See {ISync-setDefiPair}.
     */
    function setDefiPair(address pair) external override onlyManager {
        require(pair != address(0), 'zero address');
        if (EnumerableSet.add(addressSet, pair)) {
            emit PairSet(pair);
        } else {
            revert('failed to set defi pair');
        }
    }

    /**
     * @dev See {ISync-delDefiPair}.
     */
    function delDefiPair(address pair) external override onlyManager {
        if (addressSet.remove(pair)) {
            emit PairDel(pair);
        } else {
            revert('failed to delete defi pair');
        }
    }

    /**
     * @dev See {ISync-sync}.
     */
    function sync() external override nonReentrant {
        address pair;
        uint256 len = addressSet.length();
        if (len == 1) {
            pair = addressSet.at(0);
            IUniswapV2Sync(pair).sync();
            emit PairSynced(pair);
        } else if (len > 1) {
            for (uint256 i = 0; i < len; ) {
                pair = addressSet.at(i);
                IUniswapV2Sync(pair).sync();
                emit PairSynced(pair);

                unchecked {
                    i++;
                }
            }
        }
    }

    function _authorizeUpgrade(address) internal override onlyManager {}

    function implementation() public view returns (address) {
        return _getImplementation();
    }
}
