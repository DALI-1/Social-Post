using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialPostBackEnd.Migrations
{
    public partial class MIG1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AgeRanges",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Min_age = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Max_age = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AgeRanges", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Genders",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Gender_Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Genders", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MenuItems",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MenuItemName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Label = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    URL = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuItems", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Platforms",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PlatformName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PlatformLogoImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PlatformPolicyUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PlatformUrl = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Platforms", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BirthdayDate = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProfilePictureURL = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PasswordHash = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    PasswordSalt = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: true),
                    DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeleteUserId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Users_Users_CreatedUserId",
                        column: x => x.CreatedUserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Users_Users_DeleteUserId",
                        column: x => x.DeleteUserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "MenuItemActions",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ActionName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MenuItemId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuItemActions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MenuItemActions_MenuItems_MenuItemId",
                        column: x => x.MenuItemId,
                        principalTable: "MenuItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Countries",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Country_Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Country_Key = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Country_PlatformCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Country_PlatformId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Countries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Countries_Platforms_Country_PlatformId",
                        column: x => x.Country_PlatformId,
                        principalTable: "Platforms",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Interests",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Interest_Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Interest_PlatformCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Interest_Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Interest_Topic = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Interest_PlatformId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Interests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Interests_Platforms_Interest_PlatformId",
                        column: x => x.Interest_PlatformId,
                        principalTable: "Platforms",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Languages",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Language_Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Language_PlatformKey = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Language_PlatformId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Languages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Languages_Platforms_Language_PlatformId",
                        column: x => x.Language_PlatformId,
                        principalTable: "Platforms",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Groups",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Group_Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedUserId = table.Column<long>(type: "bigint", nullable: true),
                    RecentModificationDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: true),
                    DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeleteUserId = table.Column<long>(type: "bigint", nullable: true),
                    ParentGroupId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Groups", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Groups_Groups_ParentGroupId",
                        column: x => x.ParentGroupId,
                        principalTable: "Groups",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Groups_Users_CreatedUserId",
                        column: x => x.CreatedUserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Groups_Users_DeleteUserId",
                        column: x => x.DeleteUserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PlatformAccounts",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PlatformAccountID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AccessToken = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AccessTokenExpireDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PlatformID = table.Column<long>(type: "bigint", nullable: true),
                    AddDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AddUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: true),
                    DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeleteUserId = table.Column<long>(type: "bigint", nullable: true),
                    Is_AddedBySearchService = table.Column<bool>(type: "bit", nullable: true),
                    Is_Tagable = table.Column<bool>(type: "bit", nullable: true),
                    Is_Mentionable = table.Column<bool>(type: "bit", nullable: true),
                    CachedData_LastUpdateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CachedData_Username = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CachedData_First_name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CachedData_Last_name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CachedData_Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CachedData_Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CachedData_PictureURL = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CachedData_PictureHeight = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CachedData_PictureWidth = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CachedData_PictureIs_silhouette = table.Column<bool>(type: "bit", nullable: false),
                    CachedData_IsChanged = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlatformAccounts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlatformAccounts_Platforms_PlatformID",
                        column: x => x.PlatformID,
                        principalTable: "Platforms",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PlatformAccounts_Users_AddUserId",
                        column: x => x.AddUserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PlatformAccounts_Users_DeleteUserId",
                        column: x => x.DeleteUserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Regions",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Region_Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Region_PlatformCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Region_CountryId = table.Column<long>(type: "bigint", nullable: true),
                    Region_PlatformId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Regions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Regions_Countries_Region_CountryId",
                        column: x => x.Region_CountryId,
                        principalTable: "Countries",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Regions_Platforms_Region_PlatformId",
                        column: x => x.Region_PlatformId,
                        principalTable: "Platforms",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Assets",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AssetName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AssetType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ResourceURL = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: true),
                    DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeleteUserId = table.Column<long>(type: "bigint", nullable: true),
                    GroupId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Assets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Assets_Groups_GroupId",
                        column: x => x.GroupId,
                        principalTable: "Groups",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Assets_Users_CreatedUserId",
                        column: x => x.CreatedUserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Assets_Users_DeleteUserId",
                        column: x => x.DeleteUserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "GroupMenuItemActions",
                columns: table => new
                {
                    MenuActionsId = table.Column<long>(type: "bigint", nullable: false),
                    PermitedMenuItemActionGroupsId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupMenuItemActions", x => new { x.MenuActionsId, x.PermitedMenuItemActionGroupsId });
                    table.ForeignKey(
                        name: "FK_GroupMenuItemActions_Groups_PermitedMenuItemActionGroupsId",
                        column: x => x.PermitedMenuItemActionGroupsId,
                        principalTable: "Groups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GroupMenuItemActions_MenuItemActions_MenuActionsId",
                        column: x => x.MenuActionsId,
                        principalTable: "MenuItemActions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GroupModifications",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ModificationLabel = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<long>(type: "bigint", nullable: true),
                    GroupId = table.Column<long>(type: "bigint", nullable: true),
                    ModificationDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupModifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GroupModifications_Groups_GroupId",
                        column: x => x.GroupId,
                        principalTable: "Groups",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GroupModifications_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "MenuItemGroups",
                columns: table => new
                {
                    MenuItemGroupsId = table.Column<long>(type: "bigint", nullable: false),
                    MenuItemsId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuItemGroups", x => new { x.MenuItemGroupsId, x.MenuItemsId });
                    table.ForeignKey(
                        name: "FK_MenuItemGroups_Groups_MenuItemGroupsId",
                        column: x => x.MenuItemGroupsId,
                        principalTable: "Groups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MenuItemGroups_MenuItems_MenuItemsId",
                        column: x => x.MenuItemsId,
                        principalTable: "MenuItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Patterns",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatternName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PatternText = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GroupId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patterns", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Patterns_Groups_GroupId",
                        column: x => x.GroupId,
                        principalTable: "Groups",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Posts",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PostText = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RepeatPost = table.Column<bool>(type: "bit", nullable: true),
                    RepeatOption = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EndRepeatPost = table.Column<bool>(type: "bit", nullable: true),
                    EndRepeatOption = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EndRepeatOnOccurence = table.Column<long>(type: "bigint", nullable: true),
                    EndRepeatAfterDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PostDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: true),
                    DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeleteUserId = table.Column<long>(type: "bigint", nullable: true),
                    PostGroupID = table.Column<long>(type: "bigint", nullable: true),
                    IsPosted = table.Column<bool>(type: "bit", nullable: true),
                    Post_Occurence = table.Column<long>(type: "bigint", nullable: true),
                    IsTargeted = table.Column<bool>(type: "bit", nullable: false),
                    POST_Targeted_GenderId = table.Column<long>(type: "bigint", nullable: true),
                    POST_Targeted_AgeRangeId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Posts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Posts_AgeRanges_POST_Targeted_AgeRangeId",
                        column: x => x.POST_Targeted_AgeRangeId,
                        principalTable: "AgeRanges",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Posts_Genders_POST_Targeted_GenderId",
                        column: x => x.POST_Targeted_GenderId,
                        principalTable: "Genders",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Posts_Groups_PostGroupID",
                        column: x => x.PostGroupID,
                        principalTable: "Groups",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Posts_Users_CreatedUserId",
                        column: x => x.CreatedUserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Posts_Users_DeleteUserId",
                        column: x => x.DeleteUserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "UserGroup",
                columns: table => new
                {
                    JoinedGroupsId = table.Column<long>(type: "bigint", nullable: false),
                    JoinedUsersId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserGroup", x => new { x.JoinedGroupsId, x.JoinedUsersId });
                    table.ForeignKey(
                        name: "FK_UserGroup_Groups_JoinedGroupsId",
                        column: x => x.JoinedGroupsId,
                        principalTable: "Groups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserGroup_Users_JoinedUsersId",
                        column: x => x.JoinedUsersId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PlatformPages",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AccessToken = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AccessTokenExpireDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PlatformPageID = table.Column<long>(type: "bigint", nullable: true),
                    PlatformID = table.Column<long>(type: "bigint", nullable: true),
                    PageOwnerID = table.Column<long>(type: "bigint", nullable: true),
                    AssociatedByPlatformPageID = table.Column<long>(type: "bigint", nullable: true),
                    AddDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AddUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: true),
                    DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeleteUserId = table.Column<long>(type: "bigint", nullable: true),
                    GroupId = table.Column<long>(type: "bigint", nullable: true),
                    CachedData_LastUpdateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CachedData_PageName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CachedData_Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CachedData_Bio = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CachedData_About = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CachedData_Category = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CachedData_WebsiteURL = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CachedData_Location = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CachedData_followers_count = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CachedData_fan_count = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CachedData_PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CachedData_PictureURL = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CachedData_PictureHeight = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CachedData_PictureWidth = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CachedData_PictureIs_silhouette = table.Column<bool>(type: "bit", nullable: false),
                    CachedData_IsChanged = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlatformPages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlatformPages_Groups_GroupId",
                        column: x => x.GroupId,
                        principalTable: "Groups",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PlatformPages_PlatformAccounts_PageOwnerID",
                        column: x => x.PageOwnerID,
                        principalTable: "PlatformAccounts",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PlatformPages_PlatformPages_AssociatedByPlatformPageID",
                        column: x => x.AssociatedByPlatformPageID,
                        principalTable: "PlatformPages",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PlatformPages_Platforms_PlatformID",
                        column: x => x.PlatformID,
                        principalTable: "Platforms",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PlatformPages_Users_AddUserId",
                        column: x => x.AddUserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PlatformPages_Users_DeleteUserId",
                        column: x => x.DeleteUserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Locations",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Location_Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Location_Type = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Location_PlatformCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Location_RegionId = table.Column<long>(type: "bigint", nullable: true),
                    Location_PlatformId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Locations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Locations_Platforms_Location_PlatformId",
                        column: x => x.Location_PlatformId,
                        principalTable: "Platforms",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Locations_Regions_Location_RegionId",
                        column: x => x.Location_RegionId,
                        principalTable: "Regions",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "MentionedAccountPost",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PostId = table.Column<long>(type: "bigint", nullable: true),
                    Mentioned_PlatformAccount_ID = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MentionedAccountPost", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MentionedAccountPost_PlatformAccounts_Mentioned_PlatformAccount_ID",
                        column: x => x.Mentioned_PlatformAccount_ID,
                        principalTable: "PlatformAccounts",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_MentionedAccountPost_Posts_PostId",
                        column: x => x.PostId,
                        principalTable: "Posts",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PostAssets",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PostId = table.Column<long>(type: "bigint", nullable: true),
                    AssetId = table.Column<long>(type: "bigint", nullable: true),
                    ThumbnailID = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostAssets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PostAssets_Assets_AssetId",
                        column: x => x.AssetId,
                        principalTable: "Assets",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PostAssets_Assets_ThumbnailID",
                        column: x => x.ThumbnailID,
                        principalTable: "Assets",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PostAssets_Posts_PostId",
                        column: x => x.PostId,
                        principalTable: "Posts",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PostCountries",
                columns: table => new
                {
                    Country_Targeted_PostsId = table.Column<long>(type: "bigint", nullable: false),
                    POST_Targeted_CountriesId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostCountries", x => new { x.Country_Targeted_PostsId, x.POST_Targeted_CountriesId });
                    table.ForeignKey(
                        name: "FK_PostCountries_Countries_POST_Targeted_CountriesId",
                        column: x => x.POST_Targeted_CountriesId,
                        principalTable: "Countries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PostCountries_Posts_Country_Targeted_PostsId",
                        column: x => x.Country_Targeted_PostsId,
                        principalTable: "Posts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PostInterests",
                columns: table => new
                {
                    Interest_Targeted_PostsId = table.Column<long>(type: "bigint", nullable: false),
                    POST_Targeted_InterestsId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostInterests", x => new { x.Interest_Targeted_PostsId, x.POST_Targeted_InterestsId });
                    table.ForeignKey(
                        name: "FK_PostInterests_Interests_POST_Targeted_InterestsId",
                        column: x => x.POST_Targeted_InterestsId,
                        principalTable: "Interests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PostInterests_Posts_Interest_Targeted_PostsId",
                        column: x => x.Interest_Targeted_PostsId,
                        principalTable: "Posts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PostLanguages",
                columns: table => new
                {
                    Language_Targeted_PostsId = table.Column<long>(type: "bigint", nullable: false),
                    POST_Targeted_LanguagesId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostLanguages", x => new { x.Language_Targeted_PostsId, x.POST_Targeted_LanguagesId });
                    table.ForeignKey(
                        name: "FK_PostLanguages_Languages_POST_Targeted_LanguagesId",
                        column: x => x.POST_Targeted_LanguagesId,
                        principalTable: "Languages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PostLanguages_Posts_Language_Targeted_PostsId",
                        column: x => x.Language_Targeted_PostsId,
                        principalTable: "Posts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PostRegions",
                columns: table => new
                {
                    POST_Targeted_RegionsId = table.Column<long>(type: "bigint", nullable: false),
                    Region_Targeted_PostsId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostRegions", x => new { x.POST_Targeted_RegionsId, x.Region_Targeted_PostsId });
                    table.ForeignKey(
                        name: "FK_PostRegions_Posts_Region_Targeted_PostsId",
                        column: x => x.Region_Targeted_PostsId,
                        principalTable: "Posts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PostRegions_Regions_POST_Targeted_RegionsId",
                        column: x => x.POST_Targeted_RegionsId,
                        principalTable: "Regions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DynamicFields",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatternId = table.Column<long>(type: "bigint", nullable: true),
                    PostID = table.Column<long>(type: "bigint", nullable: true),
                    PageID = table.Column<long>(type: "bigint", nullable: true),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DynamicFields", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DynamicFields_Patterns_PatternId",
                        column: x => x.PatternId,
                        principalTable: "Patterns",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DynamicFields_PlatformPages_PageID",
                        column: x => x.PageID,
                        principalTable: "PlatformPages",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DynamicFields_Posts_PostID",
                        column: x => x.PostID,
                        principalTable: "Posts",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PagePost",
                columns: table => new
                {
                    PagesId = table.Column<long>(type: "bigint", nullable: false),
                    PostsId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PagePost", x => new { x.PagesId, x.PostsId });
                    table.ForeignKey(
                        name: "FK_PagePost_PlatformPages_PagesId",
                        column: x => x.PagesId,
                        principalTable: "PlatformPages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PagePost_Posts_PostsId",
                        column: x => x.PostsId,
                        principalTable: "Posts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PlatformPosts",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PostPlatformID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PostMessage = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SharesCount = table.Column<long>(type: "bigint", nullable: true),
                    PlatformId = table.Column<long>(type: "bigint", nullable: true),
                    Platform_CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    App_AddDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    App_DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: true),
                    IsAppPosted = table.Column<bool>(type: "bit", nullable: true),
                    App_PostID = table.Column<long>(type: "bigint", nullable: true),
                    PlatformPage_ID = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlatformPosts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlatformPosts_PlatformPages_PlatformPage_ID",
                        column: x => x.PlatformPage_ID,
                        principalTable: "PlatformPages",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PlatformPosts_Platforms_PlatformId",
                        column: x => x.PlatformId,
                        principalTable: "Platforms",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PlatformPosts_Posts_App_PostID",
                        column: x => x.App_PostID,
                        principalTable: "Posts",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PostsHistory",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PlatformPageID = table.Column<long>(type: "bigint", nullable: true),
                    PostID = table.Column<long>(type: "bigint", nullable: true),
                    Post_Shares_TotalCount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Post_Likes_TotalCount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Post_Comment_TotalCount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InseightsTime = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostsHistory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PostsHistory_PlatformPages_PlatformPageID",
                        column: x => x.PlatformPageID,
                        principalTable: "PlatformPages",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PostsHistory_Posts_PostID",
                        column: x => x.PostID,
                        principalTable: "Posts",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PostLocations",
                columns: table => new
                {
                    Location_Targeted_PostsId = table.Column<long>(type: "bigint", nullable: false),
                    POST_Targeted_LocationsId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostLocations", x => new { x.Location_Targeted_PostsId, x.POST_Targeted_LocationsId });
                    table.ForeignKey(
                        name: "FK_PostLocations_Locations_POST_Targeted_LocationsId",
                        column: x => x.POST_Targeted_LocationsId,
                        principalTable: "Locations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PostLocations_Posts_Location_Targeted_PostsId",
                        column: x => x.Location_Targeted_PostsId,
                        principalTable: "Posts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Tags",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TaggedImage_X = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TaggedImage_Y = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    App_Screen_x = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    App_Screen_y = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    App_ScrollLeftValue = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    App_ScrollTopValue = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TaggedAssetPost_ID = table.Column<long>(type: "bigint", nullable: true),
                    TaggedPlatformAccount_ID = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tags", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tags_PlatformAccounts_TaggedPlatformAccount_ID",
                        column: x => x.TaggedPlatformAccount_ID,
                        principalTable: "PlatformAccounts",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Tags_PostAssets_TaggedAssetPost_ID",
                        column: x => x.TaggedAssetPost_ID,
                        principalTable: "PostAssets",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PlatformComments",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Platform_CommentID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Comment_Message = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PlatformId = table.Column<long>(type: "bigint", nullable: true),
                    PlatformPost_ID = table.Column<long>(type: "bigint", nullable: true),
                    Platform_CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    App_AddDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    App_DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlatformComments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlatformComments_PlatformPosts_PlatformPost_ID",
                        column: x => x.PlatformPost_ID,
                        principalTable: "PlatformPosts",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PlatformComments_Platforms_PlatformId",
                        column: x => x.PlatformId,
                        principalTable: "Platforms",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PlatformLikes",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Platform_LikeID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PlatfromAccount_Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PlatformId = table.Column<long>(type: "bigint", nullable: true),
                    PlatformPost_ID = table.Column<long>(type: "bigint", nullable: true),
                    App_AddDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    App_DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlatformLikes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlatformLikes_PlatformPosts_PlatformPost_ID",
                        column: x => x.PlatformPost_ID,
                        principalTable: "PlatformPosts",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PlatformLikes_Platforms_PlatformId",
                        column: x => x.PlatformId,
                        principalTable: "Platforms",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Assets_CreatedUserId",
                table: "Assets",
                column: "CreatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_DeleteUserId",
                table: "Assets",
                column: "DeleteUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_GroupId",
                table: "Assets",
                column: "GroupId");

            migrationBuilder.CreateIndex(
                name: "IX_Countries_Country_PlatformId",
                table: "Countries",
                column: "Country_PlatformId");

            migrationBuilder.CreateIndex(
                name: "IX_DynamicFields_PageID",
                table: "DynamicFields",
                column: "PageID");

            migrationBuilder.CreateIndex(
                name: "IX_DynamicFields_PatternId",
                table: "DynamicFields",
                column: "PatternId");

            migrationBuilder.CreateIndex(
                name: "IX_DynamicFields_PostID",
                table: "DynamicFields",
                column: "PostID");

            migrationBuilder.CreateIndex(
                name: "IX_GroupMenuItemActions_PermitedMenuItemActionGroupsId",
                table: "GroupMenuItemActions",
                column: "PermitedMenuItemActionGroupsId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupModifications_GroupId",
                table: "GroupModifications",
                column: "GroupId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupModifications_UserId",
                table: "GroupModifications",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Groups_CreatedUserId",
                table: "Groups",
                column: "CreatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Groups_DeleteUserId",
                table: "Groups",
                column: "DeleteUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Groups_ParentGroupId",
                table: "Groups",
                column: "ParentGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_Interests_Interest_PlatformId",
                table: "Interests",
                column: "Interest_PlatformId");

            migrationBuilder.CreateIndex(
                name: "IX_Languages_Language_PlatformId",
                table: "Languages",
                column: "Language_PlatformId");

            migrationBuilder.CreateIndex(
                name: "IX_Locations_Location_PlatformId",
                table: "Locations",
                column: "Location_PlatformId");

            migrationBuilder.CreateIndex(
                name: "IX_Locations_Location_RegionId",
                table: "Locations",
                column: "Location_RegionId");

            migrationBuilder.CreateIndex(
                name: "IX_MentionedAccountPost_Mentioned_PlatformAccount_ID",
                table: "MentionedAccountPost",
                column: "Mentioned_PlatformAccount_ID");

            migrationBuilder.CreateIndex(
                name: "IX_MentionedAccountPost_PostId",
                table: "MentionedAccountPost",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_MenuItemActions_MenuItemId",
                table: "MenuItemActions",
                column: "MenuItemId");

            migrationBuilder.CreateIndex(
                name: "IX_MenuItemGroups_MenuItemsId",
                table: "MenuItemGroups",
                column: "MenuItemsId");

            migrationBuilder.CreateIndex(
                name: "IX_PagePost_PostsId",
                table: "PagePost",
                column: "PostsId");

            migrationBuilder.CreateIndex(
                name: "IX_Patterns_GroupId",
                table: "Patterns",
                column: "GroupId");

            migrationBuilder.CreateIndex(
                name: "IX_PlatformAccounts_AddUserId",
                table: "PlatformAccounts",
                column: "AddUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PlatformAccounts_DeleteUserId",
                table: "PlatformAccounts",
                column: "DeleteUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PlatformAccounts_PlatformID",
                table: "PlatformAccounts",
                column: "PlatformID");

            migrationBuilder.CreateIndex(
                name: "IX_PlatformComments_PlatformId",
                table: "PlatformComments",
                column: "PlatformId");

            migrationBuilder.CreateIndex(
                name: "IX_PlatformComments_PlatformPost_ID",
                table: "PlatformComments",
                column: "PlatformPost_ID");

            migrationBuilder.CreateIndex(
                name: "IX_PlatformLikes_PlatformId",
                table: "PlatformLikes",
                column: "PlatformId");

            migrationBuilder.CreateIndex(
                name: "IX_PlatformLikes_PlatformPost_ID",
                table: "PlatformLikes",
                column: "PlatformPost_ID");

            migrationBuilder.CreateIndex(
                name: "IX_PlatformPages_AddUserId",
                table: "PlatformPages",
                column: "AddUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PlatformPages_AssociatedByPlatformPageID",
                table: "PlatformPages",
                column: "AssociatedByPlatformPageID");

            migrationBuilder.CreateIndex(
                name: "IX_PlatformPages_DeleteUserId",
                table: "PlatformPages",
                column: "DeleteUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PlatformPages_GroupId",
                table: "PlatformPages",
                column: "GroupId");

            migrationBuilder.CreateIndex(
                name: "IX_PlatformPages_PageOwnerID",
                table: "PlatformPages",
                column: "PageOwnerID");

            migrationBuilder.CreateIndex(
                name: "IX_PlatformPages_PlatformID",
                table: "PlatformPages",
                column: "PlatformID");

            migrationBuilder.CreateIndex(
                name: "IX_PlatformPosts_App_PostID",
                table: "PlatformPosts",
                column: "App_PostID");

            migrationBuilder.CreateIndex(
                name: "IX_PlatformPosts_PlatformId",
                table: "PlatformPosts",
                column: "PlatformId");

            migrationBuilder.CreateIndex(
                name: "IX_PlatformPosts_PlatformPage_ID",
                table: "PlatformPosts",
                column: "PlatformPage_ID");

            migrationBuilder.CreateIndex(
                name: "IX_PostAssets_AssetId",
                table: "PostAssets",
                column: "AssetId");

            migrationBuilder.CreateIndex(
                name: "IX_PostAssets_PostId",
                table: "PostAssets",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_PostAssets_ThumbnailID",
                table: "PostAssets",
                column: "ThumbnailID");

            migrationBuilder.CreateIndex(
                name: "IX_PostCountries_POST_Targeted_CountriesId",
                table: "PostCountries",
                column: "POST_Targeted_CountriesId");

            migrationBuilder.CreateIndex(
                name: "IX_PostInterests_POST_Targeted_InterestsId",
                table: "PostInterests",
                column: "POST_Targeted_InterestsId");

            migrationBuilder.CreateIndex(
                name: "IX_PostLanguages_POST_Targeted_LanguagesId",
                table: "PostLanguages",
                column: "POST_Targeted_LanguagesId");

            migrationBuilder.CreateIndex(
                name: "IX_PostLocations_POST_Targeted_LocationsId",
                table: "PostLocations",
                column: "POST_Targeted_LocationsId");

            migrationBuilder.CreateIndex(
                name: "IX_PostRegions_Region_Targeted_PostsId",
                table: "PostRegions",
                column: "Region_Targeted_PostsId");

            migrationBuilder.CreateIndex(
                name: "IX_Posts_CreatedUserId",
                table: "Posts",
                column: "CreatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Posts_DeleteUserId",
                table: "Posts",
                column: "DeleteUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Posts_POST_Targeted_AgeRangeId",
                table: "Posts",
                column: "POST_Targeted_AgeRangeId");

            migrationBuilder.CreateIndex(
                name: "IX_Posts_POST_Targeted_GenderId",
                table: "Posts",
                column: "POST_Targeted_GenderId");

            migrationBuilder.CreateIndex(
                name: "IX_Posts_PostGroupID",
                table: "Posts",
                column: "PostGroupID");

            migrationBuilder.CreateIndex(
                name: "IX_PostsHistory_PlatformPageID",
                table: "PostsHistory",
                column: "PlatformPageID");

            migrationBuilder.CreateIndex(
                name: "IX_PostsHistory_PostID",
                table: "PostsHistory",
                column: "PostID");

            migrationBuilder.CreateIndex(
                name: "IX_Regions_Region_CountryId",
                table: "Regions",
                column: "Region_CountryId");

            migrationBuilder.CreateIndex(
                name: "IX_Regions_Region_PlatformId",
                table: "Regions",
                column: "Region_PlatformId");

            migrationBuilder.CreateIndex(
                name: "IX_Tags_TaggedAssetPost_ID",
                table: "Tags",
                column: "TaggedAssetPost_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Tags_TaggedPlatformAccount_ID",
                table: "Tags",
                column: "TaggedPlatformAccount_ID");

            migrationBuilder.CreateIndex(
                name: "IX_UserGroup_JoinedUsersId",
                table: "UserGroup",
                column: "JoinedUsersId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_CreatedUserId",
                table: "Users",
                column: "CreatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_DeleteUserId",
                table: "Users",
                column: "DeleteUserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DynamicFields");

            migrationBuilder.DropTable(
                name: "GroupMenuItemActions");

            migrationBuilder.DropTable(
                name: "GroupModifications");

            migrationBuilder.DropTable(
                name: "MentionedAccountPost");

            migrationBuilder.DropTable(
                name: "MenuItemGroups");

            migrationBuilder.DropTable(
                name: "PagePost");

            migrationBuilder.DropTable(
                name: "PlatformComments");

            migrationBuilder.DropTable(
                name: "PlatformLikes");

            migrationBuilder.DropTable(
                name: "PostCountries");

            migrationBuilder.DropTable(
                name: "PostInterests");

            migrationBuilder.DropTable(
                name: "PostLanguages");

            migrationBuilder.DropTable(
                name: "PostLocations");

            migrationBuilder.DropTable(
                name: "PostRegions");

            migrationBuilder.DropTable(
                name: "PostsHistory");

            migrationBuilder.DropTable(
                name: "Tags");

            migrationBuilder.DropTable(
                name: "UserGroup");

            migrationBuilder.DropTable(
                name: "Patterns");

            migrationBuilder.DropTable(
                name: "MenuItemActions");

            migrationBuilder.DropTable(
                name: "PlatformPosts");

            migrationBuilder.DropTable(
                name: "Interests");

            migrationBuilder.DropTable(
                name: "Languages");

            migrationBuilder.DropTable(
                name: "Locations");

            migrationBuilder.DropTable(
                name: "PostAssets");

            migrationBuilder.DropTable(
                name: "MenuItems");

            migrationBuilder.DropTable(
                name: "PlatformPages");

            migrationBuilder.DropTable(
                name: "Regions");

            migrationBuilder.DropTable(
                name: "Assets");

            migrationBuilder.DropTable(
                name: "Posts");

            migrationBuilder.DropTable(
                name: "PlatformAccounts");

            migrationBuilder.DropTable(
                name: "Countries");

            migrationBuilder.DropTable(
                name: "AgeRanges");

            migrationBuilder.DropTable(
                name: "Genders");

            migrationBuilder.DropTable(
                name: "Groups");

            migrationBuilder.DropTable(
                name: "Platforms");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
