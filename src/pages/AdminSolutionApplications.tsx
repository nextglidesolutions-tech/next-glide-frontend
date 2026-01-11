import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Download,
    Trash2,
    RefreshCw,
    Eye,
    MailCheck
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminSolutionApplications() {
    const [solutions, setSolutions] = useState<any[]>([]);
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSolutionId, setSelectedSolutionId] = useState<string>('all');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Detail Modal
    const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const { toast } = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

            // Parallel fetch
            const [solutionsRes, inquiriesRes] = await Promise.all([
                fetch(`${apiUrl}/api/solutions`),
                fetch(`${apiUrl}/api/solutions/inquiries/all`)
            ]);

            if (solutionsRes.ok && inquiriesRes.ok) {
                const solutionsData = await solutionsRes.json();
                const inquiriesData = await inquiriesRes.json();
                setSolutions(solutionsData);
                setInquiries(inquiriesData);
            }
        } catch (error) {
            console.error('Error loading data:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to load applications' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this application? This cannot be undone.')) return;

        setActionLoading(id);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/solutions/inquiries/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setInquiries(prev => prev.filter(i => i._id !== id));
                toast({ title: 'Deleted', description: 'Application removed successfully' });
                if (selectedInquiry?._id === id) setIsDetailOpen(false);
            } else {
                throw new Error('Delete failed');
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete application' });
        } finally {
            setActionLoading(null);
        }
    };

    const handleResendEmail = async (id: string) => {
        setActionLoading(id);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/solutions/inquiries/${id}/resend`, {
                method: 'POST'
            });

            if (response.ok) {
                toast({ title: 'Email Sent', description: 'Application receipt email has been resent to the user.' });
            } else {
                throw new Error('Sending failed');
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to send email' });
        } finally {
            setActionLoading(null);
        }
    };

    const exportToCSV = () => {
        // Filter inquiries based on current view
        const dataToExport = selectedSolutionId === 'all'
            ? inquiries
            : inquiries.filter(i => i.solutionId === selectedSolutionId || i.solutionName === solutions.find(s => s._id === selectedSolutionId)?.name);

        if (dataToExport.length === 0) {
            toast({ title: 'No Data', description: 'There is no data to export.' });
            return;
        }

        // Prepare Headers
        const headers = ['Date', 'Solution', 'Full Name', 'Email', 'Phone', 'Company', 'Budget', 'Requirements', 'Custom Responses'];

        const csvContent = [
            headers.join(','),
            ...dataToExport.map(item => {
                const customRespString = (item.customResponses || [])
                    .map((r: any) => `${r.question}: ${r.answer}`)
                    .join(' | ');

                return [
                    `"${new Date(item.createdAt).toLocaleDateString()}"`,
                    `"${item.solutionName}"`,
                    `"${item.fullName}"`,
                    `"${item.email}"`,
                    `"${item.phone}"`,
                    `"${item.company || ''}"`,
                    `"${item.estimatedBudget || ''}"`,
                    `"${(item.requirements || '').replace(/"/g, '""')}"`,
                    `"${customRespString.replace(/"/g, '""')}"`
                ].join(',');
            })
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `solutions_applications_export_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredInquiries = selectedSolutionId === 'all'
        ? inquiries
        : inquiries.filter(i => i.solutionId === selectedSolutionId || i.solutionName === solutions.find(s => s._id === selectedSolutionId)?.name);

    return (
        <AdminLayout>
            <div className="p-8 h-full flex flex-col">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Solution Applications</h1>
                        <p className="text-muted-foreground">Manage incoming inquiries and applications for solutions.</p>
                    </div>
                </div>

                {/* FILTERS & ACTIONS BAR */}
                <div className="bg-card p-4 rounded-xl border shadow-sm mb-6 flex flex-wrap gap-4 items-end justify-between">
                    <div className="w-full md:w-1/3">
                        <Label className="mb-2 block">Filter by Solution</Label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={selectedSolutionId}
                            onChange={(e) => setSelectedSolutionId(e.target.value)}
                        >
                            <option value="all">All Solutions</option>
                            {solutions.map(s => (
                                <option key={s._id} value={s._id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" onClick={fetchData}>
                            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
                        </Button>
                        <Button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700 text-white">
                            <Download className="w-4 h-4 mr-2" /> Export Excel
                        </Button>
                    </div>
                </div>

                {/* DATA TABLE */}
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden flex-1">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Solution</TableHead>
                                    <TableHead>Applicant</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">Loading...</TableCell>
                                    </TableRow>
                                )}

                                {!loading && filteredInquiries.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                            No applications found for this selection.
                                        </TableCell>
                                    </TableRow>
                                )}

                                {filteredInquiries.map((app) => (
                                    <TableRow key={app._id} className="hover:bg-muted/50">
                                        <TableCell className="text-muted-foreground font-mono text-xs">
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="font-medium text-blue-600">
                                            {app.solutionName}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-bold">{app.fullName}</div>
                                            <div className="text-xs text-muted-foreground">{app.company}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">{app.email}</div>
                                            <div className="text-xs text-muted-foreground">{app.phone}</div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" title="View Details" onClick={() => { setSelectedInquiry(app); setIsDetailOpen(true); }}>
                                                    <Eye className="w-4 h-4 text-blue-500" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Resend Receipt Email"
                                                    onClick={() => handleResendEmail(app._id)}
                                                    disabled={actionLoading === app._id}
                                                >
                                                    <MailCheck className={`w-4 h-4 text-green-600 ${actionLoading === app._id ? 'animate-pulse' : ''}`} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Delete Application"
                                                    onClick={() => handleDelete(app._id)}
                                                    disabled={actionLoading === app._id}
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* DETAILS MODAL */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Application Details</DialogTitle>
                    </DialogHeader>

                    {selectedInquiry && (
                        <div className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border">
                                <div>
                                    <Label className="text-xs text-muted-foreground uppercase">Solution</Label>
                                    <div className="font-bold text-lg text-blue-700">{selectedInquiry.solutionName}</div>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground uppercase">Date</Label>
                                    <div className="font-medium">{new Date(selectedInquiry.createdAt).toLocaleString()}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-bold border-b pb-1 mb-2">Applicant Info</h4>
                                    <dl className="space-y-2 text-sm">
                                        <div><dt className="text-muted-foreground">Detailed Name:</dt><dd>{selectedInquiry.fullName}</dd></div>
                                        <div><dt className="text-muted-foreground">Email:</dt><dd>{selectedInquiry.email}</dd></div>
                                        <div><dt className="text-muted-foreground">Phone:</dt><dd>{selectedInquiry.phone}</dd></div>
                                        <div><dt className="text-muted-foreground">Company:</dt><dd>{selectedInquiry.company || '-'}</dd></div>
                                    </dl>
                                </div>
                                <div>
                                    <h4 className="font-bold border-b pb-1 mb-2">Project Info</h4>
                                    <dl className="space-y-2 text-sm">
                                        <div><dt className="text-muted-foreground">Budget:</dt><dd>{selectedInquiry.estimatedBudget || '-'}</dd></div>
                                        <div><dt className="text-muted-foreground">Source:</dt><dd>{selectedInquiry.source || '-'}</dd></div>
                                    </dl>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold border-b pb-1 mb-2">Requirements</h4>
                                <div className="p-3 bg-muted/10 rounded border text-sm whitespace-pre-wrap">
                                    {selectedInquiry.requirements}
                                </div>
                            </div>

                            {selectedInquiry.customResponses && selectedInquiry.customResponses.length > 0 && (
                                <div>
                                    <h4 className="font-bold border-b pb-1 mb-2 text-purple-700">Custom Form Responses</h4>
                                    <div className="space-y-3">
                                        {selectedInquiry.customResponses.map((res: any, idx: number) => (
                                            <div key={idx} className="bg-purple-50 p-3 rounded border border-purple-100">
                                                <div className="text-xs font-semibold text-purple-600 mb-1">{res.question}</div>
                                                <div className="text-sm">{res.answer}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button variant="outline" onClick={() => handleResendEmail(selectedInquiry._id)}>
                                    <MailCheck className="w-4 h-4 mr-2" /> Resend Receipt Email
                                </Button>
                                <Button variant="destructive" onClick={() => handleDelete(selectedInquiry._id)}>
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
