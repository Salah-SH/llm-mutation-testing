const { ethers, upgrades } = require('hardhat');
var tpl, manager;

describe.only('Manager upgradeable test', function () {
    it('Deploy Manager V1', async function () {
        [owner] = await ethers.getSigners();
        tpl = await ethers.getContractFactory('Manager');
        manager = await upgrades.deployProxy(
            tpl,
            [owner.address, owner.address, owner.address, owner.address, owner.address, owner.address, owner.address, owner.address, owner.address],
            { initializer: 'initialize', kind: 'uups' }
        );
        await manager.deployed();
        console.log("deployed to:", manager.address);
    });

    it('Deploy Manager V2', async function () {
        tpl = await ethers.getContractFactory('ManagerV2');
        manager = await upgrades.upgradeProxy(manager.address, tpl);
        await manager.deployed();
        console.log("deployed to:", manager.address);
    });
});