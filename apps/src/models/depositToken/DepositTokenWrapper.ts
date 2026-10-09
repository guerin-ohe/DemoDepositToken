// Import Ether.JS
import { Provider, Signer, Contract } from "ethers";

// Import SimpleWallet ABI
import DEPOSIT_TOKEN_ABI from "../../abis/DepositToken.json";

class DepositTokenWrapper {
    private provider: Provider;
    private contractAddress: string;
    private abi: any[];
    private contract: Contract;

    constructor(provider: Provider, signer: Signer, contractAddress: string, abi: any[]) {
        this.provider = provider;
        this.contractAddress = contractAddress;
        this.abi = abi;
        
        // Création du contrat
        this.contract = new Contract(this.contractAddress, this.abi, signer); 
    }

    // ERC20 interface
    //

    async name(): Promise<string> {
        return await this.contract.name();
    }

    async symbol(): Promise<string> {
        return await this.contract.symbol();
    }

    async decimals(): Promise<number> {
        return await this.contract.decimals();
    }
    
    async totalSupply(): Promise<number> {
        return await this.contract.totalSupply();
    }

    async balanceOf(adress: string): Promise<number> {
        return await this.contract.balanceOf(adress);
    }
    
    async transfer(to: string, value: number): Promise<boolean> {
        return await this.contract.transfer(to, value);
    }

    // Minter
    async checkMint(address: string): Promise<boolean> {
        return await this.contract.checkMint(address);
    }

    async setMinter(address: string, allowed: boolean) {
        try {
                const tx = await this.contract.setMinter(address, allowed);
                const receipt = await tx.wait();
                console.log('Transaction réussie:', receipt);
        } catch (error) {
                console.error('Erreur lors de l appel à la méthode mint:', error);
                throw error;
        }
    }

    // insérer ici transfertFrom() et functions associées

    // Deposit Token interface
    //
    async getToken(): Promise<DepositTokenWrapper> {
        return await this.contract.token();
    }

    async paused(): Promise<boolean> {
        return await this.contract.paused();    
    }

    async pause() {
        try {
                const tx = await this.contract.pause();
                const receipt = await tx.wait();
                console.log('Transaction réussie:', receipt);
        } catch (error) {
                console.error('Erreur lors de l appel à la méthode pause:', error);
                throw error;
        }
    }

    async unpause() {
        try {
                const tx = await this.contract.unpause();
                const receipt = await tx.wait();
                console.log('Transaction réussie:', receipt);
        } catch (error) {
                console.error('Erreur lors de l appel à la méthode unpause:', error);
                throw error;
        }
    }

    async deposit(to: string, amount: number) {
        try {
                const tx = await this.contract.deposit(to, amount);
                const receipt = await tx.wait();
                console.log('Transaction réussie:', receipt);
        } catch (error) {
                console.error('Erreur lors de l appel à la méthode mint:', error);
                throw error;
        }
    }

    // burnFrom(address account, uint256 amount)
    async withdraw(from: string, amount: number) {
        try {
                const tx = await this.contract.withdraw(from, amount);
                const receipt = await tx.wait();
                console.log('Transaction réussie:', receipt);
        } catch (error) {
                console.error('Erreur lors de l appel à la méthode burn:', error);
                throw error;
        }
    }

    // get Contract interface
    getContract() : Contract {
        return this.contract;
    }
}

export default DepositTokenWrapper;
