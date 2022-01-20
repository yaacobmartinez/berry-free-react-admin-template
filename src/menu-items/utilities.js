// assets
import { IconBrandFramer, IconTypography, IconPalette, IconShadow, IconWindmill, IconLayoutGridAdd } from '@tabler/icons';

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

const utilities = {
    id: 'utilities',
    type: 'group',
    children: [
        {
            id: 'products',
            title: 'Products',
            type: 'item',
            url: '/dashboard/products',
            breadcrumbs: false
        },
        {
            id: 'monitoring',
            title: 'Customer Monitoring',
            type: 'item',
            url: '/dashboard/monitoring',
            breadcrumbs: false
        },
        // {
        //     id: 'user-management',
        //     title: 'User Management',
        //     type: 'item',
        //     url: '/dashboard/users',
        //     breadcrumbs: false
        // },
    ]
};

export default utilities;
