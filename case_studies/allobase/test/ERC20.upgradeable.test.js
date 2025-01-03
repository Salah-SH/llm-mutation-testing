const { ethers, upgrades } = require('hardhat');
var ft, tpl;

describe.only('ERC20 upgradeable test', function () {
    it('Deploy ERC20 V1', async function () {
        [owner] = await ethers.getSigners();
        tpl = await ethers.getContractFactory('ERC20Tpl');
        ft = await upgrades.deployProxy(
            tpl,
            ["AU ALLO", "AUAL", owner.address, owner.address, owner.address],
            { initializer: 'initialize', kind: 'uups' }
        );
        await ft.deployed();
        console.log("deployed to:", ft.address);
    });

    it('Deploy ERC20 V2', async function () {
        tpl = await ethers.getContractFactory('ERC20TplV2');
        ft = await upgrades.upgradeProxy(ft.address, tpl);
        await ft.deployed();
        console.log("deployed to:", ft.address);
    });
});