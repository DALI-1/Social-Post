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
import * as variables from "../../variables/variables";
import { Avatar } from "@nextui-org/react";
import EditIcon from "@mui/icons-material/Edit";
import TuneIcon from "@mui/icons-material/Tune";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
function Header(props) {
  const { onDrawerToggle } = props;
  const { GlobalState, Dispatch } = React.useContext(AppContext);
  let [TabMenu, SetTabMenu] = React.useState(0);

  let [PicStatus, SetPicStatus] = React.useState();
  React.useEffect(() => {
    if (GlobalState.UserProfilePicture == "") {
      SetPicStatus("/static/images/avatar/1.jpg");
    } else {
      SetPicStatus(GlobalState.UserProfilePicture);
    }

    if (GlobalState.PageSelectedTab == variables.PageTabs.ManagePage) {
      SetTabMenu(0);
    }

    if (GlobalState.PageSelectedTab == variables.PageTabs.AddPage) {
      SetTabMenu(1);
    }

    if (GlobalState.PageSelectedTab == variables.PageTabs.EditPage) {
      SetTabMenu(1);
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
                Posts Management
              </Typography>
            </Grid>

            <Grid item>
              <Tooltip title="Help">
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
                <TuneIcon /> <p>Manage Pages</p>
              </>
            }
            onClick={() => {
              Dispatch({ type: variables.PageTabActions.SelectManagePage });
            }}
          />

          {GlobalState.PageSelectedTab == variables.PageTabs.AddPage && (
            <Tab
              label={
                <>
                  <GroupAddIcon /> <p>Add Pages</p>
                </>
              }
            />
          )}

          {GlobalState.PageSelectedTab == variables.PageTabs.EditPage && (
            <Tab
              label={
                <>
                  <EditIcon /> <p>Edit Page</p>
                </>
              }
              onClick={() => {
                Dispatch({ type: variables.PageTabActions.SelectEditPage });
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
