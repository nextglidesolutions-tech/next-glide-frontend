import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, Zap, Building2, Landmark, Heart, Factory, ShoppingCart, Radio, MessageSquare } from 'lucide-react';
import { QuickContactModal } from '@/components/shared/QuickContactModal';

const industries = [
  {
    icon: GraduationCap,
    title: 'Education',
    description: 'Transform campus operations and student services with unified digital workflows.',
    impact: 'Streamlined student services, reduced administrative burden, enhanced campus experience.',
    solutions: ['Student Service Center', 'IT Service Management', 'Asset Management'],
  },
  {
    icon: Zap,
    title: 'Energy',
    description: 'Optimize field operations and asset management for energy and utilities.',
    impact: 'Improved field efficiency, predictive maintenance, regulatory compliance.',
    solutions: ['Field Service Management', 'ITOM', 'GRC'],
  },
  {
    icon: Building2,
    title: 'Government',
    description: 'Modernize citizen services and agency operations with secure, compliant solutions.',
    impact: 'Enhanced citizen experience, improved agency efficiency, FedRAMP compliance.',
    solutions: ['Citizen Service Portal', 'ITSM', 'Security Operations'],
  },
  {
    icon: Landmark,
    title: 'Financial Services',
    description: 'Accelerate digital transformation while maintaining regulatory compliance.',
    impact: 'Faster service delivery, reduced risk, improved compliance posture.',
    solutions: ['GRC', 'ITSM', 'Security Operations'],
  },
  {
    icon: Heart,
    title: 'Healthcare',
    description: 'Improve patient care and clinical operations with connected healthcare workflows.',
    impact: 'Better patient outcomes, streamlined clinical operations, HIPAA compliance.',
    solutions: ['Clinical Device Management', 'HR Service Delivery', 'ITSM'],
  },
  {
    icon: Factory,
    title: 'Manufacturing',
    description: 'Connect shop floor to top floor with integrated operational technology.',
    impact: 'Reduced downtime, improved quality, supply chain visibility.',
    solutions: ['ITOM', 'Asset Management', 'Field Service Management'],
  },
  {
    icon: ShoppingCart,
    title: 'Retail',
    description: 'Deliver exceptional customer experiences across all channels.',
    impact: 'Unified customer view, faster issue resolution, improved store operations.',
    solutions: ['Customer Service Management', 'ITSM', 'HR Service Delivery'],
  },
  {
    icon: Radio,
    title: 'Telecommunication',
    description: 'Transform network operations and customer service delivery.',
    impact: 'Reduced network incidents, improved customer satisfaction, faster service activation.',
    solutions: ['Telecom Service Management', 'ITOM', 'Customer Service Management'],
  },
];

export default function Industries() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-72 h-72 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
              Industries
            </span>
            <h1 className="heading-1 text-primary-foreground mb-6">
              Trusted Across Global Industries
            </h1>
            <p className="body-large text-primary-foreground/80">
              We deliver tailored ServiceNow solutions for diverse sectors,
              understanding the unique challenges, regulations, and compliance
              requirements of each industry.
            </p>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="group bg-card rounded-2xl p-8 card-shadow border border-border/50 hover:border-accent/30 transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                    <industry.icon className="w-8 h-8 text-accent group-hover:text-accent-foreground transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h3 className="heading-4 text-foreground mb-3">{industry.title}</h3>
                    <p className="text-muted-foreground mb-4">{industry.description}</p>

                    <div className="bg-muted/50 rounded-xl p-4 mb-4">
                      <h4 className="text-sm font-semibold text-foreground mb-2">Business Impact</h4>
                      <p className="text-sm text-muted-foreground">{industry.impact}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {industry.solutions.map((solution, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full"
                        >
                          {solution}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <div className="bg-card rounded-2xl p-12 shadow-elevated border border-border text-center">
            <h2 className="heading-3 text-foreground mb-4">
              Industry-Specific Solutions
            </h2>
            <p className="body-text max-w-2xl mx-auto mb-8">
              Our industry experts understand your unique challenges. Let's discuss
              how ServiceNow can transform your operations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="accent" size="lg" onClick={() => window.open('https://wa.me/7671972625?text=Hey%20hi%20i%20want%20to%20more%20about%20your%20industry%20solutions!', '_blank')}>
                <MessageSquare className="w-5 h-5 mr-2" />
                Chat on WhatsApp
              </Button>
              <Button variant="outline" size="lg" onClick={() => setModalOpen(true)}>
                <ArrowRight className="w-5 h-5 mr-2" />
                Talk to an Expert
              </Button>
            </div>
          </div>
        </div>
      </section>

      <QuickContactModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        source="Industries Page"
      />
    </Layout>
  );
}
