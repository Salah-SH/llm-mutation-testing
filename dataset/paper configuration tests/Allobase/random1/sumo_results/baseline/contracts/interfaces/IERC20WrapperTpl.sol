// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.8.3;

import '@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-IERC20PermitUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol';

import './IERC20Wrap.sol';
import './IERC20Freeze.sol';
import './IPause.sol';

interface IERC20WrapperTpl is IERC20MetadataUpgradeable, IERC20PermitUpgradeable, IERC20Wrap, IERC20Freeze, IPause {
    /**
     * @notice Initialize the contract.
     * @param name_ The name of the token
     * @param symbol_ The symbol of the token
     * @param manager_ The address of manager
     * @param underlying_ The address of underlying erc20 token
     */
    function initialize(
        string memory name_,
        string memory symbol_,
        address manager_,
        address underlying_
    ) external;

    /**
     * @notice Exchanges underlying erc20 token to wrapped erc20 token with approvals to be made via signatures
     * @param underlyingAmount The amount of underlying erc20 token to wrap.
     * @param deadline The expiration of signature, a timestamp in the future.
     * @param v The signature fields
     * @param r The signature fields
     * @param s The signature fields
     * @return wrapperAmount The amount of wrapped erc20 token user receives after wrap.
     */
    function wrapWithPermit(
        uint256 underlyingAmount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (uint256 wrapperAmount);

    /**
     * @notice Mint `amount` tokens to the `to`.
     * @param to The address to mint to
     * @param amount The amount of token to mint
     */
    function mintTo(address to, uint256 amount) external;

    /**
     * @notice Burn `amount` tokens from `account`.
     * @param from The address to burn from
     * @param amount The amount of token to burn
     */
    function burnFrom(address from, uint256 amount) external;
}
