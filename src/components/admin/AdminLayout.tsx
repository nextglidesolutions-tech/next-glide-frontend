import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, Briefcase, Menu, X, ChevronLeft, ChevronRight, FileText, Inbox } from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // Check auth on mount
    useEffect(() => {
        const isAuth = localStorage.getItem('adminAuth');
        if (!isAuth) {
            navigate('/admin');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminAuth');
        navigate('/admin');
    };

    const navItems = [
        { path: '/admin/dashboard', label: 'Contacts', icon: LayoutDashboard },
        { path: '/admin/services', label: 'Services', icon: Briefcase },
        { path: '/admin/service-forms', label: 'Service Forms', icon: FileText },
        { path: '/admin/applications', label: 'Applications', icon: Inbox },
        { path: '/admin/solutions', label: 'Solutions', icon: Briefcase }, // Reusing Briefcase for now, or maybe 'Lightbulb'
        { path: '/admin/solution-forms', label: 'Solution Forms', icon: FileText },
        { path: '/admin/solution-applications', label: 'Solution Apps', icon: Inbox },
    ];

    return (
        <div className="min-h-screen bg-muted/20 flex">
            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col
                    ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full'}
                `}
            >
                <div className="p-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-primary">NextGlide Admin</h2>
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)} className="md:hidden">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Button
                                key={item.path}
                                variant={isActive ? "secondary" : "ghost"}
                                className={`w-full justify-start ${isActive ? 'font-semibold' : 'text-foreground'}`}
                                onClick={() => navigate(item.path)}
                            >
                                <Icon className="w-4 h-4 mr-2" />
                                {item.label}
                            </Button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <main
                className={`flex-1 transition-all duration-300 ease-in-out min-h-screen flex flex-col
                    ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}
                `}
            >
                {/* Top Toggle Button Area */}
                <div className={`p-4 ${isSidebarOpen ? 'hidden' : 'block'}`}>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsSidebarOpen(true)}
                        className="bg-card shadow-sm"
                    >
                        <Menu className="h-4 w-4" />
                    </Button>
                </div>

                {/* Toggle Button when sidebar is open (Desktop) - Optional, maybe integrated into page? 
                    Actually, if the sidebar is open, the user might want to close it. 
                    Let's add a collapse button inside the sidebar or a floating one?
                    Use a consistent toggle button in the top-left area?
                */}

                <div className="flex-1 relative">
                    {/* 
                        If the sidebar is OPEN, we hide the external menu button to avoid clutter, 
                        assuming the user can close it from the sidebar itself?
                        Currently my sidebar design above doesn't have a close button for desktop, only for mobile (md:hidden).
                        Let's add a collapse button to the sidebar for desktop too.
                     */}
                    {/* Let's adjust the Sidebar header to have a collapse button even on desktop */}

                    {/* Or better, put the toggle button always in the main content top-left? 
                         If sidebar is open, button is at `ml-64 + padding`.
                         If sidebar is closed, button is at `ml-0 + padding`.
                     */}
                    {isSidebarOpen && (
                        <div className="absolute top-4 left-[-16px] z-50 hidden md:block">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="rounded-full shadow-md border w-8 h-8"
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    {/* If collapsed, we need the button to expand. 
                         I already added one above: "p-4 block". 
                         Let's unify.
                     */}

                    {children}
                </div>
            </main>
        </div>
    );
}
