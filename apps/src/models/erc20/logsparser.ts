import { Interface, Provider, id, zeroPadValue } from "ethers";
import type { Log } from "ethers";
import type { EventLog } from "ethers";

import STABLECOIN_ABI from '../../abis/Stablecoin.json';

// Arguments décodus de l'événement Transfer
export interface ERC20TransferArgs {
  from: string;
  to: string;
  value: bigint;
  blockDate: string;
  timestamp: number;
  blockNumber: number;
  blockHash: string;
}

// Type pratique pour un log Transfer ERC20
export type ERC20TransferEventLog = EventLog & {
  args: ERC20TransferArgs;
  eventName: "Transfer";
}

// formateur log ERC20
const iface = new Interface(STABLECOIN_ABI);

// parseur log ERC20
export const parseERC20TransferLog = async(log: Log): Promise<ERC20TransferArgs> => {

  // format logs
  const parsed = iface.parseLog({
    topics: log.topics,
    data: log.data,
  });

  // get ERC20 transfert information
  if (!parsed || parsed.name !== 'Transfer') {
    throw new Error('Invalid Transfer log');
  }

  const from = parsed.args[0] as string;
  const to = parsed.args[1] as string;
  const value = parsed.args[2] as bigint;

  // check current block
  const currentBlock = await log.getBlock();
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
}

// get ERC20 transfert fonction logs
export const getERC20TransfertLogs = async (provider: Provider, tokenAddress: string) : Promise<Array<ERC20TransferArgs>> => {

  // get logs
  const logs = await provider.getLogs({
    address: tokenAddress,
    topics: [id("Transfer(address,address,uint256)")]
  });

  // Parser chaque log et extraire les arguments
  const transferEvents: ERC20TransferArgs[] = [];
  for (const log of logs) {
    try {
      const args = await parseERC20TransferLog(log);
      transferEvents.push(args);
    } catch (error) {
      // Ignorer les logs qui ne peuvent pas être parsés (mauvais format, etc.)
      console.warn('Failed to parse log:', log, error);
    }
  }

  // return
  return transferEvents;
}

// get ERC20 transfert from fonction logs
export const getERC20TransfertFromLogs = async (provider: Provider, tokenAddress: string, fromAddress: string) : Promise<Array<ERC20TransferArgs>> => {
  
  // get logs
  const logs = await provider.getLogs({
    address: tokenAddress,
    topics: [
      id("Transfer(address,address,uint256)"),
      zeroPadValue(fromAddress, 32)
    ]
  });

  // Parser chaque log et extraire les arguments
  const transferEvents: ERC20TransferArgs[] = [];
  for (const log of logs) {
    try {
      const args = await parseERC20TransferLog(log);
      transferEvents.push(args);
    } catch (error) {
      // Ignorer les logs qui ne peuvent pas être parsés (mauvais format, etc.)
      console.warn('Failed to parse log:', log, error);
    }
  }

  // return
  return transferEvents;
}

// get ERC20 transfert to fonction logs
export const getERC20TransfertToLogs = async (provider: Provider, tokenAddress: string, toAddress: string) : Promise<Array<ERC20TransferArgs>> => {
  
  // get logs
  const logs = await provider.getLogs({
    address: tokenAddress,
    topics: [
      id("Transfer(address,address,uint256)"),
      null,
      zeroPadValue(toAddress, 32)
    ]
  });

  // Parser chaque log et extraire les arguments
  const transferEvents: ERC20TransferArgs[] = [];
  for (const log of logs) {
    try {
      const args = await parseERC20TransferLog(log);
      transferEvents.push(args);
    } catch (error) {
      // Ignorer les logs qui ne peuvent pas être parsés (mauvais format, etc.)
      console.warn('Failed to parse log:', log, error);
    }
  }

  // return
  return transferEvents;
}