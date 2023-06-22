import React from "react";
import "./VideoInput.css"
import Button from '@mui/material/Button';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
export default function VideoInput(props) {
  const { width, height } = props;

  const inputRef = React.useRef();

  const [source, setSource] = React.useState(null);

  //Passing the Local URL to the caller function.
  React.useEffect(()=>{
    props.setSelectedVideo_Local_URL(source)
  },[source])
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    setSource(url);
    
  };

  const handleChoose = (event) => {
    inputRef.current.click();
  };
 

  return (<>
  <div className="UploadButton">
  <input
        ref={inputRef}
        className="VideoInput_input"
        type="file"
        onChange={handleFileChange}
        accept=".mov,.mp4"
        
      />
<Button variant="outlined"  onClick={handleChoose} endIcon={<OndemandVideoIcon />} style={{width:"90%", margin:"10px"}}>Add Video</Button>
  </div>
 
   <div className="VideoInput">
      {source && (
        <video
          className="VideoInput_video"
          height={height}
          width="100%"
          controls
          src={source}
          
        />
      )}
      {source==null&&<div className="VideoInput_footer">{"Nothing Uploaded"}</div>}
    </div>
  </>
   
  );
}
