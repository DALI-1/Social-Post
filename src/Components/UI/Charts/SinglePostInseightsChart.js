import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';
// ==============================|| INCOME AREA CHART ||============================== //

const IncomeAreaChart = ({PageName,slot,Type,Data}) => {
    var Y_Axis=[]
    var X_axis=[]
// preparing the Y Axis
Data.map((ins)=>{

    if(Type=="Comments")
    {
        Y_Axis=[...Y_Axis,ins.CommentCount]
    }
    if(Type=="Likes")
    {
        Y_Axis=[...Y_Axis,ins.LikeCount]
    }
    if(Type=="Shares")
    {
        Y_Axis=[...Y_Axis,ins.SharesCount]
    }

})
// preparing the X Axis

Data.map((ins)=>{
    X_axis=[...X_axis,ins.InsightDate]
})
    return (<ReactApexChart options={{chart: {id: "basic-bar"},xaxis: {categories: X_axis}}} series={[{name: PageName,data: Y_Axis}]} type="area" height={450} />)
};

IncomeAreaChart.propTypes = {
    slot: PropTypes.string
};

export default IncomeAreaChart;
