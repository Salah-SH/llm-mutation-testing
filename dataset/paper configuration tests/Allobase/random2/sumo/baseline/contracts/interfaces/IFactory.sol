// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.8.3;

/// @title The interface for the Factory
interface IFactory {
    struct triple {
        address ERC721;
        address ERC20;
        address ERC20Wrapper;
    }

    /**
     * @notice Returns the current manager of the factory
     * @dev Can not be changed any more
     */
    function manager() external view returns (address);

    /**
     * @notice Returns the current ERC721 implementation of the factory
     * @dev Can be changed by the current manager via setERC721Impl
     */
    function ERC721Impl() external view returns (address);

    /**
     * @notice Returns the current ERC20 implementation of the factory
     * @dev Can be changed by the current manager via setERC20Impl
     */
    function ERC20Impl() external view returns (address);

    /**
     * @notice Returns the current ERC20 wrapper implementation of the factory
     * @dev Can be changed by the current manager via setERC20WrapperImpl
     */
    function ERC20WrapperImpl() external view returns (address);

    /**
     * @notice Returns the current sync implementation of the factory
     * @dev Can be changed by the current manager via setSyncImpl
     */
    function syncImpl() external view returns (address);

    /**
     * @dev initialize the contract
     * @param _ERC721Impl The ERC721 implementation of the factory
     * @param _ERC20Impl The ERC20 implementation of the factory
     * @param _ERC20WrapperImpl The ERC20 wrapper implementation of the factory
     * @param _syncImpl The sync implementation of the factory
     * @param _manager The manager of the factory
     */
    function initialize(
        address _ERC721Impl,
        address _ERC20Impl,
        address _ERC20WrapperImpl,
        address _syncImpl,
        address _manager
    ) external;

    /**
     * @notice Updates the ERC721 implementation of the factory
     * @dev Must be called by the current manager
     * @param newImpl The new ERC721 implementation of the factory
     */
    function setERC721Impl(address newImpl) external;

    /**
     * @notice Updates the ERC20 implementation of the factory
     * @dev Must be called by the current manager
     * @param newImpl The new ERC20 implementation of the factory
     */
    function setERC20Impl(address newImpl) external;

    /**
     * @notice Updates the ERC20 wrapper implementation of the factory
     * @dev Must be called by the current manager
     * @param newImpl The new ERC20 wrapper implementation of the factory
     */
    function setERC20WrapperImpl(address newImpl) external;

    /**
     * @notice Updates the sync implementation of the factory
     * @dev Must be called by the current manager
     * @param newImpl The new sync implementation of the factory
     */
    function setSyncImpl(address newImpl) external;

    /**
     * @dev Returns the ERC721/ERC20/ERC20Wrapper proxy addresses for a given symbol, or addresses 0/0/0 if it does not exist
     * @param symbol The symbol of the ERC20 token
     * @return ERC721 The proxy address of the ERC721 token contract
     * @return ERC20 The proxy address of the ERC20 token contract
     * @return ERC20Wrapper The proxy address of the ERC20 wrapper token contract
     */
    function getTriple(string calldata symbol)
        external
        view
        returns (
            address ERC721,
            address ERC20,
            address ERC20Wrapper
        );

    /**
     * @dev Returns the ERC721/ERC20/ERC20Wrapper proxy addresses for a given index
     * @param index The index of the triple array
     * @return ERC721 The proxy address of the ERC721 token contract
     * @return ERC20 The proxy address of the ERC20 token contract
     * @return ERC20Wrapper The proxy address of the ERC20 wrapper token contract
     */
    function allTriples(uint256 index)
        external
        view
        returns (
            address ERC721,
            address ERC20,
            address ERC20Wrapper
        );

    /**
     * @dev Returns the allTriples count
     * @return The count of the allTriples
     */
    function getTriplesLength() external view returns (uint256);

    /**
     * @dev Returns the sync proxy address for a given symbol, or address 0 if it does not exist
     * @return The proxy address of the sync contract
     */
    function getSync(string calldata symbol) external view returns (address);

    /**
     * @notice Create a new triple
     * @dev Must be called by the current manager
     * @param name The ERC20 token name
     * @param symbol The ERC20 token symbol
     * @param underlyingUnit The unit of underlying amount, eg `kg`, `oz`
     * @return t The triple of erc721/erc20/erc20Wrapper proxy addresses
     * @return triplesLength The count of the allTriples
     * @return s The proxy address of the Sync contract
     */
    function createTriple(
        string calldata name,
        string calldata symbol,
        string calldata underlyingUnit
    )
        external
        returns (
            triple memory t,
            uint256 triplesLength,
            address s
        );
}
