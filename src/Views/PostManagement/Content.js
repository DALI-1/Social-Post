import * as React from "react";
import { UserInformations } from "../../variables/variables";
import * as variables from "../../variables/variables";
import { AppContext } from "../../context/Context";
import Container from "react-bootstrap/Container";
import ManagePostContent from "./ManagePostContent";
import AddPostContent from "./AddPostContent";
import EditPostContent from "./EditPostContent";
import PreviewPostContent from "./PreviewPostContent";
export default function Content() {
  const { GlobalState, Dispatch } = React.useContext(AppContext);
  return (
    <>
      {!GlobalState.HeadSpinner ? (
        <>
          {UserInformations.info != null ? (
            <>
              <Container>
                {GlobalState.PostSelectedTab ==variables.PostTabs.ManagePostsTab && <ManagePostContent />}
                 {GlobalState.PostSelectedTab ==variables.PostTabs.AddPost &&<AddPostContent/>}
                 {GlobalState.PostSelectedTab ==variables.PostTabs.EditPost &&<EditPostContent/>}
                 {GlobalState.PostSelectedTab ==variables.PostTabs.PreviewPost &&<PreviewPostContent/>}
              </Container>
            </>
          ) : (
            <>
              {" "}
              <div className="card-body text-center">
                <p>
                  Failed to Load Data please retry again or check your
                  connection
                </p>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className="card-body text-center">
            <p>Please wait, loading data....</p>
          </div>
        </>
      )}
    </>
  );
}
