import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageCircle, Share2, Send, Calendar, TrendingUp, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Category {
    _id: string;
    name: string;
}

interface Comment {
    text: string;
    createdAt: string;
}

interface SocialPost {
    _id: string;
    title: string;
    category?: Category;
    caption: string;
    hashtags?: string;
    imageUrl?: string;
    likes: number;
    shares: number;
    comments: Comment[];
    createdAt: string;
}

export default function SocialConnects() {
    const [posts, setPosts] = useState<SocialPost[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // UI State
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('trending'); // trending | recent
    const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());

    // Interaction State
    const [commentInput, setCommentInput] = useState<{ [key: string]: string }>({});
    const [activeCommentId, setActiveCommentId] = useState<string | null>(null);

    const { toast } = useToast();
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [activeCategory, sortBy]);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${apiUrl}/api/categories`);
            if (res.ok) setCategories(await res.json());
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchPosts = async () => {
        setLoading(true);
        try {
            let url = `${apiUrl}/api/social-posts?sort=${sortBy}`;
            if (activeCategory !== 'all') {
                url += `&categoryId=${activeCategory}`;
            }

            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleReadMore = (id: string) => {
        const newExpanded = new Set(expandedPosts);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedPosts(newExpanded);
    };

    const handleLike = async (id: string) => {
        try {
            const res = await fetch(`${apiUrl}/api/social-posts/${id}/like`, { method: 'POST' });
            if (res.ok) {
                const updatedPost = await res.json();
                setPosts(posts.map(p => p._id === id ? { ...p, likes: updatedPost.likes } : p));
            }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleShare = async (id: string) => {
        try {
            navigator.clipboard.writeText(`${window.location.origin}/social-connects`);
            toast({
                title: 'Link Copied!',
                description: 'Post link copied to clipboard.',
            });

            const res = await fetch(`${apiUrl}/api/social-posts/${id}/share`, { method: 'POST' });
            if (res.ok) {
                const updatedPost = await res.json();
                setPosts(posts.map(p => p._id === id ? { ...p, shares: updatedPost.shares } : p));
            }
        } catch (error) {
            console.error('Error sharing post:', error);
        }
    };

    const handleComment = async (id: string) => {
        const text = commentInput[id];
        if (!text?.trim()) return;

        try {
            const res = await fetch(`${apiUrl}/api/social-posts/${id}/comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });

            if (res.ok) {
                const updatedPost = await res.json();
                setPosts(posts.map(p => p._id === id ? { ...p, comments: updatedPost.comments } : p));
                setCommentInput({ ...commentInput, [id]: '' });
                toast({
                    title: 'Comment Added',
                    description: 'Your comment has been posted.',
                });
            }
        } catch (error) {
            console.error('Error commenting:', error);
        }
    };

    return (
        <Layout>
            {/* Hero Section */}
            <section className="pt-32 pb-10 hero-gradient relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 right-20 w-72 h-72 bg-accent rounded-full blur-3xl" />
                </div>
                <div className="container-custom relative z-10">
                    <div className="max-w-4xl text-center md:text-left">
                        <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
                            Community & Updates
                        </span>
                        <h1 className="heading-1 text-primary-foreground mb-6">
                            Social Connects
                        </h1>
                        <p className="body-large text-primary-foreground/80 max-w-2xl">
                            Stay updated with our latest news, insights, and community stories.
                            Connect, share, and grow with us.
                        </p>
                    </div>
                </div>
            </section>

            {/* Filter & Sort Section */}
            <section className="py-8 bg-background border-b sticky top-20 z-40 backdrop-blur-md bg-background/95 supports-[backdrop-filter]:bg-background/60">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        {/* Category Cloud */}
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            <Button
                                variant={activeCategory === 'all' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setActiveCategory('all')}
                                className="rounded-full"
                            >
                                All
                            </Button>
                            {categories.map(cat => (
                                <Button
                                    key={cat._id}
                                    variant={activeCategory === cat._id ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setActiveCategory(cat._id)}
                                    className="rounded-full"
                                >
                                    {cat.name}
                                </Button>
                            ))}
                        </div>

                        {/* Sort Tabs */}
                        <Tabs value={sortBy} onValueChange={setSortBy} className="w-[200px]">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="trending" className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" /> Trending
                                </TabsTrigger>
                                <TabsTrigger value="recent" className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> Latest
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>
            </section>

            {/* Posts Grid Section */}
            <section className="py-12 bg-gray-50/50 min-h-[500px]">
                <div className="container-custom">
                    {loading ? (
                        <div className="text-center py-20 animate-pulse">Loading posts...</div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                <MessageCircle className="w-8 h-8 opacity-20" />
                            </div>
                            <p>No posts available in this category yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {posts.map((post) => (
                                <Card key={post._id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 flex flex-col h-full bg-card hover:border-accent/30 hover:-translate-y-1">
                                    {/* Image Section */}
                                    {post.imageUrl && (
                                        <div className="w-full h-48 overflow-hidden bg-muted relative">
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                                            <img
                                                src={post.imageUrl}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            {/* Category Badge */}
                                            {post.category && (
                                                <Badge className="absolute top-3 right-3 bg-background/90 text-foreground backdrop-blur-sm shadow-sm hover:bg-background text-xs px-3 py-1">
                                                    {post.category.name}
                                                </Badge>
                                            )}
                                        </div>
                                    )}

                                    <CardHeader className="p-4 pb-2">
                                        <h3 className="text-xl font-bold line-clamp-2 leading-tight group-hover:text-accent transition-colors text-foreground">
                                            {post.title}
                                        </h3>
                                        <div className="text-xs text-muted-foreground mt-2 flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </div>
                                            {post.likes > 5 && (
                                                <div className="flex items-center gap-1 text-orange-500 font-medium bg-orange-50 px-2 py-0.5 rounded-full">
                                                    <TrendingUp className="w-3 h-3" /> Trending
                                                </div>
                                            )}
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-4 pt-2 flex-grow">
                                        <div className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                                            {expandedPosts.has(post._id) ? post.caption : (
                                                <span className="line-clamp-3">{post.caption}</span>
                                            )}
                                        </div>
                                        {post.caption.length > 100 && (
                                            <Button
                                                variant="link"
                                                className="p-0 h-auto text-accent font-semibold mt-2 text-xs"
                                                onClick={() => toggleReadMore(post._id)}
                                            >
                                                {expandedPosts.has(post._id) ? 'Read Less' : 'Read More'}
                                            </Button>
                                        )}
                                        {post.hashtags && (
                                            <div className="mt-4 text-xs text-blue-600 font-medium tracking-wide">
                                                {post.hashtags}
                                            </div>
                                        )}
                                    </CardContent>

                                    <CardFooter className="p-4 pt-0 flex flex-col gap-3 border-t bg-muted/30 mt-auto">
                                        {/* Action Buttons */}
                                        <div className="flex items-center justify-between w-full pt-3">
                                            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors" onClick={() => handleLike(post._id)}>
                                                <ThumbsUp className={`w-4 h-4 ${post.likes > 0 ? 'fill-accent text-accent' : ''}`} />
                                                <span className="text-xs font-medium">{post.likes}</span>
                                            </Button>

                                            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors" onClick={() => setActiveCommentId(activeCommentId === post._id ? null : post._id)}>
                                                <MessageCircle className="w-4 h-4" />
                                                <span className="text-xs font-medium">{post.comments.length}</span>
                                            </Button>

                                            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors" onClick={() => handleShare(post._id)}>
                                                <Share2 className="w-4 h-4" />
                                                <span className="text-xs font-medium">{post.shares}</span>
                                            </Button>
                                        </div>

                                        {/* Comments Section */}
                                        {activeCommentId === post._id && (
                                            <div className="w-full space-y-3 pt-2 animate-in fade-in slide-in-from-top-2">
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="Add a comment..."
                                                        className="h-8 text-xs bg-background shadow-sm"
                                                        value={commentInput[post._id] || ''}
                                                        onChange={(e) => setCommentInput({ ...commentInput, [post._id]: e.target.value })}
                                                        onKeyDown={(e) => e.key === 'Enter' && handleComment(post._id)}
                                                    />
                                                    <Button size="icon" className="h-8 w-8 shrink-0" onClick={() => handleComment(post._id)}>
                                                        <Send className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                                {post.comments.length > 0 && (
                                                    <div className="max-h-32 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                                                        {post.comments.slice().reverse().map((comment, idx) => (
                                                            <div key={idx} className="bg-background p-2.5 rounded-md border text-xs text-foreground/80 shadow-sm">
                                                                {comment.text}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
}
