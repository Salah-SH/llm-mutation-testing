const { ethers, upgrades } = require("hardhat");

async function main() {
    let tpl;
    tpl = await ethers.getContractFactory('ERC20Tpl');
    erc20Tpl = await tpl.deploy();
    console.log("erc20Tpl deployed to:", erc20Tpl.address);

    tpl = await ethers.getContractFactory('ERC20WrapperTpl');
    erc20WrapperTpl = await tpl.deploy();
    console.log("erc20WrapperTpl deployed to:", erc20WrapperTpl.address);

    tpl = await ethers.getContractFactory('ERC721Tpl');
    erc721Tpl = await tpl.deploy();
    console.log("erc721Tpl deployed to:", erc721Tpl.address);

    tpl = await ethers.getContractFactory('SyncTpl');
    syncTpl = await tpl.deploy();
    console.log("syncTpl deployed to:", syncTpl.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });