import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// chart options
const areaChartOptions = {
    chart: {
        height: 450,
        type: 'area',
        toolbar: {
            show: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth',
        width: 2
    },
    grid: {
        strokeDashArray: 0
    }
};

// ==============================|| INCOME AREA CHART ||============================== //

const IncomeAreaChart = ({ slot,Type,Data}) => {
    const theme = useTheme();
    const { primary, secondary } = theme.palette.text;
    const line = theme.palette.divider;
    var DefaultStateValue=[]
    var DefaultConfigurationValue=[]
    if(Type=="Comments")
    {
      Data.postsInseights.map((post)=>{
        let Post_CommentsY_Values=[]
        //We search for the Y values of the Comments inseights for the post
        post.inseightsInfo.map((Info)=>{
         if(Info.type=='Comments')
         {
            Post_CommentsY_Values= Info.y_Values
            DefaultConfigurationValue=Info.x_Values
         }
        })
        //We create the post with the Y values that it can take
        DefaultStateValue=[...DefaultStateValue,{
            name: "Post "+post.postID,
            data:Post_CommentsY_Values
        }]
        
      })
    }
    if(Type=="Likes")
    {
      Data.postsInseights.map((post)=>{
        let Post_LikesY_Values=[]
        //We search for the Y values of the Comments inseights for the post
        post.inseightsInfo.map((Info)=>{
         if(Info.type=='Likes')
         {
            Post_LikesY_Values= Info.y_Values
            DefaultConfigurationValue=Info.x_Values
         }
        })
        //We create the post with the Y values that it can take
        DefaultStateValue=[...DefaultStateValue,{
            name: "Post "+post.postID,
            data:Post_LikesY_Values
        }]
        
      })
    }
    if(Type=="Shares")
    {
      Data.postsInseights.map((post)=>{
        let Post_SharesY_Values=[]
        //We search for the Y values of the Comments inseights for the post
        post.inseightsInfo.map((Info)=>{
         if(Info.type=='Shares')
         {
            Post_SharesY_Values= Info.y_Values
            DefaultConfigurationValue=Info.x_Values
         }
        })
        //We create the post with the Y values that it can take
        DefaultStateValue=[...DefaultStateValue,{
            name: "Post "+post.postID,
            data:Post_SharesY_Values
        }]
        
      })
    }


    const [options, setOptions] = useState( {
        chart: {
          id: "basic-bar"
        },
        xaxis: {
          categories: DefaultConfigurationValue
        }
      });


    const [series, setSeries] = useState(DefaultStateValue);

    return <ReactApexChart options={options} series={series} type="area" height={450} />;
};

IncomeAreaChart.propTypes = {
    slot: PropTypes.string
};

export default IncomeAreaChart;
