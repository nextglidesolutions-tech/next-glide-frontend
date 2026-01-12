import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Save, GripVertical } from 'lucide-react';

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

export default function FormBuilder() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [selectedJob, setSelectedJob] = useState<string>('');
    const [fields, setFields] = useState<Field[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        if (selectedJob) {
            fetchForm(selectedJob);
        } else {
            setFields([]);
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

    return (
        <div className="max-w-4xl">
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Form Builder</h2>
                <p className="text-muted-foreground mb-4">Design the application form for a specific job.</p>

                <div className="flex gap-4 items-end">
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
            </div>

            {selectedJob && (
                <div className="space-y-6">
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-semibold text-lg">Form Fields</h3>
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
                            <div className="space-y-4">
                                {fields.map((field, index) => (
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
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeField(field.id)}
                                                className="text-muted-foreground hover:text-destructive"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Button size="lg" onClick={saveForm}>
                            <Save className="w-4 h-4 mr-2" />
                            Save Form
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
