import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowRight, Briefcase, MapPin, Clock, TrendingUp, Users, Award, Heart, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

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

interface Job {
  _id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
}

interface Field {
  id: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export default function Careers() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [formFields, setFormFields] = useState<Field[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/jobs`);
      if (res.ok) setJobs(await res.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (job: Job) => {
    setSelectedJob(job);
    setFormLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/forms/${job._id}`);
      if (res.ok) {
        const data = await res.json();
        setFormFields(data.fields || []);
        setFormData({});
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate submission for now
    setTimeout(() => {
      setSubmitting(false);
      setSelectedJob(null);
      toast({
        title: 'Application Submitted',
        description: 'Thank you for your interest! We will review your application soon.'
      });
    }, 1500);
  };

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

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

          <div className="space-y-4 max-w-4xl mx-auto min-h-[400px]">
            {loading ? (
              <p className="text-center text-muted-foreground">Loading open positions...</p>
            ) : jobs.length === 0 ? (
              <p className="text-center text-muted-foreground">No current openings. Check back later!</p>
            ) : (
              jobs.map((job) => (
                <div
                  key={job._id}
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
                    <Button variant="outline" size="sm" onClick={() => handleApply(job)}>
                      Apply Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ))
            )}
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

      {/* Application Form Modal */}
      <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
          </DialogHeader>

          {formLoading ? (
            <div className="py-8 text-center">Loading application form...</div>
          ) : formFields.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <p>No application form configured for this position.</p>
              <Button className="mt-4" onClick={() => setSelectedJob(null)}>Close</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              {formFields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id}>
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </Label>

                  {field.type === 'textarea' ? (
                    <Textarea
                      id={field.id}
                      placeholder={field.placeholder}
                      required={field.required}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                    />
                  ) : (
                    <Input
                      id={field.id}
                      type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : 'text'}
                      placeholder={field.placeholder}
                      required={field.required}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                    />
                  )}
                </div>
              ))}

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setSelectedJob(null)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
