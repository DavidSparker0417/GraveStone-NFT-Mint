import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function DGBackdrop({open, description}) {
  return (
    <div>
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1 ,
          flexDirection:"column"
        }}
        open={open}
      >
        <CircularProgress color="inherit" />
        <h1 style={{marginTop: "16px"}}>{description}</h1>
      </Backdrop>
    </div>
  );
}