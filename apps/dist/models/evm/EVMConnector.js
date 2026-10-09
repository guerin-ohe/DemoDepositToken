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
exports.getConnectorVersion = exports.getSignerFromAdress = exports.getSigner = exports.getProvider = void 0;
const ethers_1 = require("ethers");
// local EVM node provider
const provider = new ethers_1.JsonRpcProvider("http://localhost:8545");
// get provider
const getProvider = () => {
    return provider;
};
exports.getProvider = getProvider;
// get default signer
const getSigner = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield provider.getSigner();
});
exports.getSigner = getSigner;
// get signer from adress
const getSignerFromAdress = (adress) => __awaiter(void 0, void 0, void 0, function* () {
    return yield provider.getSigner(adress);
});
exports.getSignerFromAdress = getSignerFromAdress;
// get Ethers.js version
const getConnectorVersion = () => {
    return ethers_1.version;
};
exports.getConnectorVersion = getConnectorVersion;
