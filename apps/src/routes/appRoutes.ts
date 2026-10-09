import express from 'express';
import { getAdress, getMint, submitMint, getTransfert, submitTransfert, getBurn, submitBurn, getDepositToken, switchtMintStatus, getErc20TransfertEvent } from '../controllers/appController';

const router = express.Router();

// default route
router.get('/', getAdress);

// Adress and balance
router.get('/home', getAdress);

// Mint
router.get('/mint', getMint);
router.post('/mint_submit', submitMint);

// Transfert
router.get('/transfert', getTransfert);
router.post('/transfert_submit', submitTransfert);

// Burn
router.get('/burn', getBurn);
router.post('/burn_submit', submitBurn);


// Stablecoin
router.get('/depositToken', getDepositToken);

// Mint switch
router.get('/switch_mint', switchtMintStatus);

// ERC20 Transfert Event
router.get('/erc20TransfertEvent', getErc20TransfertEvent);

export default router;
