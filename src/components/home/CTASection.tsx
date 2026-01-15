import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuickContactModal } from '@/components/shared/QuickContactModal';

export function CTASection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="section-padding hero-gradient relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-20 w-64 h-64 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-primary-foreground/20 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="heading-2 text-primary-foreground mb-6">
            Ready to Accelerate Your Digital Transformation?
          </h2>
          <p className="body-large text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Partner with NextGlide Solutions to unlock the full potential of
            ServiceNow. Our experts are ready to help you achieve operational
            excellence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl" onClick={() => window.open('https://wa.me/7671972625?text=Hey%20hi%20i%20want%20to%20more%20about%20your%20services!', '_blank')}>
              <MessageSquare className="w-5 h-5 mr-2" />
              Chat on WhatsApp
            </Button>
            <Button variant="heroOutline" size="xl" onClick={() => setModalOpen(true)}>
              <Calendar className="w-5 h-5 mr-2" />
              Quick Request
            </Button>
          </div>
        </div>
      </div>

      <QuickContactModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        source="Home CTA"
      />
    </section>
  );
}
