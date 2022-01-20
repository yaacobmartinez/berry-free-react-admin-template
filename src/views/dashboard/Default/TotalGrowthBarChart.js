import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { Grid, MenuItem, TextField, Typography, useTheme } from '@material-ui/core';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// chart data
import chartData from './chart-data/total-growth-bar-chart';
import axiosInstance from 'utils/axios';
import _ from 'lodash';

const status = [
    {
        value: 'today',
        label: 'Today'
    },
    {
        value: 'month',
        label: 'This Month'
    },
    {
        value: 'year',
        label: 'This Year'
    }
];

// ===========================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||=========================== //

const TotalGrowthBarChart = ({ isLoading }) => {
    const [value, setValue] = React.useState('year');
    const month = new Date().getMonth()
    const today = new Date()
    const [totals, setTotals] = React.useState({
        today: 0, 
        month: 2, 
        year: 1
    })
    const [earnings, setEarnings] = React.useState({
        today: 0, 
        month: 2, 
        year: 1
    })
    const [base, setBase] = React.useState({})
    const [chartdetails, setChartDetails] = React.useState({...chartData, series: [
        {
            name: 'Total Earnings',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
            name: 'Net Income',
            data: [0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    ]})
    const getChartData = React.useCallback(async () => {
        const {data} = await axiosInstance.get(`/orders/charts`)
        setChartDetails({...chartData, series:data.series})
        setBase(data.series)
        setTotals(data.totals)
        setEarnings(data.earnings)
    }, [])
    const theme = useTheme();

    const handleMenuClick = ({target}) => {
        setValue(target.value)
        if (target.value === 'today') {
            setChartDetails({...chartdetails, series: [
                {
                    name: 'Total Earnings',
                    data: Array.from(new Array(12)).map((i,index) => {
                        if (new Date().getMonth() === index) {
                            return earnings.today
                        }
                        return 0
                    })
                }, 
                {
                    name: 'Net Income',
                    data: Array.from(new Array(12)).map((i,index) => {
                        if (new Date().getMonth() === index) {
                            return totals.today
                        }
                        return 0
                    })
                }
            ]})
        }
        if (target.value === 'month') {
            setChartDetails({...chartdetails, series: [
                {
                    name: 'Total Earnings',
                    data: Array.from(new Array(12)).map((i,index) => {
                        if (new Date().getMonth() === index) {
                            return earnings.month
                        }
                        return 0
                    })
                }, 
                {
                    name: 'Total Income',
                    data: Array.from(new Array(12)).map((i,index) => {
                        if (new Date().getMonth() === index) {
                            return totals.month
                        }
                        return 0
                    })
                }
            ]})
        }
        if (target.value === 'year') {
            setChartDetails({...chartdetails, series: base})
        }
    }
    const { primary } = theme.palette.text;
    const grey200 = theme.palette.grey[200];

    const primary200 = theme.palette.primary[200];
    const primaryDark = theme.palette.primary.dark;
    const secondaryMain = theme.palette.secondary.main;
    const secondaryLight = theme.palette.secondary.light;
    const grey500 = theme.palette.grey[500];

    
    React.useEffect(() => {
        // set chart data here
        getChartData()
        // console.log('fetch chart data here')
    }, [getChartData])
    React.useEffect(() => {
        const newChartData = {
            ...chartData.options,
            colors: [primary200, primaryDark, secondaryMain, secondaryLight],
            xaxis: {
                labels: {
                    style: {
                        colors: [primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary]
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: [primary]
                    }
                }
            },
            grid: {
                borderColor: grey200
            },
            tooltip: {
                theme: 'light'
            },
            legend: {
                labels: {
                    colors: grey500
                }
            }
        };

        // do not load chart when loading
        if (!isLoading) {
            ApexCharts.exec(`bar-chart`, 'updateOptions', newChartData);
        }
    }, [primary200, primaryDark, secondaryMain, secondaryLight, primary, grey200, isLoading, grey500]);

    return (
        <>
            {isLoading ? (
                <SkeletonTotalGrowthBarChart />
            ) : (
                <MainCard>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Grid container direction="column" spacing={1}>
                                        <Grid item>
                                            <Typography variant="subtitle2">Total Growth</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="h3">₱{parseFloat(totals[value]).toFixed(2)}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <TextField
                                        id="standard-select-currency"
                                        select
                                        value={value}
                                        onChange={handleMenuClick}
                                    >
                                        {status.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Chart {...chartdetails} />
                        </Grid>
                    </Grid>
                </MainCard>
            )}
        </>
    );
};

TotalGrowthBarChart.propTypes = {
    isLoading: PropTypes.bool
};

export default TotalGrowthBarChart;
