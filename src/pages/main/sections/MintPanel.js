import { Grid, Box, Typography, styled, Button } from "@mui/material";
import { Children, useState } from "react";
import GSTypography from "../../../components/GSTypography";
import ImageBox from "../../../components/ImageBox";

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

function MintController() {
  const [count, setCount] = useState(1);
  function decreaseCount() {
    if(count <= 1)
      return;
    setCount(count-1);
  }
  function increaseCount() {
    setCount(count + 1);
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
        <MintControlButton>MINT NOW</MintControlButton>
      </Box>
    </>
  );
}

export default function MintPanel({ ...rest }) {
  return (
    <>
      <Grid item container width="100%" height="29%" justifyContent="center">
        <ImageBox
          image="url(images/desktop/public-sale-live.png)"
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
          Supply Remaining <br />
          3333 / 3333
        </GSTypography>
      </Grid>
      <Grid item height="20%" />
      <Grid item height="28%" container flexDirection="column" justifyContent="center">
        <MintController />
      </Grid>
    </>
  );
}
