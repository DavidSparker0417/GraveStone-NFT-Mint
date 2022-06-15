import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  general: {
    maxSupply: 0,
    totalSupply: 0,
    mintPrice: 0,
    round : 0,
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
    state: "initial"
  }
};

const nftSlice = createSlice({
  name: "DEGENs-NFT",
  initialState,
  reducers: {
    RefreshGeneral (state, action) {
      state.general = action.payload;
    }
  }
});

export const {RefreshGeneral} = nftSlice.actions;
export const getGeneral = (state) => state.nft.general;
export default nftSlice.reducer;