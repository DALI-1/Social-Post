using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SocialPostBackEnd.Models;

namespace SocialPostBackEnd.Data
{
  
        public class ApplicationDbContext : DbContext
    {
        
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
            
        }
     

        public DbSet<User> Users { get; set; }
        public DbSet<PlatformAccount> PlatformAccounts { get; set; }
        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Asset> Assets { get; set; }
        public DbSet<AssetPost> PostAssets { get; set; }
        public DbSet<PlatformPage> PlatformPages { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<MenuItemAction> MenuItemActions { get; set; }

        public DbSet<Pattern> Patterns { get; set; }

        public DbSet<DynamicField> DynamicFields { get; set; }
       
        public DbSet<GroupModification> GroupModifications { get; set; }
        public DbSet<Platform> Platforms { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<MentionedAccountPost> MentionedAccountPost { get; set; }

        //---------Post Targets tables----------------//
        public DbSet<Country> Countries { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Region> Regions { get; set; }
        public DbSet<Interest> Interests { get; set; }
        public DbSet<Gender> Genders { get; set; }
        public DbSet<AgeRange> AgeRanges { get; set; }
        public DbSet<Language> Languages { get; set; }

        //=========================Post inseights==================================//
        public DbSet<PlatformPost> PlatformPosts { get; set; }
        public DbSet<PlatformComment> PlatformComments { get; set; }
        public DbSet<PlatformLike> PlatformLikes { get; set; }
        public DbSet<PostHistory> PostsHistory { get; set; }

        

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {


            //one to many User<=>SlaveUser  Delete relationship 
            modelBuilder.Entity<User>()
               .HasOne<User>(g => g.DeleteUser)
               .WithMany()
               .HasForeignKey(prop => prop.DeleteUserId);

            //one to many User<=>Slave User  Create relationship 
            modelBuilder.Entity<User>()
               .HasOne<User>(g => g.CreateUser)
               .WithMany()
               .HasForeignKey(prop => prop.CreatedUserId);


            //Many to Many Users<=>Groups relationship "GroupModifications" -modifications
            modelBuilder.Entity<GroupModification>()
                   .HasOne(g=>g.User)
                   .WithMany(g=>g.Modifications)
                   .HasForeignKey(prop => prop.UserId);

            modelBuilder.Entity<GroupModification>()
                   .HasOne(g => g.Group)
                   .WithMany(g => g.Modifications)
                   .HasForeignKey(prop => prop.GroupId);

            //many to many User<=>Group relationship - which group the user joined
            modelBuilder.Entity<User>().HasMany<Group>(u => u.JoinedGroups)
                   .WithMany(g => g.JoinedUsers)
                   .UsingEntity(ug => ug.ToTable("UserGroup")
                   );
            //many to many Post<=>Page relationship - The posts for each page
            modelBuilder.Entity<PlatformPage>()
                .HasMany<Post>(fb=>fb.Posts)
                .WithMany(g => g.Pages)
                .UsingEntity(ug => ug.ToTable("PagePost")
                );
            //one to many User<=>Group  Delete relationship 
            modelBuilder.Entity<Group>()
               .HasOne<User>(g => g.DeleteUser)
               .WithMany(u => u.DeletedGroups)
               .HasForeignKey(prop => prop.DeleteUserId);
            
            //one to many User<=>Group  Create relationship 
            modelBuilder.Entity<Group>()
               .HasOne<User>(g => g.CreateUser)
               .WithMany(u => u.CreatedGroups)
               .HasForeignKey(prop => prop.CreatedUserId);

            //one to many Patterns<=>Group relationship 
             modelBuilder.Entity<Pattern>()
                 .HasOne<Group>(p => p.Group)
                 .WithMany(g=>g.GroupPatterns)
                 .HasForeignKey(prop => prop.GroupId);

                  //many to many GroupMenuItemAction<=>Group relationship
                  modelBuilder.Entity<Group>().HasMany<MenuItemAction>(g => g.MenuActions)
                      .WithMany(mi=>mi.PermitedMenuItemActionGroups)
                      .UsingEntity(ug => ug.ToTable("GroupMenuItemActions")
                      );

                     //many to many MenuItem<=>Group relationship
                     modelBuilder.Entity<Group>().HasMany<MenuItem>(g => g.MenuItems)
                         .WithMany(mi => mi.MenuItemGroups)
                         .UsingEntity(ug => ug.ToTable("MenuItemGroups")
                         );


            //One to many PlatformPage<=>Group relationship
            modelBuilder.Entity<Group>().HasMany<PlatformPage>(g => g.PlatformPages)
                .WithOne(p => p.Group)
                .HasForeignKey(prop => prop.GroupId);




            //many to one MenuItem<=>MenuItemAction relationship
            modelBuilder.Entity<MenuItemAction>()
                          .HasOne<MenuItem>(mia => mia.MenuItem)
                          .WithMany()
                          .HasForeignKey(prop => prop.MenuItemId
                          );



            //many to one Page<=>Platform relationship
            modelBuilder.Entity<PlatformPage>()
                          .HasOne<Platform>(mia => mia.Platform)
                          .WithMany()
                          .HasForeignKey(prop => prop.PlatformID
                          );


            //many to one User<=>Platform relationship
            modelBuilder.Entity<PlatformAccount>()
                          .HasOne<Platform>(mia => mia.Platform)
                          .WithMany()
                          .HasForeignKey(prop => prop.PlatformID);

//-----------------Configuration for AssetPost Relationship-----------------//

            //many to One PostAssets<=>Post relationship
            modelBuilder.Entity<Post>()
                .HasMany<AssetPost>(p => p.UsedAssets)
                .WithOne(p => p.Post)
                .HasForeignKey(prop => prop.PostId); ;

            //many to One PostAssets<=>Asset relationship
            modelBuilder.Entity<Asset>()
                .HasMany<AssetPost>(p => p.PostsUsedAt)
                .WithOne(p => p.Asset)
                .HasForeignKey(prop => prop.AssetId); ;


            //many to One PostAssets<=>Asset  Thumbnail relationship 
            modelBuilder.Entity<AssetPost>()
                .HasOne<Asset>(p => p.Thumbnail)
                .WithMany(p => p.PostsThumbnails)
                .HasForeignKey(prop => prop.ThumbnailID);
            //---------------Configuration End-------------------------//

            //many to one Dynamicfield<=>Page relationship "DynamicField" 
            modelBuilder.Entity<DynamicField>()
                               .HasOne<PlatformPage>(p=>p.PlatformPage)
                               .WithMany()
                               .HasForeignKey(prop => prop.PageID);
                           
                           //one to one Dynamicfieldt<=>Pattern relationship "DynamicField" 
                           modelBuilder.Entity<DynamicField>()
                                .HasOne<Pattern>(df => df.Pattern)
                                .WithMany(p=>p.AssociatedDynamicFields)
                                .HasForeignKey(prop => prop.PatternId);


                            //one to many DynamicField<=>Post relationship 
                            modelBuilder.Entity<DynamicField>()
                                .HasOne<Post>(df => df.Post)
                                .WithMany(p=>p.PostDynamicFields)
                                .HasForeignKey(prop => prop.PostID);


            //one to many Platform Page<=>PlatformUser relationship  ((Who's the page owner))
            modelBuilder.Entity<PlatformPage>()
                .HasOne<PlatformAccount>(df => df.PageOwner)
                .WithMany()
                .HasForeignKey(prop => prop.PageOwnerID);
            //one to many FaceBookPage<=>InstagramPage relationship
            modelBuilder.Entity<PlatformPage>()
                            .HasMany<PlatformPage>(fp => fp.AssociatedPlatformPages)
                            .WithOne(p=>p.AssociatedByPlatformPage)
                            .HasForeignKey(prop => prop.AssociatedByPlatformPageID);

            //one to many Group<=>Group  recurssive relationship 
            modelBuilder.Entity<Group>()
                            .HasOne<Group>(fp => fp.ParentGroup)
                            .WithMany(g=>g.SubGroups)
                            .HasForeignKey(prop => prop.ParentGroupId);


            //one to many User<=>Platform Page  Delete relationship 
            modelBuilder.Entity<PlatformPage>()
               .HasOne<User>(g => g.DeleteUser)
               .WithMany(u => u.DeletedPlatformPages)
               .HasForeignKey(prop => prop.DeleteUserId);

            //one to many User<=>Platform Page Create relationship 
            modelBuilder.Entity<PlatformPage>()
               .HasOne<User>(g => g.AddUser)
               .WithMany(u => u.AddedPlatformPages)
               .HasForeignKey(prop => prop.AddUserId);
            //one to many User<=>Platform Account Delete relationship 
            modelBuilder.Entity<PlatformAccount>()
               .HasOne<User>(g => g.DeleteUser)
               .WithMany(u => u.DeletedPlatformAccounts)
               .HasForeignKey(prop => prop.DeleteUserId);

            //one to many User<=>Platform Account Create relationship 
            modelBuilder.Entity<PlatformAccount>()
               .HasOne<User>(g => g.AddUser)
               .WithMany(u => u.AddedPlatformAccounts)
               .HasForeignKey(prop => prop.AddUserId);


            //one to many Group<=>Post  relationship 
            modelBuilder.Entity<Post>()
               .HasOne<Group>(g => g.Group)
               .WithMany(u => u.GroupPosts)
               .HasForeignKey(prop => prop.PostGroupID);

            //One to many Assets<=>Group relationship
            modelBuilder.Entity<Asset>()
                .HasOne<Group>(p => p.Group)
                .WithMany(a => a.GroupAssets)
                .HasForeignKey(prop => prop.GroupId);

            //one to many User<=>Asset Delete relationship 
            modelBuilder.Entity<Asset>()
               .HasOne<User>(g => g.DeleteUser)
               .WithMany()
               .HasForeignKey(prop => prop.DeleteUserId);

            //one to many User<=>Asset Create relationship 
            modelBuilder.Entity<Asset>()
               .HasOne<User>(g => g.CreateUser)
               .WithMany()
               .HasForeignKey(prop => prop.CreatedUserId);


            //one to many User<=>Post Delete relationship 
            modelBuilder.Entity<Post>()
               .HasOne<User>(g => g.DeleteUser)
               .WithMany(u => u.DeletedPosts)
               .HasForeignKey(prop => prop.DeleteUserId);

            //one to many User<=>Postt Create relationship 
            modelBuilder.Entity<Post>()
               .HasOne<User>(g => g.CreateUser)
               .WithMany(u => u.AddedPosts)
               .HasForeignKey(prop => prop.CreatedUserId);

            //one to many Country<=>Region  relationship
            modelBuilder.Entity<Region>()
             .HasOne<Country>(g => g.Region_Country)
             .WithMany(u => u.Country_Regions)
             .HasForeignKey(prop => prop.Region_CountryId);

            //one to many Region<=>Location relationship
            modelBuilder.Entity<Location>()
             .HasOne<Region>(g => g.Location_Region)
             .WithMany(u => u.Region_Locations)
             .HasForeignKey(prop => prop.Location_RegionId);

            //------------------Relationships Related the Post Targeting--------------------------


            //one to many Post<=>AgeRange relationship
            modelBuilder.Entity<Post>()
             .HasOne<AgeRange>(g => g.POST_Targeted_AgeRange)
             .WithMany()
             .HasForeignKey(prop => prop.POST_Targeted_AgeRangeId);

            //one to many Post<=>Gender relationship
            modelBuilder.Entity<Post>()
             .HasOne<Gender>(g => g.POST_Targeted_Gender)
             .WithMany()
             .HasForeignKey(prop => prop.POST_Targeted_GenderId);

  //----Patform-Language,Country,interest,region,location one to many association---//

            //one to many Country<=>Platform relationship
            modelBuilder.Entity<Country>()
             .HasOne<Platform>(g => g.Country_Platform)
             .WithMany()
             .HasForeignKey(prop => prop.Country_PlatformId);

            //one to many Region<=>Platform relationship
            modelBuilder.Entity<Region>()
             .HasOne<Platform>(g => g.Region_Platform)
             .WithMany()
             .HasForeignKey(prop => prop.Region_PlatformId);

            //one to many Location<=>Platform relationship
            modelBuilder.Entity<Location>()
             .HasOne<Platform>(g => g.Location_Platform)
             .WithMany()
             .HasForeignKey(prop => prop.Location_PlatformId);


            //one to many Language<=>Platform relationship
            modelBuilder.Entity<Language>()
             .HasOne<Platform>(g => g.Language_Platform)
             .WithMany()
             .HasForeignKey(prop => prop.Language_PlatformId);

            //one to many Interest<=>Platform relationship
            modelBuilder.Entity<Interest>()
             .HasOne<Platform>(g => g.Interest_Platform)
             .WithMany()
             .HasForeignKey(prop => prop.Interest_PlatformId);
            //--End---//


            //----Country<->Region, Region<->Location one to many association---//

            //one to many Country<->Region relationship
            modelBuilder.Entity<Region>()
             .HasOne<Country>(g => g.Region_Country)
             .WithMany(p=>p.Country_Regions)
             .HasForeignKey(prop => prop.Region_CountryId);

            //one to many Region<->Location relationship
            modelBuilder.Entity<Location>()
             .HasOne<Region>(g => g.Location_Region)
             .WithMany(p=>p.Region_Locations)
             .HasForeignKey(prop => prop.Location_RegionId);

            //----End----//

            //many to many Post<=>Countries Target relationship
            modelBuilder.Entity<Post>()
            .HasMany<Country>(p => p.POST_Targeted_Countries)
            .WithMany(p => p.Country_Targeted_Posts)
            .UsingEntity(ug => ug.ToTable("PostCountries")) ;

            //many to many Post<=>Region Target relationship
            modelBuilder.Entity<Post>()
            .HasMany<Region>(p => p.POST_Targeted_Regions)
            .WithMany(p => p.Region_Targeted_Posts)
            .UsingEntity(ug => ug.ToTable("PostRegions"));


            //many to many Post<=>Location Target relationship
            modelBuilder.Entity<Post>()
            .HasMany<Location>(p => p.POST_Targeted_Locations)
            .WithMany(p => p.Location_Targeted_Posts)
            .UsingEntity(ug => ug.ToTable("PostLocations"));

            //many to many Post<=>Location Target relationship
            modelBuilder.Entity<Post>()
            .HasMany<Interest>(p => p.POST_Targeted_Interests)
            .WithMany(p => p.Interest_Targeted_Posts)
            .UsingEntity(ug => ug.ToTable("PostInterests"));

            //many to many Post<=>Language Target relationship
            modelBuilder.Entity<Post>()
            .HasMany<Language>(p => p.POST_Targeted_Languages)
            .WithMany(p => p.Language_Targeted_Posts)
            .UsingEntity(ug => ug.ToTable("PostLanguages"));
            //---end---//


            //------------------Tags relationships--------------//

            //One to many PlatformAccounts<=>Tag Target relationship
            modelBuilder.Entity<Tag>()
            .HasOne<PlatformAccount>(g => g.TaggedPlatformAccount)
            .WithMany(p => p.ListOfTags)
            .HasForeignKey(prop => prop.TaggedPlatformAccount_ID);

            //One to many AssetPost<=>Tag Target relationship
            modelBuilder.Entity<Tag>()
            .HasOne<AssetPost>(g => g.TaggedAssetPost)
            .WithMany(p => p.Asset_Tags)
            .HasForeignKey(prop => prop.TaggedAssetPost_ID);

            //---------------End------------------------//



            //------------------MentionedAccountPost relationships--------------//

            //One to many MentionedAccountPost<=>Post Target relationship
            modelBuilder.Entity<MentionedAccountPost>()
            .HasOne<Post>(g => g.Post)
            .WithMany(p => p.PostMentions)
            .HasForeignKey(prop => prop.PostId);

            //One to many MentionedAccountPost<=>PlatformAccount Target relationship
            modelBuilder.Entity<MentionedAccountPost>()
            .HasOne<PlatformAccount>(g => g.Mentioned_PlatformAccount)
            .WithMany(p => p.Mentions)
            .HasForeignKey(prop => prop.Mentioned_PlatformAccount_ID);

            //---------------End------------------------//



            //------------------PlatformPost relationships--------------//

            //One to many PlatformPost<=>PlatformComment relationship
            modelBuilder.Entity<PlatformPost>()
            .HasMany<PlatformComment>(g => g.PostComments)
            .WithOne(p => p.PlatformPost)
            .HasForeignKey(prop => prop.PlatformPost_ID);

            //One to many PlatformPost<=>PlatformLike  relationship
            modelBuilder.Entity<PlatformPost>()
            .HasMany<PlatformLike>(g => g.PostLikes)
            .WithOne(p => p.PlatformPost)
            .HasForeignKey(prop => prop.PlatformPost_ID);


            //One to many Platform<=>PlatformComment  relationship
            modelBuilder.Entity<PlatformComment>()
            .HasOne<Platform>(g => g.Platform)
            .WithMany()
            .HasForeignKey(prop => prop.PlatformId);

            //One to many Platform<=>PlatformLike  relationship
            modelBuilder.Entity<PlatformLike>()
            .HasOne<Platform>(g => g.Platform)
            .WithMany()
            .HasForeignKey(prop => prop.PlatformId);


            //One to many PlatformPost<=>post  relationship
            modelBuilder.Entity<Post>()
            .HasMany<PlatformPost>(g => g.Posted_PlatformPosts)
            .WithOne(p=>p.App_Post)
            .HasForeignKey(prop => prop.App_PostID);

            //One to many PlatformPage<=>post  relationship
            modelBuilder.Entity<PlatformPage>()
            .HasMany<PlatformPost>(g => g.Posted_PlatformPosts)
            .WithOne(p => p.PlatformPage)
            .HasForeignKey(prop => prop.PlatformPage_ID);

            //---------------End------------------------//


            //------------------Inseights relationships--------------//
            //One to many PlatformPostInseights<=>PlatformPost  relationship
            modelBuilder.Entity<Post>()
            .HasMany<PostHistory>(g => g.PostInseightsHistory)
            .WithOne(p => p.Post)
            .HasForeignKey(prop => prop.PostID);

            //One to many PlatformPostInseights<=>PlatformPage  relationship
            modelBuilder.Entity<PlatformPage>()
            .HasMany<PostHistory>(g => g.PageInseightsHistory)
            .WithOne(p => p.PlatformPage)
            .HasForeignKey(prop => prop.PlatformPageID);


            //---------------End------------------------//

        }




    }
}
