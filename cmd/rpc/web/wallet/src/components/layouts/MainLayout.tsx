import { Outlet } from 'react-router-dom'
import { AppSidebar } from './AppSidebar'
import { TopBar } from './TopBar'

export default function MainLayout() {
    return (
        <div className="relative min-h-dvh overflow-hidden bg-[#03120f] text-[#f2fff8]">
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_16%_0%,rgba(84,243,179,0.16),transparent_34%),linear-gradient(180deg,#03120f,#041612_40%,#020b09)]" />
            <AppSidebar />

            <div className="relative z-10 flex min-h-dvh min-w-0 flex-1 flex-col">
                <TopBar />

                <main className="relative z-10 flex-1 overflow-y-auto pt-14 lg:pt-0">
                    <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-0 lg:py-12">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}
