// import { ethers } from 'ethers';
import Web3 from 'web3';
// import HDWalletProvider from '@truffle/hdwallet-provider';
import { routerAbi, tokenAbi } from './default-abi.js';

export const UINT256_MAX = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"
/***************************************/
/*          wallet functions           */
/***************************************/
function dsWalletGetProvider(net, connector) {
  const { ethereum } = window;

  if (!ethereum || !ethereum.providers) {
    return ethereum;
  }
  let provider
  switch (connector) {
    case 'metamask':
      provider = ethereum.providers.find(({ isMetaMask }) => isMetaMask)
      break;
    default:
      return null;
  }
  if (provider)
  {
    console.log("[dsweb3] provider = ", provider)
    ethereum.setSelectedProvider(provider)
  }
  return ethereum
}

export async function dsWalletConnectInjected(net, connector) {
  let ethereum = dsWalletGetProvider(net, connector)
  // if (!ethereum)
  //   throw ({message: 'No wallet installed on your browser'})
  const strChainId = '0x' + net.chainId.toString(16);
  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: strChainId }]
    })
    await ethereum.request({ method: 'eth_requestAccounts' });
  } catch (error) {
    if (error.code === 4902) {
      await dsWalletAddChain(net)
      await ethereum.request({ method: 'eth_requestAccounts' });
    } else {
      throw error
    }
  }
}

export function dsWalletGetTrimedAccountName(account) {
  return account.substr(2, 4) + '...' + account.substr(-4, 4);
}

export async function dsWalletAddChain(net) {
  const ethereum = window.ethereum
  const chainId = "0x" + net.chainId.toString(16)
  const data = [{
    chainId: chainId,
    chainName: net.chainName,
    nativeCurrency: net.nativeCurrency,
    rpcUrls: [net.rpc],
    blockExplorerUrls: [net.blockExplorerUrl]
  }]
  await ethereum.request({ method: 'wallet_addEthereumChain', params: data })
}

export async function dsWalletAccountFromProvider(provider) {
  const web3 = dsWeb3Get(provider);
  const accounts = await web3.eth.getAccounts();
  return accounts[0];
}

export function dsWalletTrimedAccount(account) {
  return account.slice(0, 4) + "..." + account.slice(-4);
}
/***************************************/
/*          ethers.js functions        */
/***************************************/
// check if wallet address valid
export function dsWeb3IsAddrValid(address) {
  return Web3.utils.isAddress(address);
}

// // get web3 provider
// export function dsEthersGetWeb3Provider() {
//   if (!window.ethereum) {
//     alert("Metamask is not installed.")
//     return null;
//   }
//   const provider = new ethers.providers.Web3Provider(window.ethereum);
//   return provider;
// }

// // get contract object 
// export function dsEthersGetContract(addr, abi, isTrReq) {
//   if (!window.ethereum) {
//     alert("Metamask is not installed.")
//     return;
//   }
//   const provider = new ethers.providers.Web3Provider(window.ethereum);
//   let contract;
//   if (isTrReq === true) {
//     const signer = provider.getSigner();
//     contract = new ethers.Contract(addr, abi, signer);
//   } else {
//     contract = new ethers.Contract(addr, abi, provider);
//   }
//   return contract;
// }

/***************************************/
/*          web3.js  functions         */
/***************************************/
// export function dsWeb3GetSignedContract(chainId, privateKey, contractAbi, contractAddr) {
//   const provider = new HDWalletProvider(privateKey, chainId);
//   const web3 = new Web3(provider);
//   const contract = new web3.eth.Contract(contractAbi, contractAddr);
//   return contract;
// }

/**
 * Get web3 from provider
 * @param rpc provider
 * @returns web3
 */
export function dsWeb3Get(provider) {
  let web3;
  if (typeof provider === 'undefined')
    web3 = new Web3(window.web3.currentProvider);
  else
    web3 = new Web3(provider);
  return web3;
}

// get web3 contract
export function dsWeb3GetContract(provider, address, abi) {
  const web3 = dsWeb3Get(provider)
  const contract = new web3.eth.Contract(abi, address);
  return contract;
}

// get current account
export async function dsWeb3GetCurrentAccount() {
  const web3 = new Web3(window.web3.currentProvider);
  const accounts = await web3.eth.getAccounts();
  return accounts[0];
}

// get account address from private key
export function dsWeb3GetAddressFromPrivKey(provider, privKey) {
  const web3 = dsWeb3Get(provider)
  const address = web3.eth.accounts.privateKeyToAccount(privKey).address
  return address
}

// get estimate gas
export async function dsWeb3EstimateGas(provider, privKey, transaction, eth) {
  const web3 = dsWeb3Get(provider)
  const account = privKey === null
    ? provider.selectedAddress
    : web3.eth.accounts.privateKeyToAccount(privKey).address
  const gas = await transaction.estimateGas({ from: account, value: eth })
  return gas;
}

// send transaction
export async function dsWeb3SendTransaction(provider, privateKey, _account, transaction, eth) {
  const web3 = dsWeb3Get(provider)
  const gasPrice = await web3.eth.getGasPrice()
  const account = privateKey === null
    ? _account
    : web3.eth.accounts.privateKeyToAccount(privateKey).address
  const gas = await transaction.estimateGas({ from: account, value: eth })
  if (privateKey === null) {
    const trPending = transaction.send({
      from: account,
      value: eth,
      gas: gas
    })
    return trPending
  } else {
    const options = {
      to: transaction._parent._address,
      data: transaction.encodeABI(),
      gas: gas,
      gasPrice: gasPrice,
      value: eth
    }
    const signed = await web3.eth.accounts.signTransaction(options, privateKey)
    const trResult = await web3.eth.sendSignedTransaction(signed.rawTransaction)
    const spentGas = trResult.gasUsed * gasPrice
    // console.log(`[DSWEB3] dsWeb3SendTransaction :: transaction result = `, spentGas)
    return spentGas
  }
}

// get eth balance 
export async function dsWeb3GetBalance(provider, address) {
  const web3 = dsWeb3Get(provider)
  return await web3.eth.getBalance(address)
}

// get token balance
export async function dsWeb3GetTokenBalance(token, account, provider) {
  let contract
  if (typeof token === 'string') {
    contract = dsWeb3GetContract(provider, token, tokenAbi)
  } else {
    contract = token
  }
  const balance = await contract.methods.balanceOf(account).call();
  return balance
}

// check if allowed to approve for token
export async function dsWeb3TokenApproveCheck(provider, token, account, spender) {
  const contract = dsWeb3GetContract(provider, token, tokenAbi);
  const allowance = await contract.methods.allowance(account, spender).call();
  return allowance !== "0";
}

// approve maximum value to specific address for proper token
export async function dsWeb3TokenApprove(provider, privKey, token, account, spender) {
  const contract = dsWeb3GetContract(provider, token, tokenAbi);
  const transaction = contract.methods.approve(spender, UINT256_MAX);
  return dsWeb3SendTransaction(provider, privKey, account, transaction);
}

// send coin
export async function dsWeb3SendCoin(provider, pKey, to, amount) {
  const web3 = dsWeb3Get(provider)
  const options = {
    to: to,
    gas: 30000,
    value: amount
  }
  const signed = await web3.eth.accounts.signTransaction(options, pKey)
  await web3.eth.sendSignedTransaction(signed.rawTransaction)
}

// get token price
export async function dsWeb3GetTokenPrice(provider, token, stableCoin) {
  let contract = dsWeb3GetContract(provider, token, tokenAbi)
  let router
  // get router address
  await contract.methods.router().call()
    .then(function (recipent) {
      router = recipent
    })
    .catch(function (error) {
      const msg = dsErrMsgGet(error.message)
      console.log(msg)
    })

  if (router === undefined)
    return undefined

  // get price
  let price
  contract = dsWeb3GetContract(provider, router, routerAbi)
  await contract.methods
    .getAmountsOut(dsBnEthToWei(1), [token, stableCoin]).call()
    .then(function (recipent) {
      price = dsBnWeiToEth(recipent[1])
    })
    .catch(function (error) {
      const msg = dsErrMsgGet(error.message)
      console.log(msg)
    })

  return price
}

export async function dsWeb3GetTokenDecmials(provider, tokenAddr) {
  const tokenContract = dsWeb3GetContract(provider, tokenAddr, tokenAbi)
  return await tokenContract.methods.decimals().call()
}

export async function dsWeb3TokenSymbol(provider, tokenAddr) {
  const contract = dsWeb3GetContract(provider, tokenAddr, tokenAbi)
  return await contract.methods.symbol().call()
}

// get token price
export async function dsWeb3GetTokenPriceByRouter(provider, router, token, stableCoin, _decimals) {
  let priceInWeth
  let price
  let decimals = _decimals
  if (decimals === undefined)
    decimals = await dsWeb3GetTokenDecmials(provider, token)

  const contract = dsWeb3GetContract(provider, router, routerAbi)
  const weth = await contract.methods.WETH().call()
  priceInWeth = await contract
    .methods
    .getAmountsOut(dsBnEthToWei("1", decimals), [token, weth]).call()

  const amounts = await contract.methods
    .getAmountsOut(priceInWeth[1], [weth, stableCoin]).call()

  decimals = parseInt(await dsWeb3GetTokenDecmials(provider, stableCoin))
  price = dsBnWeiToEth(amounts[1], decimals)
  return price
}

// get token price
export async function dsWeb3GetStableBalance(provider, account, router, stableCoin) {
  const balance = await dsWeb3GetBalance(provider, account)
  if (balance === "0")
    return "0"
  const contract = dsWeb3GetContract(provider, router, routerAbi)
  const weth = await contract.methods.WETH().call()
  const amounts = await contract.methods.getAmountsOut(balance, [weth, stableCoin]).call()
  const stableDecimals = parseInt(await dsWeb3GetTokenDecmials(provider, stableCoin))
  const stableBalance = dsBnWeiToEth(amounts[1], stableDecimals)
  // console.log("[HEAL] STABLE BALANCE = ", stableBalance)
  return stableBalance
}

/***************************************/
/*       bignumber  functions          */
/***************************************/
export const DECIMAL_DEFAULT = 18;
function getEthUnit(accuracy) {
  let mapping = Web3.utils.unitMap;
  let valuePrecision = "";
  for (var i = 0; i < accuracy; i++) {
    valuePrecision = valuePrecision + "0";
  }
  let unitMapValue = 1 + valuePrecision;

  for (const key in mapping) {
    if (mapping[key] === unitMapValue) {
      return key;
    }
  }
  return null;
}

export function dsBnWeiToEth(wei, decimals, precision) {
  let ethVal;
  if (typeof decimals === 'undefined')
    ethVal = Web3.utils.fromWei(wei, 'ether');
  else if (typeof decimals === 'string') {
    ethVal = Web3.utils.fromWei(wei, decimals);
  }
  else if (decimals === 18)
    ethVal = Web3.utils.fromWei(wei, 'ether');
  else {
    const unitEth = getEthUnit(decimals);
    ethVal = Web3.utils.fromWei(wei, unitEth);
  }

  const v = parseFloat(ethVal);
  if (typeof precision === 'undefined') {
    if (v < 1)
      precision = 8;
    else
      precision = 4;
  }

  ethVal = v.toFixed(precision).replace(/\.?0*$/, '');
  return parseFloat(ethVal);
}

export function dsBnEthToWei(eth, decimals) {
  let weiVal;

  if (typeof eth === 'undefined')
    return 0;

  if (typeof decimals === 'undefined') {
    weiVal = Web3.utils.toWei(eth, 'ether');
  }
  else {
    const unitEth = getEthUnit(decimals);
    weiVal = Web3.utils.toWei(parseFloat(eth).toFixed(decimals), unitEth);
  }

  return weiVal;
}

/***************************************/
/*       Error message functions       */
/***************************************/
export function dsErrMsgGet(message) {
  const prefix = 'Internal JSON-RPC error.'
  let msg = message
  if (msg.startsWith(prefix)) {
    const str = msg.replace(prefix, '').trim()
    msg = JSON.parse(str).message
  }
  return msg
}