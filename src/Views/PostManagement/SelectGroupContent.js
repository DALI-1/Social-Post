import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import {AppContext} from "../../context/Context"
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import * as vars from "../../variables/variables"
function SimpleDialog(props) {
  const { onClose, selectedValue, open } = props;
  const Groups=props.Groups
  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Select the group you want to work under</DialogTitle>
      <List sx={{ pt: 0 }}>
        {Groups.map((grp,index) => (
          
          <ListItem disableGutters key={index}>
            <ListItemButton onClick={() => handleListItemClick(grp.ID.toString())}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={grp.Name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default function SimpleDialogDemo() {
  const [open, setOpen] = React.useState(true);
  const [Groups,setGroups]=React.useState([])
  const [selectedValue, setSelectedValue] = React.useState("NoneYet");
  const {GlobalState,Dispatch}=React.useContext(AppContext)

  React.useEffect(()=>{
    let groups=[]
    vars.UserInformations.info.joinedGroups.map((grp)=>{
        groups=[...groups,{Name:grp.group_Name,ID:grp.id}]
        })
        setGroups(groups)
  },[])
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (v) => {
    setOpen(false);
    

Dispatch({type:vars.UpdateSelectedPostGroup.SetPostGroup,value:v})
    setSelectedValue(v);
  };

  return (
    <div>
      <SimpleDialog
      Groups={Groups}
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}