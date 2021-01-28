import React, { useState } from "react";

let data = {
  overnat_adresse: "",
  overnat_navn: "",
  overnat_lokaler: "",
  overnat_over_50: false,
  overnat_tegning_filnavn: "",
  overnat_antal: "",
  overnat_start_dato: new Date(),
  overnat_slut_dato: new Date(),
  overnat_start_tid: new Date(),
  overnat_slut_tid: new Date(),
  overnat_kommune: "",
  overnat_kontaktpers: "",
  overnat_kontakttlf: "",
  ansvarl_kontaktpers: "",
  ansvarl_kontaktlf: "",
  ansvarl_kontaktmail: "",
  ansoegn_indsendt: "",
  // gid: "",
  the_geom: "",
  overnat_tegning: "",
  // file: "",
  //imageSrc: "",
};

const FormularContext = React.createContext([{}, () => {}, () => {}, () => {}]);

const FormularProvider = (props) => {
  const [state, setState] = useState(data);
  const [imageSrc, setImageSrc] = useState("");
  const setValue = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const resetForm = () => setState(data);

  const setValues = (keyValues) => {
    Object.keys(keyValues).forEach((k) => {
      setValue(k, keyValues[k]);
    });
  };

  return (
    <FormularContext.Provider value={[state, setValue, setValues, resetForm]}>
      {props.children}
    </FormularContext.Provider>
  );
};

export { FormularContext, FormularProvider };
