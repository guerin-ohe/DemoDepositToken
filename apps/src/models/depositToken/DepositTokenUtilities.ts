import { Provider } from "ethers";
import { getBalance } from '../evm/EVMUtilities';
import { getAdressList } from '../evm/EVMConf';
import { getDepositTokenContractFromAdress } from '../../models/depositToken/MyDepositToken';

// tuple adress and solde
type AdressAndBalance = [adress: string, eth_balance: bigint, erc20_balance: number];
type BalanceList = AdressAndBalance[];

// get adress and adress balance list
export const getAdressAndBalanceList = async (provider: Provider): Promise<BalanceList> => {
  
    // get Adresss list
  const adressAndKeyList = getAdressList();

  // map getSolde on adress list
  const adressAndBalanceList = await Promise.all(
    adressAndKeyList.map(async ([adress, key]) => {
      const eth_balance = await getBalance(provider, adress);
      const depositToken = await getDepositTokenContractFromAdress(adress);
      const erc20_balance = await depositToken.balanceOf(adress);
      const result: AdressAndBalance = [adress, eth_balance, erc20_balance];
      return result;
    }));
  
  return adressAndBalanceList;
}

// tuple adress and solde
type AdressERC20BalanceAndRepair = [adress: string, erc20_balance: number, erc20_repair: number];
type ERC20RepairList = AdressERC20BalanceAndRepair[];

// get adress, erc20 balance and repair list
export const getAdressERC20BalanceAndRepairList = async (provider: Provider): Promise<ERC20RepairList> => {

  // get Adresss list
  const adressAndKeyList = getAdressList();

  // map balanceOf and rerpair on adress list
  const adressERC20BalanceAndRepairList = await Promise.all(
    adressAndKeyList.map(async ([adress, key]) => {
      const depositToken = await getDepositTokenContractFromAdress(adress);
      const erc20_balance = await depositToken.balanceOf(adress);
      const erc20_total_supply = await depositToken.totalSupply();
      var erc20_repair = 0;
      if (erc20_total_supply > 0) 
        erc20_repair = Number(erc20_balance) * 100 / Number(erc20_total_supply); 
      const result: AdressERC20BalanceAndRepair = [adress, erc20_balance, erc20_repair];
      return result;
    }));
  
  return adressERC20BalanceAndRepairList;
}
