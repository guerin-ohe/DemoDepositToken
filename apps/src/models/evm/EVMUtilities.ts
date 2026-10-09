import { Provider, Signer, parseEther } from "ethers";

// get adress balance
export const getBalance = async (provider: Provider, adress : string): Promise<bigint> => {
    return await provider.getBalance(adress);
}

// transfert Ethers
export const sendEthers = async (provider: Provider, signer: Signer, destinationAdress : string, amount : bigint) => {
    try {

        // Faire un virement sur le wallet
        const tx = {
            to: destinationAdress,
            value: parseEther(amount.toString())
        };
        
        // Envoyer la transaction
        const receipt = await signer.sendTransaction(tx);
        console.log('Transaction réussie:', receipt);
    } catch (error) {
        console.error('Erreur lors de l\'appel :', error);
    }
}
