import { createContext, useContext, useEffect } from "react";
import { degenGetStatistics } from "../contracts/nft";
import { RefreshGeneral } from "../redux/nft";
import { useWallet } from "./wallet";
import { useDispatch } from "react-redux";

export const GlobalContext = createContext();
export function GlobalProvider({ children }) {
  const wallet = useWallet();
  const dispatch = useDispatch();

  // timer for refreshing nft info
  useEffect(() => {
    console.log("[DAVID] +++++++++++++ Initial Loading ++++++++++ ");
    const ac = new AbortController();

    async function fetchNftInfo () {
      const degenInfo = await degenGetStatistics(wallet.provider);
      console.log("[DAVID] degenInfo = ", degenInfo);
      dispatch(RefreshGeneral(degenInfo));
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
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  const data = useContext(GlobalContext);
  return data;
}
