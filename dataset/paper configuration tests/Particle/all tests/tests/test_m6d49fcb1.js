const { expect } = require("chai");

describe("Test ERC20ExtPermit", function () {
  it("Test permit with expired deadline should revert", async function () {
    const [owner, spender] = await ethers.getSigners();

    const permitSig = async (token, owner, value, deadline, spenderAddr) => {
      const name = await token.name();
      const structHash = ethers.utils.solidityKeccak256(
        ["bytes32", "address", "address", "uint256", "uint256", "uint256"],
        [
          ethers.utils.keccak256(
            ["bytes32", "address", "address", "uint256", "uint256", "uint256"],
            [
              ethers.utils.keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"),
              owner.address,
              spenderAddr,
              value,
              await token.nonces(owner.address),
              deadline,
            ]
          ),
          ethers.constants.HashZero, // EIP-712 DOMAIN_SEPARATOR unused
          ethers.constants.HashZero // EIP-712 DOMAIN_SEPARATOR unused
        ]
      );

      const hash = await token.hashTypedDataV4(structHash);

      const signature = await owner._signMessage(hash);
      const { v, r, s } = ethers.utils.splitSignature(signature);

      return { v, r, s };
    };

    it("should revert if deadline is expired", async function() {
      const decimal = await ft.decimals();
      const value = ethers.BigNumber.from(100).mul(ethers.BigNumber.from(10).pow(decimal));
      const deadline = ethers.BigNumber.from(Math.floor(Date.now() / 1000) - 1); // Set deadline to be past timestamp

      let sig = await permitSig(ft.connect(owner), owner, value, deadline, spender.address);
      
      await expect(ft.permit(owner.address, spender.address, value, deadline, sig.v, sig.r, sig.s)).to.be.revertedWith("ERC20: Permit expired");
    });
  });
});