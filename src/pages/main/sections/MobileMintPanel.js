import { Grid, Box, Typography, styled, Button } from "@mui/material";
import { Children, useState } from "react";
import GSTypography from "../../../components/GSTypography";
import ImageBox from "../../../components/ImageBox";

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
  const [count, setCount] = useState(1);
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
          mb="10%"
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
  return (
    <>
      <Grid height="30%" pt={2}>
        <MintController />
      </Grid>
      <Grid height="30%" container justifyContent="center" alignContent="end">
        <MintControlButton>MINT NOW</MintControlButton>
      </Grid>
      <Grid height="30%" container alignItems="center" justifyContent="center">
        <GSTypography 
          textAlign="center" 
          fontSize="4vw"
          color="white"
        >
          Supply Remaining <br />
          3333 / 3333
        </GSTypography>
      </Grid>
    </>
  );
}
