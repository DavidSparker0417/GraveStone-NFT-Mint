import { Box } from "@mui/material";
import ImageBox from "./ImageBox";

export default function StoneButton({image, handleClick, ...rest}) {
  return (
    <ImageBox
      width="45%"
      height="20%"
      ml="-15%"
      mt="20%"
      onClick= {handleClick}
      image={image}
      {...rest}
    />
  );
}