import { createContext, useCallback, useContext, useState } from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { dsWalletAccountFromProvider } from "../ds-lib/ds-web3";
import {TARGET_NET} from "../config/config";
import { toast } from "react-toastify";

export const WalletContext = createContext();

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: "691246788d1149f2a95f82cd3a893f72",
    },
  },
};

const web3Modal = new Web3Modal({
  providerOptions,
});

export const WalletProvider = ({ children }) => {
  const [provider, setProvider] = useState(TARGET_NET.rpc);
  const [account, setAccount] = useState();

  const isValidNet = useCallback(() => {
    if (!provider || typeof provider === "string")
      return true;
    const targetChain = "0x" + TARGET_NET.chainId.toString(16);
    return provider.chainId === targetChain;
  }, [provider]);

  async function connect() {
    try {
      // connect
      const _provider = await web3Modal.connect();
      console.log("[WALLET] Modal connected ", _provider);
      setProvider(_provider);
      // get account
      const account = await dsWalletAccountFromProvider(_provider);
      setAccount(account);

      // events
      _provider.on("connect", (info) => {
        console.log("[WALLET] connected! ", info);
        setProvider(_provider);
      });

      _provider.on("chainChanged", (chainId) => {
        console.log("[WALLET] Chain Changed! ", chainId, _provider.chainId, provider);
        setProvider(_provider);
        const targetChain = "0x" + TARGET_NET.chainId.toString(16);
        if (chainId === targetChain) {
          toast.success("Successfully connected!");
        } else {
          toast.error(`Wrong network! Please turn into ${TARGET_NET.chainName} network`);
        }
      });

      _provider.on("accountsChanged", (accounts) => {
        console.log("[WALLET] Account changed! ", accounts);
        setAccount(accounts[0]);
        if (!accounts.length)
          setProvider(TARGET_NET.rpc);
      });

      _provider.on("disconnect", (err) => {
        console.log("[WALLET] Disconnect! err = ", err);
        setProvider(TARGET_NET.rpc);
      });

    } catch (e) {
      console.log("[WALLET] Exception occured. err = ", e.message);
    }
  }

  const disconnect = useCallback(async() =>{
    if (provider?.close)
      await provider.close();
    
    await web3Modal.clearCachedProvider();
    setAccount(undefined);
    setProvider(TARGET_NET.rpc);
  }, [provider]);

  return (
    <WalletContext.Provider
      value={{
        provider,
        account,
        connect,
        disconnect,
        isValidNet
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const data = useContext(WalletContext);
  return data;
};
