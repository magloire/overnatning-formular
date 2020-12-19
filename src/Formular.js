import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { Button, Checkbox, MenuItem, Typography } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import Chip from '@material-ui/core/Chip';
import AddIcon from '@material-ui/icons/Add';
import DateFnsUtils from '@date-io/date-fns';
import daLocale from 'date-fns/locale/da';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DawaSearcher from './DawaSearcher';
import { InsertPhoto } from '@material-ui/icons';


const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
      margin:25
    },
  }));

  let fileName = '';

function Formular(){
    const fileRef = React.useRef(null);
    const classes = useStyles();
    const [filNavn, setFilNavn] = useState('');
    const [data,setData] = useState({
      overnat_adresse : '',
      overnat_navn : '',
      overnat_lokaler : '',
      overnat_over_50 : false,
      overnat_tegning : '',
      overnat_tegning_filnavn : '',
      overnat_antal: '',
      overnat_start_dato : new Date().toISOString(),
      overnat_slut_dato : new Date().toISOString() ,
      overnat_start_tid : new Date().toISOString() ,
      overnat_slut_tid : new Date().toISOString() ,
      overnat_kommune : '',
      overnat_kontaktpers : '',
      overnat_kontakttlf : '',
      ansvarl_kontaktpers : '',
      ansvarl_kontaktlf : '',
      ansvarl_kontaktmail : '',
      ansoegn_indsendt : '',
      gid : '',
      the_geom : '',
      file:''
    });

  const kommuner = [
    {
      value:'Aarhus', nummer: 751
    },
    {
      value: 'Favrskov', nummer: 710
    },
    {
      value: 'Noordjurs', nummer: 707
    },
    {
      value: 'Odder', nummer:727
    },
    {
      value: 'Samsø', nummer: 741
    },
    {
      value: 'Skanderborg', nummer: 746
    },
    {
      value: 'Syddjurs', nummer: 706
    },
    {
      value: 'Randers', nummer: 730
    }
  ];

  const [komkode, setKomkode] = useState('751|741|727|710|706|707|730|746')

    const [imageSrc, setImageSrc] = useState("");

    const handleInputChange = (e) => {
    }
    
    const { register, handleSubmit, watch, errors } = useForm();
    const onSubmit = data => console.log(data);
    const [selectedDate, setSelectedDate] = React.useState(new Date());

    const deleteImage = () => {
      setData({
        ...data,
        overnat_tegning_filnavn : ''
      });

      setImageSrc("");
    }
    
    const handleDateChange = (date) => {
      setSelectedDate(date);
    };

    const handleStartDate = (date) => {
        let startDate = new Date(date);
        let slutDato = new Date(data.overnat_slut_dato); 
        let endDate =  slutDato < startDate ?
                      startDate
                      :slutDato;
        console.log("startDate :", startDate, " , endDate : ", endDate);
        setData({
          ...data,
          overnat_start_dato : startDate.toISOString(),
          overnat_slut_dato : endDate.toISOString()
        })
    }

    const handleStartTime = (date) => {
      setData({
        ...data,
        overnat_start_tid : new Date(date).toISOString()
      })
    }

    const handleEndDate = (date) => {
      let endDate = new Date(date);
      let startDate = new Date(data.overnat_start_dato);
      setData({
        ...data,
        overnat_slut_dato : new Date(date).toISOString()
      })
    }

    const handleEndTime = (date) => {
      setData({
        ...data,
        overnat_slut_tid : new Date(date).toISOString()
      })
    }

    const handleSelect = (e) => {
      const [nr, val] = e.target.value.split('_');
      console.log('kommune selected: ',e.target.value);
      setData({
        ...data,
        overnat_kommune: e.target.value,
        overnat_adresse:'',
        the_geom: ''
      });
      setKomkode(nr);
      setAdresseTekst('');   
    }
    
    const setAdressData = (adress) => {
      //console.log(`[${adress.adgangsadresse.x},${adress.adgangsadresse.x}]`);
      if(adress === ''){
        setData({
          ...data,
          overnat_adresse : '',
          the_geom : ''
        });
      }else{
        setData({
          ...data,
          overnat_adresse : adress.tekst,
          the_geom: `[${adress.adgangsadresse.x},${adress.adgangsadresse.y}]`// TODO: post geometry
        });
      }
    }

    const handleFormData = (e) => {
      console.log(e.target.id, ":",e.target.value)
      setData({
        ...data,
        [e.target.id] : e.target.value
      });
    }

    const handleCheckBox = (e) => {
      setData({
        ...data,
        overnat_over_50 : e.target.checked
      });
    }

    const [adresseTekst,setAdresseTekst] = useState('');

    const reader = new FileReader();

    const handleImageUpload = (e) => {
      console.log("file upload: ", e.target.files[0].name);
      setFilNavn(e.target.files[0].name);
      let file = e.target.files[0];
      let name = e.target.files[0].name;
      fileName = name;

      setData({
        ...data,
        overnat_tegning_filnavn : e.target.files[0].name,
      });

      if(file){
        reader.onload = handleReaderLoaded;
       // reader.readAsBinaryString(file);
       reader.readAsDataURL(file);
      }
    }

    const _substr = (str, len) => {
      return '...' + str.substring(str.length - len);
    }

    const handleReaderLoaded = (e) => {
      let binaryString = e.target.result;
      setImageSrc(reader.result);
      // setData({
      //   ...data,
      //   overnat_tegning : btoa(binaryString)
      // });
    }

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={daLocale}>
      <Container maxWidth="sm">
        {/* <Paper> */}
                <Typography variant="h6" gutterBottom>
                Ansøg om midlertidig overnatning
              </Typography>
              <Grid container spacing={3}>
                  <Grid item xs={12}>
                      <TextField 
                        id="overnat_kommune" 
                        select
                        value={data.overnat_kommune}
                        InputLabelProps={{ shrink: true }} 
                        label={
                          <Typography variant="h6" component="h3">Hvilken kommune</Typography>
                        }
                        onChange = {handleSelect}
                        fullWidth 
                        >
                          {
                            kommuner.map(option => (
                              <MenuItem key={option.nummer} value={`${option.nummer}_${option.value}`}>
                                {option.value}
                              </MenuItem>
                            ))
                          }
                        </TextField>
                  </Grid>
                  <Grid item xs={12}>
                      {/* <TextField 
                        id="standard-basic" 
                        InputLabelProps={{ shrink: true }} 
                        label={
                          <Typography variant="h6" component="h3">Overnatningstedets adresse</Typography>
                        }
                        fullWidth 
                        /> */}
                        <DawaSearcher setAdressData={setAdressData} komkode={komkode} adresseTekst={adresseTekst} setAdresseTekst={setAdresseTekst}/>
                  </Grid>
                  <Grid item xs={12}>
                      <TextField 
                        id="overnat_navn" 
                        InputLabelProps={{ shrink: true }} 
                        label={
                          <Typography variant="h6" component="h3">Overnatningstedets Navn</Typography>
                        }
                        onChange = {handleFormData}
                        fullWidth 
                        />
                  </Grid>
                  <Grid item xs={12}>
                      <TextField 
                        id="overnat_lokaler" 
                        InputLabelProps={{ shrink: true }} 
                        label={
                          <Typography variant="h6" component="h3">Lokaler</Typography>
                        }
                        onChange = {handleFormData}
                        fullWidth 
                        />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography style={{color:'rgba(0, 0, 0, 0.54)'}} variant="subtitle1" component="h3">Overnatter mere end 50 personer </Typography>
                    
                </Grid>
                <Grid item xs={6}>
                  <Checkbox 
                    color="primary" 
                    checked={data.overnat_over_50}
                    onChange={handleCheckBox}
                    />
                </Grid>
                {
                  data.overnat_over_50 &&
                <Grid item xs={5}>
                    <Typography style={{color:'rgba(0, 0, 0, 0.54)'}} variant="subtitle1" component="h3">Vedhæft tegningsmateriale </Typography>
                    
                </Grid>
                }
                {
                  data.overnat_over_50 &&
                  <Grid 
                    item xs={2}
                    >
                  <label htmlFor="upload-photo">
                    <input
                      style={{ display: 'none' }}
                      id="upload-photo"
                      name="upload-photo"
                      type="file"
                      accept=".jpeg,.jpg,.png"
                      onChange={handleImageUpload}
                      ref={fileRef}
                    />

                    
                    <IconButton color="primary" aria-label="upload fil"
                      onClick={e => fileRef.current && fileRef.current.click()}
                    >
                      <PhotoCameraIcon/>
                    </IconButton>
                  </label>
                  </Grid>
                }
                  {
                    data.overnat_over_50 &&
                    <>
                    {/* <Grid item xs={3}></Grid> */}
                    <Grid item xs={5}>
                      {
                        data.overnat_tegning_filnavn && 
                        <Chip 
                          variant="outlined"
                          label={
                            data.overnat_tegning_filnavn.length > 25 ?
                             _substr(data.overnat_tegning_filnavn, 22)
                            : data.overnat_tegning_filnavn
                          }
                          size="medium"
                          color="secondary"
                          onDelete={(x) => deleteImage()}
                        />
                      }
                    </Grid>
                    {/* <Grid item xs={3}></Grid> */}
                    </>
                  }
                
                 
                  <Grid item xs={12}>
                      <TextField 
                        id="overnat_antal" 
                        InputLabelProps={{ shrink: true }} 
                        label={
                          <Typography variant="h6" component="h3">Maksimal antal overnatninger</Typography>
                        }
                        onChange = {handleFormData}
                        fullWidth 
                        />
                  </Grid>
                  <Grid item xs={6}>
                      
                        <KeyboardDatePicker
                            margin="normal"
                            id="overnat_start_dato"
                            label={
                              <Typography variant="h6" component="h3">Start dato</Typography>
                            }
                            value={data.overnat_start_dato}
                            onChange={handleStartDate}
                            KeyboardButtonProps={{
                              'aria-label': 'ændre datoen',
                            }}
                            format="yyyy-MM-dd"
                            cancelLabel="Annulere"
                          />
                  </Grid>
                  <Grid item xs={6}>
                  <KeyboardTimePicker
                      margin="normal"
                      id="overnat_start_tid"
                      label={
                        <Typography variant="h6" component="h3">Start tidspunkt</Typography>
                      }
                      ampm={false}
                      value={data.overnat_start_tid}
                      onChange={handleStartTime}
                      KeyboardButtonProps={{
                        'aria-label': 'ændre tidspunkt',
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                  <KeyboardDatePicker
                            
                            format="yyyy-MM-dd"
                            margin="normal"
                            id="overnat_slut_dato"
                            label={
                              <Typography variant="h6" component="h3">Slut dato</Typography>
                            }
                            value={data.overnat_slut_dato}
                            onChange={handleEndDate}
                            KeyboardButtonProps={{
                              'aria-label': 'ændre datoen',
                            }}
                          />
                  </Grid>
                  <Grid item xs={6}>
                  <KeyboardTimePicker
                      margin="normal"
                      id="overnat_slut_tid"
                      label={
                        <Typography variant="h6" component="h3">Slut tidspunkt</Typography>
                      }
                      value={data.overnat_slut_tid}
                      ampm={false}
                      onChange={handleEndTime}
                      KeyboardButtonProps={{
                        'aria-label': 'ændre tidspunkt',
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                      <TextField 
                        id="overnat_kontaktpers" 
                        InputLabelProps={{ shrink: true }} 
                        label={
                          <Typography variant="h6" component="h3">Navn Kontaktperson</Typography>
                        }
                        onChange = {handleFormData}
                        fullWidth 
                        />
                  </Grid>
                  <Grid item xs={6}>
                      <TextField 
                        id="overnat_kontakttlf" 
                        InputLabelProps={{ shrink: true }} 
                        label={
                          <Typography variant="h6" component="h3">Kontakt tlf.</Typography>
                        }
                        onChange = {handleFormData}
                        fullWidth 
                        />
                  </Grid>
                  <Grid item xs={12}></Grid>
                  <Grid item xs={12}>
                      <TextField 
                        id="ansvarl_kontaktpers" 
                        InputLabelProps={{ shrink: true }} 
                        label={
                          <Typography variant="h6" component="h3">Navn ansvarlig</Typography>
                        }
                        onChange = {handleFormData}
                        fullWidth 
                        />
                  </Grid>
                  <Grid item xs={6}>
                      <TextField 
                        id="ansvarl_kontaktlf" 
                        InputLabelProps={{ shrink: true }} 
                        label={
                          <Typography variant="h6" component="h3">Tlf. ansvarlig</Typography>
                        }
                        onChange = {handleFormData}
                        fullWidth 
                        />
                  </Grid>
                  <Grid item xs={6}>
                      <TextField 
                        id="ansvarl_kontaktmail" 
                        InputLabelProps={{ shrink: true }} 
                        label={
                          <Typography variant="h6" component="h3">E-mail ansvarlig</Typography>
                        }
                        onChange = {handleFormData}
                        fullWidth 
                        />
                  </Grid>
                  <Grid item xs={4}></Grid>
                  <Grid item xs={4}>
                    <Button variant="contained" color="primary">Send</Button>
                  </Grid>
                  <Grid item xs={4}></Grid>
                  
              </Grid>
              
          {/* </Paper> */}
          </Container>
          </MuiPickersUtilsProvider>

            
    );
}

export default Formular;