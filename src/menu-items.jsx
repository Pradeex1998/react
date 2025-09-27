// assets
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import LightbulbCircleIcon from '@mui/icons-material/LightbulbCircle';


const icons = {
  NavigationOutlinedIcon: NavigationOutlinedIcon,
  HomeOutlinedIcon: HomeOutlinedIcon,
  ChromeReaderModeOutlinedIcon: ChromeReaderModeOutlinedIcon,
  HelpOutlineOutlinedIcon: HelpOutlineOutlinedIcon,
  SecurityOutlinedIcon: SecurityOutlinedIcon,
  AccountTreeOutlinedIcon: AccountTreeOutlinedIcon,
  BlockOutlinedIcon: BlockOutlinedIcon,
  AppsOutlinedIcon: AppsOutlinedIcon,
  ContactSupportOutlinedIcon: ContactSupportOutlinedIcon,
  PeopleOutlineOutlinedIcon: PeopleOutlineOutlinedIcon,
  LightbulbCircleIcon: LightbulbCircleIcon
};

// ==============================|| MENU ITEMS ||============================== //

// eslint-disable-next-line
export default {
  items: [
    {
      id: 'navigation',
      title: 'Truth Bible',
      caption: 'Dashboard',
      type: 'group',
      icon: icons['NavigationOutlinedIcon'],
      children: [
        // {
        //   id: 'dashboard',
        //   title: 'Dashboard',
        //   type: 'item',
        //   icon: icons['HomeOutlinedIcon'],
        //   url: '/dashboard/default'
        // },
        {
          id: 'subscription-detail',
          title: 'Subscription Detail',
          type: 'item',
          icon: icons['ChromeReaderModeOutlinedIcon'],
          url: '/subscription-detail'
        },
        {
          id: 'auth',
          title: 'Users',
          type: 'collapse',
          icon: icons['PeopleOutlineOutlinedIcon'],
          children: [
            {
              id: 'web-users',
              title: 'Admin User',
              type: 'item',
              url: '/user/web-userlist',
            },
            {
              id: 'mobile-users',
              title: 'App User',
              type: 'item',
              url: '/user/mobile-userlist',
            }
          ]
        },
        {
          id: 'plan-list',
          title: 'Plan List',
          type: 'item',
          icon: icons['LightbulbCircleIcon'], // Updated icon for Plan List
          url: '/plan/list'
        },
      ]
    }
  ]
};
