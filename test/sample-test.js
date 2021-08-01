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

  it("Swap ETH to DAI with router", async () => {
    const swapTx = await instance.swap({value: ethers.utils.parseEther('1')});
    await swapTx.wait();

    const daiAmount = await instance.daiBalance();
    
    expect(parseFloat(ethers.utils.formatEther(daiAmount))).to.be.greaterThan(0);
  });

  it("Allows member to deposit DAI to savings", async () => {
    const swapTx = await instance.swap({value: ethers.utils.parseEther('1')});
    await swapTx.wait();
    await instance.daiBalance();

    const [ user ] = await ethers.getSigners();

    deposit = ethers.utils.parseEther('100');
    await DAI.connect(user).approve(instance.address, deposit);

    const initialAmount = await instance.getMemberSavingsBalance();
    const depositTx = await instance.depositTokensToSavings(deposit);
    await depositTx.wait();
    const newAmount = await instance.getMemberSavingsBalance();
    await instance.daiBalance();

    expect(parseFloat(ethers.utils.formatEther(newAmount))).to.be.greaterThan(parseFloat(ethers.utils.formatEther(initialAmount)));
  });

  it("Able to retrieve total balance of savings pool", async () => {
    let totalSavings = await instance.getTotalSavingsBalance();
    totalSavings = parseFloat(ethers.utils.formatEther(totalSavings));
    console.log(totalSavings);
    expect(totalSavings).to.be.greaterThanOrEqual(parseFloat(ethers.utils.formatEther(deposit)));
  });

  it("Able to retrieve interest accrued in pool", async () => {
    let totalSavings = await instance.getTotalSavingsBalance();
    totalSavings = parseFloat(ethers.utils.formatEther(totalSavings));

    let totalDeposit = await instance.totalPrincipal();
    totalDeposit = parseFloat(ethers.utils.formatEther(totalDeposit));

    let interestAccrued = await instance.getTotalInterestAccrued();
    interestAccrued = parseFloat(ethers.utils.formatEther(interestAccrued));

    expect(interestAccrued).to.equal(totalSavings - totalDeposit);
  });

  xit("Allows member to deposit ETH (as DAI) to savings", async () => {
    const initialAmount = await instance.getMemberSavingsBalance();
    
    const depositTx = await instance.depositETHToSavings({value: '1000'});
    await depositTx.wait();

    const newAmount = await instance.getMemberSavingsBalance();
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

    expect(await instance.getMemberSavingsBalance()).to.equal(deposit);

    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
