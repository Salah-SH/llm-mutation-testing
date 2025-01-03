const { ethers, upgrades } = require('hardhat');
var nft, tpl;

describe.only('ERC721 upgradeable test', function () {
    it('Deploy ERC721 V1', async function () {
        [owner] = await ethers.getSigners();
        tpl = await ethers.getContractFactory('ERC721Tpl');
        nft = await upgrades.deployProxy(
            tpl,
            ["AU ALLO NFT", "AUALNFT", owner.address, owner.address, owner.address],
            { initializer: 'initialize', kind: 'uups' }
        );
        await nft.deployed();
        console.log("deployed to:", nft.address);
    });

    it('Deploy ERC721 V2', async function () {
        tpl = await ethers.getContractFactory('ERC721TplV2');
        nft = await upgrades.upgradeProxy(nft.address, tpl);
        await nft.deployed();
        console.log("deployed to:", nft.address);
    });
});