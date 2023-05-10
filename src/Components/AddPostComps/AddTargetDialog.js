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
import * as variables from "../../variables/variables"
import * as Facebook_Search from "../../libs/Facebook_Search"
import CancelIcon from '@mui/icons-material/Cancel';
import ModeStandbyIcon from '@mui/icons-material/ModeStandby';
import WcIcon from '@mui/icons-material/Wc';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TranslateIcon from '@mui/icons-material/Translate';
import InterestsIcon from '@mui/icons-material/Interests';
import {  toast } from "react-toastify";
import { Avatar } from "@nextui-org/react";
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import IconButton from '@mui/material/IconButton';
import Fade from '@mui/material/Fade'; 
import LocalesJSON from "../../Data/Locales.json" 
const Locales=LocalesJSON

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default   function AlertDialogSlide({SetShowAddTargetDialog}) { 
  const handleClose = () => {
    SetShowAddTargetDialog(false)
  };
  //Interests Async Multi Select
  let Already_Searched_Target_Interest_Value= React.useRef("");
  let Target_Interest_MultiSelect_Value= React.useRef("");
  console.log(variables.PostGlobalVariables.POST_CachedInterestOptions)
  const [Target_Interest_MultiSelect_Values, setTarget_Interest_MultiSelect_Values] = React.useState(variables.PostGlobalVariables.POST_TargetedInterests);
  const [Target_Interest_MultiSelect_open, setTarget_Interest_MultiSelect_Open] = React.useState(false);
  const [Target_Interest_MultiSelect_options, setTarget_Interest_MultiSelect_Options] = React.useState(variables.PostGlobalVariables.POST_CachedInterestOptions);
  const [Target_Interest_MultiSelect_loading,setTarget_Interest_MultiSelect_loading] =React.useState(false)
  
  //----------------------NOTE:This function Updates the Interests options based on the input value------------------------//
  const HandleInterestsOptionsUpdate=(() => {

    Already_Searched_Target_Interest_Value.current=Target_Interest_MultiSelect_Value.current
    let List_Of_Audience_Interests= Facebook_Search.Facebook_Get_Audience_Interests(Target_Interest_MultiSelect_Value.current)
    List_Of_Audience_Interests.then((Result)=>{

      
      if(Result.length!==0)
      {
        let Combined_Interests= [...Target_Interest_MultiSelect_options, ...Result].reduce((acc, curr) => {
          const found = acc.find(item => item.id === curr.id);
          if (!found) {
            acc.push(curr);
          }
          return acc;
        }, [])
        setTarget_Interest_MultiSelect_Options(Combined_Interests)      
      }
      setTarget_Interest_MultiSelect_loading(false)
    })
  });

  // Country MultiSelect
  let Country_Target_MultiSelect_Value= React.useRef("");
  const [Country_Target_MultiSelectValues, setCountry_Target_MultiSelectValues] = React.useState(variables.PostGlobalVariables.POST_TargetedCountries);
  const [Country_Target_MultiSelectopen, setCountry_Target_MultiSelectOpen] = React.useState(false);
  const [Country_Target_MultiSelectoptions, setCountry_Target_MultiSelectOptions] = React.useState(variables.PostGlobalVariables.POST_CachedCountryOptions);
  const [Country_Target_MultiSelect_loading,setCountry_Target_MultiSelect_loading] =React.useState(false)
 
  //----------------------NOTE:This function Updates the country options based on the input value------------------------//
  const HandleCountryOptionsUpdate=(() => {
      Already_Searched_Target_Interest_Value.current=Country_Target_MultiSelect_Value.current
      let CountriesPromise=Facebook_Search.Facebook_Get_Audience_Countries(Country_Target_MultiSelect_Value.current)
      CountriesPromise.then((json)=>{
        if(json.length!==0)
        {
          let Combined_Countries= [...Country_Target_MultiSelectoptions, ...json].reduce((acc, curr) => {
            const found = acc.find(item => item.id === curr.id);
            if (!found) {
              acc.push(curr);
            }
            return acc;
          }, [])
          setCountry_Target_MultiSelectOptions(Combined_Countries)
        }
        setCountry_Target_MultiSelect_loading(false)
      })
    })
 //----------------------END NOTE------------------------//


  //City/Region Multi Select

  let Already_Searched_Region_Value= React.useRef("");
  let Region_Target_MultiSelect_Value= React.useRef("");
  const [Region_Target_MultiSelectValues, setRegion_Target_MultiSelectValues] = React.useState(variables.PostGlobalVariables.POST_TargetedRegions);
  const [Region_Target_MultiSelectopen, setRegion_Target_MultiSelectOpen] = React.useState(false);
  const [Region_Target_MultiSelectoptions, setRegion_Target_MultiSelectOptions] = React.useState(variables.PostGlobalVariables.POST_CachedRegionOptions);
  const [Region_Target_MultiSelect_loading,setRegion_Target_MultiSelect_loading] =React.useState(false)
 
   //----------------------NOTE:This function Updates the Regions options based on the input value and Selected Countries------------------------//
  const HandleRegionOptionsUpdate=(() => {
      Already_Searched_Region_Value.current=Region_Target_MultiSelect_Value.current
      let List_Of_Regions=Facebook_Search.Facebook_Get_Audience_Regions(Country_Target_MultiSelectValues,Region_Target_MultiSelect_Value.current) 
     
        List_Of_Regions.then((json)=>{
          if(json.length!==0)
          {
          let Combined_Regions= [...Region_Target_MultiSelectoptions, ...json].reduce((acc, curr) => {
            const found = acc.find(item => item.id === curr.id);
            if (!found) {
              acc.push(curr);
            }
            return acc;
          }, [])
          setRegion_Target_MultiSelectOptions(Combined_Regions)
        }
        setRegion_Target_MultiSelect_loading(false)
      })
      
      
    });
//----------------------END NOTE------------------------//
  //Location Multi Select

  let Already_Searched_Location_Value= React.useRef("");
  let Location_Target_MultiSelect_Value= React.useRef("");
  const [Location_Target_MultiSelectValues, setLocation_Target_MultiSelectValues] = React.useState(variables.PostGlobalVariables.POST_TargetedLocations);
  const [Location_Target_MultiSelectopen, setLocation_Target_MultiSelectOpen] = React.useState(false);
  const [Location_Target_MultiSelectoptions, setLocation_Target_MultiSelectOptions] = React.useState(variables.PostGlobalVariables.POST_CachedLocationOptions);
  const [Location_Target_MultiSelect_loading,setLocation_Target_MultiSelect_loading] =React.useState(false)
  //----------------------NOTE:This function Updates the Locations options based on the input value and Selected Regions------------------------//
  
 const HandleLocationOptionsUpdate=(() => {

      Already_Searched_Location_Value.current=Location_Target_MultiSelect_Value.current
      let List_Of_Regions=Facebook_Search.Facebook_Get_Audience_Locations(Region_Target_MultiSelectValues,Location_Target_MultiSelect_Value.current)
        List_Of_Regions.then((json)=>{
          if(json.length!==0)
          {
          let Combined_Regions= [...Location_Target_MultiSelectoptions, ...json].reduce((acc, curr) => {
            const found = acc.find(item => item.id === curr.id);
            if (!found) {
              acc.push(curr);
            }
            return acc;
          }, [])
          setLocation_Target_MultiSelectOptions(Combined_Regions)    
          }
          setLocation_Target_MultiSelect_loading(false)
        })
    });

   //----------------------END NOTE------------------------//
  //Target language Multi Select
  const [Language_Target_MultiSelectValues, setLanguage_Target_MultiSelectValues] = React.useState(variables.PostGlobalVariables.POST_TargetedLanguages);
  const [Language_Target_MultiSelectopen, setLanguage_Target_MultiSelectOpen] = React.useState(false);
  const [Language_Target_MultiSelectoptions, setLanguage_Target_MultiSelectOptions] = React.useState([...Locales]);
  const Language_Target_MultiSelectloading = false
  //Age  Select

  const [From_age, setFrom_Age] = React.useState( variables.PostGlobalVariables.POST_TargetedAgeRange.FromAge);
  const [To_age, setTo_Age] = React.useState(variables.PostGlobalVariables.POST_TargetedAgeRange.ToAge);
  const [Gender, setGender] = React.useState(variables.PostGlobalVariables.POST_TargetedGenderId);
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
    if(Number(To_age)>Number(From_age))
    {
      if(Number(From_age)<100&&Number(From_age)>5 &&Number(To_age)<100&&Number(To_age)>5)
      {

        //Updating the POST variables in /variables.js
        //Updating Age
        variables.PostGlobalVariables.POST_TargetedAgeRange.FromAge=From_age
        variables.PostGlobalVariables.POST_TargetedAgeRange.ToAge=To_age
        //Updating Gender
        variables.PostGlobalVariables.POST_TargetedGenderId=Gender
        //Updating Language
        variables.PostGlobalVariables.POST_TargetedLanguages=Language_Target_MultiSelectValues
        //Caching LanguageOptionList
        variables.PostGlobalVariables.POST_CachedLanguageOptions=Language_Target_MultiSelectoptions
          //Updating Location
        variables.PostGlobalVariables.POST_TargetedLocations=Location_Target_MultiSelectValues
        //Caching LocationOptionList
        variables.PostGlobalVariables.POST_CachedLocationOptions=Location_Target_MultiSelectoptions
          //Updating Regions
        variables.PostGlobalVariables.POST_TargetedRegions=Region_Target_MultiSelectValues
        //Caching RegionOptionList
        variables.PostGlobalVariables.POST_CachedRegionOptions=Region_Target_MultiSelectoptions
          //Updating Countries
        variables.PostGlobalVariables.POST_TargetedCountries=Country_Target_MultiSelectValues
        //Caching CountriesoptionList
        variables.PostGlobalVariables.POST_CachedCountryOptions=Country_Target_MultiSelectoptions
         //Updating Interests
        variables.PostGlobalVariables.POST_TargetedInterests=Target_Interest_MultiSelect_Values
        //Caching InterestsoptionList
        variables.PostGlobalVariables.POST_CachedInterestOptions=Target_Interest_MultiSelect_options

        toast.info("Post Targetting Applied !", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
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
      //Updating the POST variables in /variables.js
        //Updating Age
        variables.PostGlobalVariables.POST_TargetedAgeRange.FromAge=From_age
        variables.PostGlobalVariables.POST_TargetedAgeRange.ToAge=To_age
        //Updating Gender
        variables.PostGlobalVariables.POST_TargetedGenderId=Gender
        //Updating Language
        variables.PostGlobalVariables.POST_TargetedLanguages=Language_Target_MultiSelectValues
        //Caching LanguageOptionList
        variables.PostGlobalVariables.POST_CachedLanguageOptions=Language_Target_MultiSelectoptions
          //Updating Location
        variables.PostGlobalVariables.POST_TargetedLocations=Location_Target_MultiSelectValues
        //Caching LocationOptionList
        variables.PostGlobalVariables.POST_CachedLocationOptions=Location_Target_MultiSelectoptions
          //Updating Regions
        variables.PostGlobalVariables.POST_TargetedRegions=Region_Target_MultiSelectValues
        //Caching RegionOptionList
        variables.PostGlobalVariables.POST_CachedRegionOptions=Region_Target_MultiSelectoptions
          //Updating Countries
        variables.PostGlobalVariables.POST_TargetedCountries=Country_Target_MultiSelectValues
        //Caching CountriesoptionList
        variables.PostGlobalVariables.POST_CachedCountryOptions=Country_Target_MultiSelectoptions
         //Updating Interests
        variables.PostGlobalVariables.POST_TargetedInterests=Target_Interest_MultiSelect_Values
        //Caching InterestsoptionList
        variables.PostGlobalVariables.POST_CachedInterestOptions=Target_Interest_MultiSelect_options

        toast.info("Post Targetting Applied !", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        handleClose()

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
        <DialogTitle>Target Post</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
      <Container>
        <Row>
          <Col md={12}>
          <Accordion className='m-2' defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <Container style={{display:"flex",justifyContent:"left",alignItems:"center"}}>
            <Row>
              <Col md={4}>
              <Avatar size="xl" style={{marginRight:"0.5rem"}} src="https://firebasestorage.googleapis.com/v0/b/socialpost-58454.appspot.com/o/PlatformsLogo%2Ftarget.png?alt=media&token=884b4ed1-5c08-494e-9ea7-a92cd85119ab" color="primary" zoomed/>
              </Col>
             
              
            </Row>
            <Row>
            <Col md={10}>
               <p style={{marginTop:"1rem"}}>Facebook & Instagram Targetting Option</p>
              </Col>
              <Col md={2}>
              <Tooltip style={{marginTop:"0.5rem"}} title="Here you can Target Facebook and Instagram posts so that they be posted specifically for certain people, example  only to females" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}><IconButton> <HelpOutlineIcon /></IconButton></Tooltip> 
              </Col>
            </Row>
          </Container>

       </Accordion.Header>
        <Accordion.Body> 

          <Container style={{  justifyContent: 'center',textAlign: 'center'  }}>
          
            <Row style={{marginBottom:"1rem",marginTop:"1rem"}}>
            
        
       <strong style={{marginBottom:"1rem"}}><i><AccessibilityIcon/></i> Age  </strong>
           
              <Col md={6}>
              <FormControl fullWidth> 
              <TextField id="outlined-basic" type='number' defaultValue={From_age} label="From Age" variant="outlined" onChange={handleFromAgeChange} />
        </FormControl>
              </Col>
              <Col md={6}>
              <FormControl fullWidth>
               
               <TextField id="outlined-basic" type='number' defaultValue={To_age} label="To Age" variant="outlined" onChange={handleToAgeChange} />
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
           <MenuItem value={1}>Males Only</MenuItem>
           <MenuItem value={2}>Females Only</MenuItem>
           <MenuItem  value={3}>Both Genders</MenuItem>
         </Select>
         </FormControl>
              </Col>
            </Row>
            <Row>
            <strong style={{marginBottom:"1rem",marginTop:"1rem"}}><i><LocationOnIcon/></i> Location</strong>
              <Col>
              
              <Autocomplete
                multiple
                onChange={(event, newValue) => {
                  setCountry_Target_MultiSelectValues(newValue)
                  //if the Country is changed, all the regions should be updated 
                setRegion_Target_MultiSelectValues([])
                setRegion_Target_MultiSelectOptions([]) 
                setLocation_Target_MultiSelectOptions([])
                setLocation_Target_MultiSelectValues([]) 
                }}  
                id="multiple-limit-tags"  
              open={Country_Target_MultiSelectopen}
              onOpen={() => {
                setCountry_Target_MultiSelectOpen(true);
              }}
              onClose={() => {
                setCountry_Target_MultiSelectOpen(false);
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              getOptionLabel={(option) => option.country_Name}
              options={Country_Target_MultiSelectoptions}
              loading={Country_Target_MultiSelect_loading}
              value={Country_Target_MultiSelectValues}
              onInputChange={(e)=>{ 
                   Country_Target_MultiSelect_Value.current=e.target.value
                  if(Country_Target_MultiSelect_Value.current!=="" &&Country_Target_MultiSelect_Value.current!=0 &&Country_Target_MultiSelect_Value.current!==Already_Searched_Target_Interest_Value.current)
                  {                    
                    setCountry_Target_MultiSelect_loading(true)
                    HandleCountryOptionsUpdate()
                  } 
                        
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
              
              isOptionEqualToValue={(option, value) => option.id === value.id}
              getOptionLabel={(option) => option.region_Name}
              options={Region_Target_MultiSelectoptions}
              loading={Region_Target_MultiSelect_loading}
              onInputChange={(e)=>{ 
                   Region_Target_MultiSelect_Value.current=e.target.value
                  if(Region_Target_MultiSelect_Value.current!=0 && Region_Target_MultiSelect_Value.current!=="" &&Region_Target_MultiSelect_Value.current!==Already_Searched_Region_Value.current)
                  {             
                    setRegion_Target_MultiSelect_loading(true)
                    HandleRegionOptionsUpdate()  
                  }     
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
                  if(Location_Target_MultiSelect_Value.current!==0 &&Location_Target_MultiSelect_Value.current!=="" &&Location_Target_MultiSelect_Value.current!==Already_Searched_Location_Value.current)
                    {                 
                        setLocation_Target_MultiSelect_loading(true)  
                        HandleLocationOptionsUpdate()
                    }
                }   
              }
                multiple
                id="multiple-limit-tags"  
              open={Location_Target_MultiSelectopen}
              onOpen={() => {
                setLocation_Target_MultiSelectOpen(true);
              }}
              onClose={() => {
                setLocation_Target_MultiSelectOpen(false);
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              getOptionLabel={(option) => option.location_Name}
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
              value={Language_Target_MultiSelectValues}
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
              value={Target_Interest_MultiSelect_Values}
              onChange={(event, newValue)=>
              {
                setTarget_Interest_MultiSelect_Values(newValue)
              }}
                multiple
                id="multiple-limit-tags"  
              open={Target_Interest_MultiSelect_open}
              onOpen={() => {
                setTarget_Interest_MultiSelect_Open(true);
              }}
              onClose={() => {
                setTarget_Interest_MultiSelect_Open(false);
              }}
              isOptionEqualToValue={(option, value) => option.id == value.id}
              getOptionLabel={(option) => option.interest_Name}
              options={Target_Interest_MultiSelect_options}
              loading={Target_Interest_MultiSelect_loading}
              onInputChange={(e)=>{ 
                  Target_Interest_MultiSelect_Value.current=e.target.value 
                  if(Target_Interest_MultiSelect_Value.current!==0&& Target_Interest_MultiSelect_Value.current!=="" &&Target_Interest_MultiSelect_Value.current!==Already_Searched_Target_Interest_Value.current)
                  {
                  setTarget_Interest_MultiSelect_loading(true) 
                  HandleInterestsOptionsUpdate()   
                  } 
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