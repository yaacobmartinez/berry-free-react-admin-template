/* eslint-disable no-underscore-dangle */
import React, { useCallback, useEffect, useState } from 'react';

// material-ui
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from '@material-ui/core';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import axiosInstance from 'utils/axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useNavigate } from 'react-router';
import Avatar from 'ui-component/extended/Avatar';
import { Celebration, CloudDownload, RemoveCircle, RemoveRedEye } from '@material-ui/icons';
import { format, formatISO9075 } from 'date-fns';

//= =============================|| SAMPLE PAGE ||==============================//

const Monitoring = () => {
    const navigate = useNavigate()
    const [orders, setOrders] = useState([])
    const [pageSize, setPageSize] = React.useState(10);
    const [viewOrder, setViewOrder] = React.useState(null);
    const [removeOrder, setRemoveOrder] = React.useState(null)
    const getOrders = useCallback(async () => {
        const { data } = await axiosInstance.get(`/orders`)
        setOrders(data.orders)
    }, [])

    useEffect(() => {
        getOrders()
    }, [getOrders])
    return (
        <MainCard title="Sales Monitoring">
            <OrderDialog open={Boolean(viewOrder)} onClose={() => setViewOrder(null)} order={viewOrder} onChange={getOrders} />
            {removeOrder && (
                <RemoveOrderDialog open={Boolean(removeOrder)} onClose={() => setRemoveOrder(null)} id={removeOrder} onChange={getOrders} />
            )}
            {
                orders && (
                    <DataGrid
                        style={{ marginTop: 20 }}
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
                                renderCell: (row) => (
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
                                renderCell: ({ value }) => (
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
                                renderCell: ({ value }) => (
                                    <div>
                                        <Typography variant="caption">
                                            {value === 0 ? 'Pending' : 'Paid'}
                                        </Typography>
                                    </div>
                                )
                            },
                            {
                                field: 'date_created',
                                headerName: 'Transaction Date',
                                sortable: true,
                                minWidth: 250,
                                type: 'date',
                                valueFormatter: (params) => format(new Date(params.value), "yyyy-MM-dd"),
                                valueGetter: (params) => new Date(params.value),
                                /* renderCell: ({ value }) => (
                                    <div>
                                        <Typography variant="caption">
                                            {format(new Date(value), "yyyy-MM-dd")}
                                        </Typography>
                                    </div>
                                ) */
                            },
                            {
                                field: 'cart',
                                headerName: 'Transaction Time',
                                sortable: true,
                                minWidth: 250,
                                renderCell: (row) => (
                                    <div>
                                        <Typography variant="caption">
                                            {format(new Date(row.row.date_created), "p")}
                                        </Typography>
                                    </div>
                                )
                            },
                            {
                                field: '__v',
                                headerName: 'Actions',
                                minWidth: 200,
                                renderCell: (row) => (
                                    <div>
                                        <IconButton size="small" color="secondary" onClick={() => setRemoveOrder(row.id)}>
                                            <RemoveCircle />
                                        </IconButton>
                                        <IconButton size="small" color="secondary" onClick={() => setViewOrder(row.row)}>
                                            <RemoveRedEye />

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
const RemoveOrderDialog = ({ open, onClose, id, onChange }) => {
    const handleRemove = async () => {
        console.log(id)
        const { data } = await axiosInstance.delete(`/orders/${id}`)
        onChange()
        onClose()
    }
    return (
        <Dialog maxWidth="xs" fullWidth open={open} onClose={onClose}>
            <DialogTitle style={{ fontSize: 15 }}>Remove Order</DialogTitle>
            <DialogContent style={{ padding: "0px 20px 20px 20px" }}>
                Are you sure you want to remove this order? <br />(Order #{id})
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" size="small" onClick={onClose}>Close</Button>
                <Button variant="contained" size="small" color="primary" onClick={handleRemove}>Remove</Button>
            </DialogActions>
        </Dialog>
    )
}
const OrderDialog = ({ open, onClose, order, onChange }) => {
    console.log(order)
    const handleTagAsPaid = async () => {
        console.log(order)
        const { data } = await axiosInstance.post(`/orders/markaspaid/${order._id}`)
        console.log(data)
        onChange()
        onClose()
    }
    return (
        <Dialog maxWidth="sm" fullWidth open={open} onClose={onClose}>
            <DialogTitle style={{ fontSize: 15 }}>Transaction Details</DialogTitle>
            <DialogContent style={{ padding: "0px 20px 20px 20px" }}>
                <Typography variant="body2" component="h6" gutterBottom style={{ textAlign: 'center' }}>
                    MGJ FOOD Product Trading
                </Typography>
                <Typography variant="body2" component="h6" gutterBottom style={{ textAlign: 'center' }}>
                    880 Cabiawan, Banga 1st 3004 Plaridel, Philippines
                </Typography>
                <Divider />
                <Typography variant="body2" component="h6" gutterBottom style={{ textAlign: 'center', marginTop: 10 }}>
                    **SALES INVOICE**
                </Typography>
                <Typography variant="caption" component="h6" gutterBottom style={{ textAlign: 'center', marginTop: 10 }} >
                    INVOICE ID: {order?._id}
                </Typography>

                <Divider />
                <List style={{ width: '100%', padding: 0 }}>
                    {order?.cart.map((item, index) => (
                        <ListItem key={index} style={{ background: '#fff', marginBottom: 10, borderRadius: 10, padding: 0 }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: "center", width: '100%', paddingBottom: 10 }} >
                    <Typography variant="caption">Item(s) : {order?.cart?.length}</Typography>
                    <Typography variant="caption" style={{ textAlign: 'right' }}>Qty(s) : {order?.cart?.reduce((prev, current) => parseFloat(prev) + parseFloat(current.quantity), 0)}</Typography>
                </div>
                <Divider />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: "center", width: '100%', paddingBottom: 20, marginTop: 10, }}>
                    <Typography variant="caption">SUBTOTAL</Typography>
                    <Typography variant="caption" style={{ textAlign: 'right' }}>{order?.total?.toFixed(2)}</Typography>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: "center", width: '100%' }}>
                    <Typography variant="caption">Vatable Sales</Typography>
                    <Typography variant="caption" style={{ textAlign: 'right' }}>{parseFloat(parseFloat(order?.total) / parseFloat(1.12)).toFixed(2)}</Typography>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: "center", width: '100%', paddingBottom: 20 }}>
                    <Typography variant="caption">Vat Amount</Typography>
                    <Typography variant="caption" style={{ textAlign: 'right' }}>{(parseFloat(order?.total) - (parseFloat(parseFloat(order?.total) / parseFloat(1.12)))).toFixed(2)}</Typography>
                </div>
                <Divider />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
                    <Typography variant="h2">Total</Typography>
                    <Typography variant="h2">Php {parseFloat(order?.total).toFixed(2)}</Typography>
                </div>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" disabled={order?.status === 1} size="small" color="primary" onClick={handleTagAsPaid}>Tag as Paid</Button>
                <Button variant="outlined" size="small" onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}
export default Monitoring;