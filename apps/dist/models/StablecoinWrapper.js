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
class StablecoinWrapper {
    constructor(provider, signer, contractAddress, abi) {
        this.provider = provider;
        this.contractAddress = contractAddress;
        this.abi = abi;
        // Création du contrat
        this.contract = new ethers_1.Contract(this.contractAddress, this.abi, signer);
    }
    // ERC20 interface
    //
    name() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.contract.name();
        });
    }
    symbol() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.contract.symbol();
        });
    }
    decimals() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.contract.decimals();
        });
    }
    totalSupply() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.contract.totalSupply();
        });
    }
    balanceOf(adress) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.contract.balanceOf(adress);
        });
    }
    transfer(to, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.contract.transfer(to, value);
        });
    }
    // insérer ici transfertFrom() et functions associées
    // stablecoin interface
    //
    getToken() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.contract.token();
        });
    }
    paused() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.contract.paused();
        });
    }
    pause() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tx = yield this.contract.pause();
                const receipt = yield tx.wait();
                console.log('Transaction réussie:', receipt);
            }
            catch (error) {
                console.error('Erreur lors de l appel à la méthode pause:', error);
            }
        });
    }
    unpause() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tx = yield this.contract.unpause();
                const receipt = yield tx.wait();
                console.log('Transaction réussie:', receipt);
            }
            catch (error) {
                console.error('Erreur lors de l appel à la méthode unpause:', error);
            }
        });
    }
    mint(to, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tx = yield this.contract.mint(to, amount);
                const receipt = yield tx.wait();
                console.log('Transaction réussie:', receipt);
            }
            catch (error) {
                console.error('Erreur lors de l appel à la méthode mint:', error);
            }
        });
    }
    // burnFrom(address account, uint256 amount)
    burn(from, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tx = yield this.contract.burnFrom(from, amount);
                const receipt = yield tx.wait();
                console.log('Transaction réussie:', receipt);
            }
            catch (error) {
                console.error('Erreur lors de l appel à la méthode burn:', error);
            }
        });
    }
}
exports.default = StablecoinWrapper;
