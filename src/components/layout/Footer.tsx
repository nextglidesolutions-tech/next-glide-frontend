import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Twitter, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const footerLinks = {
  solutions: [
    { name: 'ITSM', href: '/solutions#itsm' },
    { name: 'ITOM', href: '/solutions#itom' },
    { name: 'CSM', href: '/solutions#csm' },
    { name: 'HRSD', href: '/solutions#hrsd' },
    { name: 'GRC', href: '/solutions#grc' },
  ],
  services: [
    { name: 'Advisory Services', href: '/services#advisory' },
    { name: 'Implementations', href: '/services#implementations' },
    { name: 'Managed Support', href: '/services#managed-support' },
    { name: 'Training', href: '/services#training' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* CTA Section */}
      <div className="border-b border-primary-foreground/10">
        <div className="container-custom py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="heading-3 text-primary-foreground mb-2">
                Ready to Transform Your Enterprise?
              </h3>
              <p className="text-primary-foreground/70 text-lg">
                Let's discuss how ServiceNow can accelerate your digital journey.
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-3">
                <img
                  src="/logo trasanparent.png"
                  alt="NextGlide Solutions"
                  className="h-10 w-auto object-contain brightness-0 invert"
                />
                <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">
                  Next Glide
                </span>
              </div>
            </div>
            <p className="text-primary-foreground/70 mb-6 max-w-sm">
              Premier ServiceNow partner delivering enterprise digital transformation
              solutions for global organizations.
            </p>
            <div className="space-y-3">
              <a href="mailto:info@nextglide.com" className="flex items-center gap-3 text-primary-foreground/70 hover:text-accent transition-colors">
                <Mail className="w-5 h-5" />
                info@nextglide.com
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-3 text-primary-foreground/70 hover:text-accent transition-colors">
                <Phone className="w-5 h-5" />
                +1 (234) 567-890
              </a>
              <div className="flex items-center gap-3 text-primary-foreground/70">
                <MapPin className="w-5 h-5" />
                Global Offices
              </div>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Solutions</h4>
            <ul className="space-y-3">
              {footerLinks.solutions.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex gap-4 mt-6">
              <a href="#" className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-accent transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-accent transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
            <p>© 2024 NextGlide Solutions Private Limited. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
