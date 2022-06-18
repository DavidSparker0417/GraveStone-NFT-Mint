import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  general: {
    maxSupply: 0,
    totalSupply: 0,
    mintPrice: 0,
    round : 0,
    maxMintPerWallet: 0,
    isWhitelist: false,
    isAllowedToMint: false,
    balance: 0,
    phase1 : {
      cost: "0",
      maxPerWallet: 0,
      maxPerTrx: 0,
      active: false,
    },
    phase2 : {
      cost: "0",
      maxPerWallet: 0,
      maxPerTrx: 0,
      active: false,
    },
  },
  operate : {
    count: 0,
  }
};

const nftSlice = createSlice({
  name: "DEGENs-NFT",
  initialState,
  reducers: {
    RefreshGeneral (state, action) {
      state.general = action.payload;
    },

    UpdateMintCount (state, action) {
      state.operate.count = action.payload;
    },

    UpdateBalance(state, action) {
      console.log("[REDUX] Updating balance. ", action.payload);
      state.general.balance = action.payload;
    }
  }
});

export const {RefreshGeneral, UpdateMintCount, UpdateBalance} = nftSlice.actions;
export const getGeneral = (state) => state.nft.general;
export const getOperate = (state) => state.nft.operate;
export default nftSlice.reducer;