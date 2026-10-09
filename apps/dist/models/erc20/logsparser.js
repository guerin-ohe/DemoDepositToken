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
exports.getERC20TransfertToLogs = exports.getERC20TransfertFromLogs = exports.getERC20TransfertLogs = exports.parseERC20TransferLog = void 0;
const ethers_1 = require("ethers");
const Stablecoin_json_1 = __importDefault(require("../../abis/Stablecoin.json"));
// formateur log ERC20
const iface = new ethers_1.Interface(Stablecoin_json_1.default);
// parseur log ERC20
const parseERC20TransferLog = (log) => __awaiter(void 0, void 0, void 0, function* () {
    // format logs
    const parsed = iface.parseLog({
        topics: log.topics,
        data: log.data,
    });
    // get ERC20 transfert information
    if (!parsed || parsed.name !== 'Transfer') {
        throw new Error('Invalid Transfer log');
    }
    const from = parsed.args[0];
    const to = parsed.args[1];
    const value = parsed.args[2];
    // check current block
    const currentBlock = yield log.getBlock();
    if (!currentBlock) {
        throw new Error(`Block not found: ${log.blockHash}`);
    }
    return {
        from,
        to,
        value,
        blockDate: new Date(currentBlock.timestamp * 1000).toDateString(),
        timestamp: currentBlock.timestamp,
        blockNumber: log.blockNumber,
        blockHash: log.blockHash
    };
});
exports.parseERC20TransferLog = parseERC20TransferLog;
// get ERC20 transfert fonction logs
const getERC20TransfertLogs = (provider, tokenAddress) => __awaiter(void 0, void 0, void 0, function* () {
    // get logs
    const logs = yield provider.getLogs({
        address: tokenAddress,
        topics: [(0, ethers_1.id)("Transfer(address,address,uint256)")]
    });
    // Parser chaque log et extraire les arguments
    const transferEvents = [];
    for (const log of logs) {
        try {
            const args = yield (0, exports.parseERC20TransferLog)(log);
            transferEvents.push(args);
        }
        catch (error) {
            // Ignorer les logs qui ne peuvent pas être parsés (mauvais format, etc.)
            console.warn('Failed to parse log:', log, error);
        }
    }
    // return
    return transferEvents;
});
exports.getERC20TransfertLogs = getERC20TransfertLogs;
// get ERC20 transfert from fonction logs
const getERC20TransfertFromLogs = (provider, tokenAddress, fromAddress) => __awaiter(void 0, void 0, void 0, function* () {
    // get logs
    const logs = yield provider.getLogs({
        address: tokenAddress,
        topics: [
            (0, ethers_1.id)("Transfer(address,address,uint256)"),
            (0, ethers_1.zeroPadValue)(fromAddress, 32)
        ]
    });
    // Parser chaque log et extraire les arguments
    const transferEvents = [];
    for (const log of logs) {
        try {
            const args = yield (0, exports.parseERC20TransferLog)(log);
            transferEvents.push(args);
        }
        catch (error) {
            // Ignorer les logs qui ne peuvent pas être parsés (mauvais format, etc.)
            console.warn('Failed to parse log:', log, error);
        }
    }
    // return
    return transferEvents;
});
exports.getERC20TransfertFromLogs = getERC20TransfertFromLogs;
// get ERC20 transfert to fonction logs
const getERC20TransfertToLogs = (provider, tokenAddress, toAddress) => __awaiter(void 0, void 0, void 0, function* () {
    // get logs
    const logs = yield provider.getLogs({
        address: tokenAddress,
        topics: [
            (0, ethers_1.id)("Transfer(address,address,uint256)"),
            null,
            (0, ethers_1.zeroPadValue)(toAddress, 32)
        ]
    });
    // Parser chaque log et extraire les arguments
    const transferEvents = [];
    for (const log of logs) {
        try {
            const args = yield (0, exports.parseERC20TransferLog)(log);
            transferEvents.push(args);
        }
        catch (error) {
            // Ignorer les logs qui ne peuvent pas être parsés (mauvais format, etc.)
            console.warn('Failed to parse log:', log, error);
        }
    }
    // return
    return transferEvents;
});
exports.getERC20TransfertToLogs = getERC20TransfertToLogs;
