const { ethers, upgrades } = require('hardhat');

const deployTokens = async function (name, symbol, underlyingUnit) {
    let Creator;
    let sender;
    Creator = await ethers.getContractFactory("ERC721Tpl");
    const erc721Impl = await Creator.deploy();
   
    Creator = await ethers.getContractFactory("ERC20Tpl");
    const erc20Impl = await Creator.deploy();

    Creator = await ethers.getContractFactory("ERC20WrapperTpl");
    const erc20WrapperImpl = await Creator.deploy();

    Creator = await ethers.getContractFactory("SyncTpl");
    const syncImpl = await Creator.deploy();

    [sender] = await ethers.getSigners();
    
    const Factory = await ethers.getContractFactory("Factory");
    const factoryImplV1 =  await Factory.deploy();

    const FacotryProxy = await ethers.getContractFactory("ERC1967Proxy");
    let factory = await FacotryProxy.deploy(factoryImplV1.address, '0x');
    factory = await Factory.attach(factory.address);

    const Manager = await ethers.getContractFactory("Manager");
    const managerImplV1 = await Manager.deploy();

    const ManagerProxy = await ethers.getContractFactory("ERC1967Proxy");
    let manager = await ManagerProxy.deploy(managerImplV1.address, '0x');
    manager = await Manager.attach(manager.address);

    await factory.initialize(erc721Impl.address, erc20Impl.address, erc20WrapperImpl.address, syncImpl.address, sender.address);
    await manager.initialize(sender.address, sender.address, sender.address, sender.address, sender.address, sender.address, sender.address, sender.address, factory.address);
   
    await factory.createTriple(name, symbol, underlyingUnit);
    const triple = await factory.getTriple(symbol);
    
    // erc721
    const ERC721Token = await ethers.getContractFactory("ERC721Tpl");
    const nft = await ERC721Token.attach(triple.ERC721);
    // console.log(nft.address);
    // erc20
    const ERC20Token = await ethers.getContractFactory("ERC20Tpl");
    const ft = await ERC20Token.attach(triple.ERC20);

    // erc20 wrapper
    const ERC20WrapperToken = await ethers.getContractFactory("ERC20WrapperTpl");
    const wft = await ERC20WrapperToken.attach(triple.ERC20Wrapper);
   
    //  // set manager address to factory
    //  await factory.setManager(manager.address);

    return {factory, manager, nft, ft, wft};
};

const deployFactory = async function () {
    const Factory = await ethers.getContractFactory("Factory");
    const factoryImplV1 = await Factory.deploy();
    await factoryImplV1.deployed();

    [owner] = await ethers.getSigners();
    const ABI = ["function initialize(address, address, address, address, address)"];
    const abi = new ethers.utils.Interface(ABI);
    const data = abi.encodeFunctionData(
        "initialize",
        [owner.address, owner.address, owner.address, owner.address, owner.address]
    )
    const FacotryProxy = await ethers.getContractFactory("ERC1967Proxy");
    const factoryProxy = await FacotryProxy.deploy(factoryImplV1.address, data);
    await factoryProxy.deployed();

    const factory = await Factory.attach(factoryProxy.address);

    return factory
}

module.exports = { deployTokens, deployFactory };
