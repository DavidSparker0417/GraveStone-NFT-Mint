import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { WalletProvider } from "./context/wallet";
import { GlobalProvider } from "./context/global";
import { Provider } from "react-redux";
import store from "./redux/store";
import UIProvider from "./context/ui";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <UIProvider>
        <WalletProvider>
          <GlobalProvider>
            <ThemeProvider theme={theme}>
              <App />
            </ThemeProvider>
          </GlobalProvider>
        </WalletProvider>
      </UIProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
