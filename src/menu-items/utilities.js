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
    title: 'Utilities',
    type: 'group',
    children: [
        {
            id: 'util-typography',
            title: 'Products',
            type: 'item',
            url: '/utils/util-typography',
            breadcrumbs: false
        },
        {
            id: 'util-color',
            title: 'Monitoring',
            type: 'item',
            url: '/utils/util-color',
            breadcrumbs: false
        }
    ]
};

export default utilities;
