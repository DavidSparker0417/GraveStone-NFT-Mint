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

function MintController({setMintCount}) {
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);
  useEffect(() => {
    setMintCount && setMintCount(count);
    dispatch(UpdateMintCount(count));
  }, [count])
  function decreaseCount() {
    if (count <= 1) return;
    setCount(count - 1);
  }
  function increaseCount() {
    setCount(count + 1);
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

export default function MobileMintPanel({ ...rest }) {
  const nftState = useSelector(getGeneral);
  const wallet = useWallet();
  const [count, setCount] = useState();

  function handleMint() {
    gstnMintNft(wallet.provider, wallet.account, nftState.mintPrice, count);
  }
  return (
    <>
      <Grid height="35%" container alignItems="center" justifyContent="center">
        <MintController setMintCount={setCount}/>
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
          Supply Remaining <br />
          {nftState.totalSupply} / {nftState.maxSupply}
        </GSTypography>
      </Grid>
    </>
  );
}
