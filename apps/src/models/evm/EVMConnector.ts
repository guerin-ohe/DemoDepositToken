import { JsonRpcProvider, Provider, Signer, version, parseEther } from "ethers";

// local EVM node provider
const provider = new JsonRpcProvider("http://localhost:8545");

// get provider
export const getProvider = (): Provider => {
  return provider;
};

// get default signer
export const getSigner = async (): Promise<Signer> => {
    return await provider.getSigner();
}

// get signer from adress
export const getSignerFromAdress = async (adress: string): Promise<Signer> => {
    return await provider.getSigner(adress);
}

// get Ethers.js version
export const getConnectorVersion = (): string => {
    return version;
}


