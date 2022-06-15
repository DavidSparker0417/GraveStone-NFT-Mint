import { TARGET_NET } from "../config/config";
import { dsWeb3GetContract, dsWeb3SendTransaction } from "../ds-lib/ds-web3";
import degenAbi from "./abi/DEGENsRock.json";
import BigNumber from "bignumber.js";

function degenGetContract(provider) {
  const contract = dsWeb3GetContract(provider, TARGET_NET.degenNft, degenAbi.abi);
  return contract;
}
export async function degenGetStatistics(provider) {
  let degenInfo = {};
  const contract = degenGetContract(provider);
  degenInfo.maxSupply = await contract.methods.maxSupply().call();
  degenInfo.totalSupply = await contract.methods.totalSupply().call();
  degenInfo.mintPrice = await contract.methods.getCost().call();
  const isRoundOne = await contract.methods.getIsPhaseOne().call();
  degenInfo.round = isRoundOne ? 1 : 2;
  degenInfo.maxMintPerOneTime = await contract.methods.getMaxMintAmountPerTransaction().call();
  degenInfo.maxMintPerWallet = await contract.methods.getMaxMintAmountPerWallet().call();
  
  let phase1 = {};
  phase1.cost = await contract.methods.phaseOneCost().call();
  phase1.maxPerWallet = await contract.methods.maxMintAmountPerWalletPhaseOne().call();
  phase1.maxPerTrx = await contract.methods.maxMintAmountPerTransactionPhaseOne().call();
  phase1.active = isRoundOne;
  degenInfo.phase1 = phase1;

  let phase2 = {};
  phase2.cost = await contract.methods.phaseTwoCost().call();
  phase2.maxPerWallet = await contract.methods.maxMintAmountPerWalletPhaseTwo().call();
  phase2.maxPerTrx = await contract.methods.maxMintAmountPerTransactionPhaseTwo().call();
  phase2.active = !isRoundOne;

  degenInfo.phase2 = phase2;  
  console.log("[DEGEN] get statistics :: ", degenInfo);
  return degenInfo;
}

export async function degenMintNft(provider, account, price, amount) {
  const contract = degenGetContract(provider);
  console.log(`[DEGEN] minting :: price = ${price}, amount=${amount}`);
  const bnPrice = new BigNumber(price);
  const payment = bnPrice.multipliedBy(amount);
  const transaction = contract.methods.mint(amount);
  await dsWeb3SendTransaction(provider, null, account, transaction, payment);
}