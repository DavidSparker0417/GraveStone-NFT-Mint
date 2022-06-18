import { Box, Typography } from "@mui/material";
import MuiLink from "@mui/material/Link";
import { TARGET_NET } from "../config/config";

function LinkText({ link, children }) {
  return (
    <Typography
      component={MuiLink}
      href={link}
      target="_blank"
      fontFamily="chalkboard"
      fontWeight="bold"
      color="black"
      sx={{
        textDecoration: "none",
      }}
      mb={1}
    >
      {children}
    </Typography>
  );
}

function Splitter({ children }) {
  return (
    <Typography 
      component="span" 
      mx={1} 
      fontFamily="inherit" 
      fontWeight="bold"
      sx={{
        display: {
          xs: "none",
          lg: "inline"
        }
      }}
    >
      {children}
    </Typography>
  );
}

export default function SocialBox({ splitter, ...rest }) {
  return (
    <Box {...rest}>
      <LinkText link="https://opensea.io/collection/ripethereum">Opensea</LinkText>
      {splitter && <Splitter>{splitter}</Splitter>}
      <LinkText link="https://twitter.com/RIPethereum">Twitter</LinkText>
      {splitter && <Splitter>{splitter}</Splitter>}
      <LinkText link={`https://etherscan.io/address/${TARGET_NET.gravestone}`}>Contract</LinkText>
    </Box>
  );
}
