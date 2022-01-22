import React, { lazy } from 'react';
import Loadable from 'ui-component/Loadable';
import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';

const ChangePassword = Loadable(lazy(() => import('views/pages/ChangePassword')));


// ===========================|| ROUTING RENDER ||=========================== //

export default function ThemeRoutes() {
    return useRoutes([MainRoutes, AuthenticationRoutes,{
        path: '/changepassword', 
        element: <ChangePassword />
    }]);
}
