import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import HelpIcon from "@mui/icons-material/Help";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import LinearLoadingSpinner from "../../components/UI/SpinnerComps/LinearLoadingSpinner";
import { AppContext } from "../../context/Context";
import SendIcon from '@mui/icons-material/Send';
import VisibilityIcon from '@mui/icons-material/Visibility';
import * as variables from "../../variables/variables";
import { Avatar } from "@nextui-org/react";
import EditIcon from "@mui/icons-material/Edit";
import BarChartIcon from '@mui/icons-material/BarChart';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
function Header(props) {
  
  const { onDrawerToggle } = props;
  const { GlobalState, Dispatch } = React.useContext(AppContext);
  let [TabMenu, SetTabMenu] = React.useState(0);

  let [PicStatus, SetPicStatus] = React.useState();
  React.useEffect(() => {
    if (GlobalState.UserProfilePicture == "") {
      SetPicStatus("https://firebasestorage.googleapis.com/v0/b/socialpost-58454.appspot.com/o/PlatformsLogo%2Ffavicon.ico.png?alt=media&token=67706ea6-c3ae-4cdd-bb9e-4f61c39d0505");
    } else {
      SetPicStatus(GlobalState.UserProfilePicture);
    }

    if (GlobalState.PostSelectedTab == variables.PostTabs.ManagePostsTab) {
      SetTabMenu(0);
    }
    if (GlobalState.PostSelectedTab == variables.PostTabs.ViewPostInseights) {
      SetTabMenu(1);
    }
    if (GlobalState.PostSelectedTab == variables.PostTabs.AddPost) {
      SetTabMenu(2);
    }

    if (GlobalState.PostSelectedTab == variables.PostTabs.EditPost) {
      SetTabMenu(2);
    }
    if (GlobalState.PostSelectedTab == variables.PostTabs.PreviewPost) {
      SetTabMenu(2);
    }
  }, [GlobalState]);
  return (
    <React.Fragment>
      <AppBar color="primary" position="sticky" elevation={0}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            <Grid sx={{ display: { sm: "none", xs: "block" } }} item>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={onDrawerToggle}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item xs />
            <Grid item style={{ marginTop: "1rem" }}>
              <p>
                {GlobalState.FirstName + " "} {GlobalState.LastName}
              </p>
            </Grid>
            <Grid item>
              <Tooltip title="Alerts • No alerts">
                <IconButton color="inherit">
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <IconButton color="inherit" sx={{ p: 0.5 }}>
                <Avatar
                  size="lg"
                  src={PicStatus}
                  color="primary"
                  bordered
                  squared
                />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        color="primary"
        position="static"
        elevation={0}
        sx={{ zIndex: 0 }}
      >
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
              <Typography color="inherit" variant="h5" component="h1">
                Publish Management
              </Typography>
            </Grid>

            <Grid item>
              <Tooltip title="Social Post is an application that lets you schedule, create posts efficently within an organized group, pages management.">
                <IconButton color="inherit">
                  <HelpIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        position="static"
        elevation={0}
        sx={{ zIndex: 0 }}
      >
        <Tabs value={TabMenu} textColor="inherit">
          <Tab
            label={
              <>
                <CalendarMonthIcon/> <p>Manage Posts</p>
              </>
            }
            onClick={() => {
              Dispatch({ type: variables.PostSelectedTabActions.SelectManagePosts });
            }}
          />

          <Tab
            label={
              <>
                <BarChartIcon/> <p>View Insights</p>
              </>
            }
            onClick={() => {
              Dispatch({ type: variables.PostSelectedTabActions.SelectViewPostInseights });
            }}
          />

          {GlobalState.PostSelectedTab == variables.PostTabs.AddPost && (
            <Tab
              label={
                <>
                  <SendIcon /> <p>Add Post</p>
                </>
              }
              onClick={() => {
                Dispatch({ type: variables.PostSelectedTabActions.SelectAddPost });
              }}
            />
          )}

          {GlobalState.PostSelectedTab == variables.PostTabs.EditPost && (
            <Tab
              label={
                <>
                  <EditIcon /> <p>Edit Post</p>
                </>
              }
              onClick={() => {
                Dispatch({ type: variables.PostSelectedTabActions.SelectEditPost });
              }}
            />
          )}

          {GlobalState.PostSelectedTab == variables.PostTabs.PreviewPost && (
            <Tab
              label={
                <>
                  <VisibilityIcon /> <p>Preview Post</p>
                </>
              }
              onClick={() => {
                Dispatch({ type: variables.PostSelectedTabActions.SelectEditPost });
              }}
            />
          )}
        </Tabs>
      </AppBar>
      {GlobalState.HeadSpinner && <LinearLoadingSpinner />}
      {GlobalState.RequestSpinner && <LinearLoadingSpinner />}
    </React.Fragment>
  );
}

export default Header;
