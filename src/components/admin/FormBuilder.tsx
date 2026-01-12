import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Save, GripVertical, Download, Mail, RefreshCw, Send } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

interface Field {
    id: string;
    label: string;
    type: string;
    placeholder?: string;
    required: boolean;
    options?: string[];
}

interface Job {
    _id: string;
    title: string;
}

interface Application {
    _id: string;
    formData: Record<string, string>;
    submittedAt: string;
    email: string;
    name: string;
}

export default function FormBuilder() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [selectedJob, setSelectedJob] = useState<string>('');
    const [fields, setFields] = useState<Field[]>([]);
    const [loading, setLoading] = useState(false);

    // Application Management State
    const [applications, setApplications] = useState<Application[]>([]);
    const [loadingApps, setLoadingApps] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Custom Email Modal State
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState<Application | null>(null);
    const [emailSubject, setEmailSubject] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const [sendingEmail, setSendingEmail] = useState(false);

    const { toast } = useToast();
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        if (selectedJob) {
            fetchForm(selectedJob);
            fetchApplications(selectedJob);
        } else {
            setFields([]);
            setApplications([]);
        }
    }, [selectedJob]);

    const fetchJobs = async () => {
        try {
            const res = await fetch(`${apiUrl}/api/jobs`);
            if (res.ok) setJobs(await res.json());
        } catch (error) {
            console.error(error);
        }
    };

    const fetchForm = async (jobId: string) => {
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/forms/${jobId}`);
            if (res.ok) {
                const data = await res.json();
                setFields(data.fields || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchApplications = async (jobId: string) => {
        setLoadingApps(true);
        try {
            const res = await fetch(`${apiUrl}/api/applications/${jobId}`);
            if (res.ok) {
                setApplications(await res.json());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingApps(false);
        }
    };

    const addField = () => {
        const newField: Field = {
            id: `field_${Date.now()}`,
            label: 'New Field',
            type: 'text',
            required: false,
            placeholder: ''
        };
        setFields([...fields, newField]);
    };

    const updateField = (id: string, updates: Partial<Field>) => {
        setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const removeField = (id: string) => {
        setFields(fields.filter(f => f.id !== id));
    };

    const saveForm = async () => {
        if (!selectedJob) return;
        try {
            const res = await fetch(`${apiUrl}/api/forms`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobId: selectedJob, fields })
            });

            if (res.ok) {
                toast({ title: 'Form Saved', description: 'Application form updated successfully.' });
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to save form.' });
        }
    };

    // --- Application Actions ---

    const deleteApplication = async (id: string) => {
        if (!confirm('Are you sure you want to delete this application?')) return;
        setActionLoading(id);
        try {
            await fetch(`${apiUrl}/api/applications/${id}`, { method: 'DELETE' });
            setApplications(applications.filter(a => a._id !== id));
            toast({ title: 'Application Deleted' });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete application' });
        } finally {
            setActionLoading(null);
        }
    };

    const resendEmail = async (app: Application) => {
        setActionLoading(app._id);
        try {
            const res = await fetch(`${apiUrl}/api/applications/resend-email/${app._id}`, { method: 'POST' });
            if (res.ok) {
                toast({ title: 'Email Resent', description: `Receipt sent to ${app.email}` });
            } else {
                throw new Error();
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to resend email' });
        } finally {
            setActionLoading(null);
        }
    };

    const openEmailModal = (app: Application) => {
        setSelectedApplicant(app);
        setEmailSubject(`Regarding your application for ${jobs.find(j => j._id === selectedJob)?.title}`);
        setEmailMessage(`Dear ${app.name},\n\n...\n\nBest regards,\nNextGlide Recruiting Team`);
        setIsEmailModalOpen(true);
    };

    const sendCustomEmail = async () => {
        if (!selectedApplicant) return;
        setSendingEmail(true);
        try {
            const res = await fetch(`${apiUrl}/api/applications/custom-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    toEmail: selectedApplicant.email,
                    subject: emailSubject,
                    message: emailMessage
                })
            });
            if (res.ok) {
                toast({ title: 'Email Sent', description: `Email sent to ${selectedApplicant.email}` });
                setIsEmailModalOpen(false);
            } else {
                throw new Error();
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to send email' });
        } finally {
            setSendingEmail(false);
        }
    };

    const exportCSV = () => {
        if (applications.length === 0) return;

        // Dynamic headers based on current form fields + basic info
        const fieldHeaders = fields.map(f => f.label);
        const headers = ['Date', 'Applicant Name', 'Email', ...fieldHeaders];

        const csvRows = [
            headers.join(','),
            ...applications.map(app => {
                const row = [
                    `"${new Date(app.submittedAt).toLocaleDateString()}"`,
                    `"${app.name}"`,
                    `"${app.email}"`,
                    ...fields.map(f => `"${(app.formData[f.id] || '').replace(/"/g, '""')}"`)
                ];
                return row.join(',');
            })
        ];

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `applications_${jobs.find(j => j._id === selectedJob)?.title || 'export'}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Form Builder & Applicants</h2>
                <p className="text-muted-foreground mb-4">Design application forms and manage applicants for each job.</p>

                <div className="w-full max-w-sm">
                    <Label className="mb-2 block">Select Job Position</Label>
                    <Select value={selectedJob} onValueChange={setSelectedJob}>
                        <SelectTrigger>
                            <SelectValue placeholder="Choose a job..." />
                        </SelectTrigger>
                        <SelectContent>
                            {jobs.map(job => (
                                <SelectItem key={job._id} value={job._id}>{job.title}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {selectedJob && (
                <div className="space-y-8">
                    {/* Form Builder Section */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-semibold text-lg">Form Configuration</h3>
                            <Button onClick={addField} variant="outline" size="sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Field
                            </Button>
                        </div>

                        {loading ? (
                            <p>Loading form...</p>
                        ) : fields.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">No fields added yet. Click "Add Field" to start.</p>
                        ) : (
                            <div className="space-y-4 mb-6">
                                {fields.map((field) => (
                                    <div key={field.id} className="grid md:grid-cols-12 gap-4 items-start p-4 bg-muted/30 rounded-lg border border-border/50 group">
                                        <div className="md:col-span-1 pt-3 text-muted-foreground">
                                            <GripVertical className="w-5 h-5 cursor-move" />
                                        </div>
                                        <div className="md:col-span-10 grid gap-4">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Field Label</Label>
                                                    <Input
                                                        value={field.label}
                                                        onChange={e => updateField(field.id, { label: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Type</Label>
                                                    <Select
                                                        value={field.type}
                                                        onValueChange={val => updateField(field.id, { type: val })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="text">Short Text</SelectItem>
                                                            <SelectItem value="textarea">Long Text</SelectItem>
                                                            <SelectItem value="number">Number</SelectItem>
                                                            <SelectItem value="email">Email</SelectItem>
                                                            <SelectItem value="url">URL Link</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Placeholder</Label>
                                                    <Input
                                                        value={field.placeholder || ''}
                                                        onChange={e => updateField(field.id, { placeholder: e.target.value })}
                                                        placeholder="Input placeholder text..."
                                                    />
                                                </div>
                                                <div className="flex items-center space-x-2 pt-8">
                                                    <Switch
                                                        id={`req-${field.id}`}
                                                        checked={field.required}
                                                        onCheckedChange={checked => updateField(field.id, { required: checked })}
                                                    />
                                                    <Label htmlFor={`req-${field.id}`}>Required Field</Label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="md:col-span-1 pt-2">
                                            <Button variant="ghost" size="icon" onClick={() => removeField(field.id)} className="text-muted-foreground hover:text-destructive">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex justify-end">
                            <Button size="lg" onClick={saveForm}>
                                <Save className="w-4 h-4 mr-2" />
                                Save Form
                            </Button>
                        </div>
                    </div>

                    {/* Applicants Section */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-semibold text-lg">Applicants ({applications.length})</h3>
                            <Button variant="outline" onClick={exportCSV} disabled={applications.length === 0}>
                                <Download className="w-4 h-4 mr-2" />
                                Export CSV
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        {fields.slice(0, 3).map(f => (
                                            <TableHead key={f.id}>{f.label}</TableHead>
                                        ))}
                                        {fields.length > 3 && <TableHead>...</TableHead>}
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loadingApps ? (
                                        <TableRow><TableCell colSpan={6} className="text-center h-24">Loading applicants...</TableCell></TableRow>
                                    ) : applications.length === 0 ? (
                                        <TableRow><TableCell colSpan={6} className="text-center h-24">No applications yet.</TableCell></TableRow>
                                    ) : (
                                        applications.map(app => (
                                            <TableRow key={app._id}>
                                                <TableCell>{new Date(app.submittedAt).toLocaleDateString()}</TableCell>
                                                <TableCell className="font-medium">{app.name}</TableCell>
                                                <TableCell>{app.email}</TableCell>
                                                {fields.slice(0, 3).map(f => (
                                                    <TableCell key={f.id}>
                                                        {f.type === 'url' ? (
                                                            <a href={app.formData[f.id]} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                                View Link
                                                            </a>
                                                        ) : (
                                                            <span className="truncate block max-w-[150px]">{app.formData[f.id]}</span>
                                                        )}
                                                    </TableCell>
                                                ))}
                                                {fields.length > 3 && (
                                                    <TableCell>
                                                        <span className="text-muted-foreground text-xs italic">View full details in export</span>
                                                    </TableCell>
                                                )}
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => openEmailModal(app)} title="Send Custom Email">
                                                            <Mail className="w-4 h-4 text-blue-500" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => resendEmail(app)} disabled={actionLoading === app._id} title="Resend Receipt">
                                                            <RefreshCw className={`w-4 h-4 text-green-500 ${actionLoading === app._id ? 'animate-spin' : ''}`} />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => deleteApplication(app._id)} disabled={actionLoading === app._id} title="Delete">
                                                            <Trash2 className="w-4 h-4 text-red-500" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Email Modal */}
            <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Send Email to {selectedApplicant?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Subject</Label>
                            <Input value={emailSubject} onChange={e => setEmailSubject(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Message</Label>
                            <Textarea value={emailMessage} onChange={e => setEmailMessage(e.target.value)} rows={6} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEmailModalOpen(false)}>Cancel</Button>
                        <Button onClick={sendCustomEmail} disabled={sendingEmail}>
                            {sendingEmail ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                            Send Email
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
