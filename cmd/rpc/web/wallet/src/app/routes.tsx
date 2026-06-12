
import { createBrowserRouter, Navigate } from 'react-router-dom'
import MainLayout from '@/components/layouts/MainLayout'

import { KeyManagement } from '@/app/pages/KeyManagement'
import RepuRing from '@/app/pages/RepuRing'

const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            { path: '/', element: <RepuRing /> },
            { path: '/repuring', element: <Navigate to="/" replace /> },
            { path: '/key-management', element: <KeyManagement /> },
            { path: '/accounts', element: <Navigate to="/key-management" replace /> },
            { path: '/all-addresses', element: <Navigate to="/key-management" replace /> },
        ],
    },
], {
    basename: import.meta.env.BASE_URL,
})

export default router
