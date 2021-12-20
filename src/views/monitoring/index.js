/* eslint-disable no-underscore-dangle */
import React, { useCallback, useEffect, useState } from 'react';

// material-ui
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from '@material-ui/core';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import axiosInstance from 'utils/axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useNavigate } from 'react-router';
import Avatar from 'ui-component/extended/Avatar';
import { Celebration, CloudDownload, RemoveCircle } from '@material-ui/icons';

//= =============================|| SAMPLE PAGE ||==============================//

const Monitoring = () => {
    const navigate = useNavigate()
    const [orders, setOrders] = useState([])
    const [pageSize, setPageSize] = React.useState(10);
    const [viewOrder, setViewOrder] = React.useState(null);
    const [removeOrder, setRemoveOrder] = React.useState(null)
    const getOrders = useCallback( async () => {
        const {data} = await axiosInstance.get(`/orders`)
        setOrders(data.orders)
    },[])

useEffect(() => {
    getOrders()
},[getOrders])
    return (
        <MainCard title="Monitoring">
            <OrderDialog open={Boolean(viewOrder)} onClose={() => setViewOrder(null)} order={viewOrder} />
            {removeOrder && (
                <RemoveOrderDialog open={Boolean(removeOrder)} onClose={() =>setRemoveOrder(null)} id={removeOrder} onChange={getOrders} />
            )}
            {
            orders && (
                <DataGrid
                    style={{marginTop: 20}}
                    rows={orders}
                    autoHeight 
                    rowHeight={35}
                    disableSelectionOnClick
                    // onRowClick ={({row}) => setViewOrder(row)}
                    getRowId={(row) => row._id}
                    components={{
                        Toolbar: GridToolbar,
                    }}
                    columns={[
                        { 
                            field: '_id', 
                            headerName: 'OrderID',
                            minWidth: 300,
                            sortable: true,
                            renderCell:(row) => (
                            <div>
                                <Typography variant="caption" component="h2" onClick={() => setViewOrder(row.row)}>
                                    {row.row._id} 
                                </Typography>
                            </div>)
                                
                        },
                        { 
                            field: 'total', 
                            headerName: 'Amount',
                            minWidth: 150,
                            sortable: true,
                            renderCell:({value}) => (
                                <div>
                                <Typography variant="caption">
                                    PHP {parseFloat(value).toFixed(2)}
                                </Typography>
                            </div>
                            )
                            
                        },
                        { 
                            field: 'status', 
                            headerName: 'Status',
                            minWidth: 130,
                            sortable: true,
                            renderCell:({value}) => (
                                <div>
                                    <Typography variant="caption">
                                        {value === 0 ? 'Pending': 'Paid'}
                                    </Typography>
                                </div>
                            ) 
                        },
                        { 
                            field: 'date_created', 
                            headerName: 'Transaction Date',
                            sortable: true,
                            minWidth: 250,
                            renderCell:({value}) => (
                                <div>
                                    <Typography variant="caption">
                                        {new Date(value).toDateString()}
                                    </Typography>
                                </div>
                            ) 
                        },
                        { 
                            field: '__v', 
                            headerName: 'Actions',
                            minWidth: 200,
                            renderCell:(row) => (
                                <div>
                                    <IconButton size="small" color="secondary" onClick={() => setRemoveOrder(row.id)}>
                                        <RemoveCircle />
                                    </IconButton>
                                </div>
                            ) 
                        },
                    ]}
                    rowsPerPageOptions={[5, 10, 20]}
                    pagination
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                />
                )
            }
        </MainCard>
    )
};
const RemoveOrderDialog = ({open, onClose, id, onChange}) => {
    const handleRemove = async () => {
        console.log(id)
        const {data} = await axiosInstance.delete(`/orders/${id}`)
        onChange()
        onClose()
    }
    return (
        <Dialog maxWidth="xs" fullWidth open={open} onClose={onClose}>
            <DialogTitle style={{fontSize: 15}}>Remove Order</DialogTitle>
            <DialogContent style={{padding: "0px 20px 20px 20px"}}>
                Are you sure you want to remove this order? <br/>(Order #{id})
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" size="small" onClick={onClose}>Close</Button>
                <Button variant="contained" size="small" color="primary" onClick={handleRemove}>Remove</Button>
            </DialogActions>
        </Dialog>
    )
}
const OrderDialog = ({open, onClose, order}) => (
        <Dialog maxWidth="sm" fullWidth open={open} onClose={onClose}>
            <DialogTitle style={{fontSize: 15}}>Transaction Details</DialogTitle>
            <DialogContent style={{padding: "0px 20px 20px 20px"}}>
                <List style={{width: '100%',padding: 0}}>
                    {order?.cart.map((item, index) => (
                        <ListItem key={index} style={{background: '#fff', marginBottom: 10, borderRadius: 10, padding: 0}}>
                            <ListItemButton dense>
                                <ListItemAvatar>
                                    <Avatar variant="rounded" src={item.media[0]}>
                                        <Celebration />
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
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Typography variant="h2">Total</Typography>
                    <Typography variant="h2">Php {parseFloat(order?.total).toFixed(2)}</Typography>
                </div>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" size="small" onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
);
export default Monitoring;