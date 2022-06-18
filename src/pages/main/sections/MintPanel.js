import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Grid, Box, Typography, styled, Button } from "@mui/material";
import { useSelector } from "react-redux";
import GSTypography from "../../../components/GSTypography";
import ImageBox from "../../../components/ImageBox";
import { getGeneral, UpdateMintCount } from "../../../redux/nft";
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
  const [count, setCount] = useState(0);
  const { maxMintPerOneTime, maxMintPerWallet, balance } = useSelector(getGeneral);
  const {account} = useWallet();
  const [disabled, setDisabled] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(UpdateMintCount(count));
    setDisabled(count === 0)
  }, [count]);

  useEffect(() => {
    setCount(0);
  }, [account])

  function decreaseCount() {
    const newCount = count - 1;
    if (newCount <= 0) return;
    setCount(newCount);
  }
  function increaseCount() {
    const availableToMint = maxMintPerWallet > balance ? maxMintPerWallet - balance : 0;
    const limit = Math.min(availableToMint, maxMintPerOneTime);
    const newCount = count + 1;
    if (newCount <= limit)
      setCount(newCount);
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
        <MintControlButton onClick={handleMint} disabled={disabled}>
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
