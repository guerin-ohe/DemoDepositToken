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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentERC20Wallet = exports.createSimpleERC20WalletWrapper = exports.simpleERC20WalletAddress = void 0;
const EVMConnector_1 = require("../models/EVMConnector");
const SimpleERC20WalletWrapper_1 = __importDefault(require("../models/SimpleERC20WalletWrapper"));
const SimpleERC20Wallet_json_1 = __importDefault(require("../abis/SimpleERC20Wallet.json"));
// Remplacez par l'adresse du contrat Fundraiser déployé
exports.simpleERC20WalletAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
// create SimpleWalletWrapper
const createSimpleERC20WalletWrapper = () => __awaiter(void 0, void 0, void 0, function* () {
    // Provider & Signer
    const provider = (0, EVMConnector_1.getProvider)();
    const signer = yield (0, EVMConnector_1.getSigner)();
    // Instanciation de la classe SimpleWalletWrapper
    const wallet = new SimpleERC20WalletWrapper_1.default(provider, signer, exports.simpleERC20WalletAddress, SimpleERC20Wallet_json_1.default);
    return wallet;
});
exports.createSimpleERC20WalletWrapper = createSimpleERC20WalletWrapper;
// current wallet
const currentWallet = (0, exports.createSimpleERC20WalletWrapper)();
// get current wallet
const getCurrentERC20Wallet = () => __awaiter(void 0, void 0, void 0, function* () {
    return currentWallet;
});
exports.getCurrentERC20Wallet = getCurrentERC20Wallet;
