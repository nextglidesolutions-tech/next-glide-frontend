import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/layout/Layout';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === '652487') {
            localStorage.setItem('adminAuth', 'true');
            toast({
                title: "Access Granted",
                description: "Welcome to the Admin Panel.",
            });
            navigate('/admin/dashboard');
        } else {
            toast({
                variant: "destructive",
                title: "Access Denied",
                description: "Incorrect password. Please try again.",
            });
        }
    };

    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center bg-muted/20">
                <div className="w-full max-w-md p-8 bg-card rounded-xl shadow-card border border-border">
                    <h1 className="text-2xl font-bold text-center mb-6">Admin Access</h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Enter PIN Code</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="******"
                                className="text-center text-lg tracking-widest"
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Enter Admin Panel
                        </Button>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
