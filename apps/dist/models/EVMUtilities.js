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
exports.sendEthers = exports.getBalance = void 0;
const ethers_1 = require("ethers");
// get adress balance
const getBalance = (provider, adress) => __awaiter(void 0, void 0, void 0, function* () {
    return yield provider.getBalance(adress);
});
exports.getBalance = getBalance;
// transfert Ethers
const sendEthers = (provider, signer, destinationAdress, amount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Faire un virement sur le wallet
        const tx = {
            to: destinationAdress,
            value: (0, ethers_1.parseEther)(amount.toString())
        };
        // Envoyer la transaction
        const receipt = yield signer.sendTransaction(tx);
        console.log('Transaction réussie:', receipt);
    }
    catch (error) {
        console.error('Erreur lors de l\'appel :', error);
    }
});
exports.sendEthers = sendEthers;
