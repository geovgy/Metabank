const { expect, assert } = require("chai");
require('dotenv').config();

describe("Contracts", async () => {
  let savingsInstance;
  let creditInstance;
  let creditFactory;
  let deposit;
  let DAI;
  const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const erc20ABI = process.env.ERC20_ABI;

  before(async () => {
    const SavingsPool = await ethers.getContractFactory("SavingsPool");
    savingsInstance = await SavingsPool.deploy("0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9");
    await savingsInstance.deployed();

    DAI = new ethers.Contract(daiAddress, erc20ABI);
  });
  
  describe("Savings Pool", function () {
    it("Allows user to create a membership", async () => {
      await savingsInstance.createMembership();
      const membership = await savingsInstance.checkMembership();
  
      expect(membership).to.be.true;
      expect(await savingsInstance.memberCount()).to.equal(1);
    });
  
    it("Swap ETH to DAI with router", async () => {
      const swapTx = await savingsInstance.swap({value: ethers.utils.parseEther('1')});
      await swapTx.wait();
  
      const daiAmount = await savingsInstance.daiBalance();
      
      expect(parseFloat(ethers.utils.formatEther(daiAmount))).to.be.greaterThan(0);
    });
  
    it("Allows member to deposit DAI to savings", async () => {
      const swapTx = await savingsInstance.swap({value: ethers.utils.parseEther('1')});
      await swapTx.wait();
      await savingsInstance.daiBalance();
  
      const [ user ] = await ethers.getSigners();
  
      deposit = ethers.utils.parseEther('100');
      await DAI.connect(user).approve(savingsInstance.address, ethers.utils.parseEther('200'));
  
      const depositTx = await savingsInstance.depositTokensToSavings(deposit);
      await depositTx.wait();
      const initialAmount = await savingsInstance.getMemberSavingsBalance();
  
      await savingsInstance.depositTokensToSavings(deposit);
      const newAmount = await savingsInstance.getMemberSavingsBalance();
      await savingsInstance.daiBalance();
  
      expect(parseFloat(ethers.utils.formatEther(newAmount))).to.be.greaterThan(parseFloat(ethers.utils.formatEther(initialAmount)));
    });

    it("Allow multiple members to deposit DAI to savings", async () => {
      const [, other1, other2, other3, other4, other5, other6] = await ethers.getSigners();
      const otherUsers = [other1, other2, other3, other4, other5, other6];

      for(let i=0; i < otherUsers.length; i++) {
        await savingsInstance.connect(otherUsers[i]).createMembership();

        const swapTx = await savingsInstance.connect(otherUsers[i]).swap({value: ethers.utils.parseEther('500')});
        await swapTx.wait();
        const balance = await savingsInstance.connect(otherUsers[i]).daiBalance();

        await DAI.connect(otherUsers[i]).approve(savingsInstance.address, balance);
    
        const depositTx = await savingsInstance.connect(otherUsers[i]).depositTokensToSavings(balance);
        await depositTx.wait();
        const amount = await savingsInstance.connect(otherUsers[i]).getMemberSavingsBalance();

        expect(parseFloat(ethers.utils.formatEther(amount))).to.equal(parseFloat(ethers.utils.formatEther(balance)));
      }
      // Add an expect or assert function to check pass
      // See how much the total savings pool has now
    });
  
    it("Able to retrieve total balance of savings pool", async () => {
      let totalSavings = await savingsInstance.getTotalSavingsBalance();
      totalSavings = parseFloat(ethers.utils.formatEther(totalSavings));
      
      expect(totalSavings).to.be.greaterThanOrEqual(parseFloat(ethers.utils.formatEther(deposit)));
    });
  
    it("Able to retrieve interest accrued in pool", async () => {
      let totalSavings = await savingsInstance.getTotalSavingsBalance();
      totalSavings = parseFloat(ethers.utils.formatEther(totalSavings));
  
      let totalDeposit = await savingsInstance.totalPrincipal();
      totalDeposit = parseFloat(ethers.utils.formatEther(totalDeposit));
  
      let interestAccrued = await savingsInstance.getTotalInterestAccrued();
      interestAccrued = parseFloat(ethers.utils.formatEther(interestAccrued));
  
      // The amounts differ after the 6th decimal
      expect(`${interestAccrued}`.substring(0, 6)).to.equal(`${totalSavings - totalDeposit}`.substring(0, 6));
    });
  
    xit("Allows member to deposit ETH (as DAI) to savings", async () => {
      const initialAmount = await savingsInstance.getMemberSavingsBalance();
      
      const depositTx = await savingsInstance.depositETHToSavings({value: '1000'});
      await depositTx.wait();
  
      const newAmount = await savingsInstance.getMemberSavingsBalance();
      if (newAmount > initialAmount) {
        return assert(true);
      }
      assert(false);
    });
  
    it("Allows member to withdraw from savings", async () => {
      const begDaiInWallet = await savingsInstance.daiBalance();
      const begSavingsBalance = await savingsInstance.getMemberSavingsBalance();
  
      await savingsInstance.withdrawFromSavings(ethers.utils.parseEther('100'));
  
      const endSavingsBalance = await savingsInstance.getMemberSavingsBalance();
      const endDaiInWallet = await savingsInstance.daiBalance();
  
      expect(parseFloat(ethers.utils.formatEther(endSavingsBalance))).to.be.lessThan(parseFloat(ethers.utils.formatEther(begSavingsBalance)));
      expect(parseFloat(ethers.utils.formatEther(endDaiInWallet))).to.be.greaterThan(parseFloat(ethers.utils.formatEther(begDaiInWallet)));
    });
  
    xit("Allows member to delete their membership", async () => {
  
    });
  
    xit("Returns the balance amount of the member's savings account", async () => {
      // const SavingsPool = await ethers.getContractFactory("SavingsPool");
      // const savings = await SavingsPool.deploy();
      // await savings.deployed();
  
      expect(await savingsInstance.getMemberSavingsBalance()).to.equal(deposit);
  
      // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");
  
      // wait until the transaction is mined
      // await setGreetingTx.wait();
  
      // expect(await greeter.greet()).to.equal("Hola, mundo!");
    });

    // Add additional tests for credit delegation and lending
    it("Can generate a credit limit for the member", async () => {
      const generateTx = await savingsInstance.generateCreditLimit();
      await generateTx.wait();
      let creditLimit = await savingsInstance.getCreditLimit();

      creditLimit = parseFloat(ethers.utils.formatEther(creditLimit));
      console.log(creditLimit);

      expect(creditLimit).to.be.lessThanOrEqual(5000);
      expect(creditLimit).to.be.greaterThan(0);
    });

    it("Can approve credit delegation to the member", async () => {
      await savingsInstance.approveCreditHolder();
      const approvedAmount = await savingsInstance.creditAllowance();
      const creditLimit = await savingsInstance.getCreditLimit();

      expect(ethers.utils.formatEther(approvedAmount)).to.equal(ethers.utils.formatEther(creditLimit));
    });

    it("Member can borrow credit multiple times within allowance", async () => {
      const balanceBefore = await savingsInstance.usdcBalance();
      await savingsInstance.borrowCredit(100);
      const balanceAfter = await savingsInstance.usdcBalance();

      expect(parseFloat(ethers.utils.formatEther(balanceAfter))).to.be.greaterThan(parseFloat(ethers.utils.formatEther(balanceBefore)));
    });

    xit("Member cannot borrow beyond credit limit", async () => {
      
    });

    // ISSUE: Unable to repay credit lender???
    // USDC balance doesn't change
    it("Member can repay delegator and reduce amount owed", async () => {
      let creditOutstanding1 = await savingsInstance.getCreditLimit();
      creditOutstanding1 = parseFloat(ethers.utils.formatEther(creditOutstanding1));
      const amount = '100';

      const [ borrower ] = await ethers.getSigners();
      const USDC = new ethers.Contract("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", erc20ABI);
      USDC.connect(borrower).approve(savingsInstance.address, amount);

      await savingsInstance.repayCredit(ethers.utils.parseEther(amount));
      let creditOutstanding2 = await savingsInstance.getCreditLimit();
      creditOutstanding2 = parseFloat(ethers.utils.formatEther(creditOutstanding2));

      expect(creditOutstanding2).to.be.lessThan(creditOutstanding1);
    });

    xit("More credit is issued equal to the amount member repaid");
  });

  describe("Credit Spender Factory", function () {
    let owner;

    xit("Contract is successfully deployed", async () => {
      const CreditContract = await ethers.getContractFactory("CreditSpenderFactory");
      creditFactory = await CreditContract.deploy();
      await creditFactory.deployed();
  
      expect(creditFactory.address);
    });
  
    xit("Factory can deploy new credit contract", async () => {
      const [ address1, address2 ] = await ethers.getSigners();
      owner = address2;
      await creditFactory.connect(owner).createCreditSpender(daiAddress);
      
      creditInstance = await creditFactory.connect(owner).getCreditSpenderAddress();
      console.log(creditFactory.address);
  
      expect(creditInstance);
    });
  });

  describe("Credit Spender", function () {
    let owner;
    let recipient;
    
    xit("Contract holder and issuer are the correct addresses", async () => {
      const [ address1, address2 ] = await ethers.getSigners();
      owner = address2;
      recipient = address1;

      const CreditSpender = await ethers.getContractFactory("CreditSpender");
      creditInstance = await CreditSpender.attach(creditInstance);
      await creditInstance.deployed();
      
      const holder = await creditInstance.holder();
      const issuer = await creditInstance.issuer();
      
      expect(holder).to.equal(owner.address);
      expect(issuer).to.equal(creditFactory.address);
    });

    xit("Contract is not valid until initialized", async () => {
      const validated = await creditInstance.valid();
      expect(validated).to.be.true;
    });

    xit("Only the holder can spend tokens in contract");

    xit("Owner can spend with contract");

    xit("Owner owes an outstanding balance to contract");

    xit("Owner can repay contract");
  });
});
