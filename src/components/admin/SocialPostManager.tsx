import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Edit, Plus, Save, Image as ImageIcon, Calendar, Eye, EyeOff, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface Category {
    _id: string;
    name: string;
}

interface SocialPost {
    _id: string;
    title: string;
    category?: Category;
    caption: string;
    hashtags: string;
    imageUrl: string;
    scheduledAt: string;
    status: 'Draft' | 'Scheduled' | 'Published';
    isHidden: boolean;
    likes: number;
    shares: number;
    comments: any[];
    createdAt: string;
}

export default function SocialPostManager() {
    const [posts, setPosts] = useState<SocialPost[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    // Filtering State
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [filterDate, setFilterDate] = useState<string>('');

    // Category Mgmt State
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        categoryId: '',
        caption: '',
        hashtags: '',
        scheduledAt: '',
        status: 'Draft'
    });

    const { toast } = useToast();
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

    useEffect(() => {
        fetchCategories();
        fetchPosts();
    }, [filterCategory, filterDate]);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${apiUrl}/api/categories`);
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchPosts = async () => {
        setLoading(true);
        try {
            let url = `${apiUrl}/api/social-posts?view=admin`;
            if (filterCategory !== 'all') url += `&categoryId=${filterCategory}`;
            if (filterDate) url += `&date=${filterDate}`;

            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to fetch social posts.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;
        try {
            const res = await fetch(`${apiUrl}/api/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategoryName })
            });
            if (res.ok) {
                toast({ title: 'Category Created' });
                setNewCategoryName('');
                setIsCategoryModalOpen(false);
                fetchCategories();
            }
        } catch (error) {
            console.error('Error creating category:', error);
        }
    };

    const handleEdit = (post: SocialPost) => {
        setEditingPost(post);
        setFormData({
            title: post.title,
            categoryId: post.category?._id || '',
            caption: post.caption,
            hashtags: post.hashtags || '',
            scheduledAt: post.scheduledAt ? new Date(post.scheduledAt).toISOString().slice(0, 16) : '',
            status: post.status as any
        });
        setPreviewUrl(post.imageUrl || '');
        setSelectedFile(null);
    };

    const handleReset = () => {
        setEditingPost(null);
        setFormData({
            title: '',
            categoryId: '',
            caption: '',
            hashtags: '',
            scheduledAt: '',
            status: 'Draft'
        });
        setPreviewUrl('');
        setSelectedFile(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.caption) {
            toast({
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Title and Caption are required.',
            });
            return;
        }

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('categoryId', formData.categoryId);
            data.append('caption', formData.caption);
            data.append('hashtags', formData.hashtags);
            data.append('status', formData.status);

            if (formData.scheduledAt) {
                data.append('scheduledAt', formData.scheduledAt);
            }

            if (selectedFile) {
                data.append('image', selectedFile);
            } else if (previewUrl && !selectedFile) {
                if (editingPost) {
                    // Keeps existing URL in backend logic if no file provided
                }
            }

            const method = editingPost ? 'PUT' : 'POST';
            const url = editingPost
                ? `${apiUrl}/api/social-posts/${editingPost._id}`
                : `${apiUrl}/api/social-posts`;

            const res = await fetch(url, {
                method,
                body: data,
            });

            const responseData = await res.json();

            if (res.ok && responseData.success) {
                toast({
                    title: 'Success',
                    description: `Post ${editingPost ? 'updated' : 'created'} successfully.`,
                });
                handleReset();
                fetchPosts();
            } else {
                throw new Error(responseData.message || 'Failed to save');
            }
        } catch (error: any) {
            console.error('Error saving post:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to save post.',
            });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        try {
            const res = await fetch(`${apiUrl}/api/social-posts/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setPosts(posts.filter(p => p._id !== id));
                toast({ title: 'Deleted', description: 'Post deleted successfully.' });
                if (editingPost?._id === id) handleReset();
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const toggleVisibility = async (post: SocialPost) => {
        try {
            const res = await fetch(`${apiUrl}/api/social-posts/${post._id}/toggle-visibility`, {
                method: 'PUT'
            });
            if (res.ok) {
                const updated = await res.json();
                setPosts(posts.map(p => p._id === post._id ? { ...p, isHidden: updated.isHidden } : p));
                toast({ title: updated.isHidden ? 'Post Hidden' : 'Post Visible' });
            }
        } catch (error) {
            console.error('Error toggling visibility:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Published': return 'bg-green-100 text-green-800 hover:bg-green-200';
            case 'Scheduled': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
            default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Form */}
            <Card className="lg:col-span-1 h-fit">
                <CardHeader>
                    <CardTitle>{editingPost ? 'Edit Post' : 'Create New Post'}</CardTitle>
                    <CardDescription>Manage your social media content.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Post internal title"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label>Category</Label>
                                <Button type="button" variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => setIsCategoryModalOpen(true)}>
                                    + New Category
                                </Button>
                            </div>
                            <Select
                                value={formData.categoryId}
                                onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Caption</Label>
                            <Textarea
                                value={formData.caption}
                                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                                placeholder="Post caption..."
                                rows={5}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Hashtags</Label>
                            <Input
                                value={formData.hashtags}
                                onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
                                placeholder="#tech #startup"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Image</Label>
                            <div className="flex flex-col gap-2">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                {previewUrl && (
                                    <div className="relative w-full h-40 bg-muted rounded-md overflow-hidden border">
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Schedule Date</Label>
                            <Input
                                type="datetime-local"
                                value={formData.scheduledAt}
                                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(val) => setFormData({ ...formData, status: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Draft">Draft</SelectItem>
                                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                                    <SelectItem value="Published">Published</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button type="submit" className="flex-1">
                                {editingPost ? 'Update Post' : 'Create Post'}
                            </Button>
                            {editingPost && (
                                <Button type="button" variant="outline" onClick={handleReset}>
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Right Column: List */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle>Existing Posts</CardTitle>
                            <CardDescription>View and manage all your posts.</CardDescription>
                        </div>
                        {/* Filters */}
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Select value={filterCategory} onValueChange={setFilterCategory}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map(cat => (
                                        <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input
                                type="date"
                                className="w-auto"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                            />
                            {(filterCategory !== 'all' || filterDate) && (
                                <Button variant="ghost" size="icon" onClick={() => { setFilterCategory('all'); setFilterDate(''); }}>
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {loading ? (
                            <p className="text-center text-muted-foreground py-10">Loading posts...</p>
                        ) : posts.length === 0 ? (
                            <p className="text-center text-muted-foreground py-10">No posts found.</p>
                        ) : (
                            posts.map((post) => (
                                <div key={post._id} className={`group flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:border-accent/50 transition-colors bg-card ${post.isHidden ? 'opacity-60 bg-muted/20' : ''}`}>
                                    {/* Thumbnail */}
                                    <div className="w-full sm:w-32 h-32 bg-muted rounded-md overflow-hidden flex-shrink-0 relative">
                                        {post.imageUrl ? (
                                            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                <ImageIcon className="w-8 h-8 opacity-20" />
                                            </div>
                                        )}
                                        {post.isHidden && (
                                            <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                                                <EyeOff className="w-8 h-8 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <div>
                                                    <h3 className="font-semibold truncate pr-2">{post.title}</h3>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                                        {post.category && (
                                                            <Badge variant="outline" className="text-xs font-normal">
                                                                {post.category.name}
                                                            </Badge>
                                                        )}
                                                        {post.scheduledAt && (
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {new Date(post.scheduledAt).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <Badge className={`text-xs whitespace-nowrap ${getStatusColor(post.status)}`}>
                                                        {post.status}
                                                    </Badge>
                                                    <div className="text-[10px] text-muted-foreground">
                                                        {post.likes} likes • {post.comments?.length || 0} comments
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                                {post.caption}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-end gap-2 mt-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleVisibility(post)}
                                                title={post.isHidden ? "Unhide Post" : "Hide Post"}
                                                className={post.isHidden ? "text-orange-500 hover:text-orange-600" : "text-muted-foreground"}
                                            >
                                                {post.isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(post)}>
                                                <Edit className="w-4 h-4 mr-1" /> Edit
                                            </Button>
                                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(post._id)}>
                                                <Trash2 className="w-4 h-4 mr-1" /> Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Create Category Modal */}
            <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Category</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Label>Category Name</Label>
                        <Input
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="e.g., AI, ServiceNow, Events"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCategoryModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateCategory}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
