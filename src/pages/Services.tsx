import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Loader2, Lightbulb, Code, Brain, Rocket, Link2, Headphones, Globe, GraduationCap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

// Mapping categories to icons for visual consistency
const iconMap: any = {
  'Advisory': Lightbulb,
  'Development': Code,
  'AI': Brain,
  'Implementation': Rocket,
  'Integration': Link2,
  'Support': Headphones,
  'Remote': Globe,
  'Training': GraduationCap,
};

// Fallback icon
const DefaultIcon = Lightbulb;

export default function Services() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        const response = await fetch(`${apiUrl}/api/services`);
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        }
      } catch (error) {
        console.error('Failed to fetch services', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
              Our Services
            </span>
            <h1 className="heading-1 text-primary-foreground mb-6">
              Comprehensive ServiceNow Expertise
            </h1>
            <p className="body-large text-primary-foreground/80">
              From strategic advisory to ongoing managed support, we deliver
              end-to-end services that maximize your ServiceNow investment and
              drive business transformation.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-accent" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold">No services found.</h3>
              <p className="text-muted-foreground mt-2">Check back later for our updated offerings.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => {
                const Icon = iconMap[service.category] || DefaultIcon;
                return (
                  <Card key={service._id} className="flex flex-col h-full border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-lg">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 text-accent">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-accent uppercase tracking-wider">{service.category}</span>
                        <CardTitle className="text-xl">{service.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-muted-foreground line-clamp-3">
                        {service.shortDescription}
                      </p>
                      {service.startingPrice && (
                        <p className="mt-4 text-sm font-medium text-foreground">
                          Starts from <span className="text-accent">{service.startingPrice}</span>
                        </p>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant="outline" asChild>
                        <Link to={`/services/${service.slug}`}>
                          {service.ctaText || 'Learn More'} <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <div className="bg-card rounded-2xl p-12 shadow-elevated border border-border text-center">
            <h2 className="heading-3 text-foreground mb-4">
              Need a Custom Solution?
            </h2>
            <p className="body-text max-w-2xl mx-auto mb-8">
              Our team of certified experts can help you identify the right services
              to meet your unique business requirements. Let's discuss your needs.
            </p>
            <Button variant="accent" size="lg" asChild>
              <Link to="/contact">
                Talk to an Expert
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
