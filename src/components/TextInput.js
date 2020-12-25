import React, { useContext } from "react";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { FormularContext } from "../context/FormContext";

export default function TextInput(props) {
  const { size, id, title, evtHandler } = props;
  const [state, setValue, setValues] = useContext(FormularContext);

  return (
    <Grid item xs={size}>
      <TextField
        id={id}
        InputLabelProps={{ shrink: true }}
        label={
          <Typography variant='h6' component='h3'>
            {title}
          </Typography>
        }
        onChange={(e) => setValue(id, e.target.value)}
        fullWidth
      />
    </Grid>
  );
}
