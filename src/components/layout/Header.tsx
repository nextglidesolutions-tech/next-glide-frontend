import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'About Us', href: '/about' },
  { name: 'Solutions', href: '/solutions' },
  { name: 'Services', href: '/services' },
  { name: 'Industries', href: '/industries' },
  { name: 'Social Connects', href: '/social-connects' },
  { name: 'Careers', href: '/careers' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [services, setServices] = useState<any[]>([]);
  const [solutions, setSolutions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

        // Fetch Services
        const resServices = await fetch(`${apiUrl}/api/services`);
        if (resServices.ok) {
          const data = await resServices.json();
          setServices(data);
        }

        // Fetch Solutions
        const resSolutions = await fetch(`${apiUrl}/api/solutions`);
        if (resSolutions.ok) {
          const data = await resSolutions.json();
          setSolutions(data);
        }
      } catch (error) {
        console.error('Error fetching menu data:', error);
      }
    };
    fetchData();
  }, []);

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div className="container-custom">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-0">
            <img
              src="/logo trasanparent.png"
              alt="NextGlide Solutions"
              className="h-[71px] w-auto object-contain"
            />
            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500 -ml-4">
              NextGlide
            </span>
          </Link>



          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => {
              const isDropdown = item.name === 'Services' || item.name === 'Solutions';
              const items = item.name === 'Services' ? services : solutions;

              if (isDropdown) {
                return (
                  <div key={item.name} className="relative group">
                    <Link
                      to={item.href}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 group-hover:bg-muted transition-colors',
                        isActive(item.href)
                          ? 'text-accent'
                          : 'text-foreground/80 hover:text-foreground'
                      )}
                    >
                      {item.name}
                      <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                    </Link>

                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-0 w-64 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                      <div className="bg-card border border-border/50 shadow-xl rounded-xl p-2 overflow-hidden">
                        {items.length > 0 ? (
                          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                            {items.map((subItem) => (
                              <Link
                                key={subItem._id}
                                to={`${item.href}/${subItem.slug}`}
                                className="block px-4 py-3 text-sm rounded-lg hover:bg-muted/80 hover:text-accent transition-colors truncate"
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-sm text-muted-foreground text-center">
                            Loading...
                          </div>
                        )}
                        <div className="border-t border-border mt-1 pt-1">
                          <Link
                            to={item.href}
                            className="block px-4 py-2 text-xs font-semibold uppercase tracking-wider text-accent hover:underline text-center"
                          >
                            View All {item.name}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium',
                    isActive(item.href)
                      ? 'text-accent bg-accent/10'
                      : 'text-foreground/80 hover:text-foreground hover:bg-muted'
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="accent" size="default" onClick={() => window.open('https://api.whatsapp.com/send/?phone=7671972625&text=Hey+hi+i+want+to+more+about+your+solution%21&type=phone_number&app_absent=0', '_blank')}>
              Talk to an Expert
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 right-0 bg-card border-t border-border">
            <div className="container-custom py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'block px-4 py-3 rounded-lg text-sm font-medium',
                    isActive(item.href)
                      ? 'text-accent bg-accent/10'
                      : 'text-foreground/80 hover:text-foreground hover:bg-muted'
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 pb-2">
                <Button variant="accent" size="lg" className="w-full" onClick={() => {
                  window.open('https://api.whatsapp.com/send/?phone=7671972625&text=Hey+hi+i+want+to+more+about+your+solution%21&type=phone_number&app_absent=0', '_blank');
                  setIsMobileMenuOpen(false);
                }}>
                  Talk to an Expert
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
