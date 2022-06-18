import { TARGET_NET } from "../config/config";
import { dsWeb3GetContract, dsWeb3SendTransaction } from "../ds-lib/ds-web3";
import gstnAbi from "./abi/RipEthereum.json";
import BigNumber from "bignumber.js";

function gstnGetContract(provider) {
  const contract = dsWeb3GetContract(provider, TARGET_NET.gravestone, gstnAbi);
  return contract;
}
export async function gstnGetStatistics(provider, account) {
  let gstnInfo = {};
  const contract = gstnGetContract(provider);
  gstnInfo.maxSupply = await contract.methods.maxSupply().call();
  gstnInfo.totalSupply = await contract.methods.totalSupply().call();
  gstnInfo.mintPrice = await contract.methods.getCost().call();
  const isRoundOne = await contract.methods.getIsPhaseOne().call();
  gstnInfo.round = isRoundOne ? 1 : 2;
  gstnInfo.maxMintPerOneTime = await contract.methods.maxMintAmountPerTransaction().call();
  gstnInfo.maxMintPerWallet = await contract.methods.getMaxMintAmountPerWallet().call();
  gstnInfo.isWhitelist = await contract.methods.isWhitelistOnly().call();
  gstnInfo.isAllowedToMint = await contract.methods.whitelisted(account).call();
  if (account)
    gstnInfo.balance = await contract.methods.balanceOf(account).call();
  let phase1 = {};
  phase1.cost = await contract.methods.phaseOneCost().call();
  phase1.maxPerTrx = await contract.methods.maxMintAmountPerWalletNonGotRektPhaseOne().call();
  phase1.active = isRoundOne;
  gstnInfo.phase1 = phase1;

  let phase2 = {};
  phase2.cost = await contract.methods.phaseTwoCost().call();
  phase2.maxPerWallet = await contract.methods.maxMintAmountPerWalletPhaseTwo().call();
  phase2.active = !isRoundOne;

  gstnInfo.phase2 = phase2;  
  // console.log("[GSTN] get statistics :: ", gstnInfo);
  return gstnInfo;
}

export async function gstnMintNft(provider, account, price, amount) {
  console.log(`[GSTN] minting :: price = ${price}, amount=${amount}`);
  const contract = gstnGetContract(provider);
  const isPause = await contract.methods.paused().call();
  if (isPause)
    throw new Error("Not available to mint for now!");
  const isWlState = await contract.methods.isWhitelistOnly().call();
  const isAllowedToMint = await contract.methods.whitelisted(account).call();
  if (isWlState && !isAllowedToMint)
    throw new Error("Not allowed to mint!");
  const bnPrice = new BigNumber(price);
  const payment = bnPrice.multipliedBy(amount);
  const transaction = contract.methods.mint(amount);
  await dsWeb3SendTransaction(provider, null, account, transaction, payment);
}

export async function gstnNftBalance(provider, account) {
  const contract = gstnGetContract(provider);
  const balance = await contract.methods.balanceOf(account).call();
  return balance;
}