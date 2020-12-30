import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import { Checkbox, Typography } from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import daLocale from "date-fns/locale/da";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import * as yup from "yup";
import DawaSearcher from "./DawaSearcher";
import ErrorComp from "./ErrorComp";
import TextInput from "./components/TextInput";
import { FormularContext } from "./context/FormContext";
import ImageUpload from "./components/ImageUpload";
import DateTimeInputs from "./components/DateInput";
import SelectInput from "./components/SelectInput";
import SubmitButton from "./components/SubmitButton";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    margin: 25,
  },
}));

function Formular() {
  const [state, setValue, setValues] = useContext(FormularContext);
  const fileRef = React.useRef(null);
  const classes = useStyles();
  const [data, setData] = useState({
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
  });

  let schema = yup.object().shape({
    overnat_adresse: yup.string().min(1),
    overnat_navn: yup.string().required(),
    overnat_lokaler: yup.string().required(),
    overnat_over_50: yup.string().required(),
    // overnat_tegning : yup.string().required(),
    // overnat_tegning_filnavn : yup.string().required(),
    overnat_antal: yup.number().positive().integer(),
    overnat_start_dato: yup.string().required(),
    overnat_slut_dato: yup.string().required(),
    overnat_start_tid: yup.string().required(),
    overnat_slut_tid: yup.string().required(),
    overnat_kommune: yup.string().required(),
    overnat_kontaktpers: yup.string().required(),
    overnat_kontakttlf: yup
      .string()
      .matches(/^[0-9]{8}$/, "telefonnr skal have 8 tal"),
    ansvarl_kontaktpers: yup.string().required(),
    ansvarl_kontaktlf: yup
      .string()
      .matches(/^[0-9]{8}$/, "telefonnr skal have 8 tal"),
    ansvarl_kontaktmail: yup.string().email().required(),
  });

  const [komkode, setKomkode] = useState("751|741|727|710|706|707|730|746");

  const [imageSrc, setImageSrc] = useState("");
  const [formErrors, setFormErrors] = useState([]);

  // const handleInputChange = (e) => {};

  // const { register, handleSubmit, watch, errors } = useForm();
  // const onSubmit = (data) => console.log(data);
  // const [selectedDate, setSelectedDate] = React.useState(new Date());

  // const deleteImage = () => {
  //   setData({
  //     ...data,
  //     overnat_tegning_filnavn: "",
  //   });

  //   setImageSrc("");
  // };

  // const handleDateChange = (date) => {
  //   setSelectedDate(date);
  // };

  // const handleStartDate = (date) => {
  //   let startDate = new Date(date);
  //   let slutDato = new Date(data.overnat_slut_dato);
  //   let endDate = slutDato < startDate ? startDate : slutDato;
  //   console.log("startDate :", startDate, " , endDate : ", endDate);
  //   setData({
  //     ...data,
  //     overnat_start_dato: startDate.toISOString(),
  //     overnat_slut_dato: endDate.toISOString(),
  //   });
  // };

  // const handleStartTime = (date) => {
  //   setData({
  //     ...data,
  //     overnat_start_tid: new Date(date).toISOString(),
  //   });
  // };

  // const handleEndDate = (date) => {
  //   let endDate = new Date(date);
  //   let startDate = new Date(data.overnat_start_dato);
  //   setData({
  //     ...data,
  //     overnat_slut_dato: new Date(date).toISOString(),
  //   });
  // };

  // const handleEndTime = (date) => {
  //   setData({
  //     ...data,
  //     overnat_slut_tid: new Date(date).toISOString(),
  //   });
  // };

  // const handleSelect = (e) => {
  //   const [nr, val] = e.target.value.split("_");
  //   console.log("kommune selected: ", e.target.value);
  //   setData({
  //     ...data,
  //     overnat_kommune: e.target.value,
  //     overnat_adresse: "",
  //     the_geom: "",
  //   });
  //   setKomkode(nr);
  //   setAdresseTekst("");
  // };

  const setAdressData = (adress) => {
    //console.log(`[${adress.adgangsadresse.x},${adress.adgangsadresse.x}]`);
    if (adress === "") {
      setData({
        ...data,
        overnat_adresse: "",
        the_geom: "",
      });
    } else {
      setData({
        ...data,
        overnat_adresse: adress.tekst,
        the_geom: `[${adress.adgangsadresse.x},${adress.adgangsadresse.y}]`, // TODO: post geometry
      });
    }
  };

  // const handleFormData = (e) => {
  //   console.log(e.target.id, ":", e.target.value);
  //   setData({
  //     ...data,
  //     [e.target.id]: e.target.value,
  //   });
  // };

  const handleCheckBox = (e) => {
    console.log("handleCheckbox => ", e.target.value);
    setValue("overnat_over_50", e.target.checked);
  };

  const [adresseTekst, setAdresseTekst] = useState("");

  const reader = new FileReader();

  // const handleImageUpload = (e) => {
  //   console.log("file upload: ", e.target.files[0].name);
  //   setFilNavn(e.target.files[0].name);
  //   let file = e.target.files[0];
  //   let name = e.target.files[0].name;
  //   fileName = name;

  //   setData({
  //     ...data,
  //     overnat_tegning_filnavn: e.target.files[0].name,
  //   });

  //   if (file) {
  //     reader.onload = handleReaderLoaded;
  //     // reader.readAsBinaryString(file);
  //     reader.readAsDataURL(file);
  //   }
  // };

  // const _substr = (str, len) => {
  //   return "..." + str.substring(str.length - len);
  // };

  // const handleReaderLoaded = (e) => {
  //   let binaryString = e.target.result;
  //   setImageSrc(reader.result);
  //   // setData({
  //   //   ...data,
  //   //   overnat_tegning : btoa(binaryString)
  //   // });
  // };

  const submitHandler = (e) => {
    console.log(data);
    schema
      .validate(data, { abortEarly: false })
      .then(function (valid) {
        alert("schame validity =>" + valid);
      })
      .catch(function (err) {
        console.log(err.errors);
        setFormErrors(err.errors);
      });
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={daLocale}>
      <Container maxWidth='sm'>
        <Typography variant='h6' gutterBottom>
          Ansøg om midlertidig overnatning
        </Typography>
        <Grid container spacing={3}>
          <SelectInput
            size={12}
            id='overnat_kommune'
            title='Hvilken kommune'
            setKomkode={setKomkode}
            setAdresseTekst={setAdresseTekst}
          />
          <DawaSearcher
            size={12}
            setAdressData={setAdressData}
            komkode={komkode}
            adresseTekst={adresseTekst}
            setAdresseTekst={setAdresseTekst}
          />
          <TextInput
            size={12}
            id='overnat_navn'
            title='Overnatningstedets Navn'
          />
          <TextInput size={12} id='overnat_lokaler' title='Lokaler' />
          <Grid item xs={6}>
            <Typography
              style={{ color: "rgba(0, 0, 0, 0.54)" }}
              variant='subtitle1'
              component='h3'
            >
              Overnatter mere end 50 personer{" "}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Checkbox
              color='primary'
              checked={state.overnat_over_50}
              onChange={handleCheckBox}
            />
          </Grid>
          {state.overnat_over_50 && <ImageUpload setImageSrc={setImageSrc} />}
          <TextInput
            size={12}
            id='overnat_antal'
            title='Maksimal antal overnatninger'
          />
          <DateTimeInputs />
          <TextInput
            size={12}
            id='overnat_kontaktpers'
            title='Navn Kontaktperson'
          />
          <TextInput size={6} id='overnat_kontakttlf' title='Kontakt tlf.' />
          <Grid item xs={12}></Grid>
          <TextInput
            size={12}
            id='ansvarl_kontaktpers'
            title='Navn ansvarlig'
          />
          <TextInput size={6} id='ansvarl_kontaktlf' title='Tlf. ansvarlig' />
          <TextInput
            size={6}
            id='ansvarl_kontaktmail'
            title='E-mail ansvarlig'
          />
          {formErrors.length > 0 && (
            <ErrorComp errors={formErrors} closeAlert={setFormErrors} />
          )}
          <SubmitButton onClick={submitHandler} />
        </Grid>
      </Container>
    </MuiPickersUtilsProvider>
  );
}
export default Formular;
