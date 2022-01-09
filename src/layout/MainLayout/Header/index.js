/* eslint-disable no-underscore-dangle */
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

// material-ui
import { makeStyles } from '@material-ui/styles';
import { Avatar, Box, Button, ButtonBase, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, SwipeableDrawer, Typography } from '@material-ui/core';

// project imports
import LogoSection from '../LogoSection';
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';

// assets
import { IconMenu2 } from '@tabler/icons';
import { Close, CloudDownload, QrCodeScanner } from '@material-ui/icons';
import QrReader from 'react-qr-reader';
import axiosInstance from 'utils/axios';

// style constant
const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1
    },
    headerAvatar: {
        ...theme.typography.commonAvatar,
        ...theme.typography.mediumAvatar,
        transition: 'all .2s ease-in-out',
        background: theme.palette.secondary.light,
        color: theme.palette.secondary.dark,
        '&:hover': {
            background: theme.palette.secondary.dark,
            color: theme.palette.secondary.light
        }
    },
    boxContainer: {
        width: '228px',
        display: 'flex',
        [theme.breakpoints.down('md')]: {
            width: 'auto'
        }
    }
}));


const Header = ({ handleLeftDrawerToggle }) => {
    const classes = useStyles();

    const [showReader, setShowReader] = useState(false)
    return (
        <>
            <div className={classes.boxContainer}>
                <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
                    <LogoSection />
                </Box>
                <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                    <Avatar variant="rounded" className={classes.headerAvatar} onClick={handleLeftDrawerToggle} color="inherit">
                        <IconMenu2 stroke={1.5} size="1.3rem" />
                    </Avatar>
                </ButtonBase>
            </div>
            <SearchSection theme="light" />
            <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden', marginLeft: 2 }}>
                <Avatar variant="rounded" className={classes.headerAvatar} onClick={() =>setShowReader(true)} color="inherit">
                    <QrCodeScanner stroke={1.5} size="1.3rem" />
                </Avatar>
            </ButtonBase>
            {showReader && (
                <QRReader open={showReader} onClose={() => setShowReader(false)} onOpen={() => setShowReader(true)} />
            )}
            <div className={classes.grow} />
            <div className={classes.grow} />
            <ProfileSection />
        </>
    );
};

const QRReader = ({open, onClose, onOpen}) => {

    const [order, setOrder] = React.useState(null)
    const getOrder = React.useCallback(async(id) =>{
        if(id) {
            const {data} = await axiosInstance.get(`/orders/${id}`)
            console.log(data)
            setOrder(data.order)
        }
    },[])
    const handleScan = (id) => {
        getOrder(id)
    }
    useEffect(() => {
        setOrder(null)
    }, [])
    const handleMarkAsPaid = async (id) => {
        if (id) {
            const {data} = await axiosInstance.post(`/orders/markaspaid/${id}`)
            console.log(data)
            onClose()
        }
    }
    return (
        <SwipeableDrawer
            anchor="bottom"
            open={open}
            onClose={onClose}
            onOpen={onOpen}
            PaperProps={{
                style: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                }
            }}
        >
            <div style={{height: '90vh', padding: '5vw'}}>
                {!order ? (
                    <>
                        <div style={{padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Typography variant="h6">Scan Customer QRCode</Typography>
                            <IconButton onClick={onClose}><Close /></IconButton>
                        </div>
                        <div>
                            <QrReader
                                delay={300}
                                onError={(err) => console.log(err)}
                                onScan={handleScan}
                                style={{ width: "100%" }}
                                />
                        </div>
                    </>
                ): (
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}> 
                            <Typography variant="h6" style={{fontSize: 30}}>Total</Typography>
                            <Typography variant="h6" style={{fontSize: 30}}>₱ {order.total.toFixed(2)}</Typography>
                        </div> 
                        <Typography variant="h6" style={{fontSize: 16, width: '100%', textAlign: 'left'}}>Items in cart</Typography>
                        <List style={{width: '100%',padding: 0}}>
                            {order?.cart?.map((item, index) => (
                                <ListItem key={index} style={{background: '#fff', marginBottom: 10, borderRadius: 10, padding: 0}}>
                                    <ListItemButton dense>
                                        <ListItemAvatar>
                                            <Avatar variant="rounded" src={item.media[0]}>
                                                <CloudDownload />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText 
                                            primary={item.name}
                                            secondary={
                                                <Typography variant="caption" color="GrayText">
                                                    Php{(parseFloat(item.initialPrice) + parseFloat(item.markupPrice)).toFixed(2)} x {item.quantity} pc/s
                                                </Typography>
                                            }
                                            />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                        <div style={{display: 'flex', justifyContent: 'space-between' , alignItems: "center", width: '100%', paddingBottom:20}} >
                            <Typography variant="body2">Item(s) : {order?.cart?.length}</Typography>
                            <Typography variant="body2" style={{textAlign: 'right'}}>Qty(s) : {order?.cart?.reduce((prev, current) =>  parseFloat(prev) + parseFloat(current.quantity),0)}</Typography>
                        </div>
                        <Divider />
                        <div style={{display: 'flex', justifyContent: 'space-between' , alignItems: "center", width: '100%', paddingBottom:20}}>
                            <Typography variant="body2">Subtotal</Typography>
                            <Typography variant="body2" style={{textAlign: 'right'}}>{order.total.toFixed(2)}</Typography>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between' , alignItems: "center", width: '100%'}}>
                            <Typography variant="body2">Vatable Sales</Typography>
                            <Typography variant="body2" style={{textAlign: 'right'}}>{parseFloat(parseFloat(order.total) / parseFloat(1.12)).toFixed(2)}</Typography>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between' , alignItems: "center", width: '100%', paddingBottom: 20}}>
                            <Typography variant="body2">Vat Amount</Typography>
                            <Typography variant="body2" style={{textAlign: 'right'}}>{(parseFloat(order.total) - (parseFloat(parseFloat(order.total) / parseFloat(1.12)))).toFixed(2)}</Typography>
                        </div>
                        <Divider />
                        <div style={{display: 'flex', justifyContent: 'space-between' , alignItems: "center", width: '100%', paddingBottom: 20}}>
                            <Typography variant="body2">Total</Typography>
                            <Typography variant="body2" style={{textAlign: 'right'}}>₱ {order.total.toFixed(2)}</Typography>
                        </div>

                        <Button variant="contained" fullWidth onClick={() => handleMarkAsPaid(order?._id)}>Mark as Paid</Button>
                    </div>
                )}
            </div>
        </SwipeableDrawer>
    )
}
Header.propTypes = {
    handleLeftDrawerToggle: PropTypes.func
};

QRReader.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onOpen: PropTypes.func
}
export default Header;
