const { ethers, upgrades } = require('hardhat');
var tpl, factory;

describe.only('Factory upgradeable test', function () {
    it('Deploy Factory V1', async function () {
        [owner] = await ethers.getSigners();
        tpl = await ethers.getContractFactory('Factory');
        factory = await upgrades.deployProxy(
            tpl,
            [owner.address, owner.address, owner.address, owner.address, owner.address],
            { initializer: 'initialize', kind: 'uups' }
        );
        await factory.deployed();
        console.log("deployed to:", factory.address);
    });

    it('Deploy Factory V2', async function () {
        tpl = await ethers.getContractFactory('FactoryV2');
        factory = await upgrades.upgradeProxy(factory.address, tpl);
        await factory.deployed();
        console.log("deployed to:", factory.address);
    });
});