import { Grid, Box, Typography, styled, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import GSTypography from "../../../components/GSTypography";
import ImageBox from "../../../components/ImageBox";
import { useWallet } from "../../../context/wallet";
import { gstnMintNft } from "../../../contracts/nft";
import { getGeneral, UpdateMintCount } from "../../../redux/nft";

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

function MintController() {
  const { maxMintPerWallet } = useSelector(getGeneral);
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);
  useEffect(() => {
    dispatch(UpdateMintCount(count));
  }, [count])
  function decreaseCount() {
    const newCount = count - 1;
    if (newCount <= 0) return;
    setCount(newCount);
  }
  function increaseCount() {
    const newCount = count + 1;
    if (newCount <= maxMintPerWallet)
      setCount(newCount);
  }
  return (
    <>
      <Box textAlign="center">
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
      </Box>
    </>
  );
}

export default function MobileMintPanel({ handleMint, ...rest }) {
  const nftState = useSelector(getGeneral);
  const wallet = useWallet();

  return (
    <>
      <Grid height="35%" container alignItems="center" justifyContent="center">
        <MintController />
      </Grid>
      <Grid height="25%" container justifyContent="center" alignContent="end">
        <MintControlButton handleClick={handleMint}>MINT NOW</MintControlButton>
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
