import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { Row,Col,Container } from 'react-bootstrap';
import { MDBBtn } from 'mdb-react-ui-kit';
import UndoIcon from '@mui/icons-material/Undo';
import DropdownTreeSelect from 'react-dropdown-tree-select'
import {UserSelectedTabActions,UserTabs,HeaderSpinnerActions,HeaderSpinner,User}from "../../variables/variables"
import {AppContext} from "../../context/Context"
import {CALL_API_With_JWTToken,CALL_API_With_JWTToken_GET} from '../../libs/APIAccessAndVerification'
import {hashString,hashRandom } from 'react-hash-string'
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import PatternIcon from '@mui/icons-material/Pattern';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as variables from "../../variables/variables"
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import { Avatar } from "@nextui-org/react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import * as APILib from "../../libs/APIAccessAndVerification"
import CancelIcon from '@mui/icons-material/Cancel';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import InputIcon from '@mui/icons-material/Input';
import SaveIcon from '@mui/icons-material/Save';
export  function FormDialog(props) {
    const [open, setOpen] = React.useState(true);
    const {GlobalState,Dispatch}=React.useContext(AppContext)
    const PatternName= React.useRef();
    const PatternValue=React.useRef();
    const handleClose = () => {
        props.SetShowAddPattern(false)
      setOpen(false);
    };
   const handleChangePatternName=(e)=>
   {
    PatternName.current=e.target.value
   }
   const handlePatternValue=(e)=>
   {
    PatternValue.current=e.target.value
   }
    const handlePatternAdd=()=>
    {
         if(PatternName.current=="" ||PatternValue.current=="")
         {
          toast.info("The Pattern Name and value cannot be empty!", {
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
         else
         {


          const pattern = /^\/\/.*\/\/$/; // regular expression pattern

            if (pattern.test(PatternValue.current)) {
              var JsonObject = {
                patternName: PatternName.current,
                patternText: PatternValue.current,
                groupID: GlobalState.SelectedGroup.id,
                };
                
                let JsonObjectToSend = JSON.stringify(JsonObject);
                let url2 =
                process.env.REACT_APP_BACKENDURL + 
                process.env.REACT_APP_ADDPATTERN;
                let UserToken = window.localStorage.getItem("AuthToken");
                let APIResult = APILib.CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);
                APIResult.then((result) => {
                if (result.errorCode == undefined) {
                  if(result.successCode==="Pattern_Added")
                  {
                    toast.success("The Pattern Created successfully!", {
                      position: "bottom-left",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                    })
                    props.SetLocalReRender(!props.LocalRerender)
                    handleClose()
                  }
                  
                 
                // setPagesList(result.result);
                }
                else
                {
                 if(result.result =="Pattern_Exist") 
                 {
                  toast.info("The pattern you're trying to add Already Exist please pick a different name", {
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
                 if(result.result =="Group_Doesnt_exist")
                 {
                  toast.error("Error, looks like the Group you're under no longer exist", {
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
                });
            } else {
              toast.info("Pattern Value is formated wrongly, Please use this format //PatternValue//", {
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
      
    }
 
    return (
      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Pattern Creation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To Create your Pattern please input the name of the pattern  and the pattern you want to use for it.
            </DialogContentText>
            <TextField   
              autoFocus
              margin="dense"
              id="name"
              label="Pattern Name"
              type="text"
              fullWidth
              onChange={handleChangePatternName}
              variant="standard"
              v
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Pattern"
              type="text"
              fullWidth
              onChange={handlePatternValue}
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color='error' startIcon={<CancelIcon />} onClick={handleClose}>Cancel</Button>
            <Button variant="outlined" color='primary' startIcon={<SaveAltIcon />} onClick={handlePatternAdd}>Save Pattern</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
export function AddDynamicFieldDialog(props) {
    const [open, setOpen] = React.useState(true); 
    let handleDynamicFieldCreation=()=>{

     var EmptyFieldOccurence=0
     let DynamicField= 
        {
          patternID: props.selected[0],
          listOfPagesDynamicFieldValues: [] 
        }
     let  listOfPagesDynamicFieldValues= []
      
  if(variables.PostGlobalVariables.POST_SelectedPageInfo.length!==0)
  {
    variables.PostGlobalVariables.POST_SelectedPageInfo.map((page)=>{
      var element=document.getElementById(page.id)
       if(element.value=="")
       {
        EmptyFieldOccurence++
       }
      listOfPagesDynamicFieldValues=[...listOfPagesDynamicFieldValues,{pageID: page.id,dynamicFieldValue: element.value}]
    
    })
  }
  if(EmptyFieldOccurence!=variables.PostGlobalVariables.POST_SelectedPageInfo.length)
  {

  
  let PatternUsedFlag=false
  variables.PostGlobalVariables.POST_AddedDynamicFields.map((df)=>{

    if(df.patternID===props.selected[0])
    {
      PatternUsedFlag=true
    }
  })
  if(PatternUsedFlag==false)
  {
    DynamicField.listOfPagesDynamicFieldValues=listOfPagesDynamicFieldValues
    variables.PostGlobalVariables.POST_AddedDynamicFields=[...variables.PostGlobalVariables.POST_AddedDynamicFields,DynamicField]
    toast.success("Pattern Created.", {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
   
    //Here we simply go through all the patterns, we extract the patternText and we insert it to the Editor
    let PatternText="//ERROR//"
    variables.PostGlobalVariables.POST_PatternsInfo.map((Pattern)=>{
        if(Pattern.id==props.selected[0])
        {
          PatternText=Pattern.patternText
        }
    })
    props.appendText(PatternText)
  }
  else
  {
    toast.info("The Selected Pattern is already in use by an other Dynamic FIeld", {
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
 handleClose() 
}
else
{
  toast.info("The Input value for Page Dynamic field cannot be empty for Every page!", {
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
  
  
  const handleClose = () => {
    setOpen(false);
    props.SetShowAddDynamicField(false)
  };
  
  
  
  
  
  
  return (
    <>
       <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Create Dynamic FIeld
          </DialogTitle>
          <DialogContent>
            <DialogContentText className='m-2' id="alert-dialog-description">

             Please Input the dynamic fields values for each of the Pages you Selected
                     for the current Selected Pattern

            </DialogContentText>
            <Container>
              {variables.PostGlobalVariables.POST_SelectedPageInfo.length===0&&<p>No Selected Pages Found</p>}
              {variables.PostGlobalVariables.POST_SelectedPageInfo.map((page)=>{
              
              return(
                <Row className='m-2'>
                <Col> <Row><Col><Avatar size="lg" src={page.PagePic} color="gradient"   squared zoomed/></Col> <Col>{page.label}</Col></Row></Col>
                <Col>
                <FormControl>
        <InputLabel htmlFor="component-outlined">Value</InputLabel>
        <OutlinedInput
          id={page.id}
          defaultValue=""
          label="Name"
          required
        />
      </FormControl>
                </Col>
            </Row>
              )

              })}
            </Container>
          </DialogContent>
          <DialogActions>
         
            <Button variant="outlined" color="error" startIcon={<CancelIcon />}  onClick={handleClose}>Cancel</Button>
            {variables.PostGlobalVariables.POST_SelectedPageInfo.length!==0&&<Button  startIcon={<SaveAltIcon />} variant="outlined" onClick={handleDynamicFieldCreation}>
              Add Dynamic Field
            </Button>}
          </DialogActions>
        </Dialog>
    </>
      
       
  );
  }




  export function DeletePatternConfirmDialog(props) {
  const handleClose = () => {
    props.SetDeletePatternConfirmDialog(false)
  };
  return (
    <>
       <Dialog
          open={true}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
           Pattern Delete
          </DialogTitle>
          <DialogContent>
            <DialogContentText className='m-2' id="alert-dialog-description">

             Are you sure you want to delete the pattern?
            </DialogContentText>
          
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" startIcon={<CancelIcon />}  onClick={handleClose}>No Don't Delete</Button>
            <Button variant="outlined"color="error" startIcon={<DeleteIcon/>} onClick={()=>{props.handleRemovePattern();handleClose()}}>
             Yes, Delete.
            </Button>
          </DialogActions>
        </Dialog>
    </>
      
       
  );
  }


export function FilterDialog(props) {
  const [open, setOpen] = React.useState(true);
  const {GlobalState,Dispatch}=React.useContext(AppContext)
  let UserText=React.useRef("")
 



const handleClose = () => {
  setOpen(false);
  props.SetFilterModal(false)
};

const FilterUsers=()=>{

var filteredrows=[]
props.Rows.map((row)=>{
  if(row.patternName.includes(UserText.current.value))
  {
    filteredrows=[...filteredrows,row]
  }

})
props.ChangeRows(filteredrows)
handleClose()
}

const cancelFilter=()=>
{
props.RevertRows()
handleClose()
}
return (
  <>
    <div>
      
      <Dialog fullWidth={true} open={open} >
        <DialogTitle> Search User</DialogTitle>
        <DialogContent>
          <DialogContentText>
           Please input the Pattern Name
          </DialogContentText>
          <input ref={UserText} className="form-control" name="UserName" id="age" type="text" placeholder="Enter the name" />
         
       </DialogContent>

        <DialogActions>
          <Button variant="outlined"color="primary" startIcon={<UndoIcon/>} onClick={cancelFilter}>Remove Filter</Button>
          <Button variant="outlined"color="primary" startIcon={<FilterAltIcon/>} onClick={FilterUsers}>Apply Filter</Button>
        </DialogActions>
      </Dialog>
    </div>
  </>
    
     
);
}







function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'ID',
    numeric: false,
    disablePadding: true,
    label: 'id',
  },
  {
    id: 'Pattern Name',
    numeric: true,
    disablePadding: false,
    label: 'Pattern Name',
  },
  {
    id: 'Pattern Value',
    numeric: true,
    disablePadding: false,
    label: 'Pattern Value',
  }


];




function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          List Of Patterns
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon onClick={()=>{props.SetDeletePatternConfirmDialog(!props.ShowDeletePatternConfirmDialog) }} />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon onClick={()=>{props.SetFilterModal(true)}} />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

 function handleRemove(e){
  let tempDynamicFieldsVar
variables.PostGlobalVariables.POST_AddedDynamicFields.map((df)=>{
if(df.patternID==e)
{
tempDynamicFieldsVar= variables.PostGlobalVariables.POST_AddedDynamicFields.filter((element) => element.patternID != e)

}
}) 
variables.PostGlobalVariables.POST_AddedDynamicFields=tempDynamicFieldsVar
toast.success("Dynamic Field Successfully removed !", {
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

function CollapseRow(props) {
  const { dfdata } = props;
  const { rows } = props;
  const [open, setOpen] = React.useState(false);
  const { SetLocalReRender } = props;
  const { LocalRerender } = props;
  const {appendText}=props
  //preparing pattern info
  let patternName=""
  let patternTxt=""
  let PatternID=dfdata.patternID
  rows.map((row)=>{
    if(row.id==dfdata.patternID)
    {
      patternName=row.patternName
      patternTxt=row.patternText
    }
  })
  const UpdateDynamicField=(pageid,patternid)=>{

    console.log(pageid,patternid)
    let NewInputValue= document.getElementById("PAGEDynamicFieldVAlue"+pageid).value
    console.log(variables.PostGlobalVariables.POST_AddedDynamicFields)
    variables.PostGlobalVariables.POST_AddedDynamicFields.map((df)=>{

      if(df.patternID==patternid)
      {
        df.listOfPagesDynamicFieldValues.map((df_page_value)=>{

          if(df_page_value.pageID==pageid)
          {
            df_page_value.dynamicFieldValue=NewInputValue
          }
        })
      }
      
    })
  }

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {dfdata.patternID}
        </TableCell>
        <TableCell>{patternName}</TableCell>
        <TableCell><IconButton onClick={()=>{handleRemove(dfdata.patternID);props.RemoveDynamicFieldText(patternTxt);SetLocalReRender(!LocalRerender)
        ;toast.info("The selected DynamicField deleted successfully !", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });}}>
          <DeleteIcon/>
        </IconButton>
        </TableCell>

        <TableCell><IconButton onClick={()=>{appendText(" "+patternTxt);SetLocalReRender(!LocalRerender);
      toast.info("The pattern inserted in the textfield", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });}}>
          <InputIcon/>
        </IconButton>
        </TableCell>
        
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Selected Pages
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Page Name</TableCell>
                    <TableCell></TableCell>
                    <TableCell>Pattern Value </TableCell>
                    <TableCell >Value</TableCell>
                    <TableCell ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dfdata.listOfPagesDynamicFieldValues.map((SRow) =>{ 
                    //preparing the page info
                        var Pagelabel=null
                        var PagePicUrl=null
                        variables.PostGlobalVariables.POST_SelectedPageInfo.map((page)=>{
                          if(SRow.pageID==page.id)
                          {
                          Pagelabel=page.label
                          PagePicUrl=page.PagePic
                          }
                        })
                    return(
                    <TableRow key={SRow.pageID}>
                      <TableCell component="th" scope="row">
                        {Pagelabel}
                      </TableCell>
                      <TableCell><Avatar size="lg" src={PagePicUrl} color="gradient"   squared zoomed/></TableCell>
                      <TableCell>{patternTxt}</TableCell>
                      <TableCell><TextField id={"PAGEDynamicFieldVAlue"+SRow.pageID}  key={SRow.pageID} variant="outlined" defaultValue={SRow.dynamicFieldValue} /></TableCell>
                      <TableCell><IconButton onClick={()=>{UpdateDynamicField(SRow.pageID,PatternID);
                        toast.info("The value of the dynamic field Updated!", {
                          position: "bottom-left",
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: "light",
                        });}}>
                          
                            <SaveIcon/>
                          </IconButton>
                          </TableCell>
                    </TableRow>
                  )
                }
                  
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export  default function EnhancedTable({appendText,RemoveDynamicFieldText}) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [FilterModal, SetFilterModal] = React.useState(false);
  const [ShowAddDynamicField, SetShowAddDynamicField] = React.useState(false);
  const [ShowAddPattern, SetShowAddPattern] = React.useState(false);
  let [ShowDeletePatternConfirmDialog, SetDeletePatternConfirmDialog] = React.useState(false);
  const {GlobalState,Dispatch}=React.useContext(AppContext)
  let [LocalRerender,SetLocalReRender]=React.useState(false)
  let [rows, setrows] = React.useState([{}]);
  let [Backuprows, setBackuprows] = React.useState([{}]); 

 //Here we will be loading the patterns for the selected group
 React.useEffect(()=>{

  var JsonObject = {
groupID: GlobalState.SelectedGroup.id,
};

let JsonObjectToSend = JSON.stringify(JsonObject);
let url2 =
process.env.REACT_APP_BACKENDURL + 
process.env.REACT_APP_GETGROUPATTERNS;
let UserToken = window.localStorage.getItem("AuthToken");
let APIResult = APILib.CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);
APIResult.then((result) => {
if (result.ErrorCode == undefined) {
setrows(result.result)
 //updating Patterns info, this will be used in the preview to replace the pattern values with their specific values
variables.PostGlobalVariables.POST_PatternsInfo=result.result
setBackuprows(result.result)
}
});

},[])

//This use effect is called when a modification is done to update the table

React.useEffect(()=>{

  var JsonObject = {
    groupID: GlobalState.SelectedGroup.id,
    };
    
    let JsonObjectToSend = JSON.stringify(JsonObject);
    let url2 =
    process.env.REACT_APP_BACKENDURL + 
    process.env.REACT_APP_GETGROUPATTERNS;
    let UserToken = window.localStorage.getItem("AuthToken");
    let APIResult = APILib.CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);
    APIResult.then((result) => {
    if (result.ErrorCode == undefined) {
    setrows(result.result)
    //updating Patterns info, this will be used in the preview to replace the pattern values with their specific values
    variables.PostGlobalVariables.POST_PatternsInfo=result.result
    setBackuprows(result.result)
    }
    });
 
 },[LocalRerender])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, rowid) => {
    const selectedIndex = selected.indexOf(rowid);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, rowid);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

   const HandleAddPattern=()=>
    {
        SetShowAddPattern(true)
    }
    const HandleAddDynamicFIeld=()=>
    {
      
      if(selected.length!==1)
      {
        toast.info("You need to Select One Pattern Only !", {
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
      //Here we test if the selected pattern is one of the default patterns or not
      else if(selected[0]==1 ||selected[0]==2||selected[0]==3||selected[0]==4)
      {
        toast.info("You cannot create a dynamic field using default patterns, please use an other personal one.", {
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
      else
      {
        SetShowAddDynamicField(true)
      }
       
    }
    const ChangeRows=(NewData)=>
    {
      setrows(NewData);
        //SetRowsRerender(!RowsRerender)
    }
    const RevertRows=()=>
    {
      setrows(Backuprows)
        
        //SetRowsRerender(!RowsRerender)
    }

    const handleRemovePattern=()=>
    {
      if(selected.length==0)
      {
        toast.info("Please Select a pattern you want to delete", {
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
      else
      {
      
let TempObject={listOfPatternsToDelete:[]}



        selected.map((s)=>{
TempObject.listOfPatternsToDelete=[...TempObject.listOfPatternsToDelete,{patternID:s}]
        })
          var JsonObject =TempObject; 
            let JsonObjectToSend = JSON.stringify(JsonObject); 
            let url2 =
            process.env.REACT_APP_BACKENDURL + 
            process.env.REACT_APP_REMOVEPATTERN;
            let UserToken = window.localStorage.getItem("AuthToken");
            let APIResult = APILib.CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);
            APIResult.then((result) => {
            if (result.errorCode == undefined) {
              if(result.successCode = "Pattern_Deleted")
              {
                toast.success("Pattern Deleted Successfully", {
                  position: "bottom-left",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });

               setSelected([])
                     
                SetLocalReRender(!LocalRerender)
              }
            }
            else
            {
              

              if (result.result=='Pattern_In_Use') {
                toast.info("Unable to Delete this pattern because it's already in use by a scheduled post", {
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

              if (result.result=='Invalid Pattern ID') {
                toast.error("Something went wrong, the pattern you tried to delete doesn't exist", {
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
              if(result.result=="Default_Pattern_CannotBe_Deleted")
              {
                toast.error("One of the Selected patterns is a Default Pattern used by default dynamic fields, you cannot delete them!", {
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
            });
        
      }
      
    }

    return (
    <>
<Container>


<Row>
<Col>
<Box sx={{ width: '100%' }}>
<Paper sx={{ width: '100%', mb: 2 ,boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1)',textAlign: "center" }} >
<Container>
    <Row><Col><Button variant="outlined"color="primary" startIcon={<PatternIcon/>} className='mx-2 m-2' onClick={HandleAddPattern} > Create new Pattern</Button></Col>
    <Col><Button variant="outlined"color="primary" startIcon={<DynamicFeedIcon/>} className='mx-2 m-2'  onClick={HandleAddDynamicFIeld} >Add Dynamic field</Button></Col>
    </Row>
</Container>
  </Paper>
  </Box>
</Col>

</Row>
 
<Row>
<Col>

<Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2,boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <EnhancedTableToolbar numSelected={selected.length} SetFilterModal={SetFilterModal} SetDeletePatternConfirmDialog={SetDeletePatternConfirmDialog} ShowDeletePatternConfirmDialog={ShowDeletePatternConfirmDialog}/>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={index}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.id}
                      </TableCell>
                      <TableCell align="right">{row.patternName}</TableCell>
                      <TableCell align="right">{row.patternText}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
</Col>
</Row>
<Row style={{display: 'flex',justifyContent: 'center',alignItems: 'center',margin:"1rem"}}>
  <Col md={12}><h4 className='m-2'style={{display: 'flex',justifyContent: 'center',alignItems: 'center',margin:"1rem"}}> List Of Currently used Dynamic fields</h4></Col>
  <Col md={12}>
  
  <TableContainer component={Paper} sx={{ width: '100%', mb: 2,boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1)' }}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>ID</TableCell>
            <TableCell>Pattern Name</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody >
          {variables.PostGlobalVariables.POST_AddedDynamicFields.length==0&& <div className="m-2" style={{display: 'flex',justifyContent: 'center',alignItems: 'center'}}><p>No Dynamic field found</p></div>}
          {variables.PostGlobalVariables.POST_AddedDynamicFields.map((df) => (
            <CollapseRow appendText={appendText} RemoveDynamicFieldText={RemoveDynamicFieldText} SetLocalReRender={SetLocalReRender} key={"DF"+df.patternID } rows={rows} dfdata={df} LocalRerender={LocalRerender} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>

  </Col>
</Row>
</Container>
{ShowAddPattern&&<FormDialog SetShowAddPattern={SetShowAddPattern} SetLocalReRender={SetLocalReRender} LocalRerender={LocalRerender}/>}
{ShowAddDynamicField&&<AddDynamicFieldDialog appendText={appendText} selected={selected} SetShowAddDynamicField={SetShowAddDynamicField} />}
{FilterModal&&<FilterDialog SetFilterModal={SetFilterModal} Rows={rows} ChangeRows={ChangeRows} RevertRows={RevertRows} />}
{ShowDeletePatternConfirmDialog&&<DeletePatternConfirmDialog  handleRemovePattern={handleRemovePattern} SetDeletePatternConfirmDialog={SetDeletePatternConfirmDialog} ShowDeletePatternConfirmDialog={ShowDeletePatternConfirmDialog}/>}

  </>
  );
}