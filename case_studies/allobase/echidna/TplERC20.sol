// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.8.3;

import '../contracts/templates/ERC20Tpl.sol';
import '../contracts/Factory.sol';
import '../contracts/Factory.sol';
import '../contracts/templates/ERC20WrapperTpl.sol';
import '../contracts/templates/ERC721Tpl.sol';
import '../contracts/templates/SyncTpl.sol';
import '../contracts/templates/ERC1967Proxy.sol';

contract TplERC20 is ERC20Tpl {
    address internal owner;
    address internal user;
    address internal attacker;

    address internal f;
    address internal erc721;
    address internal erc20Wrapper;

    uint256 internal initialTotalSupply;
    uint256 internal initialTotalShares;
    uint256 internal initialBalance_owner;
    uint256 internal initialBalance_user;
    uint256 internal initialBalance_attacker;

    uint256 initialAllowance_user_attacker;
    uint256 initialAllowance_attacker_user;
    uint256 initialAllowance_attacker_attacker;

    constructor() payable {
        owner = address(0x30000);
        user = address(0x10000);
        attacker = address(0x20000);

        f = address(new ERC1967Proxy(address(0x41), new bytes(0)));
        erc721 = address(new ERC1967Proxy(address(0x42), new bytes(0)));
        erc20Wrapper = address(new ERC1967Proxy(address(0x43), new bytes(0)));

        Factory(f).initialize(erc721, address(this), erc20Wrapper, address(0x40000), msg.sender);
        initialize('PD ALLO', 'PDAL', f, erc721, erc20Wrapper);

        uint256 supplyMax = type(uint128).max / shareBase();

        initialBalance_user = supplyMax / 2;
        initialBalance_attacker = supplyMax / 2;
        initialTotalSupply = initialBalance_user + initialBalance_attacker;

        _mint(user, initialBalance_user);
        _mint(attacker, initialBalance_attacker);

        initialTotalShares = totalShares();
    }

    function pause() external virtual override {}

    function issue(address to, uint256 amount) external virtual override {}

    function unpause() external virtual override {}

    function freeze(address addr) external virtual override {}

    function echidna_zero_always_empty() public view returns (bool) {
        return this.balanceOf(address(0x0)) == 0;
    }

    function echidna_approve_overwrites() public returns (bool) {
        bool approve_return;
        approve_return = approve(user, 10);
        require(approve_return);
        approve_return = approve(user, 20);
        require(approve_return);
        return this.allowance(msg.sender, user) == 20;
    }

    function echidna_balance_less_than_totalSupply() public view returns (bool) {
        return this.balanceOf(owner) + this.balanceOf(user) + this.balanceOf(attacker) <= totalSupply();
    }

    function echidna_share_less_than_totalShares() public view returns (bool) {
        return this.sharesOf(owner) + this.sharesOf(user) + this.sharesOf(attacker) <= totalShares();
    }

    function echidna_totalSupply_consistency() public view returns (bool) {
        return initialTotalSupply == totalSupply();
    }

    function echidna_totalShare_consistency() public view returns (bool) {
        return initialTotalShares <= totalShares();
    }

    function echidna_revert_transfer_to_zero() public returns (bool) {
        if (this.balanceOf(msg.sender) == 0) revert();
        return transfer(address(0x0), this.balanceOf(msg.sender));
    }

    function echidna_revert_transferFrom_to_zero() public returns (bool) {
        uint256 balance = this.balanceOf(msg.sender);
        bool approve_return = approve(msg.sender, balance);
        require(approve_return);
        return transferFrom(msg.sender, address(0x0), this.balanceOf(msg.sender));
    }

    function echidna_self_transferFrom() public returns (bool) {
        uint256 balance = this.balanceOf(msg.sender);
        bool approve_return = approve(msg.sender, balance);
        transferFrom(msg.sender, msg.sender, balance);
        return (this.balanceOf(msg.sender) == balance) && approve_return;
    }

    function echidna_self_transferFrom_to_other() public returns (bool) {
        uint256 balance = this.balanceOf(msg.sender);
        bool approve_return = approve(msg.sender, balance);
        bool transfer_return = transferFrom(msg.sender, owner, balance);
        return (this.balanceOf(msg.sender) == 0) && approve_return && transfer_return;
    }

    function echidna_self_transfer() public returns (bool) {
        uint256 balance = this.balanceOf(msg.sender);
        bool transfer_return = transfer(msg.sender, balance);
        return (this.balanceOf(msg.sender) == balance) && transfer_return;
    }

    function echidna_transfer_to_other() public returns (bool) {
        uint256 bSender = this.balanceOf(msg.sender);
        if (bSender < 1) {
            return true;
        }
        address receiver = user;
        if (receiver == msg.sender) {
            receiver = owner;
        }

        uint256 shares = getSharesByToken(1);
        if (shares < 1) {
            return false;
        }

        uint256 sSender = this.sharesOf(msg.sender);
        uint256 bReceiver = this.balanceOf(receiver);
        uint256 sReceiver = this.sharesOf(receiver);
        transfer(receiver, 1);
        return
            (sSender - this.sharesOf(msg.sender) == shares) &&
            (this.sharesOf(receiver) - sReceiver == shares) &&
            (bSender - this.balanceOf(msg.sender) <= 1) &&
            (this.balanceOf(receiver) - bReceiver <= 1);
    }
}
