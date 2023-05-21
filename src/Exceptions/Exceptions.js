//This exceptions is used to handle the Server's internal errors
 class ServerInternalError extends Error {
    constructor() {
      super("ServerInternalError");
      this.ErrorType="E0001"
      this.ErrorMessageDev = "Server_Internal_Error"
      this.ErrorMessageUser = "Sorry! looks like we ran into an internal issue, please retry again";
    }
  }
//This exceptions is used to handle when the connection is lost to the Server
   class ServerConnectionLostError extends Error {
    constructor() {
      super("ServerConnectionLostError");
      this.ErrorType="E0002"
      this.ErrorMessageDev = "Connection_Lost"
      this.ErrorMessageUser = "We're unable to establish a connection with the Server Please try again...";
    }
  }

  //This exceptions is used to handle when the user dont have authorization
  class UnAuthorized extends Error {
    constructor() {
      super("UnAuthorized");
      this.ErrorType="E0002"
      this.ErrorMessageDev = "Access token is not Valid for this request"
      this.ErrorMessageUser = "You don't have access to perform this action Or your session is no longer valid";
    }
  }

  module.exports = { ServerInternalError, ServerConnectionLostError,UnAuthorized };