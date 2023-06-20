import * as React from "react";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ModifyPageContent.css";
import {
  CALL_API_With_JWTToken,
} from "../../libs/APIAccessAndVerification";
import { storage } from "../../libs/FireBase";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable, 
} from "firebase/storage";
import {  hashRandom } from "react-hash-string";
import ProgressBar from "react-bootstrap/ProgressBar";
import { AppContext } from "../../context/Context";
import * as variables from "../../variables/variables";
import { Avatar } from "@nextui-org/react";
import DeleteModal from "../../components/PageManagementComps/DeletePageComps/DeletePagesModal";
import {
  ListView,
  ListViewHeader,
  ListViewFooter,
} from "@progress/kendo-react-listview";
import MainCard from "../../components/UI/cards/MainCard"
import Button from '@mui/material/Button';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SaveIcon from '@mui/icons-material/Save';
import Fade from '@mui/material/Fade'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container'; 
import IconButton from '@mui/material/IconButton';
import Accordion from 'react-bootstrap/Accordion';
import DeleteIcon from '@mui/icons-material/Delete';

import PagePictureIcon from "../../Assets/Gallery.png"
import PageIcon from "../../Assets/Page.png"
import DeletePageIcon from "../../Assets/Delete.png"
export default function Content() {
  let uploadTask = React.useRef(null);
  const [Associated_By_Page, setAssociated_By_Page] = React.useState([]);
  const [List_Of_Associated_Pages, setList_Of_Associated_Pages] =React.useState([])
  const [AssociationsLoadedFlag, SetAssociationsLoadedFlag] = React.useState([])
  const [DeleteModalShow, setDeleteModalShow] = React.useState(false);
  let PageName = React.useRef("");
  let PageDescription = React.useRef("");
  let PageAbout = React.useRef("");
  let PageImageUrl = React.useRef("");
  const { GlobalState, Dispatch } = React.useContext(AppContext);
  const [UploadProgress, setUploadProgress] = React.useState(0);

  //Here, this will be called only at the first render to load the page info so they get displayed for the user
  React.useEffect(() => {
      if (GlobalState.SelectedGroup.group_Name != "Loading...") {
        //Getting the Selected Page Informations
        var JsonObject3 = {
          PageID: variables.Pages.ListOfSelectedPages[0].ID,
          groupID: GlobalState.SelectedGroup.id,
        };
        let JsonObjectToSend3 = JSON.stringify(JsonObject3);
        let url3 =
          process.env.REACT_APP_BACKENDURL + process.env.REACT_APP_GETPAGEINFO;
        let UserToken3 = window.localStorage.getItem("AuthToken");
        let APIResult3 = CALL_API_With_JWTToken(
          url3,
          JsonObjectToSend3,
          UserToken3
        );
        Dispatch({ type: variables.HeaderSpinnerActions.TurnOnRequestSpinner });
        APIResult3.then((response) => {
          if (response.ErrorCode == undefined) {
            
            //Handling Facebook result
              PageName.current.value = response.result.cachedData_PageName;
              PageAbout.current.value = response.result.cachedData_About;
              PageImageUrl.current.src = response.result.cachedData_PictureURL;         
              PageDescription.current.value = response.result.cachedData_Description;
              setList_Of_Associated_Pages(response.result.associatedPlatformPages)
              if(response.result.associatedByPlatformPage!=null)
              {
                
                setAssociated_By_Page([response.result.associatedByPlatformPage])
              }
              
          }
          Dispatch({ type: variables.HeaderSpinnerActions.TurnOffRequestSpinner });
        }).catch((e) => {
          Dispatch({ type: variables.HeaderSpinnerActions.TurnOffRequestSpinner });
        });
      }
   
  }, []);

  //handles the save of the page informations
  const handlesubmit = (props) => {
    props.preventDefault();

    if (GlobalState.SelectedGroup.group_Name != "Loading...") {
      var JsonObject = {
        pageID: variables.Pages.ListOfSelectedPages[0].ID,
        pageName: PageName.current.value,
        pageDescription: PageDescription.current.value,
        pageAbout: PageAbout.current.value,
        groupID: GlobalState.SelectedGroup.id,
      };

      let JsonObjectToSend = JSON.stringify(JsonObject);
      let url2 =
        process.env.REACT_APP_BACKENDURL + process.env.REACT_APP_UPDATEPAGEINFO;
      let UserToken = window.localStorage.getItem("AuthToken");
      let APIResult = CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);

      Dispatch({ type: variables.HeaderSpinnerActions.TurnOnRequestSpinner });
      APIResult.then((result) => {
        if (result.successCode == "Page_Informations_Updated") {
          toast.success("Page Informations Changed Successfully", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });

          Dispatch({ type: variables.RerenderActions.ReRenderPage });
        } else {

          if(result.errorCode=="P088")
        {
          toast.info(" We're sorry, for now "+result.result, {
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
          toast.error("Page Information Change failed.", {
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
        Dispatch({
          type: variables.HeaderSpinnerActions.TurnOffRequestSpinner,
        });
      }).catch((e) => {
        Dispatch({ type: variables.HeaderSpinnerActions.TurnOffRequestSpinner });
      });
    }
  };

  const handleImageUpdate = (props) => {
    props.preventDefault();
    if (!props.target[0].files[0]) 
    {
      toast.info("No Image Selected", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    let file = props.target[0].files[0];
    let HashedFileName = hashRandom();
    const storageRef = ref(storage, `/PageImages/${HashedFileName}`);

    //Uploading the new image to FireBase
    Dispatch({
      type: variables.HeaderSpinnerActions.TurnOnRequestSpinner,
    });
    uploadTask.current = uploadBytesResumable(storageRef, file);
    uploadTask.current.on(
      "state_changed",
      //This async function is executed many times during the upload to indicate progress
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        
        setUploadProgress(progress);
      },
      //This async function is executed when there is an error with the upload
      (error) => {
        console.log(error);
      },
      //This function is executed when the state changes, we gonna use it for the state changing to complete
      () => {
        getDownloadURL(uploadTask.current.snapshot.ref).then((url) => {
          setUploadProgress(0);
          //Sending a POST HTTP To the API with the Json Object
          if (GlobalState.SelectedGroup.group_Name != "Loading...") {
            var JsonObject = {
              PageID: variables.Pages.ListOfSelectedPages[0].ID,
              pictureURL: url.toString(),
              groupID: GlobalState.SelectedGroup.id,
            };
            let JsonObjectToSend = JSON.stringify(JsonObject);
            let url2 =
              process.env.REACT_APP_BACKENDURL +
              process.env.REACT_APP_UPDATEPAGEPICTURE;
            let UserToken = window.localStorage.getItem("AuthToken");
            let APIResult = CALL_API_With_JWTToken(
              url2,
              JsonObjectToSend,
              UserToken
            );
            APIResult.then((result) => {
              if (result.successCode == "Page_Picture_Updated") {
                toast.success("Page Picture Changed Successfully", {
                  position: "bottom-left",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
                PageImageUrl.current.src = url  
                Dispatch({ type: variables.RerenderActions.ReRenderPage });
              } else {
                if(result.errorCode=="P7845")
                {

                  toast.info("This Feature is disabled for Instagram due to permissions issues.", {
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
                  toast.info("Page Picture Change failed, make sure the image is not too small.", {
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

              Dispatch({
                type: variables.HeaderSpinnerActions.TurnOffRequestSpinner,
              });
            }).catch((e) => {
              console.log(e);
            });
          }
        });
      }
    );
  };
  const CancelImageUpload = (props) => {
    let UploadCancelled = uploadTask.current.cancel();
    if (UploadCancelled) {
      setUploadProgress(0);
      toast.success("Image Change cancelled", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      toast.info("Image Change cancel failed, please contact Dev team", {
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
    Dispatch({
      type: variables.HeaderSpinnerActions.TurnOffRequestSpinner,
    });
  };
  return (
    <div className="container-xl px-4 mt-4">
      <Row className="m-2">
        <Col>
        <MainCard>
        <Accordion  defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
        <Container style={{display:"flex",justifyContent:"left",alignItems:"center"}}>
            <Row>
              <Col>
              <Avatar size="xl"  style={{marginRight:"0.5rem"}} src={PagePictureIcon} color="primary" zoomed/>
              </Col>                        
            <Col>
               <p style={{marginTop:"1rem"}}>Page Picture</p>
              </Col>
              <Col >
              <Tooltip style={{marginTop:"0.5rem"}} title="Here you can change a Page's picture, NOTE: This is disabled for Instagram until further notice." TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}><IconButton> <HelpOutlineIcon /></IconButton></Tooltip> 
              </Col>
            </Row>
          </Container>
          </Accordion.Header>
        <Accordion.Body>
        <div className="card-body text-center ">
              {/*Test if User has a profile picture if not show default*/}

              <img
                ref={PageImageUrl}
                style={{
                  display: "block",
                  margin: "auto",
                  minWidth: "6.6rem",
                  minHeight: "6.6rem",
                  maxHeight: "6.6rem",
                  maxWidth: "6.6rem",
                }}
                className="rounded-5 shadow-2 mb-1 border border-primary"
                alt=""
              />
                <form onSubmit={handleImageUpdate}>
                  <div className="small font-italic text-muted mb-4">
                    <input
                      className="form-control"
                      name="file"
                      id="inputUsername"
                      type="file"
                      accept="image/png, image/gif, image/jpeg"
                    />
                    {/* Show uploadprogress comp if the Uploadprogress state>0 */}
                    {UploadProgress != 0 && (
                      <ProgressBar className="m-4" now={UploadProgress} />
                    )}

                    {UploadProgress != 0 && (
                      <span>Uploading Image please wait...</span>
                    )}

                    {UploadProgress != 0 && (
                      <Button
                        onClick={CancelImageUpload}
                        variant="outline-primary"
                      >
                        Cancel Upload
                      </Button>
                    )}
                  </div>
                  <div className="d-flex justify-content-center">
<Button variant="outlined" color='primary' type="submit" startIcon={<SaveIcon />}>Save Informations</Button>
</div>
                </form>

            </div>

        </Accordion.Body>
      </Accordion.Item>
     
    </Accordion>   
            </MainCard>
        </Col>
        <Col>
        <MainCard>

        <Accordion  defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
        <Container style={{display:"flex",justifyContent:"left",alignItems:"center"}}>
            <Row>
              <Col>
              <Avatar size="xl" squared style={{marginRight:"0.5rem"}} src={PageIcon} color="primary" zoomed/>
              </Col>              
            
            
            <Col>
               <p style={{marginTop:"1rem"}}>Page basic informations</p>
              </Col>
              <Col >
              <Tooltip style={{marginTop:"0.5rem"}} title="Here is some basic informations about the page, NOTE: Change to Instagram Pages is disabled until further notice." TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}><IconButton> <HelpOutlineIcon /></IconButton></Tooltip> 
              </Col>
            </Row>
          </Container>
          </Accordion.Header>
        <Accordion.Body>

        <div className="card-body text-center ">
              <form onSubmit={handlesubmit}>
                <div className="mb-3">
                  <label className="small mb-1" htmlFor="Pname">
                    {" "}
                    Page Name
                  </label>
                  <input
                    ref={PageName}
                    className="form-control"
                    name="Page_Name"
                    id="Pname"
                    type="text"
                    placeholder="Enter your new Page Name"
                    readOnly
                  />
                </div>

                <div className="row gx-3 mb-3">
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="Pabout">
                      About
                    </label>
                    <input
                      ref={PageAbout}
                      className="form-control"
                      name="firstName"
                      id="Pabout"
                      type="text"
                      placeholder="Enter your Page About here"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="pdes">
                      Description
                    </label>
                    <input
                      ref={PageDescription}
                      className="form-control"
                      name="lastName"
                      id="pdes"
                      type="text"
                      placeholder="Enter your Page Description here"
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-center">
<Button variant="outlined" color='primary' type="submit" startIcon={<SaveIcon />}>Save Informations</Button>
</div>


              </form>
            </div>

        </Accordion.Body>
      </Accordion.Item>
     
    </Accordion>   

            
          </MainCard>
        </Col>
      </Row>
      <Row className="m-2">
       
        <Col>
        <MainCard>


        <Accordion  defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
        <Container style={{display:"flex",justifyContent:"left",alignItems:"center"}}>
            <Row>
              <Col>
              <Avatar size="xl" squared style={{marginRight:"0.5rem"}} src={PageIcon} color="primary" zoomed/>
              </Col>              
            

            
            <Col>
               <p style={{marginTop:"1rem"}}>Page Associations</p>
              </Col>
              <Col >
              <Tooltip style={{marginTop:"0.5rem"}} title="This shows which page is associated to which page." TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}><IconButton> <HelpOutlineIcon /></IconButton></Tooltip> 
              </Col>
            </Row>
          </Container>
          </Accordion.Header>
        <Accordion.Body>
        <div className="card-body text-center ">     
                <>
                  <ListView
                    data={List_Of_Associated_Pages}
                    item={MyAssociatedPagesRender}
                    style={{ width: "100%" }}
                    header={MyHeaderAssociatePage}
                    footer={MyFooter}
                  />
                  {List_Of_Associated_Pages.length == 0 && (
                    <p
                      className="m-1"
                      style={{ color: "rgb(160, 160, 160)", fontSize: 12 }}
                    >
                      The Page doesn't have any.
                    </p>
                  )}
                  <ListView
                    data={Associated_By_Page}
                    item={MyassociatedByPlatformPageRender}
                    style={{ width: "100%" }}
                    header={MyHeaderAssociateToPage}
                    footer={MyFooter}
                  />
                  {Associated_By_Page.length == 0 && (
                    <p
                      className="m-1"
                      style={{ color: "rgb(160, 160, 160)", fontSize: 12 }}
                    >
                      The Page doesn't have any.
                    </p>
                  )}
                </> 
            </div>

        </Accordion.Body>
      </Accordion.Item>
     
    </Accordion>   

            </MainCard>
        </Col>
        <Col>
        <MainCard >
           
        <Accordion  defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
        <Container style={{display:"flex",justifyContent:"left",alignItems:"center"}}>
            <Row>
              <Col>
              <Avatar size="xl" style={{marginRight:"0.5rem"}} src={DeletePageIcon} color="primary" zoomed/>
              </Col>              
            
            

            <Col>
               <p style={{marginTop:"1rem"}}>Discard Page</p>
              </Col>
              <Col >
              <Tooltip style={{marginTop:"0.5rem"}} title="Here you can remove the page from the group that you currently in." TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}><IconButton> <HelpOutlineIcon /></IconButton></Tooltip> 
              </Col>
            </Row>
          </Container>
          </Accordion.Header>
        <Accordion.Body>
        <div className="card-body text-center ">
              <strong> NOTE: This only deletes it from the Group, it won't delete the page from Instagram nor Facebook. </strong>
              {DeleteModalShow && (
                <DeleteModal SetShowDeleteModal={setDeleteModalShow} />
              )}

<div className="d-flex justify-content-center">
<Button variant="outlined" color='error' type="submit"
style={{ margin: "1rem" }}
onClick={() => {
  setDeleteModalShow(!DeleteModalShow);
}}
startIcon={<DeleteIcon />}> Remove the page from the Group</Button>
</div>


              
            </div>

        </Accordion.Body>
      </Accordion.Item>
     
    </Accordion>   
            
            </MainCard>
        </Col>
      </Row>
    </div>
  );
}


const MyHeaderAssociatePage = () => {
  return (
    <ListViewHeader
      style={{
        color: "rgb(0, 0, 0)",
        fontSize: 15,
      }}
      className="pl-3 pb-2 pt-2"
    >
      <strong>Associated Pages: </strong>
    </ListViewHeader>
  );
};
const MyHeaderAssociateToPage = () => {
  return (
    <ListViewHeader
      style={{
        color: "rgb(0, 0, 0)",
        fontSize: 15,
      }}
      className="pl-3 pb-2 pt-2"
    >
      <strong>Pages Associated To: </strong>
    </ListViewHeader>
  );
};
const MyFooter = () => {
  return (
    <ListViewFooter
      style={{
        color: "rgb(160, 160, 160)",
        fontSize: 14,
      }}
      className="pl-3 pb-2 pt-2"
    ></ListViewFooter>
  );
};
const MyAssociatedPagesRender = (props) => {
  let e = props.dataItem;
      return (
        <div
          className="k-listview-item row p-2 border-bottom align-middle"
          style={{ margin: 0 }}
        >
          <div className="col-2 m-2">
            {" "}
            <Avatar
              size="lg"
              src={e.cachedData_PictureURL}
              color="gradient"
              squared
              zoomed
            />
          </div>
          <div className="col-4 m-2">
            <h2
              style={{ fontSize: 14, color: "#454545", marginBottom: 0 }}
              className="text-uppercase"
            >
              {" "}
              Page Name
            </h2>
            <div style={{ fontSize: 12, color: "#a0a0a0" }}>
              {e.cachedData_PageName}
            </div>
          </div>
          <div className="col-2 m-2">
            <Avatar
              size="lg"
              src={e.platform.platformLogoImageUrl             }
              color="gradient"
              zoomed
            />
          </div>
        </div>
      );

};
const MyassociatedByPlatformPageRender = (props) => {
  let e = props.dataItem;
      return (
        <div
          className="k-listview-item row p-2 border-bottom align-middle"
          style={{ margin: 0 }}
        >
          <div className="col-2 m-2">
            {" "}
            <Avatar
              size="lg"
              src={e.cachedData_PictureURL}
              color="gradient"
              squared
              zoomed
            />
          </div>
          <div className="col-4 m-2">
            <h2
              style={{ fontSize: 14, color: "#454545", marginBottom: 0 }}
              className="text-uppercase"
            >
              {" "}
              Page Name
            </h2>
            <div style={{ fontSize: 12, color: "#a0a0a0" }}>
              {e.cachedData_PageName}
            </div>
          </div>
          <div className="col-2 m-2">
            <Avatar
              size="lg"
              src={e.platform.platformLogoImageUrl             }
              color="gradient"
              zoomed
            />
          </div>
        </div>
      );

};