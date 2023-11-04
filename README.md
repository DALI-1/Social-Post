
## Introduction
Social Post is a web application that allows campaigns to handle, schedule their posts within Facebook and Instagram, it provides a way to create posts dynamically with variables, thumbnails, Dynamic fields within a group system where multiple people can work together in a single campaign, see the post insights, schedule posts, add,edit, pages and so on...
This app contains six major sections
1. Authentification
2. Group Management
3. Page Management
4. Profile Management
5. Post Management
6. User Management

##Tools
The front-end of this project was built using React 18, Material UI, Syncfusion, MDB-React, Bootstrap Kendo UI,
The back-end of this project was built using ASP .NET Core 6, SQL Server and Service worker.

##Getting Started
For the front-end, start first by installing Node JS [`Node Download Link`](https://nodejs.org/en/download/current)
And then download or clone the git repo, after doing so simply install the dependencies (Make sure to include --force)
```bash
npm install --force
```
After finishing the download, create a new .env file (this gonna contain keys for this app)
If you wanna add HTTPS to the app and add your own certificates, in the ssl folder, put your own cert.pm and key.pm and set the HTTPS to True in the env.
For the rest, Kendo UI, get your license  from Kendo UI and puts it inside the Licenses folder and for MetaAPP Key, go create a new application Meta
[`Meta Link`](https://developers.facebook.com/async/registration/dialog/?src=default) and get your Meta App key from there,
same for TinyMceAPI key and Syncfusion, get your own keys from their websites and put them here for them to work with the app, for the rest, these are just the api paths for the backened, change them if you modified the backened or added a new api.
```bash


HTTPS=false 
SSL_CRT_FILE=./ssl/cert.pem 
SSL_KEY_FILE=./ssl/key.pem
KENDO_UI_LICENSE=./kendo-ui-license.txt

REACT_APP_METAAPPKEY=YourMetaAppKey
REACT_APP_METAAPP_APPSCOPES=email,pages_manage_cta,pages_show_list,instagram_basic,instagram_content_publish,pages_read_engagement,pages_read_engagement,pages_manage_metadata,pages_manage_metadata,pages_read_user_content,pages_manage_posts,pages_manage_engagement,public_profile
REACT_APP_METAAPP_APPFIELDS=birthday,first_name,last_name,id,email,picture
         
REACT_APP_TINYMCEJWTAPIKEY=YourTinyMCEJWTKEY
REACT_APP_SYNCFUSIONLICENSEKEY=YourSyncFusionLicenseKey

REACT_APP_FRONTENDURL=https://localhost:3000
REACT_APP_BACKENDURL=https://localhost:7297
REACT_APP_REGISTERAPINAME=/api/Auth/register
REACT_APP_LOGINAPINAME=/api/Auth/login
REACT_APP_FORGOTPWAPINAME=/api/Auth/ForgotPW
REACT_APP_CHANGEPWAPINAME=/api/Auth/ChangePW
REACT_APP_CHANGEPERSONALINFO=/api/User/ChangeUserBasicInformations
REACT_APP_CHANGEUSERIMAGE=/api/User/ChangeUserImage
REACT_APP_CHANGEPW=/api/User/ChangeUserPass
REACT_APP_CREATESUBGROUP=/api/Group/CreateSubGroup
REACT_APP_GETGROUPINFO=/api/Group/GetGroupInfo
REACT_APP_MOVEGROUP=/api/Group/MoveGroup
REACT_APP_CHANGEGROUPPERMISSION=/api/Group/ChangePermission
REACT_APP_CHANGEGROUPNAME=/api/Group/ChangeGroupName
REACT_APP_DELETEGROUP=/api/Group/DeleteGroup
REACT_APP_GETSLAVEUSERS=/api/User/GetSlaveUsers
REACT_APP_CREATESLAVEUSER=/api/User/CreateSlaveUser
REACT_APP_GETUSERINFOBYID=/api/User/GetUserInfoByID
REACT_APP_ADDUSERSTOGROUPS=/api/User/AddUsersToGroups
REACT_APP_REMOVEUSERSFROMGROUPS=/api/User/RemoveUsersFromGroups
REACT_APP_EDITSLAVEUSERINFO=/api/User/EDITSLAVEUSERINFO
REACT_APP_REMOVEUSERS=/api/User/RemoveUsers
REACT_APP_ADDINSTAGRAMPAGE=/api/Page/AddInstagramPage
REACT_APP_ADDFACEBOOKPAGE=/api/Page/AddFacebookPage
REACT_APP_GETGROUPPAGES=/api/Page/GetGroupPages
REACT_APP_DELETEPAGES=/api/Page/DeletePages
REACT_APP_GETPAGEASSOCIATIONS=/api/Page/GetAssociatedPageInformations
REACT_APP_GETPAGEINFO=/api/Page/GetPageInformations
REACT_APP_GETFBCATEGORIES=/api/Page/GetAllPagesCategories
REACT_APP_GETAPPPLATFORMS=/api/Platform/GetAppPlatforms
REACT_APP_UPDATEPAGEINFO=/api/Page/UpdatePageInfo
REACT_APP_UPDATEPAGEPICTURE=/api/Page/UpdatePagePicture
REACT_APP_ADDPATTERN=/api/Pattern/AddPatternToGroup
REACT_APP_REMOVEPATTERN=/api/Pattern/DeletePattern
REACT_APP_GETGROUPATTERNS=/api/Pattern/GetGroupPatterns
REACT_APP_ADDPOST=/api/Post/AddPost
REACT_APP_EDITPOST=/api/Post/EditPost
REACT_APP_MODIFYPOST=/api/Post/ModifyPost
REACT_APP_DELETEPOST=/api/Post/DeletePost
REACT_APP_GETGROUPPOSTS=/api/Post/GetGroupPosts
REACT_APP_GETOPTIMALPUBLISHDATE=/api/Inseights/GetOptimalPublishDate
REACT_APP_GETPOSTSINSEIGHTS=/api/Inseights/GetPostsInseights
REACT_APP_GETSINGLEPOSTINSEIGHTS=/api/Inseights/GetSinglePostInsights
REACT_APP_ADDASSET=/api/Asset/AddAsset
REACT_APP_ASSIGNTHUMBNAIL=/api/Asset/AssignVideoThumbnail
REACT_APP_DELETEGROUPASSET=/api/Asset/DeleteAsset
REACT_APP_GETGROUPASSETS=/api/Asset/GetGroupAssets
REACT_APP_GETGROUPVIDEOASSETS=/api/Asset/GetGroupVideoAssets
REACT_APP_GETPLATFORMACCOUNTS=/api/Platform//GetAllPlatformAccounts
REACT_APP_GETTAGABLEPLATFORMACCOUNTS=/api/Platform/GetTagalePlatformAccounts
REACT_APP_GETMENTIONABLEPLATFORMACCOUNTS=/api/Platform/GetMentionablePlatformAccounts
REACT_APP_GETPOSTINFO=/api/Post/GetPostInfoByID
REACT_APP_GETPAGEPLATFORMID=/api/Page/GetPagePlatformID
REACT_APP_SEARCHLOCATION=/api/Search/SearchFBLocation
REACT_APP_SEARCHCOUNTRY=/api/Search/SearchFBCountry
REACT_APP_SEARCHREGION=/api/Search/SearchFBRegion
REACT_APP_SEARCHINTEREST=/api/Search/SearchFBInterest
REACT_APP_GETPERSONALINFO=/api/User/GetUserInfo
```

Now after adding the .env file, simply start your app with

for Development:
```bash
npm start
```
for Production
```bash
npm run build
```

##Pictures
Coming..
##LearnMore
Comming...
