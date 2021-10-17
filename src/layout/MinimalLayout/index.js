import React from 'react';
import { Outlet } from 'react-router-dom';
import {useNavigate} from 'react-router'
// project imports
import Customization from '../Customization';
import { fetchFromStorage } from 'utils/storage';

// ===========================|| MINIMAL LAYOUT ||=========================== //

const MinimalLayout = () => {
    const navigate = useNavigate()
    const token = fetchFromStorage('token')
    if (token) {
        navigate('/dashboard/default')
    }
    return (
        <>
            <Outlet />
            {/* <Customization /> */}
        </>
    )
};

export default MinimalLayout;
