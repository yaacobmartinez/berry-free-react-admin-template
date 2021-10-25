import React, { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const SamplePage = Loadable(lazy(() => import('views/sample-page')));
const Products = Loadable(lazy(() => import('views/products')));
const Monitoring = Loadable(lazy(() => import('views/monitoring')));
const UserManagement = Loadable(lazy(() => import('views/user-management')));
const Product = Loadable(lazy(() => import('views/products/single')));

// ===========================|| MAIN ROUTING ||=========================== //

const MainRoutes = {
    path: '/dashboard',
    element: <MainLayout />,
    children: [
        {
            path: '/default',
            element: <DashboardDefault />
        },
        {
            path: '/product/:id',
            element: <Product />
        },
        {
            path: '/products',
            element: <Products />
        },
        {
            path: '/monitoring',
            element: <Monitoring />
        },
        {
            path: '/users',
            element: <UserManagement />
        },
        {
            path: '/profile',
            element: <SamplePage />
        },
        {
            path: '/popular-stocks',
            element: <SamplePage />
        },
        {
            path: '/income',
            element: <SamplePage />
        },

    ]
};

export default MainRoutes;
