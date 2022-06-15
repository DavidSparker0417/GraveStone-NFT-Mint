import { forwardRef } from "react";
import DGButtonRoot from "./DGButtonRoot";

const DGButton = forwardRef(({children, ...rest}, ref) => (
  <DGButtonRoot 
    {...rest} 
    ref={ref}
    variant="contained"
  >
    {children}
  </DGButtonRoot>
))

export default DGButton;