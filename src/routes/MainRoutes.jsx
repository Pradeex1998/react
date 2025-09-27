import React, { lazy } from 'react';
import { Outlet } from 'react-router-dom';

// project import
import MainLayout from 'layout/MainLayout';
import Loadable from 'component/Loadable';
import ProtectedRoute from 'component/ProtectedRoute';

const DashboardDefault = Loadable(lazy(() => import('views/Dashboard/Default')));
const UtilsTypography = Loadable(lazy(() => import('views/Utils/Typography')));
const SamplePage = Loadable(lazy(() => import('views/SamplePage')));
const MobileUserList = Loadable(lazy(() => import('views/User/MobileUserList')));
const WebUserList = Loadable(lazy(() => import('views/User/WebUserList')));
const MobileUserForm = Loadable(lazy(() => import('views/User/MobileUserForm')));
const WebUserForm = Loadable(lazy(() => import('views/User/WebUserForm')));
const ForgotPassword = Loadable(lazy(() => import('views/User/ForgotPassword')));
const SubscriptionDetailList = Loadable(lazy(() => import('views/Subscription/SubscriptionDetailList')));
const PlanList = Loadable(lazy(() => import('views/Plan/PlanList')));
const PlanForm = Loadable(lazy(() => import('views/Plan/PlanForm')));

// Public layout (no auth required)
const PublicLayout = () => <Outlet />;

// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    // Public Routes
    {
    element: <PublicLayout />,  
      children: [
        { path: 'forgot-password', element: <ForgotPassword /> },
      ]
    },
    // Protected Routes
    {
      element: (
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: '/', element: <DashboardDefault /> },
        { path: 'dashboard/default', element: <DashboardDefault /> },
        { path: 'user/web-userlist', element: <WebUserList /> },
        { path: 'user/mobile-userlist', element: <MobileUserList /> },
        { path: 'user/mobile-userform/:mode/:id?', element: <MobileUserForm /> },
        { path: 'user/web-userform/:mode/:id?', element: <WebUserForm /> },
        { path: 'subscription-detail', element: <SubscriptionDetailList /> },
        { path: 'plan/list', element: <PlanList /> },
        { path: 'plan/form/:mode/:id?', element: <PlanForm /> },
        { path: 'utils/util-typography', element: <UtilsTypography /> },
        { path: 'sample-page', element: <SamplePage /> },

      ]
    }
  ]
};

export default MainRoutes;
