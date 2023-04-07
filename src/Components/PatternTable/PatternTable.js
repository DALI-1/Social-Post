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
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import { Avatar } from "@nextui-org/react";


export  function FormDialog(props) {
    const [open, setOpen] = React.useState(true);
    const handleClose = () => {
        props.SetShowAddPattern(false)
      setOpen(false);
    };
  
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
              variant="standard"
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Pattern"
              type="text"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose}>Save Pattern</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
export function AddDynamicFieldDialog(props) {
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
                     for the current Selected Pattern <strong> //PROMO//</strong>

            </DialogContentText>
            <Container>
            <Row className='m-2'>
                <Col> <Row><Col><Avatar size="lg" src="" color="gradient"   squared zoomed/></Col> <Col>  Facebook Page 1</Col></Row></Col>
                <Col>
                <FormControl>
        <InputLabel htmlFor="component-outlined">Value</InputLabel>
        <OutlinedInput
          id="component-outlined"
          defaultValue=""
          label="Name"
        />
      </FormControl>
                </Col>
            </Row>
            <Row className='m-2'>
                <Col> <Row><Col><Avatar size="lg" src="" color="gradient"   squared zoomed/></Col> <Col>  Facebook Page 2</Col></Row></Col>
                <Col>
                <FormControl>
        <InputLabel htmlFor="component-outlined">Value</InputLabel>
        <OutlinedInput
          id="component-outlined"
          defaultValue=""
          label="Name"
        />
      </FormControl>
                </Col>
            </Row>
            </Container>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="error"  onClick={handleClose}>Cancel</Button>
            <Button variant="outlined" onClick={handleUserDelete} autoFocus>
              Add Dynamic Field
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
  if(row.userName.includes(UserText.current.value))
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
          <Button onClick={cancelFilter}>Remove Filter</Button>
          <Button onClick={FilterUsers}>Apply Filter</Button>
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

let rows=[{

}];
let Backuprows=[{

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
          List Of Patterns
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

export default function EnhancedTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [FilterModal, SetFilterModal] = React.useState(false);
  const [ShowAddDynamicField, SetShowAddDynamicField] = React.useState(false);
  const [ShowAddPattern, SetShowAddPattern] = React.useState(false);
  const [RowsRerender, SetRowsRerender] = React.useState(false);
  const {GlobalState,Dispatch}=React.useContext(AppContext)
  
//Loading All user from DB
  React.useEffect(()=>{

  }
,[])

//This use effect is called when a modification is done to update the table

React.useEffect(()=>{

    
 
 },[GlobalState.Rerender])

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
        SetShowAddDynamicField(true)
    }
    const ChangeRows=(NewData)=>
    {
        rows=NewData;
        SetRowsRerender(!RowsRerender)
    }
    const RevertRows=()=>
    {
    
        rows=Backuprows;
        SetRowsRerender(!RowsRerender)
    }

    return (
    <>
<Container>


<Row>
<Col>
<Box sx={{ width: '100%' }}>
<Paper sx={{ width: '100%', mb: 2 ,boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1)'}}>
<Container>
    <Row><Col><MDBBtn outline className='mx-2 m-2' color='secondary' onClick={HandleAddPattern} > Create new Pattern</MDBBtn></Col>
    <Col><MDBBtn outline className='mx-2 m-2' color='secondary' onClick={HandleAddDynamicFIeld} >Add Dynamic field</MDBBtn></Col>
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
        <EnhancedTableToolbar numSelected={selected.length} SetFilterModal={SetFilterModal} />
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

{ShowAddPattern&&<FormDialog SetShowAddPattern={SetShowAddPattern} />}
{ShowAddDynamicField&&<AddDynamicFieldDialog SetShowAddDynamicField={SetShowAddDynamicField} />}
{FilterModal&&<FilterDialog SetFilterModal={SetFilterModal} Rows={rows} ChangeRows={ChangeRows} RevertRows={RevertRows} />}


  </>
  );
}