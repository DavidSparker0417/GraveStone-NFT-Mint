import { useDispatch, useSelector } from "react-redux";
import { Box, Grid } from "@mui/material";
import StoneButton from "../../components/StonButton";
import { useWallet } from "../../context/wallet";
import MintPanel from "./sections/MintPanel";
import { BrowserView, MobileView, isMobile } from "react-device-detect";
import MobileMintPanel from "./sections/MobileMintPanel";
import { gstnMintNft, gstnNftBalance } from "../../contracts/nft";
import { getGeneral, getOperate, UpdateBalance, UpdateMintCount } from "../../redux/nft";
import SaleStatus from "./sections/mobile/SaleStatus";
import SocialBox from "../../components/SocialBox";
import { useUI } from "../../context/ui";
import { toast } from "react-toastify";
import { dsErrMsgGet } from "../../ds-lib/ds-web3";
import { useEffect } from "react";

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

const imgDir = isMobile ? "mobile" : "desktop";
export default function Main() {
  const nftState = useSelector(getGeneral);
  const wallet = useWallet();
  const { setLoading } = useUI();
  const dispatch = useDispatch();
  const operateState = useSelector(getOperate);
  let ui = {
    init: {
      background: `images/${imgDir}/background.webp`,
      buttonImage: `url(/images/${imgDir}/connect-wallet.webp)`,
      buttonHoverImage: `url(/images/${imgDir}/connect-wallet-hover.webp)`,
      buttonHandler: handleConnectWallet,
    },
    active: {
      background: `images/${imgDir}/background-active.webp`,
      buttonImage: `url(/images/${imgDir}/mint.webp)`,
      buttonHoverImage: `url(/images/${imgDir}/mint-hover.webp)`,
      buttonHandler: handleMint,
    },
  };
  const currentUI = wallet.account ? ui.active : ui.init;

  function handleConnectWallet() {
    console.log("handleConnectWallet");
    wallet.connect();
  }

  useEffect(() => {
    if (!wallet?.account) return;
    gstnNftBalance(wallet.provider, wallet.account).then((balance) => {
      dispatch(UpdateBalance(balance));
    });
    dispatch(UpdateMintCount(0));
  }, [wallet, wallet.account, dispatch]);

  async function handleMint() {
    if (!operateState.count)
      return;
    try {
      setLoading(true, "Minting...");
      await gstnMintNft(
        wallet.provider,
        wallet.account,
        nftState.mintPrice,
        operateState.count
      );
      setLoading(false);
      dispatch(UpdateMintCount(0));
    } catch (e) {
      setLoading(false);
      toast.error(dsErrMsgGet(e.message));
    }
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
              <SocialBox
                p="16px"
                splitter="-"
                sx={{
                  display: {
                    xs: "flex",
                    lg: "block",
                  },
                  flexDirection: {
                    xs: "column",
                    lg: "none",
                  },
                }}
              />
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
                hoverImage={currentUI.buttonHoverImage}
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
              {wallet.account && <MintPanel handleMint={handleMint} />}
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
            <Grid
              item
              height="25%"
              width="100%"
              container
              justifyContent="center"
            >
              <SaleStatus />
            </Grid>
            <Grid item height="45%" width="100%" container>
              <Grid item xs={6} pt={wallet.account ? "0" : "32px"}>
                <SocialBox display="flex" flexDirection="column" pl={1} />
              </Grid>
              <Grid item xs={6} container alignItems="center">
                <StoneButton
                  image={currentUI.buttonImage}
                  hoverImage={currentUI.buttonHoverImage}
                  handleClick={currentUI.buttonHandler}
                  width="50%"
                  height="15%"
                  ml={wallet.account ? "15%" : "0"}
                  mt={wallet.account ? "30%" : "80%"}
                />
              </Grid>
            </Grid>
            <Grid item height="30%" width="100%">
              {wallet.account && <MobileMintPanel handleMint={handleMint} />}
            </Grid>
          </Grid>
        </Box>
      </MobileView>
    </>
  );
}
