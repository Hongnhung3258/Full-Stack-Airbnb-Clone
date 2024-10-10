import DesktopSidebar from "./Desktopsidebar";
import MobileFooter from "./MobileFooter";

import getCurrentUser from "@/app/actions/getCurrenUser";

async function Sidebar({ children }: {
    children: React.ReactNode;
}) {
    const currentUser = await getCurrentUser();

    return (
        <div className="h-full">
            <DesktopSidebar currentUser={currentUser!} />
            <MobileFooter />
            <main className="lg:pl-20 h-full">
                {children}
            </main>
        </div>
    )
}

export default Sidebar;