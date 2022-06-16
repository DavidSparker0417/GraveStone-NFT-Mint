import { Box, Typography } from "@mui/material";
import MuiLink from "@mui/material/Link";

function LinkText({ link, children }) {
  return (
    <Typography
      component={MuiLink}
      href={link}
      fontFamily="inherit"
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
    <Box sx={{ fontFamily: "chalkboard" }} {...rest}>
      <LinkText link="#">Opensea</LinkText>
      {splitter && <Splitter>{splitter}</Splitter>}
      <LinkText link="#">Twitter</LinkText>
      {splitter && <Splitter>{splitter}</Splitter>}
      <LinkText link="#">Contract</LinkText>
    </Box>
  );
}
