import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Grid, Box, Typography, styled, Button } from "@mui/material";
import { useSelector } from "react-redux";
import GSTypography from "../../../components/GSTypography";
import ImageBox from "../../../components/ImageBox";
import { getGeneral, getOperate, UpdateMintCount } from "../../../redux/nft";
import { useWallet } from "../../../context/wallet";

const MintText = styled(Typography)(() => {
  return {
    color: "white",
    fontSize: "2vw",
    fontFamily: "Back-Issues-BB-Bold-Italic",
  };
});

function MintControlButton({children, handleClick, ...rest}) {
  return(
    <Button 
      onClick={handleClick}
      sx={{
        color: "white",
        fontSize: "2vw",
        minWidth: "0",
        padding: "0 16px",
        fontFamily: "Back-Issues-BB-Bold-Italic",
      }}
      {...rest}
    >
      {children}
    </Button>
  )
}

function MintController({handleMint}) {
  const { maxMintPerOneTime, maxMintPerWallet, balance } = useSelector(getGeneral);
  const { count } = useSelector(getOperate);
  const dispatch = useDispatch();

  function decreaseCount() {
    const newCount = count - 1;
    if (newCount < 0) return;
    dispatch(UpdateMintCount(newCount));
  }
  
  function increaseCount() {
    const availableToMint = parseInt(maxMintPerWallet) > parseInt(balance) ? parseInt(maxMintPerWallet) - parseInt(balance) : 0;
    const limit = Math.min(availableToMint, maxMintPerOneTime);
    // console.log(availableToMint, maxMintPerOneTime, availableToMint, maxMintPerWallet, balance);
    const newCount = count + 1;
    if (newCount <= limit)
      dispatch(UpdateMintCount(newCount));
  }

  return (
    <>
      <Box ml="25%" textAlign="center">
        <Grid container mb="10%" justifyContent="center" fontFamily="Back-Issues-BB-Bold-Italic">
          <MintControlButton 
            mr={2} 
            handleClick={decreaseCount}
          >
            -
          </MintControlButton>
          <MintText component="span">
            {count}
          </MintText>
          <MintControlButton 
            onClick={increaseCount}
          >
            +
          </MintControlButton>
        </Grid>
        <MintControlButton onClick={handleMint} disabled={count === 0}>
          MINT NOW
        </MintControlButton>
      </Box>
    </>
  );
}

export default function MintPanel({ handleMint, ...rest }) {
  const nftState = useSelector(getGeneral);
  const stageImage = nftState?.isWhitelist ? "wl-sale-live.webp" : "public-sale-live.webp";
  return (
    <>
      <Grid item container width="100%" height="29%" justifyContent="center">
        <ImageBox
          image={`url(images/desktop/${stageImage})`}
          width="60%"
          height="90%"
        />
      </Grid>
      <Grid
        item
        height="23%"
        container
        alignItems="center"
        justifyContent="center"
        pl="10%"
      >
        <GSTypography textAlign="center" fontSize="1.5vw">
          Minted / Total <br />
          {nftState.totalSupply} / {nftState.maxSupply}
        </GSTypography>
      </Grid>
      <Grid item height="20%" />
      <Grid item height="28%" container flexDirection="column" justifyContent="center">
        <MintController handleMint = {handleMint}/>
      </Grid>
    </>
  );
}
