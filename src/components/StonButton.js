import { Box, styled } from "@mui/material";
import ImageBox from "./ImageBox";

const EffectBox = styled(Box)(() => {
  return {
    width:"80%", 
    height:"50%", 
    // borderRadius:"50%",
    backgroundColor:"transparent",
    "&:hover": {
      backgroundColor:"#d6d01ca1",
      boxShadow:"0px 0px 40px #d6cf1b, 0px 0px 40px #d6cf1b"
    }
  }
});

export default function StoneButton({image, hoverImage, handleClick, ...rest}) {
  return (
    <ImageBox
      width="45%"
      height="20%"
      ml="-15%"
      mt="20%"
      onClick= {handleClick}
      image={image}
      hoverImage={hoverImage}
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        cursor: "pointer"
      }}
      {...rest}
    >
      {/* <EffectBox /> */}
    </ImageBox>
  );
}