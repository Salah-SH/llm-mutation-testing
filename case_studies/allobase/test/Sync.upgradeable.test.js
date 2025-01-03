const { ethers, upgrades } = require('hardhat');
const { expect } = require("chai");
var sync, tpl, factory;

describe.only('Sync  upgradeable test', function () {
    it('Deploy Sync V1', async function () {
        [owner] = await ethers.getSigners();
        tpl = await ethers.getContractFactory('SyncTpl');
        sync = await upgrades.deployProxy(
            tpl,
            ["AUAL", owner.address],
            { initializer: 'initialize', kind: 'uups' }
        );
        await sync.deployed();
        console.log("deployed to:", sync.address);
    });

    it('Deploy Sync V2', async function () {
        tpl = await ethers.getContractFactory('SyncTplV2');
        sync = await upgrades.upgradeProxy(sync.address, tpl);
        await sync.deployed();
        console.log("deployed to:", sync.address);
    });
});