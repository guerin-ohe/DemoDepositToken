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
exports.getStablecoinContractFromAdress = exports.createStablecoinContract = exports.stablecoinOwnerAddress = exports.stablecoinAddress = void 0;
const EVMConnector_1 = require("../models/EVMConnector");
const StablecoinWrapper_1 = __importDefault(require("../models/StablecoinWrapper"));
const Stablecoin_json_1 = __importDefault(require("../abis/Stablecoin.json"));
// Remplacez par l'adresse du contrat Fundraiser déployé
exports.stablecoinAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
// Adresse Owner Stablecoin
exports.stablecoinOwnerAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
// create StablecoinWrapper
const createStablecoinContract = (adress) => __awaiter(void 0, void 0, void 0, function* () {
    // Provider & Signer
    const provider = (0, EVMConnector_1.getProvider)();
    const signer = yield (0, EVMConnector_1.getSignerFromAdress)(adress);
    // Instanciation de la classe StablecoinWrapper
    const stablecoin = new StablecoinWrapper_1.default(provider, signer, exports.stablecoinAddress, Stablecoin_json_1.default);
    return stablecoin;
});
exports.createStablecoinContract = createStablecoinContract;
// get stablecoin wrapper to adreess
const getStablecoinContractFromAdress = (adress) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, exports.createStablecoinContract)(adress);
});
exports.getStablecoinContractFromAdress = getStablecoinContractFromAdress;
