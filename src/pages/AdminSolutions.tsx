import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Plus, Pencil, Trash2, ArrowLeft, Loader2, Link2, ArrowRight, X, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminSolutions() {
    const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
    const [solutions, setSolutions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- FORM SECTIONS (For UI Logic) ---
    const formSections = [
        { id: 'listing', title: 'Listing Details (Outside)', color: 'bg-blue-50 text-blue-700' },
        { id: 'overview', title: 'Overview & Problem Solving', color: 'bg-purple-50 text-purple-700' },
        { id: 'offering', title: 'Offering Details', color: 'bg-green-50 text-green-700' },
        { id: 'experience', title: 'Experience & Credibility', color: 'bg-amber-50 text-amber-700' },
        { id: 'delivery', title: 'Delivery & Commercials', color: 'bg-pink-50 text-pink-700' },
        { id: 'trust', title: 'Trust & Proof', color: 'bg-cyan-50 text-cyan-700' },
        { id: 'cta', title: 'Calls to Action', color: 'bg-emerald-50 text-emerald-700' },
        { id: 'testimonials', title: 'Testimonials', color: 'bg-orange-50 text-orange-700' },
        { id: 'faqs', title: 'FAQs', color: 'bg-indigo-50 text-indigo-700' },
        { id: 'custom', title: 'Custom Sections', color: 'bg-gray-100 text-gray-700' },
    ];
    const [currentSection, setCurrentSection] = useState('listing');

    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        fetchSolutions();
    }, []);

    const fetchSolutions = async () => {
        setLoading(true);
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

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleArrayChange = (field: string, value: string) => {
        // Splits by comma or newline for array fields
        const array = value.split(/[\n,]+/).map((item) => item.trim()).filter(Boolean);
        handleInputChange(field, array);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const method = view === 'create' ? 'POST' : 'PUT';
            const url = view === 'create' ? `${apiUrl}/api/solutions` : `${apiUrl}/api/solutions/${formData._id}`;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast({ title: 'Success', description: `Solution ${view === 'create' ? 'created' : 'updated'} successfully` });
                fetchSolutions();
                setView('list');
                setFormData({});
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Failed to save solution');
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditClick = async (sol: any) => {
        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/solutions/${sol.slug}`);
            if (response.ok) {
                const data = await response.json();
                setFormData(data);
                setView('edit');
            } else {
                toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch solution details' });
            }
        } catch (error) {
            console.error('Error details:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to load solution' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This action cannot be undone.')) return;
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            await fetch(`${apiUrl}/api/solutions/${id}`, { method: 'DELETE' });
            fetchSolutions();
            toast({ title: 'Deleted', description: 'Solution deleted successfully' });
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    // --- TESTIMONIAL HANDLERS ---
    const handleAddTestimonial = () => {
        const newTestimonial = { name: '', role: '', comment: '' };
        setFormData({ ...formData, testimonials: [...(formData.testimonials || []), newTestimonial] });
    };

    const handleRemoveTestimonial = (index: number) => {
        const updated = [...(formData.testimonials || [])];
        updated.splice(index, 1);
        setFormData({ ...formData, testimonials: updated });
    };

    const handleTestimonialChange = (index: number, field: string, value: string) => {
        const updated = [...(formData.testimonials || [])];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, testimonials: updated });
    };

    // --- FAQ HANDLERS ---
    const handleAddFAQ = () => {
        const newFAQ = { question: '', answer: '' };
        setFormData({ ...formData, faqs: [...(formData.faqs || []), newFAQ] });
    };

    const handleRemoveFAQ = (index: number) => {
        const updated = [...(formData.faqs || [])];
        updated.splice(index, 1);
        setFormData({ ...formData, faqs: updated });
    };

    const handleFAQChange = (index: number, field: string, value: string) => {
        const updated = [...(formData.faqs || [])];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, faqs: updated });
    };

    // --- DYNAMIC SECTION HANDLERS ---
    const handleAddSection = () => {
        const newSection = { title: '', layoutType: 'full-width', fields: [], order: (formData.dynamicSections || []).length };
        setFormData({ ...formData, dynamicSections: [...(formData.dynamicSections || []), newSection] });
    };

    const handleRemoveSection = (index: number) => {
        const updated = [...(formData.dynamicSections || [])];
        updated.splice(index, 1);
        setFormData({ ...formData, dynamicSections: updated });
    };

    const handleSectionChange = (index: number, field: string, value: any) => {
        const updated = [...(formData.dynamicSections || [])];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, dynamicSections: updated });
    };

    const handleAddField = (sectionIndex: number) => {
        const updated = [...(formData.dynamicSections || [])];
        updated[sectionIndex].fields.push({ label: '', value: '', fieldType: 'text' });
        setFormData({ ...formData, dynamicSections: updated });
    };

    const handleRemoveField = (sectionIndex: number, fieldIndex: number) => {
        const updated = [...(formData.dynamicSections || [])];
        updated[sectionIndex].fields.splice(fieldIndex, 1);
        setFormData({ ...formData, dynamicSections: updated });
    };

    const handleFieldChange = (sectionIndex: number, fieldIndex: number, field: string, value: any) => {
        const updated = [...(formData.dynamicSections || [])];
        updated[sectionIndex].fields[fieldIndex] = { ...updated[sectionIndex].fields[fieldIndex], [field]: value };
        setFormData({ ...formData, dynamicSections: updated });
    };

    // --- RENDER FORM FIELDS ---
    const renderField = (label: string, field: string, type: 'text' | 'textarea' | 'array' | 'boolean' = 'text', placeholder = '') => (
        <div className="mb-4">
            <Label className="block mb-2 font-medium">{label}</Label>
            {type === 'text' && (
                <Input
                    value={formData[field] || ''}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    placeholder={placeholder}
                />
            )}
            {type === 'textarea' && (
                <Textarea
                    value={formData[field] || ''}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    placeholder={placeholder}
                    rows={4}
                />
            )}
            {type === 'array' && (
                <Textarea
                    value={Array.isArray(formData[field]) ? formData[field].join('\n') : (formData[field] || '')}
                    onChange={(e) => handleArrayChange(field, e.target.value)}
                    placeholder="Enter items separated by new lines or commas"
                    rows={4}
                    className="bg-muted/30"
                />
            )}
        </div>
    );

    const renderSectionHeader = (title: string, colorClass: string, visibilityField?: string) => (
        <div className={`flex justify-between items-center mb-4 border-b pb-2 ${colorClass}`}>
            <h3 className="text-lg font-bold">{title}</h3>
            {visibilityField && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleInputChange(visibilityField, formData[visibilityField] === false ? true : false)}
                    className={formData[visibilityField] === false ? "text-gray-400" : "text-blue-500"}
                    title={formData[visibilityField] === false ? "Show Section" : "Hide Section"}
                >
                    {formData[visibilityField] === false ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    {formData[visibilityField] === false ? "Hidden" : "Visible"}
                </Button>
            )}
        </div>
    );

    if (loading) return (
        <AdminLayout>
            <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>
        </AdminLayout>
    );

    if (view === 'list') {
        return (
            <AdminLayout>
                <div className="p-8 space-y-8 bg-muted/10 min-h-screen">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">Solutions Management</h1>
                            <p className="text-muted-foreground">Manage your solution offerings ({solutions.length})</p>
                        </div>
                        <Button onClick={() => { setFormData({}); setView('create'); }}>
                            <Plus className="w-4 h-4 mr-2" /> Add New Solution
                        </Button>
                    </div>

                    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Solution Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Price From</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {solutions.map((sol) => (
                                    <TableRow key={sol._id}>
                                        <TableCell className="font-semibold">{sol.name}</TableCell>
                                        <TableCell>{sol.category}</TableCell>
                                        <TableCell>{sol.startingPrice}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(sol)}>
                                                <Pencil className="w-4 h-4 text-blue-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(sol._id)}>
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {solutions.length === 0 && <TableRow><TableCell colSpan={4} className="text-center h-24">No solutions found.</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="flex bg-background" style={{ height: 'calc(100vh - 60px)' }}>
                {/* LEFT SIDE: Navigation & Form */}
                <div className="w-[70%] flex flex-col border-r border-border bg-white h-full overflow-y-auto">
                    <div className="p-6 border-b border-border sticky top-0 bg-white z-10 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setView('list')}><ArrowLeft className="w-4 h-4" /></Button>
                            <h2 className="text-xl font-bold">{view === 'create' ? 'Create Solution' : 'Edit Solution'}</h2>
                        </div>
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Save Solution'}
                        </Button>
                    </div>

                    <div className="p-6">
                        {/* Section Tabs */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {formSections.map(section => (
                                <button
                                    key={section.id}
                                    onClick={() => setCurrentSection(section.id)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${currentSection === section.id
                                        ? section.color + ' ring-2 ring-offset-1 ring-blue-200'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                        }`}
                                >
                                    {section.title}
                                </button>
                            ))}
                        </div>

                        {/* FORM CONTENT */}
                        <div className="space-y-6 max-w-2xl">
                            {currentSection === 'listing' && (
                                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                                    <h3 className="text-lg font-bold mb-4 text-blue-800 border-b pb-2">Listing (Visible on Card)</h3>
                                    {renderField('Solution Name *', 'name')}
                                    {renderField('URL Slug (e.g., ai-solution) *', 'slug')}
                                    {renderField('Short Description *', 'shortDescription', 'textarea')}
                                    <div className="grid grid-cols-2 gap-4">
                                        {renderField('Category', 'category')}
                                        {renderField('Starting Price', 'startingPrice')}
                                    </div>
                                    {renderField('Call To Action Text', 'ctaText', 'text', 'Appy Now')}
                                </div>
                            )}

                            {currentSection === 'overview' && (
                                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                                    {renderSectionHeader('Deep Dive', 'text-purple-800', 'isOverviewVisible')}
                                    {renderField('Detailed Description', 'detailedDescription', 'textarea')}
                                    {renderField('Problems Solved (One per line)', 'problemsSolved', 'array')}
                                    {renderField('Who Is This For?', 'targetAudience', 'array')}
                                </div>
                            )}

                            {currentSection === 'offering' && (
                                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                                    {renderSectionHeader('What We Offer', 'text-green-800', 'isOfferingVisible')}
                                    {renderField('Key Features', 'keyFeatures', 'array')}
                                    {renderField('Topics / Coverage Areas', 'coverageAreas', 'array')}
                                    {renderField('Technologies / Tools', 'technologies', 'array')}
                                </div>
                            )}

                            {currentSection === 'experience' && (
                                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                                    {renderSectionHeader('Credibility', 'text-amber-800', 'isExperienceVisible')}
                                    <div className="grid grid-cols-2 gap-4">
                                        {renderField('Years of Experience', 'yearsExperience')}
                                        {renderField('Projects Completed', 'projectsCompleted')}
                                    </div>
                                    {renderField('Industries Served', 'industriesServed', 'array')}
                                </div>
                            )}

                            {currentSection === 'delivery' && (
                                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                                    {renderSectionHeader('Delivery & Commercials', 'text-pink-800', 'isDeliveryVisible')}
                                    <div className="grid grid-cols-2 gap-4">
                                        {renderField('Timeline Estimate', 'timeline')}
                                        {renderField('Pricing Model', 'pricingModel')}
                                    </div>
                                    {renderField('Support Details', 'supportDetails', 'textarea')}
                                </div>
                            )}

                            {currentSection === 'trust' && (
                                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                                    {renderSectionHeader('Trust & Proof', 'text-cyan-800', 'isTrustVisible')}
                                    {renderField('Case Studies (Link or Text)', 'caseStudies')}
                                    {renderField('Certifications', 'certifications', 'array')}
                                    {renderField('Partnerships', 'partnerships', 'array')}
                                    {renderField('Security Details', 'securityDetails', 'textarea')}
                                </div>
                            )}

                            {currentSection === 'testimonials' && (
                                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                                        <div className="flex items-center gap-4">
                                            <h3 className="text-lg font-bold text-orange-800">Testimonials</h3>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleInputChange('isTestimonialsVisible', formData['isTestimonialsVisible'] === false ? true : false)}
                                                className={formData['isTestimonialsVisible'] === false ? "text-gray-400" : "text-blue-500"}
                                            >
                                                {formData['isTestimonialsVisible'] === false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                        <Button size="sm" onClick={handleAddTestimonial} variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50">
                                            <Plus className="w-4 h-4 mr-1" /> Add Testimonial
                                        </Button>
                                    </div>

                                    {(formData.testimonials || []).length === 0 && <p className="text-muted-foreground italic">No testimonials added.</p>}

                                    {(formData.testimonials || []).map((t: any, idx: number) => (
                                        <div key={idx} className="mb-4 p-4 bg-orange-50/50 rounded-lg border border-orange-100 relative group">
                                            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-red-400 hover:bg-red-50" onClick={() => handleRemoveTestimonial(idx)}><X className="w-4 h-4" /></Button>
                                            <div className="grid gap-3">
                                                <Input placeholder="Client Name" value={t.name} onChange={(e) => handleTestimonialChange(idx, 'name', e.target.value)} className="bg-white" />
                                                <Input placeholder="Role / Company" value={t.role} onChange={(e) => handleTestimonialChange(idx, 'role', e.target.value)} className="bg-white" />
                                                <Textarea placeholder="Comment / Quote" value={t.comment} onChange={(e) => handleTestimonialChange(idx, 'comment', e.target.value)} className="bg-white" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {currentSection === 'faqs' && (
                                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                                        <div className="flex items-center gap-4">
                                            <h3 className="text-lg font-bold text-indigo-800">FAQs</h3>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleInputChange('isFaqsVisible', formData['isFaqsVisible'] === false ? true : false)}
                                                className={formData['isFaqsVisible'] === false ? "text-gray-400" : "text-blue-500"}
                                            >
                                                {formData['isFaqsVisible'] === false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                        <Button size="sm" onClick={handleAddFAQ} variant="outline" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                                            <Plus className="w-4 h-4 mr-1" /> Add FAQ
                                        </Button>
                                    </div>

                                    {(formData.faqs || []).length === 0 && <p className="text-muted-foreground italic">No FAQs added.</p>}

                                    {(formData.faqs || []).map((f: any, idx: number) => (
                                        <div key={idx} className="mb-4 p-4 bg-indigo-50/50 rounded-lg border border-indigo-100 relative group">
                                            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-red-400 hover:bg-red-50" onClick={() => handleRemoveFAQ(idx)}><X className="w-4 h-4" /></Button>
                                            <div className="grid gap-3">
                                                <Input placeholder="Question" value={f.question} onChange={(e) => handleFAQChange(idx, 'question', e.target.value)} className="bg-white font-medium" />
                                                <Textarea placeholder="Answer" value={f.answer} onChange={(e) => handleFAQChange(idx, 'answer', e.target.value)} className="bg-white" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {currentSection === 'cta' && (
                                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                                    {renderSectionHeader('Calls to Action & Extras', 'text-emerald-800', 'isCtaVisible')}
                                    {renderField('Primary CTA Text', 'primaryCta')}
                                    {renderField('Secondary CTA Text', 'secondaryCta')}
                                    {renderField('Next Steps / What to Expect', 'nextSteps', 'textarea')}

                                    <div className="flex items-center space-x-2 mb-4 p-4 bg-muted/20 rounded">
                                        <input
                                            type="checkbox"
                                            id="consultationAvailability"
                                            checked={formData.consultationAvailability !== false}
                                            onChange={(e) => handleInputChange('consultationAvailability', e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <Label htmlFor="consultationAvailability" className="mb-0 cursor-pointer">Consultation Available?</Label>
                                    </div>
                                </div>
                            )}

                            {currentSection === 'custom' && (
                                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                                        <h3 className="text-lg font-bold text-gray-800">Custom Dynamic Sections</h3>
                                        <Button size="sm" onClick={handleAddSection} variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                            <Plus className="w-4 h-4 mr-1" /> Add New Section
                                        </Button>
                                    </div>

                                    {(formData.dynamicSections || []).length === 0 && (
                                        <div className="text-center p-8 border-2 border-dashed rounded-xl text-muted-foreground bg-gray-50">
                                            <p className="mb-2">No custom sections yet.</p>
                                            <p className="text-sm">Add sections to create custom layouts like FAQs, Specs, or extra info blocks.</p>
                                        </div>
                                    )}

                                    {(formData.dynamicSections || []).map((section: any, sIdx: number) => (
                                        <div key={sIdx} className={`mb-8 p-6 rounded-xl border shadow-sm relative group transition-all ${section.isVisible === false ? 'bg-gray-100 border-gray-200 opacity-75' : 'bg-white border-blue-200 ring-1 ring-blue-50'
                                            }`}>
                                            <div className="absolute top-2 right-2 flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className={`hover:bg-slate-100 ${section.isVisible === false ? 'text-gray-400' : 'text-blue-500'}`}
                                                    onClick={() => handleSectionChange(sIdx, 'isVisible', section.isVisible === false ? true : false)}
                                                    title={section.isVisible === false ? "Show Section" : "Hide Section"}
                                                >
                                                    {section.isVisible === false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-400 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => handleRemoveSection(sIdx)}
                                                    title="Delete Section"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-4 pr-8">
                                                <div>
                                                    <Label>Section Title</Label>
                                                    <Input
                                                        value={section.title || ''}
                                                        onChange={(e) => handleSectionChange(sIdx, 'title', e.target.value)}
                                                        placeholder="e.g. Additional Specifications"
                                                        className="bg-white"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Layout Style (CSS)</Label>
                                                    <select
                                                        className="w-full h-10 px-3 rounded-md border border-input bg-white text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                        value={section.layoutType || 'full-width'}
                                                        onChange={(e) => handleSectionChange(sIdx, 'layoutType', e.target.value)}
                                                    >
                                                        <option value="full-width">Full Width Text Block</option>
                                                        <option value="grid-2">2-Column Grid (Key: Value)</option>
                                                        <option value="checklist">Checklist / Features List</option>
                                                        <option value="cards">Info Cards</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-3 pl-4 border-l-2 border-blue-200">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Fields / Questions</h4>
                                                    <Button size="sm" variant="ghost" className="h-8 text-blue-600" onClick={() => handleAddField(sIdx)}>
                                                        <Plus className="w-3 h-3 mr-1" /> Add Field
                                                    </Button>
                                                </div>

                                                {(section.fields || []).map((field: any, fIdx: number) => (
                                                    <div key={fIdx} className="grid grid-cols-12 gap-2 items-start bg-white p-3 rounded border">
                                                        <div className="col-span-5">
                                                            <Input
                                                                placeholder="Question / Label"
                                                                className="h-8 text-sm"
                                                                value={field.label || ''}
                                                                onChange={(e) => handleFieldChange(sIdx, fIdx, 'label', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-span-2">
                                                            <select
                                                                className="w-full h-8 px-2 rounded-md border border-input bg-transparent text-xs"
                                                                value={field.fieldType || 'text'}
                                                                onChange={(e) => handleFieldChange(sIdx, fIdx, 'fieldType', e.target.value)}
                                                            >
                                                                <option value="text">Text</option>
                                                                <option value="textarea">Long Text</option>
                                                                <option value="array">List</option>
                                                                <option value="boolean">Yes/No</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-span-4">
                                                            {field.fieldType === 'textarea' ? (
                                                                <Textarea
                                                                    placeholder="Value / Answer"
                                                                    className="min-h-[60px] text-sm"
                                                                    value={field.value || ''}
                                                                    onChange={(e) => handleFieldChange(sIdx, fIdx, 'value', e.target.value)}
                                                                />
                                                            ) : field.fieldType === 'array' ? (
                                                                <Textarea
                                                                    placeholder="Items (comma/newline)"
                                                                    className="min-h-[60px] text-sm bg-muted/20"
                                                                    value={Array.isArray(field.value) ? field.value.join('\n') : (field.value || '')}
                                                                    onChange={(e) => {
                                                                        const val = e.target.value.split(/[\n,]+/).map((s: string) => s.trim()).filter(Boolean);
                                                                        handleFieldChange(sIdx, fIdx, 'value', val);
                                                                    }}
                                                                />
                                                            ) : field.fieldType === 'boolean' ? (
                                                                <select
                                                                    className="w-full h-8 px-2 rounded-md border border-input bg-transparent text-sm"
                                                                    value={String(field.value)}
                                                                    onChange={(e) => handleFieldChange(sIdx, fIdx, 'value', e.target.value === 'true')}
                                                                >
                                                                    <option value="false">No</option>
                                                                    <option value="true">Yes</option>
                                                                </select>
                                                            ) : (
                                                                <Input
                                                                    placeholder="Value / Answer"
                                                                    className="h-8 text-sm"
                                                                    value={field.value || ''}
                                                                    onChange={(e) => handleFieldChange(sIdx, fIdx, 'value', e.target.value)}
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="col-span-1 flex justify-end">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-gray-400 hover:text-red-500"
                                                                onClick={() => handleRemoveField(sIdx, fIdx)}
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {(section.fields || []).length === 0 && (
                                                    <p className="text-xs text-center text-muted-foreground italic py-2">No fields yet. Add one to start.</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: LIVE PREVIEW & STRUCTURE */}
                <div className="w-[30%] bg-slate-50 h-full p-8 overflow-y-auto border-l border-border">
                    <div className="sticky top-0 mb-8 bg-slate-50 z-10 pb-4 border-b">
                        <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider">Preview / Structure</h3>
                        <p className="text-slate-600">See how this content maps to the Frontend structure.</p>
                    </div>

                    {/* Listing Card Preview */}
                    <div className="mb-12">
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">1</span>
                            Listing Card Preview
                        </h4>
                        <div className="bg-white p-6 rounded-xl border shadow-sm max-w-sm">
                            <div className="w-10 h-10 bg-accent/10 rounded-lg mb-4 flex items-center justify-center">
                                <Link2 className="text-accent w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">{formData.name || 'Solution Name'}</h3>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                                {formData.shortDescription || 'Short description will appear here...'}
                            </p>
                            <div className="text-xs text-accent font-semibold uppercase tracking-wider mb-4">
                                From {formData.startingPrice || '$XXX'}
                            </div>
                            <Button className="w-full" variant="outline">
                                {formData.ctaText || 'Learn More'} <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>

                    {/* Detail Page Preview */}
                    <div>
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs">2</span>
                            Detail Page Structure
                        </h4>
                        <div className="space-y-4 text-sm text-slate-600 border-l-2 border-slate-200 pl-4">
                            <div className="bg-white p-4 rounded border">
                                <strong className="block text-slate-900">Hero Section</strong>
                                <p>{formData.name}</p>
                                <p className="text-xs text-slate-400">{formData.shortDescription}</p>
                            </div>
                            <div className="bg-white p-4 rounded border">
                                <strong className="block text-slate-900">Overview</strong>
                                <p className="line-clamp-2">{formData.detailedDescription || 'Overview content...'}</p>
                            </div>
                            <div className="bg-white p-4 rounded border">
                                <strong className="block text-slate-900">Problems Solved</strong>
                                <ul className="list-disc pl-4 mt-1">
                                    {(formData.problemsSolved || []).slice(0, 3).map((p: string, i: number) => <li key={i}>{p}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
