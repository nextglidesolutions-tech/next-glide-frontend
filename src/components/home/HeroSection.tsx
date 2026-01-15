import { ArrowRight, CheckCircle2, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const trustBadges = [
  'Innovation-First Mindset',
  'Built for Growing Businesses',
  'Flexible Engagement Models',
  'Trusted Technology Partner',
];


export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-background overflow-hidden">
      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Decorative Lines */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-20 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent rotate-12" />
        <div className="absolute top-40 -right-20 w-[500px] h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent -rotate-12" />
        <div className="absolute bottom-40 -left-10 w-[400px] h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent rotate-6" />
        <div className="absolute bottom-60 -right-10 w-[450px] h-[1px] bg-gradient-to-r from-transparent via-primary/15 to-transparent -rotate-6" />
      </div>

      {/* Soft Gradient Accents */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            

            <h1 className="heading-1 text-primary mb-6 animate-fade-up delay-100">
              Transform Your Enterprise with{' '}
              <span className="text-accent">NextGlide</span>
            </h1>

            <p className="body-large text-muted-foreground mb-8 max-w-xl animate-fade-up delay-200">
              NextGlide Solutions delivers end-to-end ServiceNow implementations, 
              helping global enterprises streamline operations, enhance productivity, 
              and accelerate digital transformation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-up delay-300">
              <Button variant="accent" size="xl" asChild>
                <Link to="/contact">
                  Talk to an Expert
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/solutions">
                  Explore Solutions
                </Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 animate-fade-up delay-400">
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-sm font-medium">{badge}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative hidden lg:block animate-fade-up delay-300">
            <div className="relative">
              {/* Main Card */}
              <div className="bg-card rounded-2xl border border-border p-8 shadow-elevated">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                    <div className="text-3xl font-bold text-primary mb-1">10+</div>
                    <div className="text-sm text-muted-foreground">Implementations</div>
                  </div>
                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                    <div className="text-3xl font-bold text-primary mb-1">10+</div>
                    <div className="text-sm text-muted-foreground">Enterprise Clients</div>
                  </div>
                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                    <div className="text-3xl font-bold text-primary mb-1">99%</div>
                    <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
                  </div>
                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                    <div className="text-3xl font-bold text-primary mb-1">24/7</div>
                    <div className="text-sm text-muted-foreground">Global Support</div>
                  </div>
                </div>
                <div className="bg-accent/10 rounded-xl p-4 border border-accent/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                      <Play className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">ServiceNow Ecosystem</div>
                      <div className="text-xs text-muted-foreground">Complete Platform Coverage</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-accent rounded-xl p-4 shadow-elevated animate-float">
                <div className="text-accent-foreground font-bold text-lg">Elite</div>
                <div className="text-accent-foreground/80 text-xs">Partner Status</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
