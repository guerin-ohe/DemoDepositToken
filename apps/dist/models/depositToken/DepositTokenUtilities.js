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
exports.getAdressERC20BalanceAndRepairList = exports.getAdressAndBalanceList = void 0;
const EVMUtilities_1 = require("../evm/EVMUtilities");
const EVMConf_1 = require("../evm/EVMConf");
const MyDepositToken_1 = require("../../models/depositToken/MyDepositToken");
// get adress and adress balance list
const getAdressAndBalanceList = (provider) => __awaiter(void 0, void 0, void 0, function* () {
    // get Adresss list
    const adressAndKeyList = (0, EVMConf_1.getAdressList)();
    // map getSolde on adress list
    const adressAndBalanceList = yield Promise.all(adressAndKeyList.map((_a) => __awaiter(void 0, [_a], void 0, function* ([adress, key]) {
        const eth_balance = yield (0, EVMUtilities_1.getBalance)(provider, adress);
        const depositToken = yield (0, MyDepositToken_1.getDepositTokenContractFromAdress)(adress);
        const erc20_balance = yield depositToken.balanceOf(adress);
        const result = [adress, eth_balance, erc20_balance];
        return result;
    })));
    return adressAndBalanceList;
});
exports.getAdressAndBalanceList = getAdressAndBalanceList;
// get adress, erc20 balance and repair list
const getAdressERC20BalanceAndRepairList = (provider) => __awaiter(void 0, void 0, void 0, function* () {
    // get Adresss list
    const adressAndKeyList = (0, EVMConf_1.getAdressList)();
    // map balanceOf and rerpair on adress list
    const adressERC20BalanceAndRepairList = yield Promise.all(adressAndKeyList.map((_a) => __awaiter(void 0, [_a], void 0, function* ([adress, key]) {
        const depositToken = yield (0, MyDepositToken_1.getDepositTokenContractFromAdress)(adress);
        const erc20_balance = yield depositToken.balanceOf(adress);
        const erc20_total_supply = yield depositToken.totalSupply();
        var erc20_repair = 0;
        if (erc20_total_supply > 0)
            erc20_repair = Number(erc20_balance) * 100 / Number(erc20_total_supply);
        const result = [adress, erc20_balance, erc20_repair];
        return result;
    })));
    return adressERC20BalanceAndRepairList;
});
exports.getAdressERC20BalanceAndRepairList = getAdressERC20BalanceAndRepairList;
