import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { QuickContactModal } from '@/components/shared/QuickContactModal';
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Clock,
    CreditCard,
    Target,
    ShieldCheck,
    HelpCircle,
    MessageSquare,
    ChevronDown,
    ChevronUp,
    Star,
    Loader2
} from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
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
import { useToast } from '@/hooks/use-toast';

export default function SolutionDetail() {
    const { slug } = useParams();
    const [solution, setSolution] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    // Application Form State
    const [isApplyOpen, setIsApplyOpen] = useState(false);
    const [applyLoading, setApplyLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        estimatedBudget: '',
        source: '',
        requirements: ''
    });
    const [customData, setCustomData] = useState<any>({});
    const { toast } = useToast();

    useEffect(() => {
        const fetchSolution = async () => {
            setLoading(true);
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
                const response = await fetch(`${apiUrl}/api/solutions/${slug}`);
                if (response.ok) {
                    const data = await response.json();
                    setSolution(data);
                } else {
                    setError('Solution not found');
                }
            } catch (err) {
                console.error('Error fetching solution:', err);
                setError('Failed to load solution details');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchSolution();
        }
    }, [slug]);

    const handleApplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApplyLoading(true);

        const customResponses = Object.entries(customData).map(([key, value]) => ({
            question: key,
            answer: value
        }));

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/solutions/inquiry`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    solutionId: solution._id,
                    solutionName: solution.name,
                    customResponses
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
                    phone: '',
                    company: '',
                    estimatedBudget: '',
                    source: '',
                    requirements: ''
                });
                setCustomData({});
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

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                </div>
            </Layout>
        );
    }

    if (error || !solution) {
        return (
            <Layout>
                <div className="min-h-screen flex flex-col justify-center items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-800">{error || 'Solution not found'}</h1>
                    <Button asChild>
                        <Link to="/solutions">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Solutions
                        </Link>
                    </Button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* HERO SECTION */}
            <section className="pt-32 pb-20 hero-gradient relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
                </div>
                <div className="container-custom relative z-10">
                    <div className="mb-8">
                        <Link to="/solutions" className="inline-flex items-center text-primary-foreground/70 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Solutions
                        </Link>
                    </div>
                    <div className="max-w-4xl">
                        <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-semibold uppercase tracking-wider mb-6 border border-white/20">
                            {solution.category}
                        </span>
                        <h1 className="heading-1 text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {solution.name}
                        </h1>
                        <p className="text-xl text-primary-foreground/90 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                            {solution.shortDescription}
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                            <Button size="lg" variant="accent" onClick={() => window.open('https://wa.me/7671972625?text=Hey%20hi%20i%20want%20to%20more%20about%20your%20solution!', '_blank')}>
                                <MessageSquare className="w-5 h-5 mr-2" />
                                Chat on WhatsApp
                            </Button>
                            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" onClick={() => setModalOpen(true)}>
                                {solution.ctaText || 'Get Started'} <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
                <QuickContactModal
                    open={modalOpen}
                    onOpenChange={setModalOpen}
                    source={`Solution: ${solution?.name || 'Detail'}`}
                />
            </section>

            <div className="bg-background min-h-screen">
                {/* SUB-NAV / ANCHORS (Optional improvement for later) */}

                <div className="container-custom py-16 grid lg:grid-cols-12 gap-12">

                    {/* MAIN CONTENT COLUMN */}
                    <div className="lg:col-span-8 space-y-16">

                        {/* OVERVIEW */}
                        {solution.detailedDescription && (
                            <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <h2 className="heading-3 mb-6 flex items-center gap-2 text-foreground">
                                    Overview
                                </h2>
                                <div className="prose prose-lg text-muted-foreground whitespace-pre-wrap">
                                    {solution.detailedDescription}
                                </div>
                            </section>
                        )}

                        {/* PROBLEMS SOLVED */}
                        {(solution.problemsSolved && solution.problemsSolved.length > 0) && (
                            <section className="bg-accent/5 rounded-2xl p-8 border border-accent/10">
                                <h3 className="heading-4 mb-6 text-foreground flex items-center gap-2">
                                    <Target className="w-6 h-6 text-accent" /> Problems We Solve
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {solution.problemsSolved.map((prob: string, idx: number) => (
                                        <div key={idx} className="flex gap-3 items-start p-3 bg-background rounded-lg shadow-sm border border-border/50">
                                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <p className="text-sm font-medium text-foreground">{prob}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* KEY FEATURES */}
                        {(solution.keyFeatures && solution.keyFeatures.length > 0) && (
                            <section>
                                <h3 className="heading-3 mb-8 text-foreground">Key Features</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {solution.keyFeatures.map((feat: string, idx: number) => (
                                        <div key={idx} className="flex gap-4 p-4 rounded-xl border border-border hover:border-accent/40 hover:bg-muted/30 transition-all">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                                                <span className="font-bold text-sm">{idx + 1}</span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">{feat}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* DYNAMIC SECTIONS */}
                        {(solution.dynamicSections || []).filter((s: any) => s.isVisible !== false).map((section: any, sIdx: number) => (
                            <section key={sIdx} className="space-y-6">
                                <h3 className="heading-3 text-foreground">{section.title}</h3>
                                {section.layoutType === 'cards' ? (
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {(section.fields || []).map((f: any, fIdx: number) => (
                                            <div key={fIdx} className="p-6 rounded-xl border bg-card shadow-sm">
                                                <h4 className="font-bold text-lg mb-2">{f.label}</h4>
                                                <p className="text-muted-foreground">{f.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : section.layoutType === 'grid-2' ? (
                                    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                                        {(section.fields || []).map((f: any, fIdx: number) => (
                                            <div key={fIdx} className="border-b border-border py-2 flex justify-between gap-4">
                                                <span className="font-medium text-muted-foreground">{f.label}</span>
                                                <span className="text-right font-semibold text-foreground">{f.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : section.layoutType === 'checklist' ? (
                                    <ul className="grid gap-3">
                                        {(section.fields || []).map((f: any, fIdx: number) => (
                                            <li key={fIdx} className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                                <span className="font-medium">{f.value || f.label}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    // Default / Full Width
                                    <div className="space-y-4">
                                        {(section.fields || []).map((f: any, fIdx: number) => (
                                            <div key={fIdx}>
                                                <h4 className="font-bold mb-1">{f.label}</h4>
                                                <div className="text-muted-foreground whitespace-pre-wrap">{f.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        ))}

                        {/* FAQS */}
                        {(solution.faqs && solution.faqs.length > 0 && solution.isVisible !== false) && (
                            <section>
                                <h3 className="heading-3 mb-6 text-foreground flex items-center gap-2">
                                    <HelpCircle className="w-6 h-6 text-accent" /> Frequently Asked Questions
                                </h3>
                                <Accordion type="single" collapsible className="w-full">
                                    {solution.faqs.map((faq: any, idx: number) => (
                                        <AccordionItem key={idx} value={`item-${idx}`}>
                                            <AccordionTrigger className="text-left font-medium text-lg">
                                                {faq.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </section>
                        )}
                    </div>

                    {/* SIDEBAR */}
                    <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24 lg:self-start h-fit">

                        {/* AT A GLANCE CARD */}
                        <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
                            <h4 className="text-lg font-bold mb-4 border-b pb-2">At a Glance</h4>

                            <div className="space-y-4">
                                {solution.timeline && (
                                    <div className="flex items-start gap-3">
                                        <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <span className="text-xs font-semibold text-muted-foreground uppercase">Estimated Timeline</span>
                                            <p className="font-medium">{solution.timeline}</p>
                                        </div>
                                    </div>
                                )}

                                {solution.pricingModel && (
                                    <div className="flex items-start gap-3">
                                        <CreditCard className="w-5 h-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <span className="text-xs font-semibold text-muted-foreground uppercase">Pricing Model</span>
                                            <p className="font-medium">{solution.pricingModel}</p>
                                        </div>
                                    </div>
                                )}

                                {(solution.industriesServed || []).length > 0 && (
                                    <div className="pt-2">
                                        <span className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">Industries</span>
                                        <div className="flex flex-wrap gap-2">
                                            {solution.industriesServed.map((ind: string, i: number) => (
                                                <span key={i} className="px-2 py-1 bg-muted rounded text-xs font-medium">{ind}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-border">
                                <Button className="w-full mb-3" size="lg" variant="accent" onClick={() => window.open('https://wa.me/7671972625?text=Hey%20hi%20i%20want%20to%20more%20about%20your%20solution!', '_blank')}>
                                    <MessageSquare className="w-4 h-4 mr-2" /> Chat on WhatsApp
                                </Button>
                                <Button className="w-full mb-3" size="lg" variant="outline" onClick={() => setModalOpen(true)}>
                                    {solution.ctaText || 'Get Started'}
                                </Button>
                                <p className="text-xs text-center text-muted-foreground">
                                    {solution.consultationAvailability ? 'Free 30-min consultation included' : 'Contact us for availability'}
                                </p>
                            </div>
                        </div>

                        {/* TESTIMONIALS */}
                        {(solution.testimonials && solution.testimonials.length > 0) && (
                            <div className="space-y-4">
                                <h4 className="text-lg font-bold px-2">Client Stories</h4>
                                {solution.testimonials.map((t: any, idx: number) => (
                                    <div key={idx} className="bg-muted/30 p-6 rounded-2xl relative overflow-hidden">
                                        {/* Reduced opacity background icon instead of absolute positioned overlay to prevent overlap */}
                                        <div className="absolute top-[-10px] right-[-10px] text-accent/10 pointer-events-none">
                                            <MessageSquare className="w-24 h-24 fill-current" />
                                        </div>
                                        <p className="relative z-10 text-sm italic text-muted-foreground mb-4 leading-relaxed">
                                            "{t.comment}"
                                        </p>
                                        <div className="relative z-10 flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent text-xs flex-shrink-0">
                                                {t.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">{t.name}</p>
                                                <p className="text-xs text-muted-foreground">{t.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* TRUST SIGNALS */}
                        {(solution.certifications || solution.partnerships) && (
                            <div className="bg-white p-6 rounded-xl border shadow-sm">
                                <h4 className="flex items-center gap-2 font-bold mb-4 text-sm uppercase text-muted-foreground">
                                    <ShieldCheck className="w-4 h-4" /> Trusted By
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                    {[...(solution.certifications || []), ...(solution.partnerships || [])].map((item: string, i: number) => (
                                        <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* APPLICATION MODAL */}
            <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Apply for {solution.name}</DialogTitle>
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
                                <Label htmlFor="phone">Contact Number *</Label>
                                <Input id="phone" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company">Company / Organization</Label>
                                <Input id="company" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Solution Selected</Label>
                            <Input value={solution.name} disabled className="bg-muted" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="budget">Estimated Budget</Label>
                                <Input id="budget" placeholder="e.g. $10k - $50k" value={formData.estimatedBudget} onChange={e => setFormData({ ...formData, estimatedBudget: e.target.value })} />
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
                        {solution.inquiryFormFields && solution.inquiryFormFields.filter((f: any) => f.isVisible !== false).length > 0 && (
                            <div className="space-y-4 pt-4 border-t border-dashed">
                                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Additional Questions</h4>
                                {solution.inquiryFormFields
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
