import { Box, Button, Container, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import GSTypography from "../../components/GSTypography";
import StoneButton from "../../components/StonButton";
import { useWallet } from "../../context/wallet";
import MintPanel from "./sections/MintPanel";
import { BrowserView, MobileView, isMobile } from "react-device-detect";
import ImageBox from "../../components/ImageBox";
import MobileMintPanel from "./sections/MobileMintPanel";

function BackGround({ image, ...rest }) {
  return (
    <>
      <Box
        component="img"
        src={image}
        sx={{
          width: "100%",
          zIndex: 0,
        }}
        {...rest}
      />
    </>
  );
}

function SocialLink({ splitter, ...rest }) {
  return (
    <Box sx={{ fontFamily: "chalkboard" }} {...rest}>
      <Typography
        component={MuiLink}
        fontFamily="inherit"
        fontWeight="bold"
        color="black"
        sx={{
          textDecoration: "none"
        }}
      >
        Opensea
      </Typography>
      {
        splitter && 
        <Typography component="span" mx={1} fontFamily="inherit" fontWeight="bold">
          {splitter}
        </Typography>
      }
      <Typography
        component={MuiLink}
        fontFamily="inherit"
        fontWeight="bold"
        color="black"
        sx={{
          textDecoration: "none"
        }}
      >
        Twitter
      </Typography>
    </Box>
  );
}

function MintInfo() {
  return (
    <Box height="fit-content" pl="25%" pb="30%">
      <GSTypography>WL MINT: 5PM (PST)</GSTypography>
      <GSTypography>1 per wallet</GSTypography>
      <GSTypography>PUBLIC SALE: 6PM (PST)</GSTypography>
      <GSTypography>Max 2 per wallet</GSTypography>
    </Box>
  );
}

const imgDir = isMobile ? "mobile" : "desktop";
export default function Main() {
  const wallet = useWallet();
  let ui = {
    init: {
      background: `images/${imgDir}/background.png`,
      buttonImage: `url(/images/${imgDir}/connect-wallet.png)`,
      buttonHandler: handleConnectWallet,
    },
    active: {
      background: `images/${imgDir}/background-active.png`,
      buttonImage: `url(/images/${imgDir}/mint.png)`,
      buttonHandler: handleMint,
    },
  };
  const currentUI = wallet.account ? ui.active : ui.init;

  function handleConnectWallet() {
    console.log("handleConnectWallet");
    wallet.connect();
  }

  function handleMint() {
    console.log("handleMint");
  }

  return (
    <>
      <BrowserView style={{ height: "100%" }}>
        <Box display="flex" position="relative" height="100%">
          <BackGround image={currentUI.background} />
          <Grid
            container
            position="absolute"
            height="100%"
            width="100%"
            left={0}
            top={0}
          >
            <Grid item xs={4} height="100%">
              <SocialLink p="16px" splitter="-" />
            </Grid>
            <Grid
              item
              xs={4}
              container
              height="100%"
              justifyContent="center"
              alignItems="center"
            >
              <StoneButton
                image={currentUI.buttonImage}
                handleClick={currentUI.buttonHandler}
              />
            </Grid>
            <Grid
              item
              xs={4}
              container
              height="100%"
              flexDirection="column"
              alignContent="center"
            >
              {wallet.account && <MintPanel />}
            </Grid>
          </Grid>
        </Box>
      </BrowserView>
      <MobileView style={{ height: "100%" }}>
        <Box display="flex" position="relative" height="100%">
          <BackGround image={currentUI.background} height="100%" />
          <Grid
            container
            position="absolute"
            height="100%"
            width="100%"
            left={0}
            top={0}
          >
            <Grid item height="25%" width="100%" container justifyContent="center">
              {wallet.account && (
                <ImageBox
                  image="url(images/mobile/public-sale-live.png)"
                  width="80%"
                  height="60%"
                />
              )}
            </Grid>
            <Grid item height="45%" width="100%" container>
              <Grid item xs={6} pt={wallet.account ? "0" : "32px"}>
                <SocialLink display="flex" flexDirection="column" pl={1} />
              </Grid>
              <Grid item xs={6} container alignItems="center">
                <StoneButton
                  image={currentUI.buttonImage}
                  handleClick={currentUI.buttonHandler}
                  width="50%"
                  height="15%"
                  ml={wallet.account ? "15%" : "0"}
                  mt={wallet.account ? "30%" : "80%"}
                />
              </Grid>
            </Grid>
            <Grid item height="30%" width="100%">
              {
                wallet.account && <MobileMintPanel />
              }
            </Grid>
          </Grid>
        </Box>
      </MobileView>
    </>
  );
}
