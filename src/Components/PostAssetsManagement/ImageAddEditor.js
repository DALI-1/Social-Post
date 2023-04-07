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
import ReactImagePickerEditor, { ImagePickerConf } from 'react-image-picker-editor';
import './ImageAddEditor.css'


export default function AssetsGallery(props){
  const ImagePickerConf = {
    borderRadius: '8px',
    language: 'en',
    width: '100%',
    height: '200px',
    objectFit: 'contain',
    compressInitial: null,
  };
   const initialImage = ''
   let [ImgSrc,setImageSrc]=React.useState();
  return (<div>
     
        < ReactImagePickerEditor
            config={ImagePickerConf}
            imageSrcProp={initialImage}
            imageChanged={(newDataUri) => { setImageSrc(newDataUri) }} />
        </div>)
}

