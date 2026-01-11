import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, Zap, Building2, Landmark, Heart, Factory, ShoppingCart, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';

const industries = [
  { icon: GraduationCap, name: 'Education' },
  { icon: Zap, name: 'Energy' },
  { icon: Building2, name: 'Government' },
  { icon: Landmark, name: 'Financial' },
  { icon: Heart, name: 'Healthcare' },
  { icon: Factory, name: 'Manufacturing' },
  { icon: ShoppingCart, name: 'Retail' },
  { icon: Radio, name: 'Telecom' },
];

export function IndustriesPreview() {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
            Industries We Serve
          </span>
          <h2 className="heading-2 text-foreground mb-6">
            Trusted Across Global Industries
          </h2>
          <p className="body-large">
            We deliver tailored ServiceNow solutions for diverse sectors, 
            understanding the unique challenges and compliance requirements of each industry.
          </p>
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-12">
          {industries.map((industry, index) => (
            <div
              key={index}
              className="group flex flex-col items-center p-6 rounded-xl bg-card border border-border/50 hover:border-accent hover:shadow-soft transition-all duration-300 cursor-pointer"
            >
              <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-3 group-hover:bg-accent/10 transition-colors">
                <industry.icon className="w-7 h-7 text-muted-foreground group-hover:text-accent transition-colors" />
              </div>
              <span className="text-sm font-medium text-foreground text-center">{industry.name}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <Link to="/industries">
              View Industry Solutions
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
