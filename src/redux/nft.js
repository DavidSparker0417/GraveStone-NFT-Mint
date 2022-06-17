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
    count: 1,
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
      console.log("[REDUX] Updating mint count. ", action.payload);
      state.operate.count = action.payload;
    }
  }
});

export const {RefreshGeneral, UpdateMintCount} = nftSlice.actions;
export const getGeneral = (state) => state.nft.general;
export const getOperate = (state) => state.nft.operate;
export default nftSlice.reducer;