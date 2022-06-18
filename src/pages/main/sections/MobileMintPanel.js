import { Grid, Typography, styled, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import GSTypography from "../../../components/GSTypography";
import { useWallet } from "../../../context/wallet";
import { getGeneral, getOperate, UpdateMintCount } from "../../../redux/nft";

const MintText = styled(Typography)(() => {
  return {
    color: "white",
    fontSize: "6vw",
    fontFamily: "Back-Issues-BB-Bold-Italic",
  };
});

function MintControlButton({ children, handleClick, ...rest }) {
  return (
    <Button
      onClick={handleClick}
      sx={{
        height: "80%",
        color: "white",
        fontSize: "6vw",
        minWidth: "0",
        padding: "0 24px",
        fontFamily: "Back-Issues-BB-Bold-Italic",
      }}
      {...rest}
    >
      {children}
    </Button>
  );
}

function MintController({handleMint}) {
  const { maxMintPerOneTime, maxMintPerWallet, balance } = useSelector(getGeneral);
  const {count} = useSelector(getOperate);
  const dispatch = useDispatch();

  function decreaseCount() {
    const newCount = count - 1;
    if (newCount < 0) return;
    dispatch(UpdateMintCount(newCount));
  }
  function increaseCount() {
    const availableToMint = parseInt(maxMintPerWallet) > parseInt(balance) ? parseInt(maxMintPerWallet) - parseInt(balance) : 0;
    const limit = Math.min(availableToMint, maxMintPerOneTime);
    const newCount = count + 1;
    if (newCount <= limit)
      dispatch(UpdateMintCount(newCount));
  }
  return (
    <>
      <Grid item height="60%" textAlign="center" container alignItems="center">
        <Grid
          container
          justifyContent="center"
          fontFamily="Back-Issues-BB-Bold-Italic"
        >
          <MintControlButton mr={2} handleClick={decreaseCount}>
            -
          </MintControlButton>
          <MintText component="span">{count}</MintText>
          <MintControlButton onClick={increaseCount}>+</MintControlButton>
        </Grid>
      </Grid>
      <Grid item height="40%" container alignItems="center" justifyContent="center">
        <MintControlButton handleClick={handleMint} disabled={count===0}>MINT NOW</MintControlButton>
      </Grid>
    </>
  );
}

export default function MobileMintPanel({ handleMint, ...rest }) {
  const nftState = useSelector(getGeneral);

  return (
    <>
      <Grid height="60%" container alignItems="center" justifyContent="center">
        <MintController handleMint = {handleMint}/>
      </Grid>
      <Grid height="40%" container alignItems="center" justifyContent="center">
        <GSTypography 
          textAlign="center" 
          fontSize="4vw"
          color="white"
        >
          Minted / Total <br />
          {nftState.totalSupply} / {nftState.maxSupply}
        </GSTypography>
      </Grid>
    </>
  );
}
