import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, MessageSquare, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email Us',
    details: 'info@nextglide.com',
    description: 'Get a response within 24 hours',
  },
  {
    icon: Phone,
    title: 'Call Us',
    details: '+1 (234) 567-890',
    description: 'Mon-Fri from 9am to 6pm',
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    details: 'Global Offices',
    description: 'USA • UK • India • Singapore',
  },
];

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      console.log('🚀 Attempting to POST to:', `${apiUrl}/api/contacts`);
      console.log('📦 Data:', formData);

      const response = await fetch(`${apiUrl}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        toast({
          title: "Message Sent Successfully!",
          description: "Please check your email for more details.",
        });
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Network error. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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
              Contact Us
            </span>
            <h1 className="heading-1 text-primary-foreground mb-6">
              Let's Start a Conversation
            </h1>
            <p className="body-large text-primary-foreground/80">
              Whether you're ready to transform your enterprise or just exploring
              options, our team is here to help. Reach out today.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-card border-b border-border">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-6">
            {contactInfo.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-foreground font-medium">{item.details}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Form */}
            <div>
              <h2 className="heading-3 text-foreground mb-2">Send Us a Message</h2>
              <p className="text-muted-foreground mb-8">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>

              {isSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center animate-fade-up">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 mb-2">Message Sent Successfully!</h3>
                  <p className="text-green-700 mb-6">
                    Thank you for reaching out. Please check your email for more details.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setIsSuccess(false)}
                    className="border-green-200 text-green-700 hover:bg-green-100"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address *
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@company.com"
                        required
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Company Name
                      </label>
                      <Input
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Your Company"
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (234) 567-890"
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Subject *
                    </label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      required
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your project or requirements..."
                      required
                      rows={5}
                    />
                  </div>

                  <Button variant="accent" size="lg" type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
                </form>
              )}
            </div>

            {/* Right Side */}
            <div>
              <div className="bg-card rounded-2xl p-8 shadow-card border border-border mb-8">
                <h3 className="heading-4 text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-4">
                  <button className="w-full flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-accent/10 hover:border-accent border border-transparent transition-all text-left group">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent transition-colors">
                      <MessageSquare className="w-6 h-6 text-accent group-hover:text-accent-foreground transition-colors" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">Talk to an Expert</div>
                      <div className="text-sm text-muted-foreground">Get personalized guidance</div>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-accent/10 hover:border-accent border border-transparent transition-all text-left group">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent transition-colors">
                      <Calendar className="w-6 h-6 text-accent group-hover:text-accent-foreground transition-colors" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">Request a Demo</div>
                      <div className="text-sm text-muted-foreground">See our solutions in action</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="bg-muted/50 rounded-2xl p-8">
                <h3 className="heading-4 text-foreground mb-4">What Happens Next?</h3>
                <ul className="space-y-4">
                  {[
                    'Our team reviews your inquiry within 2 hours',
                    'A solutions expert reaches out within 24 hours',
                    'We schedule a discovery call to understand your needs',
                    'You receive a tailored proposal and roadmap',
                  ].map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
