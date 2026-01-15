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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Download, RefreshCw, Trash2, Mail, Send, Users, Briefcase, FileText, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import JobManager from '@/components/admin/JobManager';
import FormBuilder from '@/components/admin/FormBuilder';

interface Contact {
    _id: string;
    name: string;
    email: string;
    company: string;
    phone: string;
    subject: string;
    message: string;
    createdAt: string;
}

export default function AdminDashboard() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Custom Email Modal State
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [emailSubject, setEmailSubject] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const [sendingEmail, setSendingEmail] = useState(false);

    const { toast } = useToast();

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/contacts`);
            if (response.ok) {
                const data = await response.json();
                setContacts(data);
            }
        } catch (error) {
            console.error('Failed to fetch contacts', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to fetch contacts.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this contact? This action cannot be undone.')) return;

        setActionLoading(id);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/contacts/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setContacts(contacts.filter(c => c._id !== id));
                toast({
                    title: 'Contact Deleted',
                    description: 'The contact has been successfully removed.',
                });
            } else {
                throw new Error('Failed to delete');
            }
        } catch (error) {
            console.error('Error deleting contact:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to delete contact.',
            });
        } finally {
            setActionLoading(null);
        }
    };

    const handleResendWelcome = async (contact: Contact) => {
        setActionLoading(contact._id);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/contacts/resend-welcome/${contact._id}`, {
                method: 'POST',
            });

            if (response.ok) {
                toast({
                    title: 'Email Sent',
                    description: `Welcome email resent to ${contact.email}`,
                });
            } else {
                throw new Error('Failed to resend');
            }
        } catch (error) {
            console.error('Error resending email:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to resend welcome email.',
            });
        } finally {
            setActionLoading(null);
        }
    };

    const openEmailModal = (contact: Contact) => {
        setSelectedContact(contact);
        setEmailSubject(`Re: ${contact.subject}`);
        setEmailMessage(`Dear ${contact.name},\n\nRegarding your inquiry about "${contact.subject}"...\n\nBest regards,\nNextGlide Team`);
        setIsEmailModalOpen(true);
    };

    const handleSendCustomEmail = async () => {
        if (!selectedContact) return;
        setSendingEmail(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/contacts/custom-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    toEmail: selectedContact.email,
                    subject: emailSubject,
                    message: emailMessage,
                }),
            });

            if (response.ok) {
                toast({
                    title: 'Email Sent',
                    description: `Custom email sent to ${selectedContact.email}`,
                });
                setIsEmailModalOpen(false);
            } else {
                throw new Error('Failed to send');
            }
        } catch (error) {
            console.error('Error sending custom email:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to send custom email.',
            });
        } finally {
            setSendingEmail(false);
        }
    };

    const exportToCSV = () => {
        const headers = ['Name', 'Email', 'Company', 'Phone', 'Subject', 'Message', 'Date'];
        const csvContent = [
            headers.join(','),
            ...contacts.map(c => [
                `"${c.name}"`,
                `"${c.email}"`,
                `"${c.company || ''}"`,
                `"${c.phone || ''}"`,
                `"${c.subject}"`,
                `"${c.message.replace(/"/g, '""')}"`,
                `"${new Date(c.createdAt).toLocaleDateString()}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'contacts_export.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <AdminLayout>
            <div className="p-8">
                <Tabs defaultValue="contacts" className="w-full">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                            <p className="text-muted-foreground">Manage your website content and inquiries.</p>
                        </div>
                        <TabsList>
                            <TabsTrigger value="contacts" className="flex items-center gap-2">
                                <Users className="w-4 h-4" /> Contacts
                            </TabsTrigger>
                            <TabsTrigger value="jobs" className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4" /> Careers
                            </TabsTrigger>
                            <TabsTrigger value="forms" className="flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Form Builder
                            </TabsTrigger>
                            <TabsTrigger value="forms" className="flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Form Builder
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="contacts">
                        <div className="flex justify-end mb-4 gap-4">
                            <Button variant="outline" onClick={fetchContacts}>
                                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                            <Button onClick={exportToCSV}>
                                <Download className="w-4 h-4 mr-2" />
                                Export to Excel
                            </Button>
                        </div>

                        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[120px]">Date</TableHead>
                                            <TableHead className="w-[180px]">Name</TableHead>
                                            <TableHead className="w-[220px]">Email</TableHead>
                                            <TableHead className="w-[200px]">Subject</TableHead>
                                            <TableHead>Message</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-24 text-center">Loading...</TableCell>
                                            </TableRow>
                                        ) : contacts.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-24 text-center">No contacts found.</TableCell>
                                            </TableRow>
                                        ) : (
                                            contacts.map((contact) => (
                                                <TableRow key={contact._id} className="hover:bg-muted/50">
                                                    <TableCell className="font-medium whitespace-nowrap">
                                                        {new Date(contact.createdAt).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="font-semibold">{contact.name}</TableCell>
                                                    <TableCell>{contact.email}</TableCell>
                                                    <TableCell>{contact.subject}</TableCell>
                                                    <TableCell className="max-w-md truncate" title={contact.message}>
                                                        {contact.message}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => openEmailModal(contact)}
                                                                title="Send Custom Email"
                                                            >
                                                                <Mail className="w-4 h-4 text-blue-500" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleResendWelcome(contact)}
                                                                disabled={actionLoading === contact._id}
                                                                title="Resend Welcome Email"
                                                            >
                                                                <RefreshCw className={`w-4 h-4 text-green-500 ${actionLoading === contact._id ? 'animate-spin' : ''}`} />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleDelete(contact._id)}
                                                                disabled={actionLoading === contact._id}
                                                                title="Delete Contact"
                                                            >
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
                    </TabsContent>

                    <TabsContent value="jobs">
                        <JobManager />
                    </TabsContent>

                    <TabsContent value="forms">
                        <FormBuilder />
                    </TabsContent>

                    <TabsContent value="forms">
                        <FormBuilder />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Custom Email Modal */}
            <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Send Email to {selectedContact?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                value={emailSubject}
                                onChange={(e) => setEmailSubject(e.target.value)}
                                placeholder="Email Subject"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                value={emailMessage}
                                onChange={(e) => setEmailMessage(e.target.value)}
                                placeholder="Type your message here..."
                                rows={6}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEmailModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSendCustomEmail} disabled={sendingEmail}>
                            {sendingEmail ? (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Send Email
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
