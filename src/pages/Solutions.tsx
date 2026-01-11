import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Monitor,
  Server,
  Users,
  Briefcase,
  Shield,
  Boxes,
  Settings,
  LayoutDashboard,
  TrendingUp,
  CheckCircle2,
  Lightbulb,
  Globe,
  Code,
  Rocket
} from 'lucide-react';

const iconMap: Record<string, any> = {
  'ITSM': Monitor,
  'ITOM': Server,
  'CSM': Users,
  'HRSD': Briefcase,
  'GRC': Shield,
  'ITAM': Boxes,
  'App Engine': Settings,
  'Portal': LayoutDashboard,
  'SPM': TrendingUp,
  'Advisory': Lightbulb,
  'Development': Code,
  'Implementation': Rocket,
  'Support': Users,
};

export default function Solutions() {
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        const response = await fetch(`${apiUrl}/api/solutions`);
        if (response.ok) {
          const data = await response.json();
          setSolutions(data);
        }
      } catch (error) {
        console.error('Error fetching solutions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();
  }, []);

  const getIcon = (name: string, category: string) => {
    // Try to match by exact name or category
    return iconMap[name] || iconMap[category] || Lightbulb;
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              ServiceNow Solutions
            </span>
            <h1 className="heading-1 text-primary-foreground mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              Complete Platform Coverage
            </h1>
            <p className="body-large text-primary-foreground/80 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              We deliver comprehensive ServiceNow solutions across the entire
              platform ecosystem, enabling seamless digital workflows and
              operational excellence for your enterprise.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
          ) : solutions.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p>No solutions found at the moment. Please check back later.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {solutions.map((solution, index) => {
                const SolutionIcon = getIcon(solution.name, solution.category);

                return (
                  <div
                    key={solution._id || index}
                    className="group bg-card rounded-2xl overflow-hidden shadow-card border border-border/50 hover:border-accent/30 hover:shadow-card-hover transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 fill-mode-backwards"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="grid lg:grid-cols-3 gap-0 h-full">
                      {/* Left: Icon & Title */}
                      <div className="p-8 lg:border-r border-border bg-muted/5 group-hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent transition-colors duration-300">
                            <SolutionIcon className="w-7 h-7 text-accent group-hover:text-accent-foreground transition-colors" />
                          </div>
                        </div>
                        <h3 className="heading-4 text-foreground mb-2 line-clamp-2">{solution.name}</h3>
                        <p className="text-accent font-medium text-sm uppercase tracking-wide">{solution.category}</p>
                      </div>

                      {/* Middle: Description */}
                      <div className="p-8 lg:border-r border-border flex flex-col justify-between">
                        <div>
                          <p className="text-muted-foreground mb-6 leading-relaxed">
                            {solution.shortDescription}
                          </p>
                        </div>
                        <Button variant="accentOutline" size="sm" asChild className="self-start">
                          <Link to={`/solutions/${solution.slug}`}>
                            Learn More
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>

                      {/* Right: Benefits */}
                      <div className="p-8 bg-muted/10 group-hover:bg-muted/20 transition-colors">
                        <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Key Benefits</h4>
                        <ul className="space-y-3">
                          {(solution.keyFeatures || solution.problemsSolved || []).slice(0, 4).map((benefit: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                              <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{benefit}</span>
                            </li>
                          ))}
                          {(!solution.keyFeatures && !solution.problemsSolved) && (
                            <li className="text-sm text-muted-foreground italic">Details available in full view.</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <div className="bg-card rounded-2xl p-12 shadow-elevated border border-border text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -ml-32 -mb-32"></div>

            <div className="relative z-10">
              <h2 className="heading-3 text-foreground mb-4">
                Ready to Get Started?
              </h2>
              <p className="body-text max-w-2xl mx-auto mb-8">
                Let our experts help you identify the right ServiceNow solutions
                to transform your enterprise operations.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="accent" size="lg" asChild>
                  <Link to="/contact">
                    Request a Demo
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/services">
                    View Our Services
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
