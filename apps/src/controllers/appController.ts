import { Request, Response } from 'express';
import { getProvider, getSigner, getConnectorVersion } from '../models/evm/EVMConnector';
import { getBalance, sendEthers } from '../models/evm/EVMUtilities';
import { getAdressList } from '../models/evm/EVMConf';
import { getERC20TransfertLogs, getERC20TransfertFromLogs, getERC20TransfertToLogs } from '../models/erc20/logsparser';
import { getAdressAndBalanceList, getAdressERC20BalanceAndRepairList } from '../models/depositToken/DepositTokenUtilities';
import DepositTokenWrapper from '../models/depositToken/DepositTokenWrapper';
import { depositTokenAddress, depositTokenOwnerAddress, getDepositTokenContractFromAdress } from '../models/depositToken/MyDepositToken';

export const getAdress = async (req: Request, res: Response) => {
  // get Ether.js version
  const etherjs_version = getConnectorVersion();

  // get provider
  const provider = getProvider();

  // get adress and key list
  const adressAndBalanceList = await getAdressAndBalanceList(provider);

  // log
  console.log("adressAndBalanceList type:", typeof adressAndBalanceList);
  console.log("isArray:", Array.isArray(adressAndBalanceList));
  console.log("value:", adressAndBalanceList);

  // get stablecoin to owner
  const depositToken = await getDepositTokenContractFromAdress(depositTokenOwnerAddress);

  // get stablecoin name
  const erc20_name = await depositToken.name();

  // get stablecoin symbol
  const erc20_symbol = await depositToken.symbol();

  // get stablecoin decimals
  const erc20_decimals = await depositToken.decimals();

  // get stablecoin total supply
  const erc20_total_supply = await depositToken.totalSupply();

  // get stablecoin paused
  const erc20_paused = await depositToken.paused();

  // get ERC20 transfert logs
  const erc20Transferts = await getERC20TransfertLogs(provider, depositTokenAddress);

  // render view
  res.render('home', { etherjs_version, adressAndBalanceList, erc20_name, erc20_symbol, erc20_decimals, erc20_total_supply, erc20_paused, erc20Transferts });
}

export const getMint = (req: Request, res: Response) => {

  const to = req.query.to as string;

  console.log('To adress:', to);

  res.render('mint', { to });
}

export const submitMint = async (req: Request, res: Response) => {
  
  // log receive data 
  const formData = req.body;
  console.log('Form data received:', formData);

  // get post data
  const to = formData.to;
  const amount = formData.amount;

  // mint amount token for adress
  const depositToken = await getDepositTokenContractFromAdress(depositTokenOwnerAddress);
  await depositToken.deposit(to, amount);

  // redirect to home
  res.json({ success: true });
}

export const getTransfert = (req: Request, res: Response) => {

  const from = req.query.from as string;

  res.render('transfert', { from });
}

export const submitTransfert = async (req: Request, res: Response) => {
  
  // log receive data 
  const formData = req.body;
  console.log('Form data received:', formData);

  // get post data
  const from = formData.from;
  const to = formData.to;
  const amount = formData.amount;

  // transfert amount token to adress
  const depositToken = await getDepositTokenContractFromAdress(from);
  const result = await depositToken.transfer(to, amount); // voir pb de l'adresse emission
  if (result) {
    // redirect to home
    res.json({ success: true });
  } else {
    res.send('Transfer fail!');
  }
}

export const getBurn = (req: Request, res: Response) => {

  const to = req.query.to as string;

  console.log('To adress:', to);

  res.render('burn', { to });
}

export const submitBurn = async (req: Request, res: Response) => {
  
  // log receive data 
  const formData = req.body;
  console.log('Form data received:', formData);

  // get post data
  const to = formData.to;
  const amount = formData.amount;

  // burn amount token for adress
  const depositToken = await getDepositTokenContractFromAdress(depositTokenOwnerAddress);
  await depositToken.withdraw(to, amount);

  // redirect to stablecoin
  res.json({ success: true });
}

// DepositToken
export const getDepositToken = async (req: Request, res: Response) => {
  // get Ether.js version
  const etherjs_version = getConnectorVersion();

  // get stablecoin to owner
  const depositToken = await getDepositTokenContractFromAdress(depositTokenOwnerAddress);

  // get stablecoin name
  const erc20_name = await depositToken.name();

  // get stablecoin symbol
  const erc20_symbol = await depositToken.symbol();

  // get stablecoin decimals
  const erc20_decimals = await depositToken.decimals();

  // get stablecoin total supply
  const erc20_total_supply = await depositToken.totalSupply();

  // get stablecoin paused
  const erc20_paused = await depositToken.paused();

  // set erc20 balance and repair

  // get provider
  const provider = getProvider();

  // get adress and key list
  const adressERC20BalanceAndRepairList = await getAdressERC20BalanceAndRepairList(provider);

  // debug
  console.log("adressAndBalanceList type:", typeof adressERC20BalanceAndRepairList);
  console.log("isArray:", Array.isArray(adressERC20BalanceAndRepairList));
  console.log("value:", adressERC20BalanceAndRepairList);

  // get ERC20 transfert logs
  const erc20Transferts = await getERC20TransfertLogs(provider, depositTokenAddress);

  res.render('stablecoin', { etherjs_version, erc20_name, erc20_symbol, erc20_decimals, erc20_total_supply, erc20_paused, adressERC20BalanceAndRepairList, erc20Transferts });
}

// switch mint status
export const switchtMintStatus = async (req: Request, res: Response) => {
  
  // switch mint status
  const depositToken = await getDepositTokenContractFromAdress(depositTokenOwnerAddress);
  const paused = await depositToken.paused();
  if (paused)
    await depositToken.unpause();
  else
    await depositToken.pause();

  // redirect to vue depositToken.ejs
  res.redirect('/home');
}

// get ERC20 transfert event
export const getErc20TransfertEvent = async (req: Request, res: Response) => {

  // get address 
  const address = req.query.address as string;

  // get provider
  const provider = getProvider();

  // get ERC20 transfert from logs
  const erc20TransfertsFrom = await getERC20TransfertFromLogs(provider, depositTokenAddress, address);

  // getERC20TransfertToLogs
  const erc20TransfertsTo = await getERC20TransfertToLogs(provider, depositTokenAddress, address);

  res.render('erc20TransfertEvent', { erc20TransfertsFrom, erc20TransfertsTo });
}
