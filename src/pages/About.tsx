import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Eye, Award, Users, Globe, CheckCircle2 } from 'lucide-react';

const stats = [
  { value: '500+', label: 'Successful Implementations' },
  { value: '50+', label: 'Enterprise Clients' },
  { value: '200+', label: 'Certified Experts' },
  { value: '15+', label: 'Years Experience' },
];

const values = [
  {
    icon: Target,
    title: 'Client-Centric',
    description: 'We prioritize our clients\' success, delivering solutions that drive measurable business outcomes.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We maintain the highest standards in every engagement, from strategy to execution.',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'We work as true partners, fostering transparent communication and shared goals.',
  },
  {
    icon: Globe,
    title: 'Innovation',
    description: 'We continuously evolve, leveraging cutting-edge ServiceNow capabilities.',
  },
];

export default function About() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
              About Us
            </span>
            <h1 className="heading-1 text-primary-foreground mb-6">
              Your Trusted ServiceNow Partner
            </h1>
            <p className="body-large text-primary-foreground/80">
              NextGlide Solutions Private Limited is a premier ServiceNow consulting 
              partner, delivering enterprise digital transformation solutions to 
              global organizations across industries.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-b border-border">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-accent" />
              </div>
              <h3 className="heading-3 text-foreground mb-4">Our Mission</h3>
              <p className="body-text">
                To empower enterprises with innovative ServiceNow solutions that 
                streamline operations, enhance productivity, and accelerate digital 
                transformation, enabling our clients to achieve sustainable competitive 
                advantage in an ever-evolving business landscape.
              </p>
            </div>
            <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-accent" />
              </div>
              <h3 className="heading-3 text-foreground mb-4">Our Vision</h3>
              <p className="body-text">
                To be the global leader in ServiceNow consulting, recognized for 
                delivering exceptional value, fostering innovation, and building 
                lasting partnerships that drive enterprise success across industries 
                and geographies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
              Our Values
            </span>
            <h2 className="heading-2 text-foreground mb-6">
              Principles That Guide Us
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-accent" />
                </div>
                <h4 className="heading-4 text-foreground mb-2">{value.title}</h4>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
                Why NextGlide
              </span>
              <h2 className="heading-2 text-foreground mb-6">
                Enterprise-Grade Expertise You Can Trust
              </h2>
              <p className="body-large mb-8">
                With a team of certified ServiceNow professionals and a proven 
                track record across Fortune 500 companies, we deliver solutions 
                that scale.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'ServiceNow Elite Partner status',
                  'Certified implementation specialists',
                  'Industry-specific expertise',
                  '24/7 global support coverage',
                  'Agile delivery methodology',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Button variant="accent" size="lg" asChild>
                <Link to="/contact">
                  Partner With Us
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="bg-card rounded-2xl p-8 shadow-elevated border border-border">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-muted rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-foreground mb-1">98%</div>
                    <div className="text-sm text-muted-foreground">On-time Delivery</div>
                  </div>
                  <div className="bg-muted rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-foreground mb-1">99%</div>
                    <div className="text-sm text-muted-foreground">Client Retention</div>
                  </div>
                  <div className="bg-muted rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-foreground mb-1">4.9/5</div>
                    <div className="text-sm text-muted-foreground">Client Rating</div>
                  </div>
                  <div className="bg-muted rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-foreground mb-1">100+</div>
                    <div className="text-sm text-muted-foreground">Certifications</div>
                  </div>
                </div>
              </div>
              <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full rounded-2xl bg-accent/10" />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
