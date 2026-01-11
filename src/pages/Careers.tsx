import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, MapPin, Clock, TrendingUp, Users, Award, Heart, Zap } from 'lucide-react';

const benefits = [
  {
    icon: TrendingUp,
    title: 'Career Growth',
    description: 'Structured career paths with mentorship and certification support.',
  },
  {
    icon: Users,
    title: 'Collaborative Culture',
    description: 'Work with talented professionals in a supportive environment.',
  },
  {
    icon: Award,
    title: 'Industry Recognition',
    description: 'Be part of a ServiceNow Elite Partner organization.',
  },
  {
    icon: Heart,
    title: 'Work-Life Balance',
    description: 'Flexible work arrangements and comprehensive wellness programs.',
  },
];

const openings = [
  {
    title: 'Senior ServiceNow Developer',
    department: 'Engineering',
    location: 'Remote / Hybrid',
    type: 'Full-time',
    experience: '5+ years',
  },
  {
    title: 'ServiceNow Architect',
    department: 'Consulting',
    location: 'Remote / Hybrid',
    type: 'Full-time',
    experience: '8+ years',
  },
  {
    title: 'ITSM Consultant',
    department: 'Consulting',
    location: 'Remote',
    type: 'Full-time',
    experience: '3+ years',
  },
  {
    title: 'Project Manager',
    department: 'Delivery',
    location: 'Remote / Hybrid',
    type: 'Full-time',
    experience: '5+ years',
  },
  {
    title: 'Business Analyst',
    department: 'Consulting',
    location: 'Remote',
    type: 'Full-time',
    experience: '3+ years',
  },
  {
    title: 'ServiceNow Administrator',
    department: 'Operations',
    location: 'Remote',
    type: 'Full-time',
    experience: '2+ years',
  },
];

export default function Careers() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-10 left-20 w-72 h-72 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
              Careers
            </span>
            <h1 className="heading-1 text-primary-foreground mb-6">
              Build Your Career With Us
            </h1>
            <p className="body-large text-primary-foreground/80">
              Join a team of passionate professionals driving digital transformation 
              for global enterprises. Grow your career while making an impact.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
              Why Join Us
            </span>
            <h2 className="heading-2 text-foreground mb-6">
              A Great Place to Work
            </h2>
            <p className="body-large">
              We invest in our people with competitive benefits, continuous 
              learning opportunities, and a culture that celebrates innovation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-card border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
              Open Positions
            </span>
            <h2 className="heading-2 text-foreground mb-6">
              Current Opportunities
            </h2>
            <p className="body-large">
              Explore our current openings and find the role that matches your 
              skills and career aspirations.
            </p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {openings.map((job, index) => (
              <div
                key={index}
                className="group bg-card rounded-xl p-6 card-shadow border border-border/50 hover:border-accent/30 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.type}
                      </span>
                      <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                        {job.experience}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/contact">
                      Apply Now
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="bg-primary rounded-2xl p-12 text-center">
            <Zap className="w-12 h-12 text-accent mx-auto mb-6" />
            <h2 className="heading-3 text-primary-foreground mb-4">
              Don't See the Right Role?
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              We're always looking for talented individuals. Send us your resume 
              and we'll reach out when a matching opportunity arises.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">
                Submit Your Resume
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
