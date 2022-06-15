import MuiLink from "@mui/material/Link";
import { Box } from "@mui/material";
export default function SocialPanel(props) {
  return (
    <>
      {props?.data?.map((social, i) => (
        <Box key={`social-${i}`} component={MuiLink} href={social.link} mr={2}>
          <Box component="img" src={social.image} width="48px" />
        </Box>
      ))}
    </>
  );
}
