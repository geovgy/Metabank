const { expect, assert } = require("chai");
require('dotenv').config();

describe("SavingsPool", async () => {
  let instance;
  let deposit;
  let DAI;
  const erc20ABI = process.env.ERC20_ABI;

  before(async () => {
    const SavingsPool = await ethers.getContractFactory("SavingsPool");
    instance = await SavingsPool.deploy("0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9");
    await instance.deployed();

    const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    DAI = new ethers.Contract(daiAddress, erc20ABI);
  });
  
  it("Allows user to create a membership", async () => {
    await instance.createMembership();
    const membership = await instance.checkMembership();

    expect(membership).to.be.true;
    expect(await instance.memberCount()).to.equal(1);
  });

  xit("Swap ETH to DAI with router", async () => {
    const swapTx = await instance.swap({value: ethers.utils.parseEther('1')});
    await swapTx.wait();

    const daiAmount = await instance.daiBalance();
    
    console.log(await ethers.utils.parseUnits(daiAmount));
    expect(await ethers.utils.parseUnits(daiAmount)).to.be.greaterThan(0);
  });

  it("Allows member to deposit DAI to savings", async () => {
    const swapTx = await instance.swap({value: ethers.utils.parseEther('1')});
    await swapTx.wait();
    await instance.daiBalance();

    const [ user ] = await ethers.getSigners();

    deposit = ethers.utils.parseEther('100');
    await DAI.connect(user).approve(instance.address, deposit);

    const initialAmount = await instance.getSavingsBalance();
    const depositTx = await instance.depositTokensToSavings(deposit);
    await depositTx.wait();
    const newAmount = await instance.getSavingsBalance();
    await instance.daiBalance();

    expect(parseFloat(ethers.utils.formatEther(newAmount))).to.be.greaterThan(parseFloat(ethers.utils.formatEther(initialAmount)));
  });

  xit("Allows member to deposit ETH (as DAI) to savings", async () => {
    const initialAmount = await instance.getSavingsBalance();
    
    const depositTx = await instance.depositETHToSavings({value: '1000'});
    await depositTx.wait();

    const newAmount = await instance.getSavingsBalance();
    if (newAmount > initialAmount) {
      return assert(true);
    }
    assert(false);
  });

  xit("Allows member to withdraw from savings", async () => {

  });

  xit("Allows member to delete their membership", async () => {

  });

  xit("Returns the balance amount of the member's savings account", async () => {
    // const SavingsPool = await ethers.getContractFactory("SavingsPool");
    // const savings = await SavingsPool.deploy();
    // await savings.deployed();

    expect(await instance.getSavingsBalance()).to.equal(deposit);

    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
