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
exports.getCurrentWallet = exports.createSimpleWalletWrapper = exports.simpleWalletAddress = void 0;
const EVMConnector_1 = require("../models/EVMConnector");
const SimpleWalletWrapper_1 = __importDefault(require("../models/SimpleWalletWrapper"));
const SimpleWallet_json_1 = __importDefault(require("../abis/SimpleWallet.json"));
// Remplacez par l'adresse du contrat Fundraiser déployé
exports.simpleWalletAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
// create SimpleWalletWrapper
const createSimpleWalletWrapper = () => __awaiter(void 0, void 0, void 0, function* () {
    // Provider & Signer
    const provider = (0, EVMConnector_1.getProvider)();
    const signer = yield (0, EVMConnector_1.getSigner)();
    // Instanciation de la classe SimpleWalletWrapper
    const wallet = new SimpleWalletWrapper_1.default(provider, signer, exports.simpleWalletAddress, SimpleWallet_json_1.default);
    return wallet;
});
exports.createSimpleWalletWrapper = createSimpleWalletWrapper;
// current wallet
const currentWallet = (0, exports.createSimpleWalletWrapper)();
// get current wallet
const getCurrentWallet = () => __awaiter(void 0, void 0, void 0, function* () {
    return currentWallet;
});
exports.getCurrentWallet = getCurrentWallet;
