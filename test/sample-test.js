const { expect, assert } = require("chai");

describe("SavingsPool", function () {
  let instance;

  beforeEach(async () => {
    const SavingsPool = await ethers.getContractFactory("SavingsPool");
    instance = await SavingsPool.deploy("0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9");
    await instance.deployed();
    await instance.createMembership();
  });

  it("Allows user to create a membership", async () => {
    const membership = await instance.checkMembership();

    expect(membership).to.be.true;
    expect(await instance.memberCount()).to.equal(1);
  });

  xit("Allows member to deposit to savings", async () => {

  });

  xit("Allows member to withdraw from savings", async () => {

  });

  xit("Allows member to delete their membership", async () => {

  });

  it("Returns the balance amount of the member's savings account", async () => {
    // const SavingsPool = await ethers.getContractFactory("SavingsPool");
    // const savings = await SavingsPool.deploy();
    // await savings.deployed();

    expect(await instance.getSavingsBalance()).to.equal("0");

    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
