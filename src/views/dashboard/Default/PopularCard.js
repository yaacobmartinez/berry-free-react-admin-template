import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

// material-ui
import { makeStyles } from '@material-ui/styles';
import { Avatar, Button, CardActions, CardContent, Divider, Grid, Menu, MenuItem, Typography } from '@material-ui/core';

// project imports
import BajajAreaChartCard from './BajajAreaChartCard';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';

// assets
import ChevronRightOutlinedIcon from '@material-ui/icons/ChevronRightOutlined';
import MoreHorizOutlinedIcon from '@material-ui/icons/MoreHorizOutlined';
import KeyboardArrowUpOutlinedIcon from '@material-ui/icons/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@material-ui/icons/KeyboardArrowDownOutlined';
import axiosInstance from 'utils/axios';
import _ from 'lodash';

// style constant
const useStyles = makeStyles((theme) => ({
    cardAction: {
        padding: '10px',
        paddingTop: 0,
        justifyContent: 'center'
    },
    primaryLight: {
        color: theme.palette.primary[200],
        cursor: 'pointer'
    },
    divider: {
        marginTop: '12px',
        marginBottom: '12px'
    },
    avatarSuccess: {
        width: '16px',
        height: '16px',
        borderRadius: '5px',
        backgroundColor: theme.palette.success.light,
        color: theme.palette.success.dark,
        marginLeft: '15px'
    },
    successDark: {
        color: theme.palette.success.dark
    },
    avatarError: {
        width: '16px',
        height: '16px',
        borderRadius: '5px',
        backgroundColor: theme.palette.orange.light,
        color: theme.palette.orange.dark,
        marginLeft: '15px'
    },
    errorDark: {
        color: theme.palette.orange.dark
    }
}));

// ===========================|| DASHBOARD DEFAULT - POPULAR CARD ||=========================== //

const PopularCard = ({ isLoading }) => {
    const classes = useStyles();

    const [stocks, setStocks] = React.useState([])
    const getChartData = React.useCallback(async () => {
        const { data } = await axiosInstance.get(`/orders/charts`)
        const stockItems = _.chain(data.stocks.flat())
            .groupBy("_id")
            .toPairs()
            .value()
        const withQuantity = stockItems.map((item) => {
            const orders = item[1]
            const totalOrders = orders.reduce((previous, current) => previous + current.quantity, 0)
            return { ...orders[0], totalOrders }
        })
        console.log(withQuantity)
        setStocks(withQuantity.sort((a, b) => b.totalOrders - a.totalOrders))
    }, [])

    React.useEffect(() => {
        // set chart data here
        getChartData()
        // console.log('fetch chart data here')
    }, [getChartData])
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            {isLoading ? (
                <SkeletonPopularCard />
            ) : (
                <MainCard content={false}>
                    <CardContent>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <Grid container alignContent="center" justifyContent="space-between">
                                    <Grid item>
                                        <Typography variant="h4">Best Seller</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sx={{ pt: '16px !important' }}>
                                {stocks && (
                                    <BajajAreaChartCard item={stocks[0]} />
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                {stocks.slice(1, 5).map((item, index) => (
                                    <Fragment key={index}>
                                        <Grid container direction="column">
                                            <Grid item>
                                                <Grid container alignItems="center" justifyContent="space-between">
                                                    <Grid item>
                                                        <Typography variant="subtitle1" color="inherit">
                                                            {item?.name}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        <Grid container alignItems="center" justifyContent="space-between">
                                                            <Grid item>
                                                                <Typography variant="subtitle1" color="inherit">
                                                                ₱{(parseFloat(item?.initialPrice) + parseFloat(item?.markupPrice)).toFixed(2)}
                                                                </Typography>
                                                            </Grid>
                                                            {/* <Grid item>
                                                                <Avatar variant="rounded" className={classes.avatarSuccess}>
                                                                    <KeyboardArrowUpOutlinedIcon fontSize="small" color="inherit" />
                                                                </Avatar>
                                                            </Grid> */}
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="subtitle2" className={classes.successDark}>
                                                    {item?.totalOrders} Total Orders
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Divider className={classes.divider} />
                                    </Fragment>
                                ))}
                            </Grid>
                        </Grid>
                    </CardContent>
                    {/* <CardActions className={classes.cardAction}>
                        <Button size="small" disableElevation>
                            View All
                            <ChevronRightOutlinedIcon />
                        </Button>
                    </CardActions> */}
                </MainCard>
            )}
        </>
    );
};

PopularCard.propTypes = {
    isLoading: PropTypes.bool
};

export default PopularCard;
