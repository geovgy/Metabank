const { expect, assert } = require("chai");
require('dotenv').config();

describe("Contracts", async () => {
  let savingsInstance;
  let creditInstance;
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
  
      deposit = ethers.utils.parseEther('200');
      await DAI.connect(user).approve(savingsInstance.address, ethers.utils.parseEther('400'));
  
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
      // *********** TO DO ***********
    });
  });
  
  describe("Credit Spender", function () {
    it("Can generate a credit limit for the member", async () => {
      const generateTx = await savingsInstance.generateCreditLimit();
      await generateTx.wait();
      let creditLimit = await savingsInstance.getCreditLimit();
  
      creditLimit = parseFloat(creditLimit)/(10**6);
  
      expect(creditLimit).to.be.lessThanOrEqual(5000);
      expect(creditLimit).to.be.greaterThan(0);
    });
  
    it("Can successfully deploy a CreditSpender contract", async () => {
      await savingsInstance.createCreditSpender();
      const [ owner ] = await ethers.getSigners();
  
      creditInstance = await savingsInstance.getCreditSpenderAddress();

      const CreditSpender = await ethers.getContractFactory("CreditSpender");
      creditInstance = await CreditSpender.attach(creditInstance);
      await creditInstance.deployed();
      
      const holder = await creditInstance.holder();
      const issuer = await creditInstance.issuer();
      
      expect(holder).to.equal(owner.address);
      expect(issuer).to.equal(savingsInstance.address);
    })
  
    it("Can approve credit delegation to the member", async () => {
      await savingsInstance.approveCreditHolder();
      const approvedAmount = await savingsInstance.creditAllowance(creditInstance.address);
      const creditLimit = await savingsInstance.getCreditLimit();
  
      expect(ethers.utils.formatEther(approvedAmount)).to.equal(ethers.utils.formatEther(creditLimit));
    });

    it("Credit limit equals credit delegated allowance", async () => {
      const allowance = await creditInstance.creditAllowance();
      const limit = await creditInstance.creditLimit();
      expect(allowance).to.equal(limit);
    })

    it("CreditSpender remains invalid until initialized", async () => {
      const isValidBefore = await creditInstance.valid();
      expect(isValidBefore).to.be.false;
      await savingsInstance.initCreditSpender();
      const isValidAfter = await creditInstance.valid();
      expect(isValidAfter).to.be.true;
    });
  
    it("Member can borrow credit from Savings Pool", async () => {
      const [, recipient] = await ethers.getSigners();
      const balanceBefore = await savingsInstance.connect(recipient).usdcBalance();
      const amount = 100*(10**6);

      await creditInstance.spend(amount, recipient.address);
      const balanceAfter = await savingsInstance.connect(recipient).usdcBalance();
  
      expect(parseFloat(ethers.utils.formatEther(balanceAfter))).to.be.greaterThan(parseFloat(ethers.utils.formatEther(balanceBefore)));
    });

    it("Member can borrow credit multiple times within allowance and not beyond", async () => {
      const [, recipient] = await ethers.getSigners();
      const amount = 100*(10**6);

      const initialBalance = await savingsInstance.connect(recipient).usdcBalance();

      await creditInstance.spend(amount, recipient.address);
      const balanceAfter1stPurchase = await savingsInstance.connect(recipient).usdcBalance();
      expect(parseFloat(ethers.utils.formatEther(balanceAfter1stPurchase))).to.be.greaterThan(parseFloat(ethers.utils.formatEther(initialBalance)));

      await creditInstance.spend(amount, recipient.address);
      const balanceAfter2ndPurchase = await savingsInstance.connect(recipient).usdcBalance();
      expect(parseFloat(ethers.utils.formatEther(balanceAfter2ndPurchase))).to.be.greaterThan(parseFloat(ethers.utils.formatEther(balanceAfter1stPurchase)));

      try {
        await creditInstance.spend(amount, recipient.address);
        expect.fail();
      } catch (error) {
        console.log(error);
        expect(error);
      }
    });
  
    it("Member can repay delegator and reduce amount owed", async () => {
      const [ borrower, recipient ] = await ethers.getSigners();
      const amount = 100*(10**6);
  
      const USDC = new ethers.Contract("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", erc20ABI);
      
      await USDC.connect(recipient).transfer(borrower.address, amount);
      await USDC.connect(borrower).approve(creditInstance.address, amount);
  
      const owedBefore = await creditInstance.creditOutstanding();
      await creditInstance.repay(amount);
      const owedAfter = await creditInstance.creditOutstanding();
  
      expect(parseFloat(ethers.utils.formatEther(owedAfter))).to.be.lessThan(parseFloat(ethers.utils.formatEther(owedBefore)));
    });
  
    xit("More credit is issued equal to the amount member repaid", async () => {
      const [, recipient] = await ethers.getSigners();
      const amount = 100*(10**6);

      const balanceBefore = await savingsInstance.connect(recipient).usdcBalance();

      await creditInstance.spend(amount, recipient.address);
      const balanceAfter = await savingsInstance.connect(recipient).usdcBalance();
      expect(parseFloat(ethers.utils.formatEther(balanceAfter))).to.be.greaterThan(parseFloat(ethers.utils.formatEther(balanceBefore)));
    });

    it("Cannot withdraw from savings with outstanding debt", async () => {
      try {
        await savingsInstance.withdrawFromSavings(ethers.utils.parseEther('1'));
        expect.fail();
      } catch (error) {
        expect(error);
      }
    });
  });
});
