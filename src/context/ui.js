import { createContext, useContext, useState } from "react";
import DGBackdrop from "../components/DGBackdrop";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const UIContext = createContext();

export default function UIProvider({children}) {
  const [loading, setLoading] = useState(false);
  const [loadingDesc, setLoadingDesc] = useState();

  function setLoadingStatus(isLoading, description) {
    setLoading(isLoading);
    setLoadingDesc(isLoading ? description : undefined);
  }
  return(
    <UIContext.Provider value={{setLoading: setLoadingStatus}}>
      {children}
      <DGBackdrop open={loading} description={loadingDesc}/>
      <ToastContainer
        position="bottom-right"
        theme='dark'
        style = {{
          width: "fit-content",
        }}
      />
    </UIContext.Provider>
  )
}

export function useUI() {
  const data = useContext(UIContext);
  return data;
}