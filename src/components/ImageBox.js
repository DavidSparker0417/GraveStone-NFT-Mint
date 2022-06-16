import { Box } from "@mui/material";
import { styled } from "@mui/material";

export default styled(Box)(({ image, hoverImage }) => {
  return {
    backgroundImage: image,
    backgroundPosition: "center",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    "&:hover" : {
      backgroundImage: hoverImage ? hoverImage : image
    }
  };
});
