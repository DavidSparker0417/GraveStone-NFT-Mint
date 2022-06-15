import { forwardRef } from "react";
import GSTypographyRoot from "./GSTypographyRoot";

const GSTypography = forwardRef(({ type, children, color, fontSize, fontFamily, ...rest }, ref) => {
  return (
    <GSTypographyRoot 
      fontSize= {fontSize ? fontSize : "16px"}
      fontFamily = {fontFamily ? fontFamily : "Back-Issues-BB-Bold-Italic"}
      ref={ref}
      color = {color}
      {...rest} 
    >
      {children}
    </GSTypographyRoot>
  );
});

export default GSTypography;
