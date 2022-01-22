import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { makeStyles } from '@material-ui/styles';
import { Avatar, Button, Grid, Typography } from '@material-ui/core';

// third-party
import Chart from 'react-apexcharts';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

import ChartDataMonth from './chart-data/total-order-month-line-chart';
import ChartDataYear from './chart-data/total-order-year-line-chart';

// assets
import LocalMallOutlinedIcon from '@material-ui/icons/LocalMallOutlined';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { Visibility, VisibilityOff } from '@material-ui/icons';

// style constant
const useStyles = makeStyles((theme) => ({
    card: {
        backgroundColor: theme.palette.primary.dark,
        color: '#fff',
        overflow: 'hidden',
        position: 'relative',
        '&>div': {
            position: 'relative',
            zIndex: 5
        },
        '&:after': {
            content: '""',
            position: 'absolute',
            width: '210px',
            height: '210px',
            background: theme.palette.primary[800],
            borderRadius: '50%',
            zIndex: 1,
            top: '-85px',
            right: '-95px',
            [theme.breakpoints.down('xs')]: {
                top: '-105px',
                right: '-140px'
            }
        },
        '&:before': {
            content: '""',
            position: 'absolute',
            zIndex: 1,
            width: '210px',
            height: '210px',
            background: theme.palette.primary[800],
            borderRadius: '50%',
            top: '-125px',
            right: '-15px',
            opacity: 0.5,
            [theme.breakpoints.down('xs')]: {
                top: '-155px',
                right: '-70px'
            }
        }
    },
    content: {
        padding: '20px !important'
    },
    avatar: {
        ...theme.typography.commonAvatar,
        ...theme.typography.largeAvatar,
        backgroundColor: theme.palette.primary[800],
        color: '#fff',
        marginTop: '8px'
    },
    cardHeading: {
        fontSize: '2.125rem',
        fontWeight: 500,
        marginRight: '8px',
        marginTop: '14px',
        marginBottom: '6px'
    },
    subHeading: {
        fontSize: '1rem',
        fontWeight: 500,
        color: theme.palette.primary[200]
    },
    avatarCircle: {
        ...theme.typography.smallAvatar,
        cursor: 'pointer',
        backgroundColor: theme.palette.primary[200],
        color: theme.palette.primary.dark
    },
    circleIcon: {
        transform: 'rotate3d(1, 1, 1, 45deg)'
    }
}));

// ===========================|| DASHBOARD - TOTAL ORDER LINE CHART CARD ||=========================== //

const TotalOrderLineChartCard = ({ isLoading, amount }) => {
    const classes = useStyles();

    const [timeValue, setTimeValue] = React.useState(false);
    const handleChangeTime = (event, newValue) => {
        setTimeValue(newValue);
    };
    const [showSales, setShowSales] = React.useState(false)

    return (
        <>
            {isLoading ? (
                <SkeletonTotalOrderCard />
            ) : (
                <MainCard border={false} className={classes.card} contentClass={classes.content}>
                    <Grid container direction="column">
                        <Grid item sx={{ mb: 0.75 }}>
                            <Grid container alignItems="center">
                                <Grid item xs={12}>
                                    <Grid container alignItems="center">
                                        <Grid item sx={{mt: 7, mb: 2}}>
                                            {timeValue ? (
                                                <Typography className={classes.cardHeading}>₱0.00</Typography>

                                            ) : (
                                                <Typography className={classes.cardHeading}>₱{
                                                    showSales 
                                                        ? parseFloat(amount).toLocaleString(undefined, {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        })
                                                        : `*.**`
                                                }</Typography>
                                            )}
                                        </Grid>
                                        <Grid item>
                                            <Avatar className={classes.avatarCircle}>
                                                <ArrowUpwardIcon fontSize="inherit" className={classes.circleIcon} />
                                            </Avatar>
                                        </Grid>
                                        <Grid item xs={12} sx={{mb: 3}}>
                                            <Typography className={classes.subHeading} gutterBottom>Total Orders Today</Typography>
                                        </Grid>
                                        <Grid item sx={{ mb: 2 }}>
                                            <Button size="small" variant="contained" color="info" startIcon={!showSales ? <Visibility /> : <VisibilityOff />} onClick={() => setShowSales(!showSales)}>{showSales ? `Hide` : `Show`} Sales</Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </MainCard>
            )}
        </>
    );
};

TotalOrderLineChartCard.propTypes = {
    isLoading: PropTypes.bool
};

export default TotalOrderLineChartCard;
