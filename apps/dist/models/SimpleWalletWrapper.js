"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import Ether.JS
const ethers_1 = require("ethers");
class SimpleWalletWrapper {
    constructor(provider, signer, contractAddress, abi) {
        this.provider = provider;
        this.contractAddress = contractAddress;
        this.abi = abi;
        // Obtenir le compte connecté
        //const currentSigner = await provider.getSigner();
        // Création du contrat
        this.contract = new ethers_1.Contract(this.contractAddress, this.abi, signer);
    }
    getOwner() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.contract.owner();
        });
    }
    getBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.contract.getBalance();
        });
    }
    withdraw(amount, to) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tx = yield this.contract.withdraw(amount, to);
                const receipt = yield tx.wait();
                console.log('Transaction réussie:', receipt);
            }
            catch (error) {
                console.error('Erreur lors de l appel à la méthode addLiquidity:', error);
            }
        });
    }
}
exports.default = SimpleWalletWrapper;
