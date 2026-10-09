"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseERC20TransferLog = parseERC20TransferLog;
const ethers_1 = require("ethers");
const Stablecoin_json_1 = __importDefault(require("../../abis/Stablecoin.json"));
const iface = new ethers_1.Interface(Stablecoin_json_1.default);
function parseERC20TransferLog(log) {
    const parsed = iface.parseLog({
        topics: log.topics,
        data: log.data,
    });
    // parsed.name === "Transfer"
    // parsed.args est { from, to, value } + accès par index
    return {
        from: parsed.args,
        to: parsed.args,
        value: parsed.args
    };
}
