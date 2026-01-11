import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
    DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Trash2, Pencil, FileText, CheckCircle2, X, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminServiceForms() {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedService, setSelectedService] = useState<any>(null);
    const [isEditMode, setIsEditMode] = useState(false);

    // Form Field Modal State
    const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
    const [currentField, setCurrentField] = useState<any>({
        label: '',
        fieldType: 'text',
        options: '', // comma separated string for edit
        required: false,
        placeholder: ''
    });
    const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);

    const { toast } = useToast();

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/services`);
            if (response.ok) {
                const data = await response.json();
                setServices(data);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to load services' });
        } finally {
            setLoading(false);
        }
    };

    const handleServiceSelect = async (slug: string) => {
        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/services/${slug}`);
            if (response.ok) {
                const data = await response.json();
                setSelectedService(data);
                setIsEditMode(true);
            }
        } catch (error) {
            console.error('Error fetching service details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveForm = async () => {
        if (!selectedService) return;

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/services/${selectedService._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    inquiryFormFields: selectedService.inquiryFormFields
                }),
            });

            if (response.ok) {
                toast({ title: 'Success', description: 'Enquiry form updated successfully' });
                setIsEditMode(false);
                setSelectedService(null);
                fetchServices(); // Refresh list if needed (though mostly static)
            } else {
                throw new Error('Failed to save service form');
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to save form configuration' });
        }
    };

    // --- FIELD HANDLERS ---

    const openAddFieldModal = () => {
        setCurrentField({ label: '', fieldType: 'text', options: '', required: false, placeholder: '' });
        setEditingFieldIndex(null);
        setIsFieldModalOpen(true);
    };

    const openEditFieldModal = (field: any, index: number) => {
        setCurrentField({
            ...field,
            options: Array.isArray(field.options) ? field.options.join(', ') : ''
        });
        setEditingFieldIndex(index);
        setIsFieldModalOpen(true);
    };

    const handleSaveField = () => {
        if (!currentField.label) {
            toast({ variant: 'destructive', title: 'Error', description: 'Label is required' });
            return;
        }

        const newField = {
            ...currentField,
            options: currentField.options ? currentField.options.split(',').map((s: string) => s.trim()).filter(Boolean) : []
        };

        const updatedFields = [...(selectedService.inquiryFormFields || [])];

        if (editingFieldIndex !== null) {
            updatedFields[editingFieldIndex] = newField;
        } else {
            updatedFields.push(newField);
        }

        setSelectedService({ ...selectedService, inquiryFormFields: updatedFields });
        setIsFieldModalOpen(false);
    };

    const handleDeleteField = (index: number) => {
        const updatedFields = [...(selectedService.inquiryFormFields || [])];
        updatedFields.splice(index, 1);
        setSelectedService({ ...selectedService, inquiryFormFields: updatedFields });
    };

    return (
        <AdminLayout>
            <div className="p-8 h-full flex flex-col">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            Service Form Builder
                        </h1>
                        <p className="text-muted-foreground">Customize the enquiry form questions for each service.</p>
                    </div>
                </div>

                {!isEditMode ? (
                    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Service Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Custom Questions</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {services.map((svc) => (
                                    <TableRow key={svc._id} className="hover:bg-muted/50 cursor-pointer" onClick={() => handleServiceSelect(svc.slug)}>
                                        <TableCell className="font-semibold">{svc.name}</TableCell>
                                        <TableCell>{svc.category}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${svc.inquiryFormFields?.length > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {svc.inquiryFormFields?.length || 0} Fields
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" className="text-blue-600">
                                                <Pencil className="w-4 h-4 mr-2" /> Configure
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="flex gap-8 h-full overflow-hidden">
                        {/* LEFT: FORM BUILDER */}
                        <div className="w-1/2 flex flex-col bg-white rounded-xl border shadow-sm h-full">
                            <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
                                <div>
                                    <h3 className="font-bold text-lg">{selectedService.name} Form</h3>
                                    <p className="text-xs text-muted-foreground">Add questions users must answer to apply.</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => { setIsEditMode(false); setSelectedService(null); }}>
                                        Cancel
                                    </Button>
                                    <Button size="sm" onClick={handleSaveForm}>
                                        Save Form
                                    </Button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {(selectedService.inquiryFormFields || []).length === 0 && (
                                    <div className="text-center py-12 border-2 border-dashed rounded-xl bg-gray-50 text-gray-400">
                                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>No custom questions added yet.</p>
                                        <Button variant="link" onClick={openAddFieldModal}>Add your first question</Button>
                                    </div>
                                )}

                                {(selectedService.inquiryFormFields || []).map((field: any, idx: number) => (
                                    <div key={idx} className={`p-4 border rounded-lg shadow-sm hover:border-blue-300 relative group transition-all ${field.isVisible === false ? 'bg-gray-100 opacity-75' : 'bg-white'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
                                                    {idx + 1}
                                                </span>
                                                <h4 className="font-semibold text-gray-800">{field.label}</h4>
                                                {field.required && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Required</span>}
                                                {field.isVisible === false && <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded flex items-center gap-1"><EyeOff className="w-3 h-3" /> Hidden</span>}
                                            </div>
                                            <div className="flex gap-1 opaciy-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-blue-600" onClick={() => {
                                                    const updated = [...selectedService.inquiryFormFields];
                                                    updated[idx].isVisible = field.isVisible === false ? true : false;
                                                    setSelectedService({ ...selectedService, inquiryFormFields: updated });
                                                }}>
                                                    {field.isVisible === false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-blue-600" onClick={() => openEditFieldModal(field, idx)}>
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-red-600" onClick={() => handleDeleteField(idx)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="pl-8 text-sm text-gray-500">
                                            <span className="bg-gray-100 px-2 py-0.5 rounded text-xs uppercase tracking-wide mr-2">{field.fieldType}</span>
                                            {field.placeholder && <span className="italic mr-2">Placeholder: "{field.placeholder}"</span>}
                                            {field.options && field.options.length > 0 && (
                                                <div className="mt-1 flex flex-wrap gap-1">
                                                    {field.options.map((opt: string, i: number) => (
                                                        <span key={i} className="text-xs border px-1.5 rounded bg-gray-50">{opt}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <Button variant="outline" className="w-full border-dashed py-6 text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50" onClick={openAddFieldModal}>
                                    <Plus className="w-4 h-4 mr-2" /> Add Question
                                </Button>
                            </div>
                        </div>

                        {/* RIGHT: PREVIEW */}
                        <div className="w-1/2 bg-gray-100 rounded-xl p-8 border overflow-y-auto">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">User View Preview</h3>

                            <div className="bg-white rounded-lg shadow-sm border p-6 max-w-md mx-auto">
                                <h2 className="text-xl font-bold mb-1">Apply for {selectedService.name}</h2>
                                <p className="text-sm text-muted-foreground mb-6">Please fill out the details below...</p>

                                <div className="space-y-4 opacity-50 pointer-events-none mb-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1"><Label>Full Name *</Label><Input placeholder="John Doe" /></div>
                                        <div className="space-y-1"><Label>Email *</Label><Input placeholder="john@example.com" /></div>
                                    </div>
                                    {/* ... standard fields ... */}
                                </div>

                                <div className="space-y-4 pt-4 border-t border-dashed">
                                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-2">Custom Questions</h4>

                                    {(selectedService.inquiryFormFields || []).length === 0 && <p className="text-sm italic text-muted-foreground">No extra questions.</p>}

                                    {(selectedService.inquiryFormFields || []).map((field: any, idx: number) => (
                                        <div key={idx} className="space-y-2">
                                            <Label>
                                                {field.label} {field.required && <span className="text-red-500">*</span>}
                                            </Label>

                                            {field.fieldType === 'textarea' ? (
                                                <Textarea placeholder={field.placeholder} />
                                            ) : field.fieldType === 'dropdown' ? (
                                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                                    {(field.options || []).map((opt: string, i: number) => <option key={i}>{opt}</option>)}
                                                </select>
                                            ) : field.fieldType === 'checkbox' ? (
                                                <div className="flex items-center space-x-2">
                                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                                                    <span className="text-sm text-gray-500">Yes</span>
                                                </div>
                                            ) : (
                                                <Input placeholder={field.placeholder} />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <Button className="w-full mt-6">Submit Application</Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ADD/EDIT FIELD MODAL */}
                <Dialog open={isFieldModalOpen} onOpenChange={setIsFieldModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingFieldIndex !== null ? 'Edit Question' : 'Add New Question'}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Question / Label</Label>
                                <Input
                                    value={currentField.label}
                                    onChange={(e) => setCurrentField({ ...currentField, label: e.target.value })}
                                    placeholder="e.g. What is your preferred tech stack?"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Input Type</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={currentField.fieldType}
                                    onChange={(e) => setCurrentField({ ...currentField, fieldType: e.target.value })}
                                >
                                    <option value="text">Short Text</option>
                                    <option value="textarea">Long Text / Description</option>
                                    <option value="dropdown">Dropdown Selection</option>
                                    {/* <option value="checkbox">Checkbox (Yes/No)</option> */}
                                </select>
                            </div>

                            {currentField.fieldType === 'dropdown' && (
                                <div className="space-y-2 animate-in fade-in zoom-in-95">
                                    <Label>Options (Comma Separated)</Label>
                                    <Input
                                        value={currentField.options}
                                        onChange={(e) => setCurrentField({ ...currentField, options: e.target.value })}
                                        placeholder="Option 1, Option 2, Option 3"
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label>Placeholder Text (Optional)</Label>
                                <Input
                                    value={currentField.placeholder}
                                    onChange={(e) => setCurrentField({ ...currentField, placeholder: e.target.value })}
                                    placeholder="e.g. Type your answer here..."
                                />
                            </div>

                            <div className="flex items-center space-x-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="req"
                                    className="h-4 w-4 rounded border-gray-300"
                                    checked={currentField.required}
                                    onChange={(e) => setCurrentField({ ...currentField, required: e.target.checked })}
                                />
                                <Label htmlFor="req" className="mb-0 cursor-pointer">Required Field?</Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsFieldModalOpen(false)}>Cancel</Button>
                            <Button onClick={handleSaveField}>Add to Form</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
