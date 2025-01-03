const { expect } = require("chai");
// const { loadFixture } = require("ethereum-waffle");
const {waffle} = require("hardhat");
const { deployTokens } = require('./helper.js');
const {loadFixture} = waffle;

describe.only("Test ERC20 Wrapper", function () {
  async function deployTokensAndMint() {
    [managerEoaMock, addr2, addr3] = await ethers.getSigners();

    const {factory, manager, nft, ft, wft} = await deployTokens('AU ALLO', 'AUAL', 'OZ');

    await nft.connect(managerEoaMock).issue(ft.address, [
      ethers.BigNumber.from("1000000000000000000"),
      ethers.BigNumber.from("2000000000000000000")
    ], ['', '']);
    await ft.connect(managerEoaMock).issue(addr2.address, '3000000000000000000');

    await ft.getWrapperByUnderlying(ethers.BigNumber.from("3000000000000000000"))
    await ft.connect(addr2).wrap(ethers.BigNumber.from("3000000000000000000"));

    return {factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3};
  }

  it("Metadata", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 } = await loadFixture(deployTokensAndMint);
    expect(await wft.name()).to.equal("AU ALLO Wrapper");
    expect(await wft.symbol()).to.equal("wAUAL");
    expect(await ft.decimals()).to.equal(18);
  });

  it("Balance", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 } = await loadFixture(deployTokensAndMint);
    const shareBase = await ft.shareBase();
    expect(await wft.balanceOf(addr2.address)).to.equal(ethers.BigNumber.from("3000000000000000000"));
    expect(await wft.totalSupply()).to.equal(ethers.BigNumber.from("3000000000000000000"));
    expect(await ft.sharesOf(wft.address)).to.equal(ethers.BigNumber.from("3000000000000000000").mul(shareBase));
  });

  it("Wrap", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 } = await loadFixture(deployTokensAndMint);
    let wrapper = await wft.getWrapperByUnderlying(ethers.BigNumber.from("1000000000000000000"))
    let underlying = await wft.getUnderlyingByWrapper(wrapper[0])
    expect(underlying[1]).to.equal(wrapper[1]);

    await wft.connect(addr2).unwrap(ethers.BigNumber.from("1000000000000000000"));

    const shareBase = await ft.shareBase();
    expect(await wft.balanceOf(addr2.address)).to.equal(ethers.BigNumber.from("2000000000000000000"));
    expect(await wft.totalSupply()).to.equal(ethers.BigNumber.from("2000000000000000000"));
    expect(await ft.balanceOf(addr2.address)).to.equal(underlying[0]);
    expect(await ft.sharesOf(wft.address)).to.equal(ethers.BigNumber.from("2000000000000000000").mul(shareBase));

    await ft.connect(addr2).unwrap(ethers.BigNumber.from("1000000000000000000"));
    expect(await wft.balanceOf(addr2.address)).to.equal(ethers.BigNumber.from("1000000000000000000"));
    expect(await wft.totalSupply()).to.equal(ethers.BigNumber.from("1000000000000000000"));
    expect(await ft.balanceOf(addr2.address)).to.equal(underlying[0].mul(2));
    expect(await ft.sharesOf(wft.address)).to.equal(ethers.BigNumber.from("1000000000000000000").mul(shareBase));

    await expect(wft.connect(addr2).wrap(ethers.BigNumber.from("1000000000000000000"))).to.be.revertedWith("ERC20: insufficient allowance");
    await ft.connect(addr2).approve(wft.address, ethers.BigNumber.from("1000000000000000000"));
    await wft.connect(addr2).wrap(ethers.BigNumber.from("1000000000000000000"));

    expect(await wft.balanceOf(addr2.address)).to.equal(ethers.BigNumber.from("2000000000000000000"));
    expect(await wft.totalSupply()).to.equal(ethers.BigNumber.from("2000000000000000000"));
    expect(await ft.balanceOf(addr2.address)).to.equal(ethers.BigNumber.from("1000000000000000000"));
    expect(await ft.sharesOf(wft.address)).to.equal(ethers.BigNumber.from("2000000000000000000").mul(shareBase));

    const deadline = ethers.BigNumber.from(1956528000);  // 2032-01-01
    let permitValue = ethers.BigNumber.from("1000000000000000000");
    const sig = await permitSig(ft.connect(addr2), addr2, permitValue, deadline, wft.address);
    await wft.connect(addr2).wrapWithPermit(permitValue, deadline, sig.v, sig.r, sig.s);
    expect(await wft.balanceOf(addr2.address)).to.equal(ethers.BigNumber.from("3000000000000000000"));
  });

  it("Transfer", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 } = await loadFixture(deployTokensAndMint);

    await wft.connect(addr2).transfer(addr3.address, ethers.BigNumber.from("1000000000000000000"));
    expect(await wft.balanceOf(addr2.address)).to.equal(ethers.BigNumber.from("2000000000000000000"));
    expect(await wft.balanceOf(addr3.address)).to.equal(ethers.BigNumber.from("1000000000000000000"));

    await wft.connect(addr2).transfer(addr3.address, ethers.BigNumber.from("1000000000000000000"));
    expect(await wft.balanceOf(addr2.address)).to.equal(ethers.BigNumber.from("1000000000000000000"));
    expect(await wft.balanceOf(addr3.address)).to.equal(ethers.BigNumber.from("2000000000000000000"));

    await wft.connect(addr2).approve(managerEoaMock.address, ethers.BigNumber.from("200000000000000000"));

    expect(await wft.allowance(addr2.address, managerEoaMock.address)).to.equal(ethers.BigNumber.from("200000000000000000"));
    await expect(wft.connect(managerEoaMock).transferFrom(addr2.address, addr3.address, ethers.BigNumber.from("300000000000000000"))).to.be.revertedWith("ERC20: insufficient allowance");
    await wft.connect(addr2).increaseAllowance(managerEoaMock.address, ethers.BigNumber.from("600000000000000000"));
    expect(await wft.allowance(addr2.address, managerEoaMock.address)).to.equal(ethers.BigNumber.from("800000000000000000"));

    await wft.connect(managerEoaMock).transferFrom(addr2.address, addr3.address, ethers.BigNumber.from("300000000000000000"));
    expect(await wft.balanceOf(addr2.address)).to.equal(ethers.BigNumber.from("700000000000000000"));
    expect(await wft.balanceOf(addr3.address)).to.equal(ethers.BigNumber.from("2300000000000000000"));
    expect(await wft.allowance(addr2.address, managerEoaMock.address)).to.equal(ethers.BigNumber.from("500000000000000000"));

    await wft.connect(addr2).decreaseAllowance(managerEoaMock.address, ethers.BigNumber.from("200000000000000000"));
    expect(await wft.allowance(addr2.address, managerEoaMock.address)).to.equal(ethers.BigNumber.from("300000000000000000"));
    await expect(wft.connect(managerEoaMock).transferFrom(addr2.address, addr3.address, ethers.BigNumber.from("500000000000000000"))).to.be.revertedWith("ERC20: insufficient allowance");
    
    await wft.connect(managerEoaMock).transferFrom(addr2.address, addr3.address, ethers.BigNumber.from("200000000000000000"));
    expect(await wft.balanceOf(addr2.address)).to.equal(ethers.BigNumber.from("500000000000000000"));
    expect(await wft.balanceOf(addr3.address)).to.equal(ethers.BigNumber.from("2500000000000000000"));
    expect(await wft.allowance(addr2.address, managerEoaMock.address)).to.equal(ethers.BigNumber.from("100000000000000000"));
  });

  it("Pause", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 } = await loadFixture(deployTokensAndMint);
    await expect(ft.connect(addr2).pause()).to.be.revertedWith("Not manager");

    await wft.connect(managerEoaMock).pause();
    expect(await wft.paused()).to.equal(true);
    await expect(wft.connect(managerEoaMock).pause()).to.be.revertedWith("Pausable: paused");

    await expect(wft.connect(addr2).transfer(addr3.address, ethers.BigNumber.from("1"))).to.be.revertedWith("ERC20: transfer while paused");

    await expect(wft.connect(addr2).unpause()).to.be.revertedWith("Not manager");

    await wft.connect(managerEoaMock).unpause();
    expect(await wft.paused()).to.equal(false);
    await expect(wft.connect(managerEoaMock).unpause()).to.be.revertedWith("Pausable: not paused");

    await wft.connect(addr2).transfer(addr3.address, ethers.BigNumber.from("1"));
  });

  it("Freeze", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 } = await loadFixture(deployTokensAndMint);
    expect(await wft.isFrozen(addr2.address)).to.equal(false);

    await expect(wft.connect(managerEoaMock).wipeFrozenAddress(addr2.address, addr3.address)).to.be.revertedWith("Wipe not frozen");

    await expect(wft.connect(addr3).freeze(addr2.address)).to.be.revertedWith("Not manager");

    await wft.connect(managerEoaMock).freeze(addr2.address);

    await expect(wft.connect(addr2).transfer(addr3.address, ethers.BigNumber.from("1000000000000000000"))).to.be.revertedWith("Address frozen");

    await wft.connect(managerEoaMock).unfreeze(addr2.address);

    await wft.connect(addr2).transfer(addr3.address, ethers.BigNumber.from("1000000000000000000"));

    await wft.connect(managerEoaMock).freeze(addr2.address);
    await wft.connect(managerEoaMock).wipeFrozenAddress(addr2.address, manager.address);
    expect(await wft.balanceOf(manager.address)).to.equal(ethers.BigNumber.from("2000000000000000000"));
  });

  async function permitSig(T20, owner, value, deadline, spenderAddr) {
    const nonce = ethers.BigNumber.from(await T20.nonces(owner.address));

    const domain = {
      name: await T20.name(),
      version: '1',
      chainId: await T20.signer.getChainId(),
      verifyingContract: T20.address
    };

    const types = {
      Permit: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' }
      ]
    };

    const message = {
      owner: await owner.getAddress(),
      spender: spenderAddr,
      value: value,
      nonce: nonce,
      deadline: deadline
    };

    const signature = await T20.signer._signTypedData(domain, types, message);
    const sig = ethers.utils.splitSignature(signature);
    return sig;
  }

  it("Erc20 permit", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2 : owner, addr3 : spender } = await loadFixture(deployTokensAndMint);

    const decimal = await wft.decimals();
    const value = ethers.BigNumber.from(100).mul(ethers.BigNumber.from(10).pow(decimal));

    const deadlinePassed = ethers.BigNumber.from(1640995200);  // 2022-01-01
    const sigPassed = await permitSig(wft.connect(owner), owner, value, deadlinePassed, spender.address);
    await expect(wft.permit(owner.address, spender.address, value, deadlinePassed, sigPassed.v, sigPassed.r, sigPassed.s)).to.be.revertedWith("ERC20: Permit expired");

    const deadline = ethers.BigNumber.from(1956528000);  // 2032-01-01
    const sig = await permitSig(wft.connect(owner), owner, value, deadline, spender.address);
    await wft.connect(owner).permit(owner.address, spender.address, value, deadline, sig.v, sig.r, sig.s);
    expect(await wft.allowance(owner.address, spender.address)).to.equal(value);

  })

  it("Upgrade", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 } = await loadFixture(deployTokensAndMint);
    let oldImpl = await wft.connect(managerEoaMock).implementation();
    let ERC20WrapperToken = await ethers.getContractFactory("ERC20WrapperTpl");
    let erc20WrapperOldImpl = await ERC20WrapperToken.attach(oldImpl);
    await expect(erc20WrapperOldImpl.initialize('a', 'b', factory.address, ft.address)).to.be.revertedWith("Initializable: contract is already initialized");
    expect(await erc20WrapperOldImpl.proxiableUUID()).to.equal("0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc");

    let newImpl = await ethers.getContractFactory("ERC20WrapperTplV2");
    erc20WrapperNewImpl = await newImpl.deploy();

    await expect(wft.connect(addr2).upgradeTo(erc20WrapperNewImpl.address)).to.be.revertedWith("Not manager");
    await expect(erc20WrapperOldImpl.connect(managerEoaMock).upgradeTo(erc20WrapperNewImpl.address)).to.be.revertedWith("Function must be called through delegatecall");
    await wft.connect(managerEoaMock).upgradeTo(erc20WrapperNewImpl.address);

    expect(await wft.connect(managerEoaMock).implementation()).to.equal(erc20WrapperNewImpl.address);

    expect(await wft.name()).to.equal("AU ALLO Wrapperv2");

    // stay unchanged after upgrading
    const shareBase = await ft.shareBase();
    expect(await wft.symbol()).to.equal("wAUAL");
    expect(await wft.balanceOf(addr2.address)).to.equal(ethers.BigNumber.from("3000000000000000000"));
    expect(await wft.totalSupply()).to.equal(ethers.BigNumber.from("3000000000000000000"));
    expect(await ft.sharesOf(wft.address)).to.equal(ethers.BigNumber.from("3000000000000000000").mul(shareBase));
  });

});