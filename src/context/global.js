import { createContext, useContext, useEffect, useState } from "react";
import { gstnGetStatistics } from "../contracts/nft";
import { RefreshGeneral } from "../redux/nft";
import { useWallet } from "./wallet";
import { useDispatch } from "react-redux";

export const GlobalContext = createContext();
export function GlobalProvider({ children }) {
  const wallet = useWallet();
  const dispatch = useDispatch();
  const [gstn, setGstn] = useState();

  // timer for refreshing nft info
  useEffect(() => {
    console.log("[DAVID] +++++++++++++ Initial Loading ++++++++++ ");
    const ac = new AbortController();

    async function fetchNftInfo () {
      const gstnInfo = await gstnGetStatistics(wallet.provider, wallet.account);
      // console.log("[DAVID] gstnInfo = ", gstnInfo);
      setGstn(gstnInfo);
      dispatch(RefreshGeneral(gstnInfo));
    }

    const callRefreshNftInfo = async () => {
      fetchNftInfo().then(() => {
        if (ac.signal.aborted === false) {
          setTimeout(() => callRefreshNftInfo(), 1000 * 3); // check every 3 seconds
        }
      });
    };

    callRefreshNftInfo();
    return () => ac.abort();
  }, [dispatch, wallet]);
  
  return (
    <GlobalContext.Provider value={{}}>
      {children}
      {/* <div style={{display:"none"}}>{gstn?.maxSupply}</div> */}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  const data = useContext(GlobalContext);
  return data;
}
