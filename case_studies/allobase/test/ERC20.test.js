const { expect } = require("chai");
// const { loadFixture } = require("ethereum-waffle");
const { waffle } = require("hardhat");
const { deployTokens } = require('./helper.js');
const { loadFixture } = waffle;

describe.only("Test ERC20", function () {
  async function deployTokensAndMint() {
    [managerEoaMock, addr2, addr3] = await ethers.getSigners();

    const {factory, manager, nft, ft, wft} = await deployTokens('AU ALLO', 'AUAL', 'OZ');

    await nft.connect(managerEoaMock).issue(ft.address, [
      ethers.BigNumber.from("1000000000000000000"),
      ethers.BigNumber.from("2000000000000000000")
    ], ['', '']);
    await ft.issue(addr2.address, '3000000000000000000');

    return {factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3};
  }

  it("Metadata", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 } = await loadFixture(deployTokensAndMint);
    expect(await ft.name()).to.equal("AU ALLO");
    expect(await ft.symbol()).to.equal("AUAL");
    expect(await ft.decimals()).to.equal(18);
  });

  it("Balance", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 } = await loadFixture(deployTokensAndMint);
    const shareBase = await ft.shareBase();
    expect(await ft.balanceOf(addr2.address)).to.equal(ethers.BigNumber.from("3000000000000000000"));
    expect(await ft.sharesOf(addr2.address)).to.equal(ethers.BigNumber.from("3000000000000000000").mul(shareBase));
    expect(await ft.totalSupply()).to.equal(ethers.BigNumber.from("3000000000000000000"));
    expect(await ft.totalShares()).to.equal(ethers.BigNumber.from("3000000000000000000").mul(shareBase));
  });

  it("Transfer", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 } = await loadFixture(deployTokensAndMint);

    await ft.connect(addr2).transfer(addr3.address, ethers.BigNumber.from("1000000000000000000"));
    expect(await ft.balanceOf(addr2.address)).to.equal(ethers.BigNumber.from("2000000000000000000"));
    expect(await ft.balanceOf(addr3.address)).to.equal(ethers.BigNumber.from("1000000000000000000"));

    await ft.connect(addr2).transfer(addr3.address, ethers.BigNumber.from("1000000000000000000"));
    expect(await ft.balanceOf(addr2.address)).to.equal(ethers.BigNumber.from("1000000000000000000"));
    expect(await ft.balanceOf(addr3.address)).to.equal(ethers.BigNumber.from("2000000000000000000"));

    await ft.connect(addr2).approve(managerEoaMock.address, ethers.BigNumber.from("200000000000000000"));
    expect(await ft.allowance(addr2.address, managerEoaMock.address)).to.equal(ethers.BigNumber.from("200000000000000000"));
    await expect(ft.connect(managerEoaMock).transferFrom(addr2.address, addr3.address, ethers.BigNumber.from("300000000000000000"))).to.be.revertedWith("ERC20: insufficient allowance");
    await ft.connect(addr2).increaseAllowance(managerEoaMock.address, ethers.BigNumber.from("600000000000000000"));
    expect(await ft.allowance(addr2.address, managerEoaMock.address)).to.equal(ethers.BigNumber.from("800000000000000000"));

    await ft.connect(managerEoaMock).transferFrom(addr2.address, addr3.address, ethers.BigNumber.from("300000000000000000"));
    expect(await ft.balanceOf(addr2.address)).to.equal(ethers.BigNumber.from("700000000000000000"));
    expect(await ft.balanceOf(addr3.address)).to.equal(ethers.BigNumber.from("2300000000000000000"));
    expect(await ft.allowance(addr2.address, managerEoaMock.address)).to.equal(ethers.BigNumber.from("500000000000000000"));

    await ft.connect(addr2).decreaseAllowance(managerEoaMock.address, ethers.BigNumber.from("200000000000000000"));
    expect(await ft.allowance(addr2.address, managerEoaMock.address)).to.equal(ethers.BigNumber.from("300000000000000000"));
    await expect(ft.connect(managerEoaMock).transferFrom(addr2.address, addr3.address, ethers.BigNumber.from("500000000000000000"))).to.be.revertedWith("ERC20: insufficient allowance");
    
    await ft.connect(managerEoaMock).transferFrom(addr2.address, addr3.address, ethers.BigNumber.from("200000000000000000"));
    expect(await ft.balanceOf(addr2.address)).to.equal(ethers.BigNumber.from("500000000000000000"));
    expect(await ft.balanceOf(addr3.address)).to.equal(ethers.BigNumber.from("2500000000000000000"));
    expect(await ft.allowance(addr2.address, managerEoaMock.address)).to.equal(ethers.BigNumber.from("100000000000000000"));

    await ft.connect(addr2).transferShare(addr3.address, ethers.BigNumber.from("3"));
    expect(await ft.sharesOf(addr2.address)).to.equal(ethers.BigNumber.from("49999999999999999999999997"));
    expect(await ft.sharesOf(addr3.address)).to.equal(ethers.BigNumber.from("250000000000000000000000003"));

    let wrapper = await ft.getWrapperByUnderlying(ethers.BigNumber.from("100000000000000000"))
    await ft.connect(managerEoaMock).transferShareFrom(addr2.address, addr3.address, wrapper[1]);
    expect(await ft.sharesOf(addr2.address)).to.equal(ethers.BigNumber.from("39999999999999999999999997"));
    expect(await ft.sharesOf(addr3.address)).to.equal(ethers.BigNumber.from("260000000000000000000000003"));

    expect(await ft.allowance(addr2.address, managerEoaMock.address)).to.equal(ethers.BigNumber.from("0"));
  });

  it("Pause", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 } = await loadFixture(deployTokensAndMint);
    await expect(ft.connect(addr2).pause()).to.be.revertedWith("Not manager");

    await ft.connect(managerEoaMock).pause();
    expect(await ft.paused()).to.equal(true);
    await expect(ft.connect(managerEoaMock).pause()).to.be.revertedWith("Pausable: paused");

    await expect(ft.connect(addr2).transfer(addr3.address, ethers.BigNumber.from("1"))).to.be.revertedWith("ERC20: transfer while paused");

    await expect(ft.connect(addr2).unpause()).to.be.revertedWith("Not manager");

    await ft.connect(managerEoaMock).unpause();
    expect(await ft.paused()).to.equal(false);
    await expect(ft.connect(managerEoaMock).unpause()).to.be.revertedWith("Pausable: not paused");

    await ft.connect(addr2).transfer(addr3.address, ethers.BigNumber.from("1"));
  });

  it("RebaseAndWrap", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 } = await loadFixture(deployTokensAndMint);

    let wrapper = await ft.getWrapperByUnderlying(ethers.BigNumber.from("500000000000000000"))
    let underlying = await ft.getUnderlyingByWrapper(wrapper[0])

    await ft.connect(addr2).wrap(ethers.BigNumber.from("500000000000000000"));

    expect(underlying[1]).to.equal(wrapper[1]);
    expect(await wft.balanceOf(addr2.address)).to.equal(wrapper[0]);
    expect(await wft.totalSupply()).to.equal(wrapper[0]);
    expect(await ft.balanceOf(addr2.address)).to.equal(ethers.BigNumber.from("2500000000000000000"));
    expect(await ft.balanceOf(wft.address)).to.equal(underlying[0]);
    expect(await ft.sharesOf(wft.address)).to.equal(wrapper[1]);
    // expect(await ft.totalShares()).to.equal(ethers.BigNumber.from("300000000000000000000000000"));
    expect(await ft.sharesOf(manager.address)).to.equal(0);

    await ft.connect(addr2).unwrap(ethers.BigNumber.from(wrapper[0]));

    expect(await wft.balanceOf(addr2.address)).to.equal(0);
    expect(await wft.totalSupply()).to.equal(0);
    expect(await ft.balanceOf(addr2.address)).to.equal(ethers.BigNumber.from("3000000000000000000"));
    expect(await ft.sharesOf(wft.address)).to.equal(0);
    expect(await ft.sharesOf(manager.address)).to.equal(0);

    await expect(ft.connect(addr2).chargeFeeRebase(ethers.BigNumber.from('1'), manager.address)).to.be.revertedWith('Not manager');
    await ft.connect(managerEoaMock).chargeFeeRebase(ethers.BigNumber.from("2000"), manager.address);

    expect(await ft.sharesOf(manager.address)).to.equal(ethers.BigNumber.from('600000000000000000'));
    expect(await ft.totalShares()).to.equal(ethers.BigNumber.from('300000000600000000000000000'));
    expect(await ft.balanceOf(manager.address)).to.equal(ethers.BigNumber.from('5999999988'));
    expect(await ft.balanceOf(addr2.address)).to.equal(ethers.BigNumber.from('2999999994000000011'));

    await ft.connect(managerEoaMock).issue(addr3.address, await ft.balanceOf(addr2.address));
    let b2 = await ft.balanceOf(addr2.address);
    let b3 = await ft.balanceOf(addr3.address);
    expect(b2.sub(b3)).to.gte(0);
    expect(b2.sub(b3)).to.lte(1);

    await ft.connect(managerEoaMock).chargeFeeRebase(ethers.BigNumber.from("1000"), manager.address);
    let b1 = await ft.balanceOf(manager.address);
    b2 = await ft.balanceOf(addr2.address);
    b3 = await ft.balanceOf(addr3.address);
    expect(await ft.totalSupply()).to.gt(b1.add(b2).add(b3));

    wrapper = await ft.getWrapperByUnderlying(ethers.BigNumber.from("500000000000000000"))
    underlying = await ft.getUnderlyingByWrapper(wrapper[0])
    expect(underlying[1]).to.equal(wrapper[1]);
    
    await ft.connect(addr2).wrap(ethers.BigNumber.from("500000000000000000"));
    await ft.connect(addr3).wrap(ethers.BigNumber.from("500000000000000000"));
    expect(await wft.balanceOf(addr2.address)).to.equal(wrapper[0]);
    expect(await wft.balanceOf(addr3.address)).to.equal(wrapper[0]);
    expect(await wft.totalSupply()).to.equal(wrapper[0].mul(2));
    expect(await ft.sharesOf(wft.address)).to.equal(wrapper[1].mul(2));

    await ft.connect(addr2).unwrap(wrapper[0]);

    expect(await wft.balanceOf(addr2.address)).to.equal(0);
    expect(await wft.totalSupply()).to.equal(wrapper[0]);
    expect(await ft.sharesOf(wft.address)).to.equal(wrapper[1]);
  });

  it("Issue", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 } = await loadFixture(deployTokensAndMint);
    await ft.connect(managerEoaMock).chargeFeeRebase(ethers.BigNumber.from('2000'), managerEoaMock.address);
    await expect(ft.connect(addr2).issue(addr3.address, ethers.BigNumber.from('1'))).to.be.revertedWith('Not manager');
    await ft.connect(managerEoaMock).issue(addr3.address, await ft.balanceOf(addr2.address));
    let t = await ft.totalSupply();
    let b1 = await ft.balanceOf(managerEoaMock.address);
    let b2 = await ft.balanceOf(addr2.address);
    let b3 = await ft.balanceOf(addr3.address);
    expect(t.sub(b1.add(b2).add(b3))).to.gte(0);
    expect(t.sub(b1.add(b2).add(b3))).to.lte(2);
    expect(b2.sub(b3)).to.gte(0);
    expect(b2.sub(b3)).to.lte(1);
  });

  it("Redeem", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 } = await loadFixture(deployTokensAndMint);

    await expect(ft.connect(addr2).redeem(ethers.BigNumber.from("3000000000000000000"), [
      ethers.BigNumber.from("1"),
      ethers.BigNumber.from("2")
    ])).to.be.revertedWith("Not manager");

    await ft.connect(addr2).transfer(managerEoaMock.address, ethers.BigNumber.from("1000000000000000000"));

    await expect(ft.connect(managerEoaMock).redeem(ethers.BigNumber.from("3000000000000000000"), [
      ethers.BigNumber.from("1")
    ])).to.be.revertedWith("Redeem underlyings amount check");
    await expect(ft.connect(managerEoaMock).redeem(ethers.BigNumber.from("3000000000000000000"), [
      ethers.BigNumber.from("6")
    ])).to.be.revertedWith("ERC721: invalid token ID");

    await expect(ft.connect(managerEoaMock).redeem(ethers.BigNumber.from("3000000000000000000"), [
      ethers.BigNumber.from("1"),
      ethers.BigNumber.from("2")
    ])).to.be.revertedWith("ERC20: burn amount exceeds balance");

    await ft.connect(addr2).transfer(managerEoaMock.address, ethers.BigNumber.from("2000000000000000000"));

    await ft.connect(managerEoaMock).redeem(ethers.BigNumber.from("3000000000000000000"), [
      ethers.BigNumber.from("1"),
      ethers.BigNumber.from("2")
    ]);

    expect(await ft.totalSupply()).to.equal(0);
    expect(await ft.totalShares()).to.equal(0);
    expect(await ft.sharesOf(managerEoaMock.address)).to.equal(0);
    expect(await nft.balanceOf(managerEoaMock.address)).to.equal(0);
    expect(await nft.totalSupply()).to.equal(0);
    expect(await nft.balanceOf(ft.address)).to.equal(0);
  });

  it("Freeze", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 } = await loadFixture(deployTokensAndMint);
    expect(await ft.isFrozen(addr2.address)).to.equal(false);

    await expect(ft.connect(managerEoaMock).wipeFrozenAddress(addr2.address, addr3.address)).to.be.revertedWith("Wipe not frozen");

    await expect(ft.connect(addr3).freeze(addr2.address)).to.be.revertedWith("Not manager");

    await ft.connect(managerEoaMock).freeze(addr2.address);

    await expect(ft.connect(addr2).transfer(addr3.address, ethers.BigNumber.from("1000000000000000000"))).to.be.revertedWith("Address frozen");

    await ft.connect(managerEoaMock).unfreeze(addr2.address);
    expect(await ft.isFrozen(addr2.address)).to.equal(false);
    expect(await ft.isFrozen(addr3.address)).to.equal(false);

    await ft.connect(addr2).transfer(addr3.address, ethers.BigNumber.from("1000000000000000000"));

    await ft.connect(managerEoaMock).freeze(addr2.address);
    await ft.connect(managerEoaMock).wipeFrozenAddress(addr2.address, manager.address);
    expect(await ft.balanceOf(manager.address)).to.equal(ethers.BigNumber.from("2000000000000000000"));
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
    const decimal = await ft.decimals();

    let sig, deadline;
    const value = ethers.BigNumber.from(100).mul(ethers.BigNumber.from(10).pow(decimal));

    deadline = ethers.BigNumber.from(1640995200);  // 2022-01-01
    sig = await permitSig(ft.connect(owner), owner, value, deadline, spender.address);
    await expect(ft.permit(owner.address, spender.address, value, deadline, sig.v, sig.r, sig.s)).to.be.revertedWith("ERC20: Permit expired");

    deadline = ethers.BigNumber.from(1956528000);  // 2032-01-01
    sig = await permitSig(ft.connect(owner), owner, value, deadline, spender.address);
    await ft.connect(owner).permit(owner.address, spender.address, value, deadline, sig.v, sig.r, sig.s);
    expect(await ft.allowance(owner.address, spender.address)).to.equal(value);

  })

  it("Upgrade", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 } = await loadFixture(deployTokensAndMint);

    let oldImpl = await ft.connect(managerEoaMock).implementation();
    let ERC20Token = await ethers.getContractFactory("ERC20Tpl");
    let erc20OldImpl = await ERC20Token.attach(oldImpl);
    await expect(erc20OldImpl.initialize('a', 'b', factory.address, nft.address, wft.address)).to.be.revertedWith("Initializable: contract is already initialized");
    expect(await erc20OldImpl.proxiableUUID()).to.equal("0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc");

    let newImpl = await ethers.getContractFactory("ERC20TplV2");
    erc20NewImpl = await newImpl.deploy();

    await expect(ft.connect(addr2).upgradeTo(erc20NewImpl.address)).to.be.revertedWith("Not manager");
    await expect(erc20OldImpl.connect(managerEoaMock).upgradeTo(erc20NewImpl.address)).to.be.revertedWith("Function must be called through delegatecall");
    await ft.connect(managerEoaMock).upgradeTo(erc20NewImpl.address);

    expect(await ft.connect(managerEoaMock).implementation()).to.equal(erc20NewImpl.address);

    expect(await ft.name()).to.equal("AU ALLOv2");

    // stay unchanged after upgrading
    const shareBase = await ft.shareBase();
    expect(await ft.symbol()).to.equal("AUAL");
    expect(await ft.balanceOf(addr2.address)).to.equal(ethers.BigNumber.from("3000000000000000000"));
    expect(await ft.sharesOf(addr2.address)).to.equal(ethers.BigNumber.from("3000000000000000000").mul(shareBase));
    expect(await ft.totalSupply()).to.equal(ethers.BigNumber.from("3000000000000000000"));
    expect(await ft.totalShares()).to.equal(ethers.BigNumber.from("3000000000000000000").mul(shareBase));
  });


});