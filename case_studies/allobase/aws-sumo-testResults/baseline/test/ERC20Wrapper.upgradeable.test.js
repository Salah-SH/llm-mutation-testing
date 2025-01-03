const { ethers, upgrades } = require('hardhat');
var wft, tpl;

describe.only('ERC20Wrapper upgradeable test', function () {
    it('Deploy ERC20Wrapper V1', async function () {
        [owner] = await ethers.getSigners();
        tpl = await ethers.getContractFactory('ERC20WrapperTpl');
        wft = await upgrades.deployProxy(
            tpl,
            ["AU ALLO Wrapper", "wAUAL", owner.address, owner.address],
            { initializer: 'initialize', kind: 'uups' }
        );
        await wft.deployed();
        console.log("deployed to:", wft.address);
    });

    it('Deploy ERC20Wrapper V2', async function () {
        tpl = await ethers.getContractFactory('ERC20WrapperTplV2');
        wft = await upgrades.upgradeProxy(wft.address, tpl);
        await wft.deployed();
        console.log("deployed to:", wft.address);
    });
});