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
exports.getErc20TransfertEvent = exports.switchtMintStatus = exports.getDepositToken = exports.submitBurn = exports.getBurn = exports.submitTransfert = exports.getTransfert = exports.submitMint = exports.getMint = exports.getAdress = void 0;
const EVMConnector_1 = require("../models/evm/EVMConnector");
const logsparser_1 = require("../models/erc20/logsparser");
const DepositTokenUtilities_1 = require("../models/depositToken/DepositTokenUtilities");
const MyDepositToken_1 = require("../models/depositToken/MyDepositToken");
const getAdress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get Ether.js version
    const etherjs_version = (0, EVMConnector_1.getConnectorVersion)();
    // get provider
    const provider = (0, EVMConnector_1.getProvider)();
    // get adress and key list
    const adressAndBalanceList = yield (0, DepositTokenUtilities_1.getAdressAndBalanceList)(provider);
    // log
    console.log("adressAndBalanceList type:", typeof adressAndBalanceList);
    console.log("isArray:", Array.isArray(adressAndBalanceList));
    console.log("value:", adressAndBalanceList);
    // get stablecoin to owner
    const depositToken = yield (0, MyDepositToken_1.getDepositTokenContractFromAdress)(MyDepositToken_1.depositTokenOwnerAddress);
    // get stablecoin name
    const erc20_name = yield depositToken.name();
    // get stablecoin symbol
    const erc20_symbol = yield depositToken.symbol();
    // get stablecoin decimals
    const erc20_decimals = yield depositToken.decimals();
    // get stablecoin total supply
    const erc20_total_supply = yield depositToken.totalSupply();
    // get stablecoin paused
    const erc20_paused = yield depositToken.paused();
    // get ERC20 transfert logs
    const erc20Transferts = yield (0, logsparser_1.getERC20TransfertLogs)(provider, MyDepositToken_1.depositTokenAddress);
    // render view
    res.render('home', { etherjs_version, adressAndBalanceList, erc20_name, erc20_symbol, erc20_decimals, erc20_total_supply, erc20_paused, erc20Transferts });
});
exports.getAdress = getAdress;
const getMint = (req, res) => {
    const to = req.query.to;
    console.log('To adress:', to);
    res.render('mint', { to });
};
exports.getMint = getMint;
const submitMint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // log receive data 
    const formData = req.body;
    console.log('Form data received:', formData);
    // get post data
    const to = formData.to;
    const amount = formData.amount;
    // mint amount token for adress
    const depositToken = yield (0, MyDepositToken_1.getDepositTokenContractFromAdress)(MyDepositToken_1.depositTokenOwnerAddress);
    yield depositToken.deposit(to, amount);
    // redirect to home
    res.json({ success: true });
});
exports.submitMint = submitMint;
const getTransfert = (req, res) => {
    const from = req.query.from;
    res.render('transfert', { from });
};
exports.getTransfert = getTransfert;
const submitTransfert = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // log receive data 
    const formData = req.body;
    console.log('Form data received:', formData);
    // get post data
    const from = formData.from;
    const to = formData.to;
    const amount = formData.amount;
    // transfert amount token to adress
    const depositToken = yield (0, MyDepositToken_1.getDepositTokenContractFromAdress)(from);
    const result = yield depositToken.transfer(to, amount); // voir pb de l'adresse emission
    if (result) {
        // redirect to home
        res.json({ success: true });
    }
    else {
        res.send('Transfer fail!');
    }
});
exports.submitTransfert = submitTransfert;
const getBurn = (req, res) => {
    const to = req.query.to;
    console.log('To adress:', to);
    res.render('burn', { to });
};
exports.getBurn = getBurn;
const submitBurn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // log receive data 
    const formData = req.body;
    console.log('Form data received:', formData);
    // get post data
    const to = formData.to;
    const amount = formData.amount;
    // burn amount token for adress
    const depositToken = yield (0, MyDepositToken_1.getDepositTokenContractFromAdress)(MyDepositToken_1.depositTokenOwnerAddress);
    yield depositToken.withdraw(to, amount);
    // redirect to stablecoin
    res.json({ success: true });
});
exports.submitBurn = submitBurn;
// DepositToken
const getDepositToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get Ether.js version
    const etherjs_version = (0, EVMConnector_1.getConnectorVersion)();
    // get stablecoin to owner
    const depositToken = yield (0, MyDepositToken_1.getDepositTokenContractFromAdress)(MyDepositToken_1.depositTokenOwnerAddress);
    // get stablecoin name
    const erc20_name = yield depositToken.name();
    // get stablecoin symbol
    const erc20_symbol = yield depositToken.symbol();
    // get stablecoin decimals
    const erc20_decimals = yield depositToken.decimals();
    // get stablecoin total supply
    const erc20_total_supply = yield depositToken.totalSupply();
    // get stablecoin paused
    const erc20_paused = yield depositToken.paused();
    // set erc20 balance and repair
    // get provider
    const provider = (0, EVMConnector_1.getProvider)();
    // get adress and key list
    const adressERC20BalanceAndRepairList = yield (0, DepositTokenUtilities_1.getAdressERC20BalanceAndRepairList)(provider);
    // debug
    console.log("adressAndBalanceList type:", typeof adressERC20BalanceAndRepairList);
    console.log("isArray:", Array.isArray(adressERC20BalanceAndRepairList));
    console.log("value:", adressERC20BalanceAndRepairList);
    // get ERC20 transfert logs
    const erc20Transferts = yield (0, logsparser_1.getERC20TransfertLogs)(provider, MyDepositToken_1.depositTokenAddress);
    res.render('stablecoin', { etherjs_version, erc20_name, erc20_symbol, erc20_decimals, erc20_total_supply, erc20_paused, adressERC20BalanceAndRepairList, erc20Transferts });
});
exports.getDepositToken = getDepositToken;
// switch mint status
const switchtMintStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // switch mint status
    const depositToken = yield (0, MyDepositToken_1.getDepositTokenContractFromAdress)(MyDepositToken_1.depositTokenOwnerAddress);
    const paused = yield depositToken.paused();
    if (paused)
        yield depositToken.unpause();
    else
        yield depositToken.pause();
    // redirect to vue depositToken.ejs
    res.redirect('/home');
});
exports.switchtMintStatus = switchtMintStatus;
// get ERC20 transfert event
const getErc20TransfertEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get address 
    const address = req.query.address;
    // get provider
    const provider = (0, EVMConnector_1.getProvider)();
    // get ERC20 transfert from logs
    const erc20TransfertsFrom = yield (0, logsparser_1.getERC20TransfertFromLogs)(provider, MyDepositToken_1.depositTokenAddress, address);
    // getERC20TransfertToLogs
    const erc20TransfertsTo = yield (0, logsparser_1.getERC20TransfertToLogs)(provider, MyDepositToken_1.depositTokenAddress, address);
    res.render('erc20TransfertEvent', { erc20TransfertsFrom, erc20TransfertsTo });
});
exports.getErc20TransfertEvent = getErc20TransfertEvent;
