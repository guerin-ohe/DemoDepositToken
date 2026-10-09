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
exports.getDepositTokenContractFromAdress = exports.createDepositTokenContract = exports.depositTokenOwnerAddress = exports.depositTokenAddress = void 0;
const EVMConnector_1 = require("../evm/EVMConnector");
const DepositTokenWrapper_1 = __importDefault(require("../../models/depositToken/DepositTokenWrapper"));
const DepositToken_json_1 = __importDefault(require("../../abis/DepositToken.json"));
// Remplacez par l'adresse du contrat Fundraiser déployé
exports.depositTokenAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
// Adresse Owner DepositToken
exports.depositTokenOwnerAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
// create DepositTokenWrapper
const createDepositTokenContract = (adress) => __awaiter(void 0, void 0, void 0, function* () {
    // Provider & Signer
    const provider = (0, EVMConnector_1.getProvider)();
    const signer = yield (0, EVMConnector_1.getSignerFromAdress)(adress);
    // Instanciation de la classe StablecoinWrapper
    const depositToken = new DepositTokenWrapper_1.default(provider, signer, exports.depositTokenAddress, DepositToken_json_1.default);
    return depositToken;
});
exports.createDepositTokenContract = createDepositTokenContract;
// get stablecoin wrapper to adreess
const getDepositTokenContractFromAdress = (adress) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, exports.createDepositTokenContract)(adress);
});
exports.getDepositTokenContractFromAdress = getDepositTokenContractFromAdress;
