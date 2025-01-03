// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.8.3;

import '../contracts/Manager.sol';
import '../contracts/Factory.sol';
import '../contracts/templates/ERC20Tpl.sol';
import '../contracts/templates/ERC20WrapperTpl.sol';
import '../contracts/templates/ERC721Tpl.sol';
import '../contracts/templates/SyncTpl.sol';
import '../contracts/templates/ERC1967Proxy.sol';
import '../contracts/interfaces/IFactory.sol';
import '../contracts/interfaces/IManager.sol';

contract ManagerEchidnaTest {
    address internal issueFeeRecipient;
    address internal redeemFeeRecipient;
    address internal managementFeeRecipient;

    uint256 issueFeeRate;

    IManager internal manager;

    IFactory.triple t;

    constructor() payable {
        issueFeeRecipient = address(0x40000);
        redeemFeeRecipient = address(0x50000);
        managementFeeRecipient = address(0x60000);

        issueFeeRate = 1000;

        address f = address(new ERC1967Proxy(address(0x40), new bytes(0)));
        address m = address(new ERC1967Proxy(address(0x45), new bytes(0)));
        manager = IManager(m);

        IFactory(f).initialize(
            address(0x41),
            address(0x42),
            address(0x43),
            address(0x44),
            m
        );

        manager.initialize(
            issueFeeRecipient,
            redeemFeeRecipient,
            managementFeeRecipient,
            address(this),
            address(this),
            address(this),
            address(this),
            address(this),
            f
        );
        (t, ) = manager.createTriple('PD ALLO', 'PDAL', 'OZ');
        // manager.setRebaseFeeRateTo(ERC20Tpl(t.ERC20).symbol(), 100);

        for (uint i = 0; i < 100; i++) {
            string[] memory tokenURIs = new string[](1);
            uint256[] memory erc20Amounts = new uint256[](1);
            erc20Amounts[0] = 10**18;
            manager.issueTo(ERC20Tpl(t.ERC20).symbol(), address(this), issueFeeRate, tokenURIs, erc20Amounts);
        }
    }

    function fuzzSetRebaseFeeRateTo(uint256 feeRate) public {
        manager.setRebaseFeeRateTo(ERC20Tpl(t.ERC20).symbol(), feeRate);
        assert(manager.rebaseFeeRates(ERC20Tpl(t.ERC20).symbol()) <= manager.feeBase());
    }

    function fuzzIssueTo(uint256[] calldata erc20Amounts) public {
        address toAddr = msg.sender;
        uint256 erc721TotalSupplyBefore = IERC721Tpl(t.ERC721).totalSupply();
        uint256 erc721BalanceBefore = IERC721Tpl(t.ERC721).balanceOf(t.ERC20);
        uint256 erc20TotalSupplyBefore = IERC20Tpl(t.ERC20).totalSupply();
        uint256 erc20BalanceBefore = IERC20Tpl(t.ERC20).balanceOf(toAddr);
        uint256 issueFeeRecipientErc20BalanceBefore = IERC20Tpl(t.ERC20).balanceOf(issueFeeRecipient);

        uint256 totalAmount;
        for (uint256 i = 0; i < erc20Amounts.length; i++) {
            totalAmount += erc20Amounts[i];
        }
        uint256 issueFee = totalAmount * issueFeeRate / manager.feeBase();
        manager.issueTo(ERC20Tpl(t.ERC20).symbol(), toAddr, issueFeeRate, new string[](erc20Amounts.length), erc20Amounts);

        assert(IERC721Tpl(t.ERC721).totalSupply() == erc721TotalSupplyBefore + erc20Amounts.length);
        assert(IERC721Tpl(t.ERC721).balanceOf(t.ERC20) == erc721BalanceBefore + erc20Amounts.length);
        assert(IERC20Tpl(t.ERC20).totalSupply() == erc20TotalSupplyBefore + totalAmount);
        assert(erc20BalanceBefore + totalAmount - issueFee - IERC20Tpl(t.ERC20).balanceOf(toAddr) <= 1);
        assert(issueFeeRecipientErc20BalanceBefore + issueFee - IERC20Tpl(t.ERC20).balanceOf(issueFeeRecipient) <= 1);
    }

    function fuzzRebaseTo() public {
        uint256 erc721TotalSupplyBefore = IERC721Tpl(t.ERC721).totalSupply();
        uint256 erc721BalanceBefore = IERC721Tpl(t.ERC721).balanceOf(t.ERC20);
        uint256 erc20TotalSupplyBefore = IERC20Tpl(t.ERC20).totalSupply();
        uint256 erc20TotalShareBefore = IERC20Tpl(t.ERC20).totalShares();
        uint256 managementFeeRecipientErc20ShareBefore = IERC20Tpl(t.ERC20).sharesOf(managementFeeRecipient);

        uint256 issueShare = erc20TotalShareBefore * manager.rebaseFeeRates(ERC20Tpl(t.ERC20).symbol()) / manager.feeBase();
        manager.rebaseTo(ERC20Tpl(t.ERC20).symbol());

        assert(IERC721Tpl(t.ERC721).totalSupply() == erc721TotalSupplyBefore);
        assert(IERC721Tpl(t.ERC721).balanceOf(t.ERC20) == erc721BalanceBefore);
        assert(IERC20Tpl(t.ERC20).totalSupply() == erc20TotalSupplyBefore);
        assert(IERC20Tpl(t.ERC20).totalShares() == erc20TotalShareBefore + issueShare);
        assert(managementFeeRecipientErc20ShareBefore + issueShare == IERC20Tpl(t.ERC20).sharesOf(managementFeeRecipient));
    }
}