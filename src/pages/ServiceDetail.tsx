import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    CheckCircle2,
    ArrowRight,
    Loader2,
    Building2,
    Users,
    Clock,
    ShieldCheck,
    Quote,
    Award,
    Code
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ServiceDetail() {
    const { slug } = useParams();
    const [service, setService] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isApplyOpen, setIsApplyOpen] = useState(false);
    const [applyLoading, setApplyLoading] = useState(false);

    // Application Form State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        contactNumber: '',
        company: '',
        estimatedBudget: '',
        source: '',
        requirements: ''
    });
    const [customData, setCustomData] = useState<any>({});

    const { toast } = useToast();

    useEffect(() => {
        const fetchService = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
                const response = await fetch(`${apiUrl}/api/services/${slug}`);
                if (response.ok) {
                    const data = await response.json();
                    setService(data);
                } else {
                    // Handle 404
                    setService(null);
                }
            } catch (error) {
                console.error('Error fetching service:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [slug]);

    const handleApplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApplyLoading(true);

        // Format custom responses
        const customResponses = Object.entries(customData).map(([key, value]) => ({
            question: key,
            answer: value
        }));

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/services/inquiry`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    serviceId: service._id,
                    serviceName: service.name,
                    phone: formData.contactNumber,
                    customResponses // Send custom data
                }),
            });

            if (response.ok) {
                toast({
                    title: "Application Received!",
                    description: "We'll review your details and get back to you shortly.",
                });
                setIsApplyOpen(false);
                setFormData({
                    fullName: '',
                    email: '',
                    contactNumber: '',
                    company: '',
                    estimatedBudget: '',
                    source: '',
                    requirements: ''
                });
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to submit application. Please try again.",
            });
        } finally {
            setApplyLoading(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-primary" /></div>;
    if (!service) return <Layout><div className="container-custom py-20 text-center"><h1 className="text-3xl font-bold">Service Not Found</h1><Button asChild className="mt-4"><Link to="/services">Back to Services</Link></Button></div></Layout>;

    return (
        <Layout>
            {/* HERO SECTION */}
            <section className="pt-32 pb-10 hero-gradient relative">
                <div className="container-custom relative z-10">
                    <div className="max-w-4xl">
                        <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-semibold mb-6">
                            {service.category}
                        </span>
                        <h1 className="heading-1 text-primary-foreground mb-6">
                            {service.name}
                        </h1>
                        <p className="body-large text-primary-foreground/80 mb-8 max-w-2xl">
                            {service.shortDescription}
                        </p>
                        <div className="flex gap-4">
                            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setIsApplyOpen(true)}>
                                {service.ctaText || 'Apply Now'}
                            </Button>
                            {service.consultationAvailability && (
                                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                                    <Link to="/contact">Book Free Consultation</Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* OVERVIEW & PROBLEM SOLVING */}
            {service.isOverviewVisible !== false && <section className="py-6 md:py-10">
                <div className="container-custom grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="heading-2 mb-6">Overview</h2>
                        <div className="prose prose-lg text-muted-foreground whitespace-pre-wrap">
                            {service.detailedDescription}
                        </div>

                        <div className="mt-8 space-y-4">
                            <h3 className="font-bold text-lg">Problems We Solve</h3>
                            <ul className="space-y-2">
                                {service.problemsSolved?.map((prob: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
                                        <span>{prob}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="bg-muted/30 p-8 rounded-2xl border border-border">
                        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-accent" /> Who Is This For?
                        </h3>
                        <ul className="space-y-3">
                            {service.targetAudience?.map((audience: string, i: number) => (
                                <li key={i} className="flex items-center gap-3 text-muted-foreground">
                                    <span className="w-2 h-2 rounded-full bg-accent" />
                                    {audience}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>}

            {/* OFFERING DETAILS */}
            {service.isOfferingVisible !== false && <section className="py-6 md:py-10 bg-muted/20">
                <div className="container-custom">
                    <h2 className="heading-2 text-center mb-12">What's Included</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Features */}
                        <div className="bg-card p-6 rounded-xl shadow-sm">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                                <Award className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-4">Key Features</h3>
                            <ul className="space-y-2">
                                {service.keyFeatures?.map((f: string, i: number) => (
                                    <li key={i} className="text-sm text-muted-foreground border-b border-dashed pb-2 last:border-0">
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Coverage */}
                        <div className="bg-card p-6 rounded-xl shadow-sm">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-4">Coverage Areas</h3>
                            <ul className="space-y-2">
                                {service.coverageAreas?.map((f: string, i: number) => (
                                    <li key={i} className="text-sm text-muted-foreground border-b border-dashed pb-2 last:border-0">
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Tech Stack */}
                        <div className="bg-card p-6 rounded-xl shadow-sm">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                                <Code className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-4">Tools & Tech</h3>
                            <div className="flex flex-wrap gap-2">
                                {service.technologies?.map((f: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-muted rounded-full text-xs font-medium">
                                        {f}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>}

            {/* CREDIBILITY & EXPERIENCE */}
            {service.isExperienceVisible !== false && <section className="py-6 md:py-10">
                <div className="container-custom">
                    <div className="grid md:grid-cols-4 gap-6 text-center mb-16">
                        <div className="p-6 border rounded-xl">
                            <div className="text-3xl font-bold text-accent mb-2">{service.yearsExperience}</div>
                            <div className="text-sm text-muted-foreground">Years Experience</div>
                        </div>
                        <div className="p-6 border rounded-xl">
                            <div className="text-3xl font-bold text-accent mb-2">{service.projectsCompleted}</div>
                            <div className="text-sm text-muted-foreground">Projects Delivered</div>
                        </div>
                        <div className="col-span-2 p-6 border rounded-xl text-left">
                            <div className="font-bold mb-2">Industries Served</div>
                            <div className="flex flex-wrap gap-2">
                                {service.industriesServed?.map((ind: string, i: number) => (
                                    <span key={i} className="text-sm bg-muted px-2 py-1 rounded">{ind}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>}

            {/* DELIVERY & COMMERCIALS (Fixed Section) */}
            {(service.isDeliveryVisible !== false) && (service.timeline || service.pricingModel || service.supportDetails) && (
                <section className="py-6 md:py-10 bg-muted/10">
                    <div className="container-custom">
                        <h2 className="heading-2 mb-8">Delivery & Commercials</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-card p-6 rounded-xl border">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-blue-500" /> Timeline & Pricing
                                </h3>
                                <div className="space-y-4">
                                    {service.timeline && (
                                        <div>
                                            <span className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Typical Timeline</span>
                                            <p className="text-lg">{service.timeline}</p>
                                        </div>
                                    )}
                                    {service.pricingModel && (
                                        <div>
                                            <span className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Pricing Model</span>
                                            <p className="text-lg">{service.pricingModel}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {service.supportDetails && (
                                <div className="bg-card p-6 rounded-xl border">
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                        <ShieldCheck className="w-5 h-5 text-green-500" /> Support & Assurance
                                    </h3>
                                    <p className="text-muted-foreground whitespace-pre-wrap">{service.supportDetails}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* TRUST & PROOF (Fixed Section) */}
            {(service.isTrustVisible !== false) && (service.caseStudies || (service.certifications && service.certifications.length > 0) || (service.partnerships && service.partnerships.length > 0)) && (
                <section className="py-6 md:py-10">
                    <div className="container-custom">
                        <h2 className="heading-2 mb-8">Why Trust Us?</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {service.caseStudies && (
                                <div className="md:col-span-3 bg-blue-50 p-6 rounded-xl border border-blue-100">
                                    <h3 className="font-bold text-lg mb-2 text-blue-900">Case Studies / Proof</h3>
                                    <p className="text-blue-800">{service.caseStudies}</p>
                                </div>
                            )}
                            {service.certifications && service.certifications.length > 0 && (
                                <div className="bg-card p-6 rounded-xl border">
                                    <h3 className="font-bold text-lg mb-4">Certifications</h3>
                                    <ul className="space-y-2">
                                        {service.certifications.map((c: string, i: number) => (
                                            <li key={i} className="flex items-center gap-2 text-muted-foreground">
                                                <Award className="w-4 h-4 text-amber-500" /> {c}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {service.partnerships && service.partnerships.length > 0 && (
                                <div className="bg-card p-6 rounded-xl border">
                                    <h3 className="font-bold text-lg mb-4">Partnerships</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {service.partnerships.map((p: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-muted rounded-full text-sm">{p}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {service.securityDetails && (
                                <div className="bg-card p-6 rounded-xl border">
                                    <h3 className="font-bold text-lg mb-4">Security Standards</h3>
                                    <p className="text-sm text-muted-foreground">{service.securityDetails}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* DYNAMIC SECTIONS */}
            {(service.dynamicSections || [])
                .filter((section: any) => section.isVisible !== false)
                .map((section: any, idx: number) => (
                    <section key={idx} className={`py-6 md:py-10 ${idx % 2 === 0 ? 'bg-muted/10' : 'bg-background'}`}>
                        <div className="container-custom">
                            {section.title && <h2 className="heading-2 mb-8">{section.title}</h2>}

                            {/* Layout: Full Width Text */}
                            {section.layoutType === 'full-width' && (
                                <div className="space-y-8">
                                    {(section.fields || []).map((field: any, fIdx: number) => (
                                        <div key={fIdx}>
                                            {field.label && <h3 className="text-xl font-bold mb-3">{field.label}</h3>}
                                            <div className="prose prose-lg text-muted-foreground whitespace-pre-wrap">
                                                {Array.isArray(field.value) ? field.value.join('\n') : (field.value === true ? 'Yes' : field.value === false ? 'No' : field.value)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Layout: 2 Column Grid */}
                            {section.layoutType === 'grid-2' && (
                                <div className="grid md:grid-cols-2 gap-8">
                                    {(section.fields || []).map((field: any, fIdx: number) => (
                                        <div key={fIdx} className="bg-card p-6 rounded-xl border shadow-sm">
                                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">{field.label}</h3>
                                            <div className="font-medium text-lg">
                                                {Array.isArray(field.value) ? (
                                                    <ul className="list-disc list-inside">
                                                        {field.value.map((v: string, vIdx: number) => <li key={vIdx}>{v}</li>)}
                                                    </ul>
                                                ) : (
                                                    <p>{field.value === true ? 'Yes' : field.value === false ? 'No' : field.value}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Layout: Checklist */}
                            {section.layoutType === 'checklist' && (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {(section.fields || []).map((field: any, fIdx: number) => (
                                        <div key={fIdx} className="flex items-start gap-3 p-4 bg-white rounded-lg border">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <div className="font-bold">{field.label}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {Array.isArray(field.value) ? field.value.join(', ') : (field.value === true ? 'Available' : field.value)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Layout: Info Cards */}
                            {section.layoutType === 'cards' && (
                                <div className="grid md:grid-cols-3 gap-6">
                                    {(section.fields || []).map((field: any, fIdx: number) => (
                                        <div key={fIdx} className="bg-card p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                                            <h3 className="font-bold text-lg mb-3 pb-3 border-b">{field.label}</h3>
                                            <div className="text-muted-foreground">
                                                {Array.isArray(field.value) ? (
                                                    <ul className="space-y-2">
                                                        {field.value.map((v: string, vIdx: number) => (
                                                            <li key={vIdx} className="flex items-center gap-2">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                                                {v}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p>{field.value}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                ))}

            {/* TESTIMONIALS */}
            {(service.isTestimonialsVisible !== false) && service.testimonials && service.testimonials.length > 0 && (
                <section className="py-6 md:py-10 bg-primary text-primary-foreground">
                    <div className="container-custom">
                        <h2 className="heading-2 text-center mb-12">Client Success</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {service.testimonials.map((t: any, i: number) => (
                                <div key={i} className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                                    <Quote className="w-8 h-8 text-accent mb-4 opacity-50" />
                                    <p className="mb-4 italic">"{t.comment}"</p>
                                    <div>
                                        <div className="font-bold">{t.name}</div>
                                        <div className="text-sm opacity-70">{t.role}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* FAQs Section */}
            {(service.isFaqsVisible !== false) && service.faqs && service.faqs.length > 0 && (
                <section className="py-6 md:py-10 bg-background">
                    <div className="container-custom max-w-4xl">
                        <h2 className="heading-2 text-center mb-12">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            {service.faqs.map((f: any, i: number) => (
                                <div key={i} className="border border-border rounded-xl p-6 hover:shadow-sm transition-shadow">
                                    <h3 className="font-bold text-lg mb-2 text-foreground">{f.question}</h3>
                                    <p className="text-muted-foreground whitespace-pre-wrap">{f.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* APPLY SECTION (Bottom CTA) */}
            {service.isCtaVisible !== false && <section className="py-6 md:py-10 bg-muted/30">
                <div className="container-custom text-center">
                    <h2 className="heading-2 mb-4">Ready to Transform?</h2>
                    <p className="mb-8 text-lg text-muted-foreground">
                        {service.nextSteps || "Take the next step. Our team is ready to help you implement this solution."}
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button size="lg" className="text-lg px-8" onClick={() => setIsApplyOpen(true)}>
                            {service.ctaText || 'Apply Now'} <ArrowRight className="ml-2" />
                        </Button>
                        {service.secondaryCta && (
                            <Button size="lg" variant="outline" className="text-lg px-8">
                                {service.secondaryCta}
                            </Button>
                        )}
                    </div>
                </div>
            </section>}

            {/* APPLICATION MODAL */}
            <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Apply for {service.name}</DialogTitle>
                        <p className="text-sm text-muted-foreground">Please fill out the details below. We'll respond within 24 hours.</p>
                    </DialogHeader>

                    <form onSubmit={handleApplySubmit} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name *</Label>
                                <Input id="fullName" required value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address *</Label>
                                <Input id="email" type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="contactNumber">Contact Number *</Label>
                                <Input id="contactNumber" required value={formData.contactNumber} onChange={e => setFormData({ ...formData, contactNumber: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company">Company / Organization</Label>
                                <Input id="company" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Service Selected</Label>
                            <Input value={service.name} disabled className="bg-muted" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="budget">Estimated Budget</Label>
                                <Input id="budget" placeholder="e.g. $5k - $10k" value={formData.estimatedBudget} onChange={e => setFormData({ ...formData, estimatedBudget: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="source">How did you hear about us?</Label>
                                <Input id="source" value={formData.source} onChange={e => setFormData({ ...formData, source: e.target.value })} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="requirements">Brief Requirements / Project Description *</Label>
                            <Textarea
                                id="requirements"
                                required
                                rows={4}
                                placeholder="Tell us about your goals, timeline, and any specific challenges..."
                                value={formData.requirements}
                                onChange={e => setFormData({ ...formData, requirements: e.target.value })}
                            />
                        </div>

                        {/* DYNAMIC FORM FIELDS */}
                        {service.inquiryFormFields && service.inquiryFormFields.filter((f: any) => f.isVisible !== false).length > 0 && (
                            <div className="space-y-4 pt-4 border-t border-dashed">
                                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Additional Questions</h4>
                                {service.inquiryFormFields
                                    .filter((field: any) => field.isVisible !== false)
                                    .map((field: any, idx: number) => (
                                        <div key={idx} className="space-y-2">
                                            <Label>
                                                {field.label} {field.required && <span className="text-red-500">*</span>}
                                            </Label>

                                            {field.fieldType === 'textarea' ? (
                                                <Textarea
                                                    required={field.required}
                                                    placeholder={field.placeholder}
                                                    value={customData[field.label] || ''}
                                                    onChange={(e) => setCustomData({ ...customData, [field.label]: e.target.value })}
                                                />
                                            ) : field.fieldType === 'dropdown' ? (
                                                <select
                                                    required={field.required}
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    value={customData[field.label] || ''}
                                                    onChange={(e) => setCustomData({ ...customData, [field.label]: e.target.value })}
                                                >
                                                    <option value="">Select an option...</option>
                                                    {(field.options || []).map((opt: string, i: number) => <option key={i} value={opt}>{opt}</option>)}
                                                </select>
                                            ) : (
                                                <Input
                                                    required={field.required}
                                                    placeholder={field.placeholder}
                                                    value={customData[field.label] || ''}
                                                    onChange={(e) => setCustomData({ ...customData, [field.label]: e.target.value })}
                                                />
                                            )}
                                        </div>
                                    ))}
                            </div>
                        )}

                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsApplyOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={applyLoading}>
                                {applyLoading ? <Loader2 className="animate-spin mr-2" /> : 'Submit Application'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Layout>
    );
}
