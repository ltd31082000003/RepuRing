
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import MainLayout from '@/components/layouts/MainLayout'

import { KeyManagement } from '@/app/pages/KeyManagement'
import { RepuRingProvider } from '@/app/pages/repuring/RepuRingProvider'
import RepuRingOverview from '@/app/pages/repuring/RepuRingOverview'
import RepuRingCircles from '@/app/pages/repuring/RepuRingCircles'
import RepuRingCommunity from '@/app/pages/repuring/RepuRingCommunity'
import RepuRingContributions from '@/app/pages/repuring/RepuRingContributions'
import RepuRingEndorse from '@/app/pages/repuring/RepuRingEndorse'
import RepuRingLeaderboard from '@/app/pages/repuring/RepuRingLeaderboard'
import RepuRingAdmin from '@/app/pages/repuring/RepuRingAdmin'

function AppRoutes(): JSX.Element {
    return (
        <RepuRingProvider>
            <Outlet />
        </RepuRingProvider>
    )
}

const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            {
                element: <AppRoutes />,
                children: [
                    { path: '/', element: <Navigate to="/repuring" replace /> },
                    {
                        path: '/repuring',
                        children: [
                            { index: true, element: <RepuRingOverview /> },
                            { path: 'circles', element: <RepuRingCircles /> },
                            { path: 'community', element: <RepuRingCommunity /> },
                            { path: 'contributions', element: <RepuRingContributions /> },
                            { path: 'endorse', element: <RepuRingEndorse /> },
                            { path: 'leaderboard', element: <RepuRingLeaderboard /> },
                            { path: 'admin', element: <RepuRingAdmin /> },
                        ],
                    },
                    { path: '/key-management', element: <KeyManagement /> },
                    { path: '/accounts', element: <Navigate to="/key-management" replace /> },
                    { path: '/all-addresses', element: <Navigate to="/key-management" replace /> },
                ],
            },
        ],
    },
], {
    basename: import.meta.env.BASE_URL,
})

export default router
