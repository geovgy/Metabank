const { expect } = require("chai");
require('dotenv').config();

describe("CreditSpender", async () => {
    let factory;
    let instance;
    let DAI;
    const [issuer, owner] = await ethers.getSigners();
    const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const erc20ABI = process.env.ERC20_ABI;

    before(async () => {
        const CreditSpenderFactory = await ethers.getContractFactory("CreditSpenderFactory");
        factory = await CreditSpenderFactory
            .connect(issuer)
            .deploy(owner.address, daiAddress, 2000);
        await factory.deployed();

        DAI = new ethers.Contract(daiAddress, erc20ABI);
    });

    it("Factory can deploy new credit contract", async () => {
        instance = await factory.connect(owner).createCreditSpender(daiAddress);
        await instance.deployed();
        console.log(instance.address);
    });

    xit("Contract is not valid until initialized");

    xit("Contract is valid");

    xit("Owner can spend with contract");

    xit("Owner owes an outstanding balance to contract");

    xit("Owner can repay contract");
});