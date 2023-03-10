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
import DropdownTreeSelect from 'react-dropdown-tree-select'
import {UserSelectedTabActions,UserTabs,HeaderSpinnerActions,HeaderSpinner,User}from "../../variables/variables"
import {AppContext} from "../../context/Context"
import {CALL_API_With_JWTToken,CALL_API_With_JWTToken_GET} from '../../libs/APIAccessAndVerification'
import {hashString,hashRandom } from 'react-hash-string'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as variables from "../../variables/variables"
import TextField from '@mui/material/TextField';

//ADD USER TO GROUP DIALOG
export function AlertDialog(props) {
  const [open, setOpen] = React.useState(true);
  const {GlobalState,Dispatch}=React.useContext(AppContext)
  let ListOfGroups=React.useRef([])
  let [GroupsDropDownList,SetGroupsDropDownList]=React.useState({})
  let UsersID=props.UserIDs
  let SetAddGroupModal=props.SetAddGroupModal


  function CreateHiearchyData(Grp) {
    if(Grp.subGroups!=null)
   {
        var localres=[]
        Grp.subGroups.map((group,index) => {  
              var childs=CreateHiearchyData(group) 
              localres=[...localres,{label:group.group_Name,value:group.id,children:childs}]  
            })
            return(localres)            
      
  }
  else
  {
    return({label:Grp.group_Name,value:Grp.id,children:[{}]})
  }
}

const FillData=()=>
{
 var res=[]

 variables.UserInformations.info.joinedGroups.map((grp)=>{
    res=[...res,{label:grp.group_Name,value:grp.id,children:CreateHiearchyData(grp)}]

 }
 )

SetGroupsDropDownList(res)
}
  const onChange = (currentNode, selectedNodes) => {
    console.log('onChange::', currentNode, selectedNodes)
     
    var res=[]
     selectedNodes.map((n)=>{
        res=[...res,n.value]
     })
    ListOfGroups.current=res
  }
  const onAction = (node, action) => {
    console.log('onAction::', action, node)
  }
  const onNodeToggle = currentNode => {
    console.log('onNodeToggle::', currentNode)
  }

  React.useEffect(()=>{
    FillData()
},[])

  
  let AddUsersToGroups=()=>{

 var JsonObject=
  {
    "userIDs":UsersID,
    "groupIDs":ListOfGroups.current
  }
 

        JsonObject=JSON.stringify(JsonObject)
        
         let url2=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_ADDUSERSTOGROUPS
         let UserToken=window.localStorage.getItem("AuthToken")
         let APIResult=CALL_API_With_JWTToken(url2,JsonObject,UserToken)
         Dispatch({type:HeaderSpinnerActions.TurnOnRequestSpinner})

         APIResult.then((result)=>
         {

          for( var property in result)
          {
          

              if( property=="UsersMovedToGroups")
              {
                  toast.success('Users Successfully added to the selected Group', {
                      position: "bottom-left",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                      });
                       handleClose();
                  break
              }
              else
              {
                if(property=="UserOrGroupsDoesntExist")
                {
                  toast.error('One of the users or groups you tried to selected doesnt exit anymore, it got deleted recently', {
                      position: "bottom-left",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                      });
                       
                  break
              }

              }
          }
          Dispatch({type:HeaderSpinnerActions.TurnOffRequestSpinner})                         
        })
          .catch(()=>{
   
Dispatch({type:HeaderSpinnerActions.TurnOffRequestSpinner}) 
  })
}


const handleClose = () => {
  setOpen(false);
  props.SetAddGroupModal(false)
};

return (
  <>
    <div>
      
      <Dialog fullWidth={true} open={open} >
        <DialogTitle> Add Selected Users to Group</DialogTitle>
        <DialogContent>
          <DialogContentText>
           Please Select the groups you want to add the users at
          </DialogContentText>
          
          <br/>
<DropdownTreeSelect data={GroupsDropDownList} onChange={onChange} onAction={onAction} onNodeToggle={onNodeToggle} /> 
<br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
       </DialogContent>


        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={AddUsersToGroups}>Add User to the selected Groups</Button>
        </DialogActions>
      </Dialog>
    </div>
  </>
    
     
);
}



//DELETE USER FROM GROUP DIALOG


export function AlertDialog2(props) {
  const [open, setOpen] = React.useState(true);
  const {GlobalState,Dispatch}=React.useContext(AppContext)
  let ListOfGroups=React.useRef([])
  let [GroupsDropDownList,SetGroupsDropDownList]=React.useState({})
  let UsersID=props.UserIDs
  let SetAddGroupModal=props.SetAddGroupModal


  function CreateHiearchyData(Grp) {
    if(Grp.subGroups!=null)
   {
        var localres=[]
        Grp.subGroups.map((group,index) => {  
              var childs=CreateHiearchyData(group) 
              localres=[...localres,{label:group.group_Name,value:group.id,children:childs}]  
            })
            return(localres)            
      
  }
  else
  {
    return({label:Grp.group_Name,value:Grp.id,children:[{}]})
  }
}

const FillData=()=>
{
 var res=[]

 variables.UserInformations.info.joinedGroups.map((grp)=>{
    res=[...res,{label:grp.group_Name,value:grp.id,children:CreateHiearchyData(grp)}]

 }
 )

SetGroupsDropDownList(res)
}
  const onChange = (currentNode, selectedNodes) => {
    console.log('onChange::', currentNode, selectedNodes)
     
    var res=[]
     selectedNodes.map((n)=>{
        res=[...res,n.value]
     })
    ListOfGroups.current=res
  }
  const onAction = (node, action) => {
    console.log('onAction::', action, node)
  }
  const onNodeToggle = currentNode => {
    console.log('onNodeToggle::', currentNode)
  }

  React.useEffect(()=>{
    FillData()
},[])

  
  let AddUsersToGroups=()=>{

 var JsonObject=
  {
    "userIDs":UsersID,
    "groupIDs":ListOfGroups.current
  }
 

        JsonObject=JSON.stringify(JsonObject)
        
         let url2=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_REMOVEUSERSFROMGROUPS
         let UserToken=window.localStorage.getItem("AuthToken")
         let APIResult=CALL_API_With_JWTToken(url2,JsonObject,UserToken)
         Dispatch({type:HeaderSpinnerActions.TurnOnRequestSpinner})

         APIResult.then((result)=>
         {

          for( var property in result)
          {
          

              if( property=="UsersRemovedFromGroups")
              {
                  toast.success('Users Successfully removed from the selected Group', {
                      position: "bottom-left",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                      });
                       handleClose();
                  break
              }
              
                if(property=="UserOrGroupsDoesntExist")
                {
                  toast.error('One of the users/Groups you selected doesnt exit anymore, it got deleted recently', {
                      position: "bottom-left",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                      });
                       
                  break
              }

              if(property=="GroupDoesntExist")
              {
                toast.error('One of the Groups you selected doesnt exit anymore, it got deleted recently', {
                    position: "bottom-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
                     
                break
            }

              
          }
          Dispatch({type:HeaderSpinnerActions.TurnOffRequestSpinner})                         
        })
          .catch(()=>{
   
Dispatch({type:HeaderSpinnerActions.TurnOffRequestSpinner}) 
  })
}


const handleClose = () => {
  setOpen(false);
  props.SetAddGroupModal(false)
};






return (
  <>
    <div>
      
      <Dialog fullWidth={true} open={open} >
        <DialogTitle> Remove Users from the group</DialogTitle>
        <DialogContent>
          <DialogContentText>
           Please Select the groups you want the selected users removed from
          </DialogContentText>
          
          <br/>
<DropdownTreeSelect data={GroupsDropDownList} onChange={onChange} onAction={onAction} onNodeToggle={onNodeToggle} /> 
<br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
       </DialogContent>


        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={AddUsersToGroups}>Remove The selected users from the groups</Button>
        </DialogActions>
      </Dialog>
    </div>
  </>
    
     
);
}




//DELETE USER DIALOG


export function AlertDialog3(props) {
  const [open, setOpen] = React.useState(true);
  const {GlobalState,Dispatch}=React.useContext(AppContext)
  let ListOfGroups=React.useRef([])
  let [GroupsDropDownList,SetGroupsDropDownList]=React.useState({})
  let UsersID=props.UserIDs

  
  let handleUserDelete=()=>{

 var JsonObject=
  {
    "userIDs":UsersID,
   
  }
 

        JsonObject=JSON.stringify(JsonObject)
        
         let url2=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_REMOVEUSERS
         let UserToken=window.localStorage.getItem("AuthToken")
         let APIResult=CALL_API_With_JWTToken(url2,JsonObject,UserToken)
         Dispatch({type:HeaderSpinnerActions.TurnOnRequestSpinner})

         APIResult.then((result)=>
         {

          for( var property in result)
          {
          

              if( property=="UsersDeleted")
              {
                  toast.success('The Selected Users Successfully deleted!', {
                      position: "bottom-left",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                      });
                       handleClose();
                  break
              }
              
                if(property=="UserOrGroupsDoesntExist")
                {
                  toast.error('One of the users you selected doesnt exit anymore, it got deleted recently', {
                      position: "bottom-left",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                      });
                       
                  break
              }

            
              
          }
          Dispatch({type:HeaderSpinnerActions.TurnOffRequestSpinner})                         
        })
          .catch(()=>{
   
Dispatch({type:HeaderSpinnerActions.TurnOffRequestSpinner}) 
  })
}


const handleClose = () => {
  setOpen(false);
  props.SetRemoveGroupModal(false)
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
          {"Delete Group"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to permanently delete the selected Users?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>No</Button>
          <Button variant="outlined" color="error" onClick={handleUserDelete} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
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
    id: 'userName',
    numeric: false,
    disablePadding: true,
    label: 'Username',
  },
  {
    id: 'firstName',
    numeric: true,
    disablePadding: false,
    label: 'First Name',
  },
  {
    id: 'lastName',
    numeric: true,
    disablePadding: false,
    label: 'Last Name',
  },
  {
    id: 'age',
    numeric: true,
    disablePadding: false,
    label: 'Age',
  },
  {
    id: 'email',
    numeric: true,
    disablePadding: false,
    label: 'Email Adress',
  },
  {
    id: 'phoneNumber',
    numeric: true,
    disablePadding: false,
    label: 'Phone Number',
  }

];

let rows=[{

}];



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
          List Of Users
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon onClick={props.HandleRemoveUser} />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [RemoveGroupModal, SetRemoveGroupModal] = React.useState(false);
  const [AddGroupModal, SetAddGroupModal] = React.useState(false);
  const [RemoveUserModal, SetRemoveUserModal] = React.useState(false);
  
  const {GlobalState,Dispatch}=React.useContext(AppContext)
  
//Loading All user from DB
  React.useEffect(()=>{

    
 var JsonObject={}

 JsonObject=JSON.stringify(JsonObject)
 
  let url2=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_GETSLAVEUSERS
  let UserToken=window.localStorage.getItem("AuthToken")
  let APIResult=CALL_API_With_JWTToken(url2,JsonObject,UserToken)
  Dispatch({type:HeaderSpinnerActions.TurnOnRequestSpinner})

  APIResult.then((result)=>
  {
    rows=result;

                           Dispatch({type:HeaderSpinnerActions.TurnOffRequestSpinner})
  })
},[])

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

   const HandleAddUser=()=>
    {
      Dispatch( {type:UserSelectedTabActions.SelectAddUser})
    }
    const HandleEditUser=()=>
    {
      if(selected.length==0)
      {
        toast.info('You need to select at least one User to modify', {
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
        if(selected.length>1)
        {
          toast.info('Select only one user if you want to modify', {
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
        User.SelectedUserToModify=selected[0]
        Dispatch( {type:UserSelectedTabActions.SelectEditUser})
        }
      }
      
      
      
    }

    const HandleAddUserToGroup=()=>{

      if(selected.length==0)
      {
        toast.info('You need to select at least one User!', {
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
        SetAddGroupModal(true)
      }
      
    }
    const HandleRemoveUserFromGroup=()=>{


      if(selected.length==0)
      {
        toast.info('You need to select at least one User!', {
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
        SetRemoveGroupModal(true)
      }
    }



    const HandleRemoveUser=()=>{


      if(selected.length==0)
      {
        toast.info('You need to select at least one User!', {
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
        SetRemoveUserModal(true)
      }
    }

    return (
    <>
<Container>


<Row>
<Col>
<Box sx={{ width: '100%' }}>
<Paper sx={{ width: '100%', mb: 2 ,textAlign: "right" }}>

     <MDBBtn outline className='mx-2 m-2' color='secondary' onClick={HandleAddUserToGroup} >
        Add User to Group
      </MDBBtn>

     <MDBBtn outline className='mx-2 m-2' color='secondary' onClick={HandleAddUser} >
        Add New User
      </MDBBtn>

      <MDBBtn outline className='mx-2 m-2' color='secondary' onClick={HandleEditUser} >
      Modify Selected User
      </MDBBtn>

      <MDBBtn outline className='mx-2 m-2' color='secondary' onClick={HandleRemoveUserFromGroup} >
        Remove User From Group
      </MDBBtn>
    
  </Paper>
  </Box>
</Col>

</Row>
 
<Row>
<Col>

<Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} HandleRemoveUser={HandleRemoveUser} />
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
              HandleRemoveUser={HandleRemoveUser}
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
                      key={row.id}
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
                        {row.userName}
                      </TableCell>
                      <TableCell align="right">{row.firstName}</TableCell>
                      <TableCell align="right">{row.lastName}</TableCell>
                      <TableCell align="right">{row.age}</TableCell>
                      <TableCell align="right">{row.email}</TableCell>
                      <TableCell align="right">{row.phoneNumber}</TableCell>
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
</Container>
{AddGroupModal&&<AlertDialog SetAddGroupModal={SetAddGroupModal}  UserIDs={selected}/> }
{RemoveGroupModal&&<AlertDialog2 SetRemoveGroupModal={SetRemoveGroupModal}  UserIDs={selected}/> }
{RemoveUserModal&&<AlertDialog3 SetRemoveGroupModal={SetRemoveUserModal}  UserIDs={selected}/> }

  </>
  );
}