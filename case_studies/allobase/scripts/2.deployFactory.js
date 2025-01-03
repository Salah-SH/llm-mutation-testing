const { ethers, upgrades } = require("hardhat");

async function main() {
    // [owner] = await ethers.getSigners();
    // const f = await ethers.getContractFactory('Factory');
    // factory = await upgrades.deployProxy(
    //     f,
    //     [owner.address, owner.address, owner.address, owner.address, owner.address],
    //     { initializer: 'initialize', kind: 'uups' }
    // );
    // await factory.deployed();

    const Factory = await ethers.getContractFactory("Factory");
    const factoryImplV1 = await Factory.deploy();
    await factoryImplV1.deployed();

    const data = [];
    const FacotryProxy = await ethers.getContractFactory("ERC1967Proxy");
    const factory = await FacotryProxy.deploy(factoryImplV1.address, data);
    await factory.deployed();
    
    console.log("Factory deployed to:", factory.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });