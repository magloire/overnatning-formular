import React, { useState } from "react";

let data = {
  overnat_adresse: "",
  overnat_navn: "",
  overnat_lokaler: "",
  overnat_over_50: false,
  overnat_tegning: "",
  overnat_tegning_filnavn: "",
  overnat_antal: "",
  overnat_start_dato: new Date().toISOString(),
  overnat_slut_dato: new Date().toISOString(),
  overnat_start_tid: new Date().toISOString(),
  overnat_slut_tid: new Date().toISOString(),
  overnat_kommune: "",
  overnat_kontaktpers: "",
  overnat_kontakttlf: "",
  ansvarl_kontaktpers: "",
  ansvarl_kontaktlf: "",
  ansvarl_kontaktmail: "",
  ansoegn_indsendt: "",
  gid: "",
  the_geom: "",
  file: "",
  //imageSrc: "",
};

const FormularContext = React.createContext([{}, () => {}, () => {}]);

const FormularProvider = (props) => {
  const [state, setState] = useState(data);
  const [imageSrc, setImageSrc] = useState("");
  const setValue = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const setValues = (keyValues) => {
    Object.keys(keyValues).forEach((k) => {
      setValue(k, keyValues[k]);
    });
  };

  return (
    <FormularContext.Provider value={[state, setValue, setValues]}>
      {props.children}
    </FormularContext.Provider>
  );
};

export { FormularContext, FormularProvider };
