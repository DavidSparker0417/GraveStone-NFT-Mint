import ImageBox from "./ImageBox";

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
    </ImageBox>
  );
}