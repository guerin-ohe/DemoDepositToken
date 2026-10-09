"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appController_1 = require("../controllers/appController");
const router = express_1.default.Router();
// default route
router.get('/', appController_1.getAdress);
// Adress and balance
router.get('/home', appController_1.getAdress);
// Mint
router.get('/mint', appController_1.getMint);
router.post('/mint_submit', appController_1.submitMint);
// Transfert
router.get('/transfert', appController_1.getTransfert);
router.post('/transfert_submit', appController_1.submitTransfert);
// Burn
router.get('/burn', appController_1.getBurn);
router.post('/burn_submit', appController_1.submitBurn);
// Stablecoin
router.get('/depositToken', appController_1.getDepositToken);
// Mint switch
router.get('/switch_mint', appController_1.switchtMintStatus);
// ERC20 Transfert Event
router.get('/erc20TransfertEvent', appController_1.getErc20TransfertEvent);
exports.default = router;
