import { ethers } from 'ethers';
import SavingsPool from '../../../../artifacts/contracts/SavingsPool.sol/SavingsPool.json';

const enableEth = async () => {
    try {
        let contractAddress = '0x0E801D84Fa97b50751Dbf25036d067dCf18858bF';
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const [account] = await ethereum.request({
                method: 'eth_requestAccounts'
            });

            const signer = provider.getSigner(account);
            const contract = new ethers.Contract(
                contractAddress,
                SavingsPool.abi,
                signer
            );
            return contract;
        } else {
            const provider = new ethers.providers.JsonRpcProvider();
            const signer = provider.getSigner()
            
            const contract = new ethers.Contract(
                contractAddress,
                SavingsPool.abi,
                signer
            );
            return contract;
        }
    } catch (e) {
        console.log(e);
    }
}

export default enableEth;