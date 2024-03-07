// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  BuildOutlined,
  CalendarOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  FilterOutlined,
  UsergroupDeleteOutlined,
  SettingOutlined
} from '@ant-design/icons';

// icons
const icons = {
  BuildOutlined,
  CalendarOutlined,
  CustomerServiceOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  FileTextOutlined,
  FilterOutlined,
  UsergroupDeleteOutlined,
  SettingOutlined
};
// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const applications = {
  id: 'group-applications',
  title: <FormattedMessage id="applications" />,
  icon: icons.AppstoreAddOutlined,
  type: 'group',
  children: [
    // {
    //   id: 'chat',
    //   title: <FormattedMessage id="chat" />,
    //   type: 'item',
    //   url: '/apps/chat',
    //   icon: icons.MessageOutlined,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'calendar',
    //   title: <FormattedMessage id="calendar" />,
    //   type: 'item',
    //   url: '/apps/calendar',
    //   icon: icons.CalendarOutlined
    // },
    // {
    //   id: 'kanban',
    //   title: 'Manage Projects',
    //   type: 'item',
    //   icon: BuildOutlined,
    //   url: '/apps/kanban/board'
    // },

    {
      id: 'Lead',
      title: <FormattedMessage id="Lead" />,
      // type: 'collapse',
      icon: icons.FilterOutlined,
      type: 'item',
      url: '/apps/lead/lead-list'
      // children: [
      //   {
      //     id: 'lead-list',
      //     title: <FormattedMessage id="All Leads" />,
      //     type: 'item',
      //     url: '/apps/lead/lead-list'
      //   },
      //   {
      //     id: 'customer-card',
      //     title: <FormattedMessage id="Client Portal" />,
      //     type: 'item',
      //     url: 'apps/lead/lead-view'
      //   }
      // ]
    },

    // {
    //   id: 'Contact',
    //   title: <FormattedMessage id="Contact" />,
    //   type: 'collapse',
    //   icon: icons.UserOutlined,
    //   children: [
    //     {
    //       id: 'contact-list',
    //       title: <FormattedMessage id="All Contacts" />,
    //       type: 'item',
    //       url: '/apps/customer/customer-list'
    //     },
    //     // {
    //     //   id: 'customer-card',
    //     //   title: <FormattedMessage id="cards" />,
    //     //   type: 'item',
    //     //   url: '/apps/customer/customer-card'
    //     // }
    //   ]
    // },

    {
      id: 'contact',
      title: <FormattedMessage id="Contacts" />,
      type: 'item',
      icon: icons.UsergroupDeleteOutlined,
      url: '/apps/contact/contact-list'
      // children: [
      //   {
      //     id: 'contact-list',
      //     title: <FormattedMessage id="All Contacts" />,
      //     type: 'item',
      //     url: '/apps/contact/contact-list'
      //   },
      // {
      //   id: 'project-card',
      //   title: <FormattedMessage id="cards" />,
      //   type: 'item',
      //   url: '/apps/project/project-card'
      // }
      // ]
    },
    {
      id: 'project',
      title: <FormattedMessage id="Projects" />,
      type: 'collapse',
      icon: icons.BuildOutlined,
      children: [
        {
          id: 'project-list',
          title: <FormattedMessage id="All Projects" />,
          type: 'item',
          url: '/apps/project/project-list'
        },
        {
          id: 'workflow-list',
          title: <FormattedMessage id="All Workflows" />,
          type: 'item',
          url: '/apps/project/workflow-list'
        }
        // {
        //   id: 'project-card',
        //   title: <FormattedMessage id="cards" />,
        //   type: 'item',
        //   url: '/apps/project/project-card'
        // }
      ]
    },
    {
      id: 'calendar',
      title: <FormattedMessage id="calendar" />,
      type: 'item',
      url: '/apps/calendar',
      icon: icons.CalendarOutlined
    },
    {
      id: 'invoice',
      title: <FormattedMessage id="invoice" />,
      url: '/apps/invoice/dashboard',
      type: 'collapse',
      icon: icons.FileTextOutlined,
      breadcrumbs: true,
      children: [
        {
          id: 'list',
          title: <FormattedMessage id="All Invoices" />,
          type: 'item',
          url: '/apps/invoice/list'
        },
        {
          id: 'create',
          title: <FormattedMessage id="Create" />,
          type: 'item',
          url: '/apps/invoice/create'
        },
        {
          id: 'details',
          title: <FormattedMessage id="details" />,
          type: 'item',
          url: '/apps/invoice/details/1'
        }

        // {
        //   id: 'edit',
        //   title: <FormattedMessage id="edit" />,
        //   type: 'item',
        //   url: '/apps/invoice/edit/1'
        // }
      ]
    },
    // {
    //   id: 'profile',
    //   title: <FormattedMessage id="profile" />,
    //   type: 'collapse',
    //   icon: icons.UserOutlined,
    //   children: [
    //     {
    //       id: 'user-profile',
    //       title: <FormattedMessage id="user-profile" />,
    //       type: 'item',
    //       url: '/apps/profiles/user/personal',
    //       breadcrumbs: false
    //     },
    //     {
    //       id: 'account-profile',
    //       title: <FormattedMessage id="account-profile" />,
    //       type: 'item',
    //       url: '/apps/profiles/account/basic',
    //       breadcrumbs: false
    //     }
    //   ]
    // },
    {
      id: 'inventory',
      title: <FormattedMessage id="Inventory" />,
      type: 'collapse',
      icon: icons.ShoppingCartOutlined,
      children: [
        // {
        //   id: 'products',
        //   title: <FormattedMessage id="products" />,
        //   type: 'item',
        //   url: '/apps/e-commerce/products'
        // },
        // {
        //   id: 'product-details',
        //   title: <FormattedMessage id="Item details" />,
        //   type: 'item',
        //   url: '/apps/e-commerce/product-details/1',
        //   breadcrumbs: false
        // },
        {
          id: 'product-list',
          title: <FormattedMessage id="Material list" />,
          type: 'item',
          url: '/apps/e-commerce/product-list',
          breadcrumbs: false
        },
        {
          id: 'add-new-product',
          title: <FormattedMessage id="Add Material" />,
          type: 'item',
          url: '/apps/e-commerce/add-new-product'
        }
        // {
        //   id: 'checkout',
        //   title: <FormattedMessage id="checkout" />,
        //   type: 'item',
        //   url: '/apps/e-commerce/checkout'
        // }
      ]
    },
    {
      id: 'users',
      title: <FormattedMessage id="Settings" />,
      type: 'collapse',
      icon: icons.SettingOutlined,
      children: [
        {
          id: 'user-list',
          title: <FormattedMessage id="Users" />,
          type: 'item',
          // icon: icons.UserOutlined,
          url: '/apps/user/user-list'
        },
        {
          id: 'role-list',
          title: <FormattedMessage id="User Permissions" />,
          type: 'item',
          url: '/apps/user/role-list'
        }
      ]
    }
    // {
    //   id: 'client-portal',
    //   title: <FormattedMessage id="Client Portal (Testing)" />,
    //   type: 'item',
    //   url: 'apps/lead/lead-view/65e5c6724158a28219cd566a'
    // },
  ]
};

export default applications;
