import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { DropDownTree } from "@progress/kendo-react-dropdowns";
import {
  processTreeData,
  expandedState,
} from "../../components/tree-data-operations";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ModifyPageContent.css";
import {
  CALL_API_With_JWTToken,
  CALL_API_With_JWTToken_GET,
} from "../../libs/APIAccessAndVerification";
import { MDBFile } from "mdb-react-ui-kit";
import { storage } from "../../libs/FireBase";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { hashString, hashRandom } from "react-hash-string";
import ProgressBar from "react-bootstrap/ProgressBar";
import { AppContext } from "../../context/Context";
import * as variables from "../../variables/variables";
import { APIStatus, APIStatuses } from "../../variables/variables";
import { Avatar } from "@nextui-org/react";
import { mapTree, extendDataItem } from "@progress/kendo-react-common";
import { minHeight } from "@mui/system";
import DeleteModal from "../../components/DeletePagesModal";
import {
  ListView,
  ListViewHeader,
  ListViewFooter,
} from "@progress/kendo-react-listview";

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

const MyItemRender = (props) => {
  let e = props.dataItem;
  if (e.associated_By_Page != undefined) {
    //here we testing by profile_picture_url attribute, if it's not undefined then the related page is an instagram page, else its a facebook one
    if (e.associated_By_Page.profile_picture_url != undefined) {
      return (
        <div
          className="k-listview-item row p-2 border-bottom align-middle"
          style={{ margin: 0 }}
        >
          <div className="col-2 m-2">
            {" "}
            <Avatar
              size="lg"
              src={e.associated_By_Page.profile_picture_url}
              color="gradient"
              squared
              zoomed
            />
          </div>
          {/*<div className="col-3 m-2">
                    <h2 style={{ fontSize: 14, color: "#454545",marginBottom: 0, }} className="text-uppercase">  Account Username</h2>
                <div style={{fontSize: 12,color: "#a0a0a0", }}>{e.value.username }</div> </div>*/}
          <div className="col-4 m-2">
            <h2
              style={{ fontSize: 14, color: "#454545", marginBottom: 0 }}
              className="text-uppercase"
            >
              {" "}
              Page Name
            </h2>
            <div style={{ fontSize: 12, color: "#a0a0a0" }}>
              {e.associated_By_Page.name}
            </div>
          </div>
          <div className="col-2 m-2">
            <Avatar
              size="lg"
              src={e.platform.platformLogoImageUrl}
              color="gradient"
              squared
              zoomed
            />
          </div>
        </div>
      );
    }
    //This indicate that this is a Facebook Page and we handle it with different attributes
    if (e.profile_picture_url == undefined) {
      return (
        <div
          className="k-listview-item row p-2 border-bottom align-middle"
          style={{ margin: 0 }}
        >
          <div className="col-2 m-2">
            {" "}
            <Avatar
              size="lg"
              src={e.associated_By_Page.picture.data.url}
              color="gradient"
              squared
              zoomed
            />
          </div>
          {/*<div className="col-3 m-2">
                    <h2 style={{ fontSize: 14, color: "#454545",marginBottom: 0, }} className="text-uppercase">  Account Username</h2>
                <div style={{fontSize: 12,color: "#a0a0a0", }}>{e.value.username }</div> </div>*/}
          <div className="col-4 m-2">
            <h2
              style={{ fontSize: 14, color: "#454545", marginBottom: 0 }}
              className="text-uppercase"
            >
              {" "}
              Page Name
            </h2>
            <div style={{ fontSize: 12, color: "#a0a0a0" }}>
              {e.associated_By_Page.name}
            </div>
          </div>
          <div className="col-2 m-2">
            <Avatar
              size="lg"
              src={e.platform.platformLogoImageUrl}
              color="gradient"
              squared
              zoomed
            />
          </div>
        </div>
      );
    }
  } else return <></>;
};

export default function Content() {
  const selectField = "selected";
  const expandField = "expanded";
  const dataItemKey = "id";
  const textField = "name";
  const subItemsField = "fb_page_categories";
  const fields = {
    selectField,
    expandField,
    dataItemKey,
    subItemsField,
  };
  let uploadTask = React.useRef(null);
  const [SelectedpageData, setSelectedpageData] = React.useState([]);
  const [data, setdata] = React.useState([{ id: "", name: "Loading" }]);
  const [value, setValue] = React.useState(null);
  const [DropDownTreeShow, setDropDownTreeShow] = React.useState(true);
  const [expanded, setExpanded] = React.useState([data[0][dataItemKey]]);
  const [Associated_By_Page, setAssociated_By_Page] = React.useState([]);
  const [List_Of_Associated_Pages, setList_Of_Associated_Pages] =
    React.useState([]);
  const [DeleteModalShow, setDeleteModalShow] = React.useState(false);
  const [AssociationsLoadedFlag, SetAssociationsLoadedFlag] =
    React.useState(false);
  let PagePicture = React.useRef();
  const onChange = (event) => setValue(event.value);
  const onExpandChange = React.useCallback(
    (event) => setExpanded(expandedState(event.item, dataItemKey, expanded)),
    [expanded]
  );

  let PageName = React.useRef("");
  let PageDescription = React.useRef("");
  let PageAbout = React.useRef("");
  let PageImageUrl = React.useRef("");
  const treeData = React.useMemo(
    () => processTreeData(data, { expanded, value }, fields),
    [expanded, value, data]
  );
  const { GlobalState, Dispatch } = React.useContext(AppContext);
  let OriginalUserinfo = React.useRef();
  const [UploadProgress, setUploadProgress] = React.useState(0);

  //this is used for the first intializtion
  React.useEffect(() => {
    //Loading All FB Categories from the backened
    if (GlobalState.SelectedGroup.group_Name != "Loading...") {
      var JsonObject = {
        PageID: variables.Pages.ListOfSelectedPages[0].ID,
        groupID: GlobalState.SelectedGroup.id,
      };
      let JsonObjectToSend = JSON.stringify(JsonObject);
      let url2 =
        process.env.REACT_APP_BACKENDURL +
        process.env.REACT_APP_GETFBCATEGORIES;
      let UserToken = window.localStorage.getItem("AuthToken");
      let APIResult = CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);
      Dispatch({ type: variables.HeaderSpinnerActions.TurnOnRequestSpinner });
      APIResult.then((result) => {
        if (result.ErrorCode == undefined) {
          setdata(result.result.data);
          Dispatch({ type: variables.HeaderSpinnerActions.TurnOffRequestSpinner });
        }
      }).catch((e) => {
        Dispatch({ type: variables.HeaderSpinnerActions.TurnOffRequestSpinner });
      });
     
      //Loading the Page Associated pages and associated by pages

      let url3 =
        process.env.REACT_APP_BACKENDURL +
        process.env.REACT_APP_GETPAGEASSOCIATIONS;
      let APIResult3 = CALL_API_With_JWTToken(
        url3,
        JsonObjectToSend,
        UserToken
      );
      Dispatch({ type: variables.HeaderSpinnerActions.TurnOnRequestSpinner });
      APIResult3.then((result) => {
        if (result.ErrorCode == undefined) {
          if (JSON.stringify(result.result.associated_By_Page) === "{}") {
            setAssociated_By_Page([]);
          } else {
            setAssociated_By_Page([result.result.associated_By_Page]);
          }
          setList_Of_Associated_Pages(result.result.list_Of_Associated_Pages);
          SetAssociationsLoadedFlag(true);
          Dispatch({ type: variables.HeaderSpinnerActions.TurnOffRequestSpinner });
        }
      }).catch((e) => {
        Dispatch({ type: variables.HeaderSpinnerActions.TurnOffRequestSpinner });
      });
     
    }
  }, []);

  //This is used for a re-render after info update or image update
  React.useEffect(() => {
    //Loading All FB Categories from the backened
    if (GlobalState.SelectedGroup.group_Name != "Loading...") {
      var JsonObject = {
        PageID: variables.Pages.ListOfSelectedPages[0].ID,
        groupID: GlobalState.SelectedGroup.id,
      };
      let JsonObjectToSend = JSON.stringify(JsonObject);
      let url2 =
        process.env.REACT_APP_BACKENDURL +
        process.env.REACT_APP_GETFBCATEGORIES;
      let UserToken = window.localStorage.getItem("AuthToken");
      let APIResult = CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);
      Dispatch({ type: variables.HeaderSpinnerActions.TurnOnRequestSpinner });
      APIResult.then((result) => {
        if (result.ErrorCode == undefined) {
          setdata(result.result.data);
          Dispatch({ type: variables.HeaderSpinnerActions.TurnOffRequestSpinner });
        }
      }).catch((e) => {
        Dispatch({ type: variables.HeaderSpinnerActions.TurnOffRequestSpinner });
      });
      
      //Loading the Page Associated pages and associated by pages

      let url3 =
        process.env.REACT_APP_BACKENDURL +
        process.env.REACT_APP_GETPAGEASSOCIATIONS;
      let APIResult3 = CALL_API_With_JWTToken(
        url3,
        JsonObjectToSend,
        UserToken
      );
      Dispatch({ type: variables.HeaderSpinnerActions.TurnOnRequestSpinner });
      APIResult3.then((result) => {
        if (result.ErrorCode == undefined) {
          if (JSON.stringify(result.result.associated_By_Page) === "{}") {
            setAssociated_By_Page([]);
          } else {
            setAssociated_By_Page([result.result.associated_By_Page]);
          }

          if (JSON.stringify(result.result.list_Of_Associated_Pages) === "[]") {
            setList_Of_Associated_Pages([]);
          } else {
            setList_Of_Associated_Pages(result.result.list_Of_Associated_Pages);
          }
          
          SetAssociationsLoadedFlag(true);
          Dispatch({ type: variables.HeaderSpinnerActions.TurnOffRequestSpinner });
        }
      }).catch((e) => {
        Dispatch({ type: variables.HeaderSpinnerActions.TurnOffRequestSpinner });
      });
      
    }
  }, [GlobalState.Rerender]);

  React.useEffect(() => {
    if (data.length != null) {
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
        APIResult3.then((result) => {
     
          if (result.ErrorCode == undefined) {
            //Handling Facebook result
            if (result.result.name != undefined) {
              PageName.current.value = result.result.name;
            }
            if (result.result.about != undefined) {
              PageAbout.current.value = result.result.about;
            }
            if (result.result.picture != undefined) {
              PageImageUrl.current.src = result.result.picture.data.url;
            }
            if (result.result.description != undefined) {
              PageDescription.current.value = result.result.description;
            }
            if (result.result.category_list != undefined) {
              //Setting the default category to selected

              var res = mapTree(treeData, subItemsField, (item) => {
                if (item.id == result.result.category_list[0].id)
                  setValue(item);
                return item;
              });
            } else {
              setDropDownTreeShow(false);
            }

            //HandlingInstagram result
            if (result.result.picture == undefined) {
              PageImageUrl.current.src = result.result.profile_picture_url;
            }
            if (result.result.description == undefined) {
              PageDescription.current.value = "Not Applicable";
              PageDescription.current.readOnly = true;
            }

            if (result.result.about == undefined) {
              PageAbout.current.value = "Not Applicable";
              PageAbout.current.readOnly = true;
            }
          }
          Dispatch({ type: variables.HeaderSpinnerActions.TurnOffRequestSpinner });
        }).catch((e) => {
          Dispatch({ type: variables.HeaderSpinnerActions.TurnOffRequestSpinner });
        });
      }
    }
  }, [data]);

  //handles the save of the page informations
  const handlesubmit = (props) => {
    props.preventDefault();

    if (GlobalState.SelectedGroup.group_Name != "Loading...") {
      var JsonObject = {
        pageID: variables.Pages.ListOfSelectedPages[0].ID,
        pageName: PageName.current.value,
        pageDescription: PageDescription.current.value,
        pageAbout: PageAbout.current.value,
        pageCategory: value.id,
        pageCategoryName: value.name,
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
    if (!props.target[0].files[0]) return;
    let file = props.target[0].files[0];
    let HashedFileName = hashRandom();
    const storageRef = ref(storage, `/PageImages/${HashedFileName}`);

    //Uploading the new image to FireBase

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
          //Sending a POST HTTP To the API with the Json Object
          setUploadProgress(0);
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
            Dispatch({
              type: variables.HeaderSpinnerActions.TurnOnRequestSpinner,
            });
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
                Dispatch({ type: variables.RerenderActions.ReRenderPage });
              } else {
                toast.error("Page Picture Change failed.", {
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
      toast.success("File Upload cancelled", {
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
      toast.error("File Upload cancel failed, please contact Dev team", {
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
  };
  return (
    <div className="container-xl px-4 mt-4">
      <div className="row d-flex">
        <div className="col-xl-4 d-flex">
          <div className="card mb-4 ">
            <div className="card-header d-flex justify-content-center">
              {" "}
              Page Picture
            </div>
            <div className="card-body text-center ">
              {/*Test if User has a profile picture if not show default*/}

              <img
                ref={PageImageUrl}
                style={{
                  display: "block",
                  margin: "auto",
                  minWidth: "10rem",
                  minHeight: "10rem",
                  maxHeight: "10rem",
                  maxWidth: "10rem",
                }}
                className="rounded-5 shadow-2 mb-5 border border-primary"
                alt=""
              />
              {DropDownTreeShow && (
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
                  <input
                    className="btn btn-primary"
                    type="submit"
                    value="Save Image"
                  />
                </form>
              )}
            </div>
          </div>
        </div>
        <div className="col-xl-8 d-flex">
          <div className="card mb-4 ">
            <div className="card-header d-flex justify-content-center">
              {" "}
              Page Details
            </div>
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
                {DropDownTreeShow && (
                  <>
                    <div className="mb-3">
                      <label className="small mb-1"> Page Category</label>
                      <br></br>
                      <div>
                        <DropDownTree
                          data={treeData}
                          value={value}
                          onChange={onChange}
                          placeholder="Please select ..."
                          textField={textField}
                          dataItemKey={dataItemKey}
                          selectField={selectField}
                          expandField={expandField}
                          subItemsField={subItemsField}
                          onExpandChange={onExpandChange}
                        />
                      </div>
                    </div>
                    <input
                      type="submit"
                      value="Save Changes"
                      className="btn btn-primary"
                    />
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="row d-flex">
        <div className="col-xl-4 d-flex">
          <div className="card mb-4 ">
            <div className="card-header d-flex justify-content-center">
              {" "}
              Delete Page
            </div>
            <div className="card-body text-center ">
              <p>
                If you want to delete the Page from the List, Be careful, if the
                Page is deleted, there is no come back, this is permanent!
              </p>
              {DeleteModalShow && (
                <DeleteModal SetShowDeleteModal={setDeleteModalShow} />
              )}
              <input
                className="btn btn-danger"
                style={{ margin: "1rem" }}
                onClick={() => {
                  setDeleteModalShow(!DeleteModalShow);
                }}
                type="submit"
                value="Delete Page"
              />
            </div>
          </div>
        </div>
        <div className="col-xl-8 d-flex">
          <div className="card mb-4 ">
            <div className="card-header d-flex justify-content-center">
              {" "}
              Modify Page Association
            </div>
            <div className="card-body text-center ">
              {AssociationsLoadedFlag == true ? (
                <>
                  <ListView
                    data={List_Of_Associated_Pages}
                    item={MyItemRender}
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
                    item={MyItemRender}
                    style={{ width: "100%" }}
                    header={MyHeaderAssociateToPage}
                    footer={MyFooter}
                  />
                  {}
                  {console.log(Associated_By_Page.length)}
                  {Associated_By_Page.length == 0 && (
                    <p
                      className="m-1"
                      style={{ color: "rgb(160, 160, 160)", fontSize: 12 }}
                    >
                      The Page doesn't have any.
                    </p>
                  )}
                </>
              ) : (
                <p>Loading Associations....</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
