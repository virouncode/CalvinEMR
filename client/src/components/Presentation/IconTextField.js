import { InputAdornment, TextField } from "@mui/material";

const IconTextField = ({ iconStart, iconEnd, ...props }) => {
  return (
    <TextField
      {...props}
      InputProps={{
        startAdornment: iconStart ? (
          <InputAdornment position="start">{iconStart}</InputAdornment>
        ) : null,
        endAdornment: iconEnd ? (
          <InputAdornment position="end">{iconEnd}</InputAdornment>
        ) : null,
      }}
    />
  );
};

export default IconTextField;
