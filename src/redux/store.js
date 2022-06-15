import {configureStore} from "@reduxjs/toolkit";
import nftReducer from "./nft";

const reducer = {
  nft: nftReducer
}

const store = configureStore({
  reducer: reducer,
});

export default store;