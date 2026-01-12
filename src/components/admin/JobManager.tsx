import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface Job {
    _id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    experience: string;
    description?: string;
}

export default function JobManager() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<Job | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        department: '',
        location: '',
        type: 'Full-time',
        experience: '',
        description: ''
    });

    const { toast } = useToast();
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/api/jobs`);
            if (response.ok) {
                const data = await response.json();
                setJobs(data);
            }
        } catch (error) {
            console.error('Failed to fetch jobs', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (job?: Job) => {
        if (job) {
            setEditingJob(job);
            setFormData({
                title: job.title,
                department: job.department,
                location: job.location,
                type: job.type,
                experience: job.experience,
                description: job.description || ''
            });
        } else {
            setEditingJob(null);
            setFormData({
                title: '',
                department: '',
                location: '',
                type: 'Full-time',
                experience: '',
                description: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        try {
            const url = editingJob
                ? `${apiUrl}/api/jobs/${editingJob._id}`
                : `${apiUrl}/api/jobs`;

            const method = editingJob ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                toast({
                    title: `Job ${editingJob ? 'Updated' : 'Created'}`,
                    description: 'Successfully saved job posting.'
                });
                setIsModalOpen(false);
                fetchJobs();
            } else {
                throw new Error('Failed to save job');
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to save job posting.'
            });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await fetch(`${apiUrl}/api/jobs/${id}`, { method: 'DELETE' });
            setJobs(jobs.filter(j => j._id !== id));
            toast({ title: 'Job Deleted' });
        } catch (error) {
            console.error('Failed to delete job', error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Job Postings</h2>
                    <p className="text-muted-foreground">Manage open positions.</p>
                </div>
                <Button onClick={() => handleOpenModal()}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Job
                </Button>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={5} className="text-center h-24">Loading...</TableCell></TableRow>
                        ) : jobs.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="text-center h-24">No jobs found.</TableCell></TableRow>
                        ) : (
                            jobs.map(job => (
                                <TableRow key={job._id}>
                                    <TableCell className="font-medium">{job.title}</TableCell>
                                    <TableCell>{job.department}</TableCell>
                                    <TableCell>{job.location}</TableCell>
                                    <TableCell>{job.type}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenModal(job)}>
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(job._id)}>
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

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingJob ? 'Edit Job' : 'Create New Job'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Job Title</Label>
                                <Input
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Department</Label>
                                <Input
                                    value={formData.department}
                                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Location</Label>
                                <Input
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Employment Type</Label>
                                <Input
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Experience Required</Label>
                            <Input
                                value={formData.experience}
                                onChange={e => setFormData({ ...formData, experience: e.target.value })}
                                placeholder="e.g. 3+ years"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit}>Save Job</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
