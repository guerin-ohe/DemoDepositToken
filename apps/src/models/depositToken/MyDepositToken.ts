import { getProvider, getSigner, getSignerFromAdress } from '../evm/EVMConnector';
import DepositTokenWrapper from '../../models/depositToken/DepositTokenWrapper';
import DEPOSIT_TOKEN_ABI_ABI from "../../abis/DepositToken.json";


// Remplacez par l'adresse du contrat Fundraiser déployé
export const depositTokenAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

// Adresse Owner DepositToken
export const depositTokenOwnerAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

// create DepositTokenWrapper
export const createDepositTokenContract = async (adress: string): Promise<DepositTokenWrapper> => {

    // Provider & Signer
    const provider = getProvider();
    const signer = await getSignerFromAdress(adress); 

    // Instanciation de la classe StablecoinWrapper
    const depositToken = new DepositTokenWrapper(provider, signer, depositTokenAddress, DEPOSIT_TOKEN_ABI_ABI);

    return depositToken;
}

// get stablecoin wrapper to adreess
export const getDepositTokenContractFromAdress = async (adress: string): Promise<DepositTokenWrapper> => {
    
    return createDepositTokenContract(adress);
}
