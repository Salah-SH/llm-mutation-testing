// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.8.3;

import '../contracts/Factory.sol';
import '../contracts/templates/ERC20Tpl.sol';
import '../contracts/templates/ERC20WrapperTpl.sol';
import '../contracts/templates/ERC721Tpl.sol';
import '../contracts/templates/SyncTpl.sol';
import '../contracts/templates/ERC1967Proxy.sol';
import '../contracts/mocks/ERC20TplWithBurn.sol';

import '../contracts/interfaces/IFactory.sol';

contract Alice {
    constructor() {}

    function approvalErc20(
        address erc20,
        address spender,
        uint256 amount
    ) public {
        (bool t, ) = erc20.call(abi.encodeWithSignature('approve(address,uint256)', spender, amount));
        require(t);
    }

    function incrAllowanceErc20(
        address erc20,
        address spender,
        uint256 amount
    ) public {
        (bool t, ) = erc20.call(abi.encodeWithSignature('increaseAllowance(address,uint256)', spender, amount));
        require(t);
    }

    function decrAllowanceErc20(
        address erc20,
        address spender,
        uint256 amount
    ) public {
        (bool t, ) = erc20.call(abi.encodeWithSignature('decreaseAllowance(address,uint256)', spender, amount));
        require(t);
    }
}

contract TplERC20EchidnaTest {
    IFactory.triple t;
    uint256 internal _initErc20Spply;
    uint256 internal _initErc20WrapperSpply;

    Alice internal alice;

    struct SnapShot {
        uint256 total;
        uint256 from;
        uint256 to;
    }

    constructor() payable {
        address f = address(new ERC1967Proxy(address(0x40), new bytes(0)));
        IFactory(f).initialize(address(0x41), address(0x42), address(0x43), address(0x44), address(this));
        (t, , ) = IFactory(f).createTriple('PD ALLO', 'PDAL', 'OZ');

        alice = new Alice();

        alice.approvalErc20(t.ERC20, address(this), type(uint256).max);
        alice.approvalErc20(t.ERC20Wrapper, address(this), type(uint256).max);

        _initErc20Spply = type(uint64).max;
        _initErc20WrapperSpply = type(uint32).max;

        IERC20Tpl(t.ERC20).issue(address(alice), type(uint32).max);
        IERC20Tpl(t.ERC20).issue(address(this), _initErc20Spply - type(uint32).max);
        IERC20Tpl(t.ERC20).wrap(type(uint32).max);
        IERC20WrapperTpl(t.ERC20Wrapper).transfer(address(alice), type(uint16).max);
    }

    function fuzzIssue(uint256 amount) public {
        IERC20Tpl erc20 = IERC20Tpl(t.ERC20);
        uint256 supply = erc20.totalSupply();
        address sender = msg.sender;
        uint256 balanceBefore = erc20.balanceOf(sender);

        erc20.issue(sender, amount);
        _initErc20Spply += amount;
        assert(erc20.totalSupply() == supply + amount && erc20.totalSupply() == _initErc20Spply);
        assert(balanceBefore + amount >= erc20.balanceOf(sender));
        uint256 diff = balanceBefore + amount - erc20.balanceOf(sender);
        assert(diff <= 1);
    }

    function fuzzBurn(uint256 amount) public {
        ERC20TplWithBurn erc20 = ERC20TplWithBurn(t.ERC20);
        uint256 supply = erc20.totalSupply();
        address burner = address(this);
        uint256 balanceBefore = erc20.balanceOf(burner);

        amount = balanceBefore == 0 ? 0 : 1 + (amount % balanceBefore);

        erc20.burn(amount);

        _initErc20Spply -= amount;
        assert(erc20.totalSupply() == supply - amount && erc20.totalSupply() == _initErc20Spply);
        assert(erc20.balanceOf(burner) >= balanceBefore - amount);
        uint256 diff = erc20.balanceOf(burner) - (balanceBefore - amount);
        assert(diff <= 1);
    }

    function fuzzChargeFeeRebase(uint256 rebaseFeeRate) public {
        IERC20Tpl erc20 = IERC20Tpl(t.ERC20);
        uint256 supply = erc20.totalSupply();
        uint256 shares = erc20.totalShares();

        uint256 sharesUser = erc20.sharesOf(msg.sender);
        uint256 feeShares = (shares * rebaseFeeRate) / 10**12;
        erc20.chargeFeeRebase(rebaseFeeRate, msg.sender);

        assert(erc20.totalSupply() == supply && supply == _initErc20Spply);
        assert(erc20.totalShares() == shares + feeShares);
        assert(erc20.sharesOf(msg.sender) == sharesUser + feeShares);
    }

    function fuzzApproval(uint256 amount) public {
        _fuzzApproval(t.ERC20, amount);
        _fuzzApproval(t.ERC20Wrapper, amount);
    }

    function fuzzIncrAllowance(uint256 amount) public {
        _fuzzIncrAllowance(t.ERC20, amount);
        _fuzzIncrAllowance(t.ERC20Wrapper, amount);
    }

    function fuzzDecrAllowance(uint256 amount) public {
        _fuzzDecrAllowance(t.ERC20, amount);
        _fuzzDecrAllowance(t.ERC20Wrapper, amount);
    }

    function fuzzTransferFrom(address to, uint256 amount) public {
        // transfer from alice
        _fuzzTransfer(
            abi.encodeWithSignature('transferFrom(address,address,uint256)', address(alice), to, amount),
            address(alice),
            to,
            false,
            amount
        );
        IERC20Upgradeable erc20 = IERC20Upgradeable(t.ERC20);
        assert(erc20.allowance(address(alice), address(this)) == type(uint256).max);

        // transfer from this
        erc20.approve(address(this), amount + 1);
        _fuzzTransfer(
            abi.encodeWithSignature('transferFrom(address,address,uint256)', address(this), to, amount),
            address(this),
            to,
            false,
            amount
        );
        assert(erc20.allowance(address(this), address(this)) == 1);
    }

    function fuzzTransfer(uint256 amount) public {
        _fuzzTransfer(
            abi.encodeWithSignature('transfer(address,uint256)', msg.sender, amount),
            address(this),
            msg.sender,
            false,
            amount
        );
    }

    function fuzzTransferShareFrom(address to, uint256 shares) public {
        // transfer from alice
        _fuzzTransfer(
            abi.encodeWithSignature('transferShareFrom(address,address,uint256)', address(alice), to, shares),
            address(alice),
            to,
            true,
            shares
        );

        IERC20Tpl erc20 = IERC20Tpl(t.ERC20);
        uint256 amount = erc20.getTokenByShares(shares);

        // transfer from this
        erc20.approve(address(this), amount + 1);
        _fuzzTransfer(
            abi.encodeWithSignature('transferShareFrom(address,address,uint256)', address(this), to, shares),
            address(this),
            to,
            true,
            shares
        );
        assert(erc20.allowance(address(this), address(this)) == 1);
    }

    function fuzzTransferShare(uint256 shares) public {
        _fuzzTransfer(
            abi.encodeWithSignature('transferShare(address,uint256)', msg.sender, shares),
            address(this),
            msg.sender,
            true,
            shares
        );
    }

    function fuzzTransferFromWrapper(address to, uint256 amount) public {
        // transfer from alice
        _fuzzTransferWrapper(
            abi.encodeWithSignature('transferFrom(address,address,uint256)', address(alice), to, amount),
            address(alice),
            to,
            amount
        );

        IERC20Upgradeable erc20 = IERC20Upgradeable(t.ERC20Wrapper);
        assert(erc20.allowance(address(alice), address(this)) == type(uint256).max);

        // transfer from this
        erc20.approve(address(this), amount + 1);
        _fuzzTransferWrapper(
            abi.encodeWithSignature('transferFrom(address,address,uint256)', address(this), to, amount),
            address(this),
            to,
            amount
        );
        assert(erc20.allowance(address(this), address(this)) == 1);
    }

    function fuzzTransferWrapper(uint256 amount) public {
        _fuzzTransferWrapper(
            abi.encodeWithSignature('transfer(address,uint256)', msg.sender, amount),
            address(this),
            msg.sender,
            amount
        );
    }

    function fuzzFreeze(address acount) public {
        IERC20Freeze(t.ERC20).freeze(acount);
        assert(IERC20Freeze(t.ERC20).isFrozen(acount) == true);

        IERC20Freeze(t.ERC20).unfreeze(acount);
        assert(IERC20Freeze(t.ERC20).isFrozen(acount) == false);

        IERC20Freeze(t.ERC20Wrapper).freeze(acount);
        assert(IERC20Freeze(t.ERC20Wrapper).isFrozen(acount) == true);

        IERC20Freeze(t.ERC20Wrapper).unfreeze(acount);
        assert(IERC20Freeze(t.ERC20Wrapper).isFrozen(acount) == false);
    }

    function fuzzWrap(uint256 amount) public {
        _fuzzWrap(t.ERC20, amount);
    }

    function fuzzWrapWrapper(uint256 amount) public {
        IERC20Upgradeable(t.ERC20).approve(t.ERC20Wrapper, amount);
        _fuzzWrap(t.ERC20Wrapper, amount);
    }

    function fuzzUnwrap(uint256 wrapperAmount) public {
        _fuzzUnwrap(t.ERC20, wrapperAmount);
    }

    function fuzzUnwrapWrapper(uint256 wrapperAmount) public {
        _fuzzUnwrap(t.ERC20Wrapper, wrapperAmount);
    }

    function fuzzWipeFrozenAddress(address from, address to) public {
        IERC20Tpl erc20 = IERC20Tpl(t.ERC20);

        uint256 totalSupply = erc20.totalSupply();
        uint256 totalShares = erc20.totalShares();

        uint256 sharesFrom = erc20.sharesOf(from);
        uint256 sharesTo = erc20.sharesOf(to);

        erc20.freeze(from);
        erc20.wipeFrozenAddress(from, to);
        erc20.unfreeze(from);

        if (from != to) {
            assert(erc20.sharesOf(to) == sharesTo + sharesFrom);
            assert(erc20.sharesOf(from) == 0);
        } else {
            assert(erc20.sharesOf(from) == sharesFrom);
        }

        assert(totalSupply == erc20.totalSupply());
        assert(totalShares == erc20.totalShares());
    }

    function fuzzWipeFrozenAddressWrapper(address from, address to) public {
        IERC20WrapperTpl erc20 = IERC20WrapperTpl(t.ERC20Wrapper);

        uint256 totalSupply = erc20.totalSupply();

        uint256 balanceFrom = erc20.balanceOf(from);
        uint256 balanceTo = erc20.balanceOf(to);

        erc20.freeze(from);
        erc20.wipeFrozenAddress(from, to);
        erc20.unfreeze(from);

        if (from != to) {
            assert(erc20.balanceOf(to) == balanceTo + balanceFrom);
            assert(erc20.balanceOf(from) == 0);
        } else {
            assert(erc20.balanceOf(from) == balanceFrom);
        }

        assert(totalSupply == erc20.totalSupply());
    }

    function _fuzzApproval(address token, uint256 amount) internal {
        IERC20Upgradeable erc20 = IERC20Upgradeable(token);
        uint256 approvalBefore = erc20.allowance(address(this), msg.sender);
        erc20.approve(msg.sender, amount);
        uint256 approvalAfter = erc20.allowance(address(this), msg.sender);
        assert(approvalAfter == amount);

        approvalBefore = erc20.allowance(address(alice), msg.sender);
        alice.approvalErc20(token, msg.sender, amount);
        approvalAfter = erc20.allowance(address(alice), msg.sender);
        assert(approvalAfter == amount);
    }

    function _fuzzIncrAllowance(address token, uint256 amount) internal {
        IERC20Upgradeable erc20 = IERC20Upgradeable(token);
        uint256 approvalBefore = erc20.allowance(address(this), msg.sender);
        (bool succ, ) = token.call(abi.encodeWithSignature('increaseAllowance(address,uint256)', msg.sender, amount));
        require(succ);
        uint256 approvalAfter = erc20.allowance(address(this), msg.sender);
        assert(approvalAfter == approvalBefore + amount);

        approvalBefore = erc20.allowance(address(alice), msg.sender);
        alice.incrAllowanceErc20(token, msg.sender, amount);
        approvalAfter = erc20.allowance(address(alice), msg.sender);
        assert(approvalAfter == approvalBefore + amount);
    }

    function _fuzzDecrAllowance(address token, uint256 amount) internal {
        IERC20Upgradeable erc20 = IERC20Upgradeable(token);
        uint256 approvalBefore = erc20.allowance(address(this), msg.sender);
        (bool succ, ) = token.call(abi.encodeWithSignature('decreaseAllowance(address,uint256)', msg.sender, amount));
        require(succ);

        uint256 approvalAfter = erc20.allowance(address(this), msg.sender);
        assert(approvalAfter == approvalBefore - amount);

        approvalBefore = erc20.allowance(address(alice), msg.sender);
        alice.decrAllowanceErc20(token, msg.sender, amount);
        approvalAfter = erc20.allowance(address(alice), msg.sender);
        assert(approvalAfter == approvalBefore - amount);
    }

    function _fuzzTransfer(
        bytes memory abiEncodeParam,
        address from,
        address to,
        bool isShare,
        uint256 amount
    ) internal {
        IERC20Tpl erc20 = IERC20Tpl(t.ERC20);

        SnapShot memory balanceBefore = SnapShot(erc20.totalSupply(), erc20.balanceOf(from), erc20.balanceOf(to));
        SnapShot memory shareBefore = SnapShot(erc20.totalShares(), erc20.sharesOf(from), erc20.sharesOf(to));

        uint256 shareAmount;
        uint256 tokenAmount;

        if (isShare) {
            shareAmount = amount;
            tokenAmount = erc20.getTokenByShares(shareAmount);
        } else {
            tokenAmount = amount;
            shareAmount = erc20.getSharesByToken(tokenAmount);
        }

        (bool isSucc, ) = t.ERC20.call(abiEncodeParam);
        require(isSucc);

        SnapShot memory balanceAfter = SnapShot(erc20.totalSupply(), erc20.balanceOf(from), erc20.balanceOf(to));
        SnapShot memory shareAfter = SnapShot(erc20.totalShares(), erc20.sharesOf(from), erc20.sharesOf(to));

        assert(balanceAfter.total == balanceBefore.total && balanceAfter.total == _initErc20Spply);
        assert(shareAfter.total == shareBefore.total);

        if (from == to || (isShare && shareAmount == 0) || (!isShare && tokenAmount == 0)) {
            assert(balanceBefore.from == balanceAfter.from && balanceBefore.to == balanceAfter.to);
            assert(shareBefore.from == shareAfter.from && shareAfter.to == shareBefore.to);
        } else {
            if (isShare) {
                assert(
                    balanceBefore.from - balanceAfter.from >= tokenAmount &&
                        balanceBefore.from - balanceAfter.from <= tokenAmount + 1
                );
                assert(
                    balanceAfter.to - balanceBefore.to >= tokenAmount &&
                        balanceAfter.to - balanceBefore.to <= tokenAmount + 1
                );
            } else {
                assert(
                    balanceBefore.from - balanceAfter.from >= tokenAmount - 1 &&
                        balanceBefore.from - balanceAfter.from <= tokenAmount
                );
                assert(
                    balanceAfter.to - balanceBefore.to >= tokenAmount - 1 &&
                        balanceAfter.to - balanceBefore.to <= tokenAmount
                );
            }

            assert(shareAfter.from == shareBefore.from - shareAmount);
            assert(shareAfter.to == shareBefore.to + shareAmount);
        }
    }

    function _fuzzTransferWrapper(
        bytes memory abiEncodeParam,
        address from,
        address to,
        uint256 amount
    ) internal {
        IERC20WrapperTpl erc20 = IERC20WrapperTpl(t.ERC20Wrapper);

        SnapShot memory balanceBefore = SnapShot(erc20.totalSupply(), erc20.balanceOf(from), erc20.balanceOf(to));

        (bool isSucc, ) = t.ERC20Wrapper.call(abiEncodeParam);
        require(isSucc);

        SnapShot memory balanceAfter = SnapShot(erc20.totalSupply(), erc20.balanceOf(from), erc20.balanceOf(to));

        assert(balanceAfter.total == balanceBefore.total && balanceAfter.total == _initErc20WrapperSpply);

        if (from == to) {
            assert(balanceBefore.from == balanceAfter.from && balanceAfter.to == balanceBefore.to);
        } else {
            assert(balanceBefore.from - balanceAfter.from == amount && balanceAfter.to - balanceBefore.to == amount);
        }
    }

    function _fuzzWrap(address token, uint256 amount) internal {
        IERC20Tpl erc20 = IERC20Tpl(t.ERC20);
        IERC20WrapperTpl erc20Wrapper = IERC20WrapperTpl(t.ERC20Wrapper);

        uint256 totalSupply = erc20.totalSupply();
        uint256 totalShares = erc20.totalShares();

        uint256 totalSupplyW = erc20Wrapper.totalSupply();

        uint256 blanceBefore = erc20.balanceOf(address(this));
        uint256 blanceWBefore = erc20Wrapper.balanceOf(address(this));
        uint256 shares = erc20.sharesOf(address(this));
        uint256 sharesW = erc20.sharesOf(t.ERC20Wrapper);
        (uint256 wrapperAmount, uint256 underlyingShares) = erc20.getWrapperByUnderlying(amount);

        IERC20Wrap(token).wrap(amount);
        uint256 blanceDiff = blanceBefore - erc20.balanceOf(address(this));
        assert(blanceDiff >= amount - 1 && blanceDiff <= amount);

        assert(erc20Wrapper.balanceOf(address(this)) == blanceWBefore + wrapperAmount);
        assert(erc20.sharesOf(address(this)) == shares - underlyingShares);
        assert(erc20.sharesOf(t.ERC20Wrapper) == sharesW + underlyingShares);

        _initErc20WrapperSpply += wrapperAmount;

        assert(totalSupply == erc20.totalSupply() && totalSupply == _initErc20Spply);
        assert(totalShares == erc20.totalShares());
        assert(
            totalSupplyW + wrapperAmount == _initErc20WrapperSpply &&
                _initErc20WrapperSpply == erc20Wrapper.totalSupply()
        );
    }

    function _fuzzUnwrap(address token, uint256 wrapperAmount) internal {
        IERC20Tpl erc20 = IERC20Tpl(t.ERC20);
        IERC20WrapperTpl erc20Wrapper = IERC20WrapperTpl(t.ERC20Wrapper);

        uint256 totalSupply = erc20.totalSupply();
        uint256 totalShares = erc20.totalShares();

        uint256 totalSupplyW = erc20Wrapper.totalSupply();

        uint256 blanceBefore = erc20.balanceOf(address(this));
        uint256 blanceWBefore = erc20Wrapper.balanceOf(address(this));
        uint256 shares = erc20.sharesOf(address(this));
        uint256 sharesW = erc20.sharesOf(t.ERC20Wrapper);
        (uint256 underlyingAmount, uint256 underlyingShares) = erc20.getUnderlyingByWrapper(wrapperAmount);

        IERC20Wrap(token).unwrap(wrapperAmount);

        _initErc20WrapperSpply -= wrapperAmount;

        uint256 blanceDiff = erc20.balanceOf(address(this)) - blanceBefore;
        assert(blanceDiff >= underlyingAmount && blanceDiff <= underlyingAmount + 1);
        assert(erc20Wrapper.balanceOf(address(this)) == blanceWBefore - wrapperAmount);
        assert(erc20.sharesOf(address(this)) == shares + underlyingShares);
        assert(erc20.sharesOf(t.ERC20Wrapper) == sharesW - underlyingShares);

        assert(totalSupply == erc20.totalSupply() && totalSupply == _initErc20Spply);
        assert(totalShares == erc20.totalShares());
        assert(
            totalSupplyW - wrapperAmount == _initErc20WrapperSpply &&
                _initErc20WrapperSpply == erc20Wrapper.totalSupply()
        );
    }
}
