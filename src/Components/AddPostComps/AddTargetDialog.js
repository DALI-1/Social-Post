import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Accordion from 'react-bootstrap/Accordion';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import * as Facebook_Search from "../../libs/Facebook_Search"
import CancelIcon from '@mui/icons-material/Cancel';
import ModeStandbyIcon from '@mui/icons-material/ModeStandby';
import WcIcon from '@mui/icons-material/Wc';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TranslateIcon from '@mui/icons-material/Translate';
import InterestsIcon from '@mui/icons-material/Interests';
import {  toast } from "react-toastify";
const Locales=[
  {
    "name": "English (US)",
    "key": 6
  },
  {
    "name": "Catalan",
    "key": 1
  },
  {
    "name": "Czech",
    "key": 2
  },
  {
    "name": "Cebuano",
    "key": 56
  },
  {
    "name": "Welsh",
    "key": 3
  },
  {
    "name": "Danish",
    "key": 4
  },
  {
    "name": "German",
    "key": 5
  },
  {
    "name": "Basque",
    "key": 59
  },
  {
    "name": "Spanish",
    "key": 23
  },
  {
    "name": "Spanish (Spain)",
    "key": 7
  },
  {
    "name": "Guarani",
    "key": 66
  },
  {
    "name": "Finnish",
    "key": 8
  },
  {
    "name": "French (France)",
    "key": 9
  },
  {
    "name": "Galician",
    "key": 65
  },
  {
    "name": "Hungarian",
    "key": 30
  },
  {
    "name": "Italian",
    "key": 10
  },
  {
    "name": "Japanese",
    "key": 11
  },
  {
    "name": "Korean",
    "key": 12
  },
  {
    "name": "Norwegian (bokmal)",
    "key": 13
  },
  {
    "name": "Norwegian (nynorsk)",
    "key": 84
  },
  {
    "name": "Dutch",
    "key": 14
  },
  {
    "name": "Frisian",
    "key": 63
  },
  {
    "name": "Polish",
    "key": 15
  },
  {
    "name": "Portuguese (Brazil)",
    "key": 16
  },
  {
    "name": "Portuguese (Portugal)",
    "key": 31
  },
  {
    "name": "Romanian",
    "key": 32
  },
  {
    "name": "Russian",
    "key": 17
  },
  {
    "name": "Slovak",
    "key": 33
  },
  {
    "name": "Slovenian",
    "key": 34
  },
  {
    "name": "Swedish",
    "key": 18
  },
  {
    "name": "Thai",
    "key": 35
  },
  {
    "name": "Turkish",
    "key": 19
  },
  {
    "name": "Northern Kurdish (Kurmanji)",
    "key": 76
  },
  {
    "name": "Simplified Chinese (China)",
    "key": 20
  },
  {
    "name": "Traditional Chinese (Hong Kong)",
    "key": 21
  },
  {
    "name": "Traditional Chinese (Taiwan)",
    "key": 22
  },
  {
    "name": "Afrikaans",
    "key": 36
  },
  {
    "name": "Albanian",
    "key": 87
  },
  {
    "name": "Armenian",
    "key": 68
  },
  {
    "name": "Azerbaijani",
    "key": 53
  },
  {
    "name": "Belarusian",
    "key": 54
  },
  {
    "name": "Bengali",
    "key": 45
  },
  {
    "name": "Bosnian",
    "key": 55
  },
  {
    "name": "Bulgarian",
    "key": 37
  },
  {
    "name": "Croatian",
    "key": 38
  },
  {
    "name": "Flemish",
    "key": 83
  },
  {
    "name": "English (UK)",
    "key": 24
  },
  {
    "name": "Esperanto",
    "key": 57
  },
  {
    "name": "Estonian",
    "key": 58
  },
  {
    "name": "Faroese",
    "key": 62
  },
  {
    "name": "French (Canada)",
    "key": 44
  },
  {
    "name": "Georgian",
    "key": 72
  },
  {
    "name": "Greek",
    "key": 39
  },
  {
    "name": "Gujarati",
    "key": 67
  },
  {
    "name": "Hindi",
    "key": 46
  },
  {
    "name": "Icelandic",
    "key": 69
  },
  {
    "name": "Indonesian",
    "key": 25
  },
  {
    "name": "Irish",
    "key": 64
  },
  {
    "name": "Javanese",
    "key": 71
  },
  {
    "name": "Kannada",
    "key": 75
  },
  {
    "name": "Kazakh",
    "key": 73
  },
  {
    "name": "Latvian",
    "key": 78
  },
  {
    "name": "Lithuanian",
    "key": 40
  },
  {
    "name": "Macedonian",
    "key": 79
  },
  {
    "name": "Malay",
    "key": 41
  },
  {
    "name": "Marathi",
    "key": 81
  },
  {
    "name": "Mongolian",
    "key": 80
  },
  {
    "name": "Nepali",
    "key": 82
  },
  {
    "name": "Punjabi",
    "key": 47
  },
  {
    "name": "Serbian",
    "key": 42
  },
  {
    "name": "Swahili",
    "key": 88
  },
  {
    "name": "Filipino",
    "key": 26
  },
  {
    "name": "Tamil",
    "key": 48
  },
  {
    "name": "Telugu",
    "key": 49
  },
  {
    "name": "Malayalam",
    "key": 50
  },
  {
    "name": "Ukrainian",
    "key": 52
  },
  {
    "name": "Uzbek",
    "key": 91
  },
  {
    "name": "Vietnamese",
    "key": 27
  },
  {
    "name": "Khmer",
    "key": 74
  },
  {
    "name": "Tajik",
    "key": 89
  },
  {
    "name": "Arabic",
    "key": 28
  },
  {
    "name": "Hebrew",
    "key": 29
  },
  {
    "name": "Urdu",
    "key": 90
  },
  {
    "name": "Persian",
    "key": 60
  },
  {
    "name": "Pashto",
    "key": 85
  },
  {
    "name": "Sinhala",
    "key": 86
  },
  {
    "name": "Japanese (Kansai)",
    "key": 70
  },
  {
    "name": "English (All)",
    "key": 1001
  },
  {
    "name": "Spanish (All)",
    "key": 1002
  },
  {
    "name": "French (All)",
    "key": 1003
  },
  {
    "name": "Chinese (All)",
    "key": 1004
  },
  {
    "name": "Portuguese (All)",
    "key": 1005
  }
]

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}
export default function AlertDialogSlide({SetShowAddTargetDialog}) { 
  const handleClose = () => {
    SetShowAddTargetDialog(false)
  };
  //Interests Async Multi Select
  let Already_Searched_Target_Interest_Value= React.useRef("");
  let Target_Interest_MultiSelect_Value= React.useRef("");
  const [Target_Interest_MultiSelect_Values, setTarget_Interest_MultiSelect_Values] = React.useState([]);
  const [Target_Interest_MultiSelect_open, setTarget_Interest_MultiSelect_Open] = React.useState(false);
  const [Target_Interest_MultiSelect_options, setTarget_Interest_MultiSelect_Options] = React.useState([]);
  const [Target_Interest_MultiSelect_loading,setTarget_Interest_MultiSelect_loading] =React.useState(false)
  React.useEffect(() => {
  if(Target_Interest_MultiSelect_Value.current!=="" &&Target_Interest_MultiSelect_Value.current!==Already_Searched_Target_Interest_Value.current)
  {
    Already_Searched_Target_Interest_Value.current=Target_Interest_MultiSelect_Value.current
    let List_Of_Audience_Interests=Facebook_Search.Facebook_Get_Audience_Interests(Target_Interest_MultiSelect_Value.current)
    List_Of_Audience_Interests.then((json)=>{
      if(json.data.length!==0)
      {
        let Combined_Interests= [...Target_Interest_MultiSelect_options, ...json.data].reduce((acc, curr) => {
          const found = acc.find(item => item.id === curr.id);
          if (!found) {
            acc.push(curr);
          }
          return acc;
        }, [])
        setTarget_Interest_MultiSelect_Options(Combined_Interests)
      }
    
    })
  }
   
  setTarget_Interest_MultiSelect_loading(false)
  }, [Target_Interest_MultiSelect_loading]);


  // Country MultiSelect
  let Country_Target_MultiSelect_Value= React.useRef("");
  const [Country_Target_MultiSelectValues, setCountry_Target_MultiSelectValues] = React.useState([]);
  const [Country_Target_MultiSelectopen, setCountry_Target_MultiSelectOpen] = React.useState(false);
  const [Country_Target_MultiSelectoptions, setCountry_Target_MultiSelectOptions] = React.useState([]);
  const [Country_Target_MultiSelect_loading,setCountry_Target_MultiSelect_loading] =React.useState(false)
  React.useEffect(() => {
    if(Country_Target_MultiSelect_Value.current!=="" &&Country_Target_MultiSelect_Value.current!==Already_Searched_Target_Interest_Value.current)
    {
      Already_Searched_Target_Interest_Value.current=Country_Target_MultiSelect_Value.current
      let List_Of_Audience_Interests=Facebook_Search.Facebook_Get_Audience_Countries(Country_Target_MultiSelect_Value.current)
      List_Of_Audience_Interests.then((json)=>{
        if(json.data.length!==0)
        {
          let Combined_Interests= [...Country_Target_MultiSelectoptions, ...json.data].reduce((acc, curr) => {
            const found = acc.find(item => item.key === curr.key);
            if (!found) {
              acc.push(curr);
            }
            return acc;
          }, [])
          setCountry_Target_MultiSelectOptions(Combined_Interests)
        }
      
      })
    }
     
    setCountry_Target_MultiSelect_loading(false)
    }, [Country_Target_MultiSelect_loading]);



  //City/Region Multi Select

  let Already_Searched_Region_Value= React.useRef("");
  let Region_Target_MultiSelect_Value= React.useRef("");
  const [Region_Target_MultiSelectValues, setRegion_Target_MultiSelectValues] = React.useState([]);
  const [Region_Target_MultiSelectopen, setRegion_Target_MultiSelectOpen] = React.useState(false);
  const [Region_Target_MultiSelectoptions, setRegion_Target_MultiSelectOptions] = React.useState([]);
  const [Region_Target_MultiSelect_loading,setRegion_Target_MultiSelect_loading] =React.useState(false)
 
  React.useEffect(() => {
    if(Region_Target_MultiSelect_Value.current!=="" &&Region_Target_MultiSelect_Value.current!==Already_Searched_Region_Value.current)
    {
      Already_Searched_Region_Value.current=Region_Target_MultiSelect_Value.current
      let List_Of_Regions=Facebook_Search.Facebook_Get_Audience_Regions(Country_Target_MultiSelectValues,Region_Target_MultiSelect_Value.current) 
      if(List_Of_Regions.length!==0)
      {
        List_Of_Regions.then((json)=>{
          let Combined_Regions= [...Region_Target_MultiSelectoptions, ...json].reduce((acc, curr) => {
            const found = acc.find(item => item.key === curr.key);
            if (!found) {
              acc.push(curr);
            }
            return acc;
          }, [])
          setRegion_Target_MultiSelectOptions(Combined_Regions)
      })
      }
      
    }
     
    setRegion_Target_MultiSelect_loading(false)
    }, [Region_Target_MultiSelect_loading]);

  //Location Multi Select

  let Already_Searched_Location_Value= React.useRef("");
  let Location_Target_MultiSelect_Value= React.useRef("");
  const [Location_Target_MultiSelectValues, setLocation_Target_MultiSelectValues] = React.useState([]);
  const [Location_Target_MultiSelectopen, setLocation_Target_MultiSelectOpen] = React.useState(false);
  const [Location_Target_MultiSelectoptions, setLocation_Target_MultiSelectOptions] = React.useState([]);
  const [Location_Target_MultiSelect_loading,setLocation_Target_MultiSelect_loading] =React.useState(false)
  React.useEffect(() => {
    if(Location_Target_MultiSelect_Value.current!=="" &&Location_Target_MultiSelect_Value.current!==Already_Searched_Location_Value.current)
    {
      Already_Searched_Location_Value.current=Location_Target_MultiSelect_Value.current
      let List_Of_Regions=Facebook_Search.Facebook_Get_Audience_Locations(Region_Target_MultiSelectValues,Location_Target_MultiSelect_Value.current)
      
      if(List_Of_Regions.length!==0)
      {
        List_Of_Regions.then((json)=>{
          let Combined_Regions= [...Location_Target_MultiSelectoptions, ...json].reduce((acc, curr) => {
            const found = acc.find(item => item.key === curr.key);
            if (!found) {
              acc.push(curr);
            }
            return acc;
          }, [])
          setLocation_Target_MultiSelectOptions(Combined_Regions)
        
      
      })
      }
      
    }
     
    setLocation_Target_MultiSelect_loading(false)
    }, [Location_Target_MultiSelect_loading]);
  //Target language Multi Select
  const [Language_Target_MultiSelectValues, setLanguage_Target_MultiSelectValues] = React.useState([]);
  const [Language_Target_MultiSelectopen, setLanguage_Target_MultiSelectOpen] = React.useState(false);
  const [Language_Target_MultiSelectoptions, setLanguage_Target_MultiSelectOptions] = React.useState([]);
  const Language_Target_MultiSelectloading = Language_Target_MultiSelectopen && Language_Target_MultiSelectoptions.length === 0;

  React.useEffect(() => {
    let active = true;

    if (!Language_Target_MultiSelectloading) {
      return undefined;
    }

    (async () => {
      if (active) {
        setLanguage_Target_MultiSelectOptions([...Locales]);
      }
    })();

    return () => {
      active = false;
    };
  }, [Language_Target_MultiSelectloading]);

  React.useEffect(() => {
    if (!Language_Target_MultiSelectopen) {
      setLanguage_Target_MultiSelectOptions([]);
    }
  }, [Language_Target_MultiSelectopen]);

  //Age  Select

  const [From_age, setFrom_Age] = React.useState('');
  const [To_age, setTo_Age] = React.useState('');
  const [Gender, setGender] = React.useState('');
  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };
  const handleFromAgeChange = (event) => {
    setFrom_Age(event.target.value);
  };
  const handleToAgeChange = (event) => {
    setTo_Age(event.target.value);
  };


  //Callbacks that Handle the Target add/Cancel

  const HandleTargetApply=()=>
  {

    //testing if the age option is selected or not
    if(To_age!=""&&From_age!="")
    {
    //checking if the from age is smaller than To age
    if(To_age>From_age)
    {
      if(From_age>100&&From_age<5 &&To_age>100&To_age<5)
      {
        console.log(From_age)
        console.log(To_age)
        console.log(Language_Target_MultiSelectValues)
        console.log(Location_Target_MultiSelectValues)
        console.log(Region_Target_MultiSelectValues)
        console.log(Country_Target_MultiSelectValues)
        console.log(Target_Interest_MultiSelect_Values)
        handleClose()
      }
      else
      {
        toast.info(" Ages values should be between 5-100", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      
    }
    else
    {
      toast.info("From age should be smaller than To Age", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
      
    }else
    {

    }


   
  }



  return (
    <div>
      <Dialog
        open={true}
        fullWidth={true}
        maxWidth='lg'
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Post Targets</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
      <Container>
        <Row>
          <Col md={12}>
          <Accordion className='m-2' defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Post Targets</Accordion.Header>
        <Accordion.Body> 

          <Container style={{  justifyContent: 'center',textAlign: 'center'  }}>
          
            <Row style={{marginBottom:"1rem",marginTop:"1rem"}}>
            
        
       <strong style={{marginBottom:"1rem"}}><i><AccessibilityIcon/></i> Age  </strong>
           
              <Col md={6}>
              <FormControl fullWidth> 
              <TextField id="outlined-basic" type='number' label="From Age" variant="outlined" onChange={handleFromAgeChange} />
        </FormControl>
              </Col>
              <Col md={6}>
              <FormControl fullWidth>
               
               <TextField id="outlined-basic" type='number' label="To Age" variant="outlined" onChange={handleToAgeChange} />
         </FormControl>
              </Col>
            </Row>

            <Row>
            <strong style={{marginBottom:"1rem" ,marginTop:"1rem"}}><i><WcIcon /></i> Gender </strong>
              <Col>
              <FormControl fullWidth>
               
               <InputLabel id="demo-simple-select-label">Gender</InputLabel>
         <Select
           labelId="demo-simple-select-label"
           id="GENDER_ID"
           value={Gender}
           label="Gender"
           onChange={handleGenderChange}
         >
           <MenuItem value={1}>Male</MenuItem>
           <MenuItem value={2}>Female</MenuItem>
         </Select>
         </FormControl>
              </Col>
            </Row>
            <Row>
            <strong style={{marginBottom:"1rem",marginTop:"1rem"}}><i><LocationOnIcon/></i> Location</strong>
              <Col>
              
              <Autocomplete
                multiple
                limitTags={7}
                onChange={(event, newValue) => {
                  setCountry_Target_MultiSelectValues(newValue)
                  //if the Country is changed, all the regions should be updated 
                setRegion_Target_MultiSelectValues([])
                setRegion_Target_MultiSelectOptions([])  
                }}  
                id="multiple-limit-tags"  
              open={Country_Target_MultiSelectopen}
              onOpen={() => {
                setCountry_Target_MultiSelectOpen(true);
              }}
              onClose={() => {
                setCountry_Target_MultiSelectOpen(false);
              }}
              isOptionEqualToValue={(option, value) => option.key === value.key}
              getOptionLabel={(option) => option.name}
              options={Country_Target_MultiSelectoptions}
              loading={Country_Target_MultiSelect_loading}
              onInputChange={(e)=>{ 
                Country_Target_MultiSelect_Value.current=e.target.value 
                setCountry_Target_MultiSelect_loading(true)
                 
           }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Countries"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {Country_Target_MultiSelect_loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
              </Col>
              <Col>
              <Autocomplete
                multiple
                limitTags={7}
                id="multiple-limit-tags" 
                value={Region_Target_MultiSelectValues}
              open={Region_Target_MultiSelectopen}
              onChange={(event, newValue) => {
                setRegion_Target_MultiSelectValues(newValue)
                //If the region changes, all the locations should be updated
                 setLocation_Target_MultiSelectOptions([])
                setLocation_Target_MultiSelectValues([])
              }}  
              onOpen={() => {
                setRegion_Target_MultiSelectOpen(true);
               
              }}
              onClose={() => {
                setRegion_Target_MultiSelectOpen(false);
              }}
              isOptionEqualToValue={(option, value) => option.key === value.key}
              getOptionLabel={(option) => option.name}
              options={Region_Target_MultiSelectoptions}
              loading={Region_Target_MultiSelect_loading}
              onInputChange={(e)=>{ 
                Region_Target_MultiSelect_Value.current=e.target.value 
                setRegion_Target_MultiSelect_loading(true)     
           }}
            
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Region"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {Region_Target_MultiSelect_loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
              </Col>

              <Col>
              <Autocomplete
                value={Location_Target_MultiSelectValues}
                onChange={(event, newValue) => {
                  setLocation_Target_MultiSelectValues(newValue)
                }}
                onInputChange={(e)=>{ 
                Location_Target_MultiSelect_Value.current=e.target.value 
                setLocation_Target_MultiSelect_loading(true)     
                }}
                multiple
                limitTags={7}
                id="multiple-limit-tags"  
              open={Location_Target_MultiSelectopen}
              onOpen={() => {
                setLocation_Target_MultiSelectOpen(true);
              }}
              onClose={() => {
                setLocation_Target_MultiSelectOpen(false);
              }}
              isOptionEqualToValue={(option, value) => option.key === value.key}
              getOptionLabel={(option) => option.name}
              options={Location_Target_MultiSelectoptions}
              loading={Location_Target_MultiSelect_loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Location"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {Location_Target_MultiSelect_loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
              </Col>
            </Row>
            

            <Row>
            <strong style={{marginBottom:"1rem",marginTop:"1rem"}}><i><TranslateIcon/></i> Languages </strong>
              <Col md={12}>
              <Autocomplete
              onChange={(event, newValue)=>
              {
                setLanguage_Target_MultiSelectValues(newValue)
              }}
                multiple
                limitTags={7}
                id="multiple-limit-tags"  
              open={Language_Target_MultiSelectopen}
              onOpen={() => {
                setLanguage_Target_MultiSelectOpen(true);
              }}
              onClose={() => {
                setLanguage_Target_MultiSelectOpen(false);
              }}
              isOptionEqualToValue={(option, value) => option.key === value.key}
              getOptionLabel={(option) => option.name}
              options={Language_Target_MultiSelectoptions}
              loading={Language_Target_MultiSelectloading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Location"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {Language_Target_MultiSelectloading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
              </Col>
            </Row>

            <Row>
            <strong style={{marginBottom:"1rem",marginTop:"1rem"}}><i><InterestsIcon/></i> Interests </strong>
              <Col md={12}>
              <Autocomplete
              onChange={(event, newValue)=>
              {
                setTarget_Interest_MultiSelect_Values(newValue)
              }}
                multiple
                limitTags={7}
                id="multiple-limit-tags"  
              open={Target_Interest_MultiSelect_open}
              onOpen={() => {
                setTarget_Interest_MultiSelect_Open(true);
              }}
              onClose={() => {
                setTarget_Interest_MultiSelect_Open(false);
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              getOptionLabel={(option) => option.name}
              options={Target_Interest_MultiSelect_options}
              loading={Target_Interest_MultiSelect_loading}
              onInputChange={(e)=>{ 
                  Target_Interest_MultiSelect_Value.current=e.target.value 
                  setTarget_Interest_MultiSelect_loading(true)     
             }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Audience Interests"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {Target_Interest_MultiSelect_loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
              </Col>
            </Row>
          </Container>

       
        </Accordion.Body>
      </Accordion.Item>
     
    </Accordion>
          </Col>
          
        </Row>
      </Container>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color='error' startIcon={<CancelIcon />} onClick={handleClose}>Cancel</Button>
          <Button variant="outlined" color='primary' startIcon={<ModeStandbyIcon />} onClick={HandleTargetApply}>Apply Targetting</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}