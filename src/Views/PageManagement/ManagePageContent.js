import * as React from "react";
import { Loader } from "@progress/kendo-react-indicators";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CALL_API_With_JWTToken,
} from "../../libs/APIAccessAndVerification";
import { AppContext } from "../../context/Context";
import * as variables from "../../variables/variables";
import "./ManagePageContent.css";
import PageManagementTable from "../../components/Table/PageManagementTable";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { MDBBtn } from "mdb-react-ui-kit";
import Paper from "@mui/material/Paper";
import { useEffect } from "react";
import SelectPlatformModal from "../../components/PlatformModal/SelectPlatformModal";
import SelectFacebookPagesModal from "../../components/FacebookComps/SelectFacebookPagesModal";
import SelectInstagramPagesModal from "../../components/InstagramComps/SelectInstagramPagesModal";
import OptionalINFBSelectModal from "../../components/InstagramComps/OptionalFBSelectModal";
import OptionalFBINSelectModal from "../../components/FacebookComps/OptionalINSTASelectModal";
import DeleteModal from "../../components/DeletePagesModal";
import Alert from '@mui/material/Alert';
import NoteAddIcon from '@mui/icons-material/NoteAdd'; 
import NoteAltIcon from '@mui/icons-material/NoteAlt'; 
import Button from '@mui/material/Button';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import * as PermissionLib from "../../libs/PermissionsChecker"
export default function Content() {
  const { GlobalState, Dispatch } = React.useContext(AppContext);
  //this flag indicate to the system when to show the Facebook Dialog asking the user to  login to Facebook and shows him the possible pages that he can choose.
  //values: TRUE: Dialog is shown, FALSE: Dialog is hidden
  const [SelectFBPageModalFlag, SetSelectFBPageModalFlag] =
    React.useState(false);
  //this flag indicate to the system when to show Instagram Dialog asking the user to  login to Facebook and shows him the possible pages that he can choose.
  //values: TRUE: Dialog is shown, FALSE: Dialog is hidden
  const [SelectINSTAPageModalFlag, SetSelectINSTAPageModalFlag] =
    React.useState(false);
  //this flag indicate to the system when to show the Select which platform to choose when the user selects to add a new page
  //values: TRUE: Dialog is shown, FALSE: Dialog is hidden
  const [SelectPlatformModalFlag, SetSelectPlatformModalFlag] =
    React.useState(false);
  //This is a flag that indicate when the Current selected group pages are loaded in order to show the table and the loading spinner
  const [DataLoaded, SetDataLoaded] = React.useState(false);
  //THIS INDICATE THE INSTA PAGES THAT HAVE A POSSIBE CONNECTION TO A FACEBOOK PAGE for the Instagram optional Modal
  //This is mainly used to show the facebook pages list in order for the User to optionally select the related Facbook users
  //DATA FORMAT:[{name: 'RestaurantA', id: '100272216328499', instagram_business_account: {name: 'Mohamed Ali Gargouri', id: '17841458690186189'}}]
  // name here indicate the Facebook page name and ID (this is useful for the optional choice later on)
  const [INFBPages, SetINFBPages] = React.useState([]);
  //THIS INDICATE THE Facebook PAGES THAT HAVE A POSSIBE CONNECTION TO An INSTAGRAM BUSINESS PAGE for the Instagram optional Modal
  //This is mainly used to show the facebook pages list in order for the User to optionally select the related Facbook users
  //DATA FORMAT:[{name: 'RestaurantA', id: '100272216328499', instagram_business_account: {name: 'Mohamed Ali Gargouri', id: '17841458690186189'}}]
  // name here indicate the Facebook page name and ID (this is useful for the optional choice later on)
  const [FBINPages, SetFBINPages] = React.useState([]);
  //This flag indicate if the Instagram choice modal  should be on or not
  const [ShowINFBChoiceModal, SetShowINFBChoiceModal] = React.useState(false);

  //This flag indicate if the Facebook choice modal  should be on or not
  const [ShowFBINChoiceModal, SetShowFBINChoiceModal] = React.useState(false);

  //This flag indicate to the Delete modal when to be on or of
  const [ShowDeleteModal, SetShowDeleteModal] = React.useState(false);
  const [TooManyRequestsError,SetTooManyRequestsError]=React.useState(false)
   
  const handlePageModify = () => {
    if (
      variables.Pages.ListOfSelectedPages.length == 0 ||
      variables.Pages.ListOfSelectedPages.length > 1
    ) {
      toast.info("You must select One Page to modify", {
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
      Dispatch({ type: variables.PageTabActions.SelectEditPage });
    }
  };

  //This function is handle the page add based on the selection list and optional selection List
  const handleAddINPages = () => {
    //Test if the select platform is Facebook or Instagram
    //This is the Facebook Case
    console.log(variables.Pages)
    if (variables.Pages.SelectedPlatformID == 1) {
      //formating the request based on the backend DTO
      var JsonObject = {
        groupID: variables.Group.SelectedGroup,
        ownerFBid: variables.FacebookUser.LoggedFacebookUserInfo.userID,
        ownerFB_shortLivedToken:
          variables.FacebookUser.LoggedFacebookUserInfo.accessToken,
        listOfPages: [],
      };

      var listOfPages = [];
      //Iterating through the selected Pages

      variables.Pages.FBSelectedPagesList.map((Selected_Facebook_Page) => {
        //This Flag indicate if he selected the optional Facebook Page of the current Insta Page or not, by default its false until we found it in the INsta optional facebook list
        var OptionalSelected = false;
        console.log(variables.Pages.FBINGSelectedOptionalPagesList);
        variables.Pages.FBINGSelectedOptionalPagesList.map(
          (SelectedOptionalFBKPage) => {
            if (SelectedOptionalFBKPage.id == Selected_Facebook_Page.id) {
              listOfPages = [
                ...listOfPages,
                {
                  pageID: Selected_Facebook_Page.id,
                  page_shortLivedToken: Selected_Facebook_Page.access_token,
                  associatedPageID:
                    Selected_Facebook_Page.instagram_business_account.id,
                },
              ];
              OptionalSelected = true;
            }
          }
        );
        //if no optional Facebook page added we just add the Insta page
        if (OptionalSelected == false) {
          listOfPages = [
            ...listOfPages,
            {
              pageID: Selected_Facebook_Page.id,
              page_shortLivedToken: Selected_Facebook_Page.access_token,
              associatedPageID: "null",
            },
          ];
        }
      });

      JsonObject.listOfPages = listOfPages;
      let JsonObjectToSend = JSON.stringify(JsonObject);
      let url2 =
        process.env.REACT_APP_BACKENDURL +
        process.env.REACT_APP_ADDFACEBOOKPAGE;
      let UserToken = window.localStorage.getItem("AuthToken");
      let APIResult = CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);
      Dispatch({ type: variables.HeaderSpinnerActions.TurnOnRequestSpinner });
      APIResult.then((result) => {
        if (result.successCode == "FCBK_Pages_Added") {
          toast.success("The Facebook pages you Selected Added Successfully!", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          //--------NOTE:Updating the selected variables to avoid conflicts if u try to add pages again----//
          variables.Pages.FBSelectedPagesList=[]
          variables.Pages.FBSelectPagesList=[]
          variables.Pages.FBINGSelectedOptionalPagesList =[]
          //---------End NOTE---------//
          Dispatch({ type: variables.HeaderSpinnerActions.TurnOffRequestSpinner });
          Dispatch({ type: variables.PageTabActions.SelectManagePage });
          Dispatch({ type: variables.RerenderActions.ReRenderPage });        
        }

        if (result.result == "Selected_Page_Exist") {
          toast.info(
            "The One of the Facebook pages you Selected Already exist!",
            {
              position: "bottom-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            }
          );
          Dispatch({ type: variables.HeaderSpinnerActions.TurnOffRequestSpinner });
        }
      }).catch((e) => {
        console.log(e);
      });
      
    }

    console.log(variables.FacebookUser.LoggedFacebookUserInfo)
    //This is the Instagram Case
    if (variables.Pages.SelectedPlatformID == 2) {
      //formating the request based on the backend DTO

      var JsonObject = {
        groupID: variables.Group.SelectedGroup,
        ownerFBid: variables.FacebookUser.LoggedFacebookUserInfo.id,
        ownerFB_shortLivedToken:
          variables.FacebookUser.LoggedFacebookUserInfo.accessToken,
        listOfPages: [],
      };

      var listOfPages = [];
      //Iterating through the selected Pages
      variables.Pages.INGSelectedPagesList.map((SelectedINSTAPAGE) => {
        //This Flag indicate if he selected the optional Facebook Page of the current Insta Page or not, by default its false until we found it in the INsta optional facebook list
        var OptionalSelected = false;
        variables.Pages.INGFBSelectedOptionalPagesList.map(
          (SelectedOptionalINSTAPAGE) => {
            if (SelectedOptionalINSTAPAGE.id == SelectedINSTAPAGE.id) {
              listOfPages = [
                ...listOfPages,
                {
                  pageID: SelectedINSTAPAGE.instagram_business_account.id,
                  page_shortLivedToken: SelectedINSTAPAGE.access_token,
                  associatedPageID: SelectedINSTAPAGE.id,
                },
              ];
              OptionalSelected = true;
            }
          }
        );
        //if no optional Facebook page added we just add the Insta page
        if (OptionalSelected == false) {
          listOfPages = [
            ...listOfPages,
            {
              pageID: SelectedINSTAPAGE.instagram_business_account.id,
              page_shortLivedToken: SelectedINSTAPAGE.access_token,
              associatedPageID: "null",
            },
          ];
        }
      });
      JsonObject.listOfPages = listOfPages;
      let JsonObjectToSend = JSON.stringify(JsonObject);
      let url2 =
        process.env.REACT_APP_BACKENDURL +
        process.env.REACT_APP_ADDINSTAGRAMPAGE;
      let UserToken = window.localStorage.getItem("AuthToken");
      let APIResult = CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);
      Dispatch({ type: variables.HeaderSpinnerActions.TurnOnRequestSpinner });
      APIResult.then((result) => {
        if (result.successCode == "INSTA_Pages_Added") {
          toast.success(
            "The Instagram pages you Selected Added Successfully!",
            {
              position: "bottom-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            }
          );
          
            //--------NOTE:Updating the selected variables to avoid conflicts if u try to add pages again----//
            variables.Pages.INGSelectedPagesList=[]
            variables.Pages.INGSelectPagesList=[]
            variables.Pages.INGFBSelectedOptionalPagesList =[]
            //---------End NOTE---------//
          Dispatch({ type: variables.HeaderSpinnerActions.TurnOffRequestSpinner });
          Dispatch({ type: variables.PageTabActions.SelectManagePage });
          Dispatch({ type: variables.RerenderActions.ReRenderPage });
        }
        if (result.result == "Selected_Page_Exist") {
          toast.info(
            "The One of the Instagram pages you Selected Already exist!",
            {
              position: "bottom-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            }
          );
          Dispatch({ type: variables.HeaderSpinnerActions.TurnOffRequestSpinner });
        }
      }).catch((e) => {
        console.log(e);
      });
    
    }
  };

  useEffect(() => {
    //Here we intialize our Page management and we request the select groups pages and show them to the user
    variables.Pages.ListOfSelectedPages = [];
    //If the User informations successfully loaded, that includes the group he is in by default or the one that he selected
    if (GlobalState.SelectedGroup.group_Name != "Loading...") {
      var JsonObject = { groupID: GlobalState.SelectedGroup.id };
      let JsonObjectToSend = JSON.stringify(JsonObject);
      let url2 =
        process.env.REACT_APP_BACKENDURL + process.env.REACT_APP_GETGROUPPAGES;
      let UserToken = window.localStorage.getItem("AuthToken");
      let APIResult = CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);
      Dispatch({ type: variables.HeaderSpinnerActions.TurnOnRequestSpinner });
      APIResult.then((result) => {
        if (result.errorCode == undefined) {
          variables.Pages.CurrentGroupPages = [];
          result.result.map((Page) => {
            variables.Pages.CurrentGroupPages = [
              ...variables.Pages.CurrentGroupPages,Page
              
            ];
          });

          SetDataLoaded(true);
          variables.Pages.ListOfSelectedPages = [];
          Dispatch({ type: variables.HeaderSpinnerActions.TurnOffRequestSpinner });
        }
        else
        {
              if(result.errorCode == "F004")
        SetTooManyRequestsError(true)
        SetDataLoaded(true);
        Dispatch({ type: variables.HeaderSpinnerActions.TurnOffRequestSpinner });
        }
      }).catch((e) => {
        console.log(e);
      });
     
    }
  }, []);

//This is used to reload data after changes
  useEffect(() => {

    SetDataLoaded(false)
    //Here we intialize our Page management and we request the select groups pages and show them to the user
    variables.Pages.ListOfSelectedPages = [];
    //If the User informations successfully loaded, that includes the group he is in by default or the one that he selected
    if (GlobalState.SelectedGroup.group_Name != "Loading...") {
      var JsonObject = { groupID: GlobalState.SelectedGroup.id };
      let JsonObjectToSend = JSON.stringify(JsonObject);
      let url2 =
        process.env.REACT_APP_BACKENDURL + process.env.REACT_APP_GETGROUPPAGES;
      let UserToken = window.localStorage.getItem("AuthToken");
      let APIResult = CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);
      Dispatch({ type: variables.HeaderSpinnerActions.TurnOnRequestSpinner });
      APIResult.then((result) => {
        if (result.errorCode == undefined) {
          variables.Pages.CurrentGroupPages = [];
          console.log(result.result)
          result.result.map((Page) => {
            variables.Pages.CurrentGroupPages = [
              ...variables.Pages.CurrentGroupPages,Page
              
            ];
          });
          SetDataLoaded(true);
          variables.Pages.ListOfSelectedPages = [];
          Dispatch({ type: variables.HeaderSpinnerActions.TurnOffRequestSpinner });
        }
        else
        {
              if(result.errorCode == "F004")
        SetTooManyRequestsError(true)
        SetDataLoaded(true);
        Dispatch({ type: variables.HeaderSpinnerActions.TurnOffRequestSpinner });
        }
      }).catch((e) => {
        console.log(e);
      });
     
    }
  }, [GlobalState.Rerender]);
  const HandlePageDelete = () => {
    //This function is gonna turn on the delete modal flag and redirect the request to it so it handles the delete
    if (variables.Pages.ListOfSelectedPages.length > 0) {
      SetShowDeleteModal(true);
    } else {
      toast.info("You need to select at least one page", {
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
    <>
      <Container>
        <Row>
          <Col>
            <Paper sx={{ width: "100%",m:1, p: 1, textAlign: "center",boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
              <div style={{ textAlign: "right" }}>
              {PermissionLib.ValidateAction(variables.MenuItems.Page_MenuItem,variables.MenuItemActions.Add_PageAction)&&           
                <Button
                  variant="outlined"color="primary"
                  className="mx-2 m-2"
                  startIcon={<NoteAddIcon/>}
                  onClick={() => {
                    SetSelectPlatformModalFlag(true);
                  }}
                >
                  Add New Page
                </Button>
}
{PermissionLib.ValidateAction(variables.MenuItems.Page_MenuItem,variables.MenuItemActions.Edit_PageAction)&&
                <Button
                  variant="outlined"color="primary"
                  className="mx-2 m-2"
                  startIcon={<NoteAltIcon/>}
                  onClick={handlePageModify}
                >
                  {" "}
                  Modifty Page
                </Button>
}
{PermissionLib.ValidateAction(variables.MenuItems.Page_MenuItem,variables.MenuItemActions.Remove_PageAction)&&
                <Button
                  variant="outlined"color="error"
                  className="mx-2 m-2"
                  startIcon={<DeleteForeverIcon/>}
                  onClick={HandlePageDelete}
                >
                  Delete Page
                </Button>
}
              </div>
            </Paper>
          </Col>
        </Row>
      </Container>

      <Container>
        <Row>
          <Col>
            <Paper sx={{ width: "100%" ,m:1, p:1 , textAlign: "center",boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'}}>
              {TooManyRequestsError&& 
                   <Alert severity="error">Too Many requests, Limit reached, please wait sometime before trying again</Alert>
              }

              {!DataLoaded && (
                <Loader
                  themeColor="info"
                  size="large"
                  type="converging-spinner"
                />
              )}
              {DataLoaded &&!TooManyRequestsError && (
                <PageManagementTable data={variables.Pages.CurrentGroupPages} />
              )}
            </Paper>
          </Col>
        </Row>
      </Container>

      {/*This Gonna show the Select Platform Dialog if the SelectPlatformModlFlag is True */}
      {SelectPlatformModalFlag && (
        <SelectPlatformModal
          SetSelectPlatformModalFlag={SetSelectPlatformModalFlag}
          SetSelectFBPageModalFlag={SetSelectFBPageModalFlag}
          SetSelectINSTAPageModalFlag={SetSelectINSTAPageModalFlag}
        />
      )}
      {/*Here is  a popup that's gonna show when the user chooses to use Facebook platform to load a page */}
      {SelectFBPageModalFlag && (
        <SelectFacebookPagesModal
          SetSelectFBPageModalFlag={SetSelectFBPageModalFlag}
          SetShowFBINChoiceModal={SetShowFBINChoiceModal}
          SetFBINPages={SetFBINPages}
          handleAddINPages={handleAddINPages}
        />
      )}
      {ShowFBINChoiceModal && FBINPages.length > 0 && (
        <OptionalFBINSelectModal
          handleAddINPages={handleAddINPages}
          SetSelectFBPageModalFlag={SetSelectFBPageModalFlag}
          SetShowFBINChoiceModal={SetShowFBINChoiceModal}
          FBINPages={FBINPages}
        />
      )}

      {/*Here is  a popup that's gonna show when the user chooses to use Instagram platform to load a page */}
      {SelectINSTAPageModalFlag && (
        <SelectInstagramPagesModal
          handleAddINPages={handleAddINPages}
          SelectINSTAPageModalFlag={SetSelectINSTAPageModalFlag}
          SetShowINFBChoiceModal={SetShowINFBChoiceModal}
          SetINFBPages={SetINFBPages}
        />
      )}
      {ShowINFBChoiceModal && INFBPages.length > 0 && (
        <OptionalINFBSelectModal
          handleAddINPages={handleAddINPages}
          SelectINSTAPageModalFlag={SetSelectINSTAPageModalFlag}
          SetShowINFBChoiceModal={SetShowINFBChoiceModal}
          INFBPages={INFBPages}
        />
      )}

      {/*Here is the pop up that shows when the user chooses to delete multiple pages*/}
      {ShowDeleteModal && (
        <DeleteModal SetShowDeleteModal={SetShowDeleteModal}/>
      )}
    </>
  );
}
