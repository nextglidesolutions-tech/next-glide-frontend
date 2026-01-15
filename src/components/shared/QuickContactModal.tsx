import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';

interface QuickContactModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    source: string; // e.g., 'Home', 'Careers'
    title?: string;
    isCareers?: boolean;
}

export function QuickContactModal({
    open,
    onOpenChange,
    source,
    title = "Get in Touch",
    isCareers = false,
}: QuickContactModalProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Data for dropdowns
    const [services, setServices] = useState<{ id: string; name: string }[]>([]);
    const [solutions, setSolutions] = useState<{ id: string; name: string }[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        interest: '',
        resumeLink: '',
        message: '',
    });

    useEffect(() => {
        if (open) {
            // Fetch services/solutions for dropdown
            const fetchData = async () => {
                try {
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
                    const [servicesRes, solutionsRes] = await Promise.all([
                        fetch(`${apiUrl}/api/services`),
                        fetch(`${apiUrl}/api/solutions`)
                    ]);

                    if (servicesRes.ok) setServices(await servicesRes.json());
                    if (solutionsRes.ok) setSolutions(await solutionsRes.json());
                } catch (error) {
                    console.error("Failed to fetch options", error);
                }
            };
            if (!isCareers) fetchData();
        }
    }, [open, isCareers]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/contacts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    subject: `${source} Inquiry: ${isCareers ? 'Career Application' : formData.interest || 'General'}`,
                    source: source,
                }),
            });

            if (response.ok) {
                setSuccess(true);
                setFormData({ name: '', email: '', phone: '', interest: '', resumeLink: '', message: '' });
            } else {
                throw new Error('Failed to submit');
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to send message. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onOpenChange(false);
        setTimeout(() => setSuccess(false), 500); // Reset after close
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">
                        {success ? 'Message Sent!' : title}
                    </DialogTitle>
                    <DialogDescription>
                        {success ? ' ' : 'Fill out the form below and we will get back to you within 6 hours.'}
                    </DialogDescription>
                </DialogHeader>

                {success ? (
                    <div className="py-8 text-center animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
                        <p className="text-muted-foreground mb-6">
                            We have received your details. Please check your email for a confirmation.
                        </p>
                        <Button onClick={handleClose} className="bg-green-600 hover:bg-green-700 text-white w-full">
                            Close
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name *</Label>
                                <Input
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+1 234 567 890"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="john@example.com"
                            />
                        </div>

                        {!isCareers && (
                            <div className="space-y-2">
                                <Label htmlFor="interest">I'm interested in...</Label>
                                <Select onValueChange={(val) => setFormData({ ...formData, interest: val })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a Service or Solution" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {services.length > 0 && <SelectItem value="header-services" disabled className="font-bold opacity-100 text-primary mt-2">Services</SelectItem>}
                                        {services.map(s => <SelectItem key={s.id} value={`Service: ${s.name}`}>{s.name}</SelectItem>)}

                                        {solutions.length > 0 && <SelectItem value="header-solutions" disabled className="font-bold opacity-100 text-primary mt-2">Solutions</SelectItem>}
                                        {solutions.map(s => <SelectItem key={s.id} value={`Solution: ${s.name}`}>{s.name}</SelectItem>)}

                                        <SelectItem value="Other">Other Inquiry</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {isCareers && (
                            <div className="space-y-2">
                                <Label htmlFor="resumeLink">Resume Link (GDrive/LinkedIn) *</Label>
                                <Input
                                    id="resumeLink"
                                    required
                                    value={formData.resumeLink}
                                    onChange={(e) => setFormData({ ...formData, resumeLink: e.target.value })}
                                    placeholder="https://drive.google.com/..."
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="message">Message *</Label>
                            <Textarea
                                id="message"
                                required
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder={isCareers ? "Tell us why you're a great fit..." : "How can we help you?"}
                                className="min-h-[100px]"
                            />
                        </div>

                        <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...
                                </>
                            ) : (
                                <>
                                    Submit Request <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
