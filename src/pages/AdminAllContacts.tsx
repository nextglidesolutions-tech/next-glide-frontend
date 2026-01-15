import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2, Search, Trash2, Mail, ExternalLink, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminAllContacts() {
    const [contacts, setContacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterSource, setFilterSource] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState('');
    const { toast } = useToast();
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/contacts`);
            if (res.ok) {
                const data = await res.json();
                // Ensure data is sorted by date desc
                setContacts(data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
            }
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch contacts' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this contact?')) return;
        try {
            const res = await fetch(`${apiUrl}/api/contacts/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast({ title: 'Success', description: 'Contact deleted successfully' });
                setContacts(contacts.filter(c => c._id !== id));
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete contact' });
        }
    };

    const handleResendEmail = async (id: string) => {
        try {
            const res = await fetch(`${apiUrl}/api/contacts/resend-welcome/${id}`, { method: 'POST' });
            if (res.ok) {
                toast({ title: 'Success', description: 'Email resent successfully' });
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to resend email' });
        }
    };


    const filteredContacts = contacts.filter(contact => {
        const matchesSource = filterSource === 'All' || (contact.source || 'Other') === filterSource;
        const matchesSearch =
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSource && matchesSearch;
    });

    // Extract unique sources for filter
    const uniqueSources = Array.from(new Set(contacts.map(c => c.source || 'Other').filter(Boolean)));

    return (
        <AdminLayout>
            <div className="p-8">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="heading-2 text-foreground mb-2">All Contacts</h1>
                            <p className="text-muted-foreground">Unified view of all inquiries and submissions.</p>
                        </div>
                        <Button onClick={fetchContacts} variant="outline" size="sm">
                            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                        </Button>
                    </div>

                    <div className="bg-card rounded-xl border border-border shadow-sm p-4 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name or email..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="w-full md:w-[200px]">
                                <Select value={filterSource} onValueChange={setFilterSource}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by Source" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Sources</SelectItem>
                                        {uniqueSources.map(s => (
                                            <SelectItem key={s} value={s}>{s}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Source</TableHead>
                                    <TableHead>Interest / Details</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                                        </TableCell>
                                    </TableRow>
                                ) : filteredContacts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No contacts found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredContacts.map((contact) => (
                                        <TableRow key={contact._id}>
                                            <TableCell className="whitespace-nowrap">
                                                {new Date(contact.createdAt).toLocaleDateString()}
                                                <span className="block text-xs text-muted-foreground">
                                                    {new Date(contact.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </TableCell>
                                            <TableCell className="font-medium">{contact.name}</TableCell>
                                            <TableCell>{contact.email}</TableCell>
                                            <TableCell>
                                                <span className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                                                    {contact.source || 'General'}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-[200px] truncate" title={contact.message}>
                                                    <span className="font-medium block">{contact.interest || contact.subject}</span>
                                                    <span className="text-xs text-muted-foreground">{contact.message}</span>
                                                    {contact.resumeLink && (
                                                        <a href={contact.resumeLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center mt-1">
                                                            Resume <ExternalLink className="w-3 h-3 ml-1" />
                                                        </a>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleResendEmail(contact._id)} title="Resend Welcome Email">
                                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(contact._id)} title="Delete">
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
        </AdminLayout>
    );
}
