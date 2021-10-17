import React, { useCallback, useEffect, useState } from 'react';

// material-ui
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Switch, Typography } from '@material-ui/core';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import axios from 'utils/axios';

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { getFullName } from 'utils/storage';
import { Link } from 'react-router-dom';
/* eslint no-underscore-dangle: 0 */
//= =============================|| SAMPLE PAGE ||==============================//

const UserManagement = () => {
    const [users, setUsers] = useState([])
    const [selectedRecord, setSelectedRecord] = React.useState(null)

    const getUsers = useCallback( async () => {
            const {data} = await axios.get(`/users`)
            setUsers(data.users)
        },
        [],
    )

    useEffect(() => {
        getUsers()
    },[getUsers])
    return (
    <MainCard title="Manage Users">
            {selectedRecord && (
                <ProvisionDialog
                    raw={selectedRecord}
                    open={Boolean(selectedRecord)}
                    onClose={() =>setSelectedRecord(null)}
                    onChange={getUsers}
                />
            )}
            {users && (
                <DataGrid 
                    rows={users}
                    autoHeight 
                    rowHeight={35}
                    getRowId={(row) => row.email}
                    components={{
                        Toolbar: GridToolbar,
                    }}
                    columns={[
                        { 
                            field: 'fullName', 
                            headerName: 'Full Name',
                            flex: 1,
                            minWidth: 250,
                            valueGetter: getFullName,
                            sortable: false,
                            renderCell:({id, value}) => <Typography variant="body2" color="black">{value}</Typography>
                                
                        },
                        { 
                            field: 'email', 
                            headerName: 'Email',
                            flex: 1,
                            minWidth: 350, 
                        },
                        { 
                            field: 'provisioned', 
                            headerName: 'Access Allowed',
                            width: 150, 
                            renderCell: (cellValues) =>  {
                                const {value} = cellValues
                                return (
                                    <Switch readOnly checked={value} onChange={() => setSelectedRecord(cellValues)}/>
                                )
                        
                            }
                        },
                    ]}
                />
            )}        
    </MainCard>
)};


export const ProvisionDialog = ({raw, id, open, onClose, onChange}) => {
    const [loading, setLoading] = React.useState(false)
    const user = raw.row
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(false)
        const res = await axios.post(`/users/provision/${user._id}`, 
        {
            provision: !user.provisioned, 
            access_level: user.access_level
        })
        console.log(res.data)
        onChange()
        onClose()
    }
    return (
        <Dialog open={open} onClose={onClose} component="form" onSubmit={handleSubmit}>
            <DialogTitle>Allow Access?</DialogTitle>
            <DialogContent>
                    Are you sure you want to {user.provisioned ? 'revoke' : 'give'} access to this user?
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" size="small" disabled={loading} onClick={onClose}>Cancel</Button>
                <Button variant="contained" size="small" type="submit" disabled={loading} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    )
}

export default UserManagement;