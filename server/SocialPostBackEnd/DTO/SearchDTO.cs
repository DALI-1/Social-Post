namespace SocialPostBackEnd.DTO
{
    public class SearchDTO
    {

        public class SearchInterestDTO
        {
            public string InterestName { get; set; }


        }
        public class SearchCountryDTO
        {
            public string CountryName { get; set; }


        }
        public class SearchRegionDTO
        {
            public List<string> CountryCodes { get; set; }
            public string RegionName { get; set; }


        }

        public class SearchLocationDTO
        {
            public List<string> RegionCodes { get; set; }
            public string LocationName { get; set; }


        }


    }
}
