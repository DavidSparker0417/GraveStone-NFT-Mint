import { forwardRef } from "react";
import DGInputRoot from "./DGInputRoot";

const DGInput = forwardRef(({inputProps, ...rest}, ref) => (
  <DGInputRoot 
    {...rest} 
    ref={ref}
    inputProps={{
      ...inputProps,
      style:{
        padding: "8px"
      }
    }}
  />
))

export default DGInput;