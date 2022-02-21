// assets
import { IconBrandFramer, IconTypography, IconPalette, IconShadow, IconWindmill, IconLayoutGridAdd } from '@tabler/icons';
import { fetchFromStorage } from 'utils/storage';

// constant
const icons = {
    IconTypography,
    IconPalette,
    IconShadow,
    IconWindmill,
    IconBrandFramer,
    IconLayoutGridAdd
};

// ===========================|| UTILITIES MENU ITEMS ||=========================== //
const user = fetchFromStorage('user')
console.log(user)
const admin = [
    {
        id: 'products',
        title: 'Products',
        type: 'item',
        url: '/dashboard/products',
        breadcrumbs: false
    },
    {
        id: 'monitoring',
        title: 'Sales Monitoring',
        type: 'item',
        url: '/dashboard/monitoring',
        breadcrumbs: false
    },
     {
         id: 'user-management',
         title: 'User Management',
         type: 'item',
         url: '/dashboard/users',
         breadcrumbs: false
     },
]
const employee = [
    {
        id: 'monitoring',
        title: 'Sales Monitoring',
        type: 'item',
        url: '/dashboard/monitoring',
        breadcrumbs: false
    },
]
const utilities = {
    id: 'utilities',
    type: 'group',
    children: user 
                    ? user.access_level === 2 
                        ? employee 
                        : admin 
                    : admin
};

export default utilities;
