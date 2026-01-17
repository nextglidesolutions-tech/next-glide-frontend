import { useState, useEffect, useRef } from "react";
import { Groq } from "groq-sdk";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Loader2, Bot, User } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from "@/lib/utils";

// Initialize Groq SDK
// dangerouslyAllowBrowser is needed because we are using it directly in frontend
// In production, it's safer to proxy through backend, but for this task we do it here
const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
});

type Message = {
    role: "user" | "assistant" | "system";
    content: string;
};

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [servicesData, setServicesData] = useState<any[]>([]);
    const [solutionsData, setSolutionsData] = useState<any[]>([]);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Fetch Context Data on Mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
                const [servicesRes, solutionsRes] = await Promise.all([
                    fetch(`${apiUrl}/api/services`),
                    fetch(`${apiUrl}/api/solutions`),
                ]);

                if (servicesRes.ok) setServicesData(await servicesRes.json());
                if (solutionsRes.ok) setSolutionsData(await solutionsRes.json());
            } catch (error) {
                console.error("Failed to fetch context data for chatbot", error);
            }
        };
        fetchData();
    }, []);

    // Initial Welcome Message
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    role: "assistant",
                    content: "Hello! I'm your NextGlide assistant. I can help you find the perfect services and solutions for your business. How can I assist you today?",
                },
            ]);
        }
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // Construct System Prompt with Data
            const systemPrompt = `
You are a friendly, welcoming, and professional AI assistant for NextGlide.
Your goal is to help users understand our Services and Solutions and guide them to apply or learn more.
Be concise but helpful. Keep the "temperature" low (factual and nice).

Here is the data about our SERVICES:
${JSON.stringify(servicesData.map(s => ({ name: s.name, category: s.category, description: s.shortDescription, benefits: s.keyFeatures })))}

Here is the data about our SOLUTIONS:
${JSON.stringify(solutionsData.map(s => ({ name: s.name, category: s.category, description: s.shortDescription, benefits: s.keyFeatures })))}

Instructions:
1. If asked about services, list them nicely and mention their key benefits.
2. If asked about solutions, explain them clearly.
3. Always be polite and encouraging.
4. If a user seems interested, encourage them to "Apply" or "Contact Us".
5. Keep responses relatively short.
`;

            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    ...messages.filter(m => m.role !== "system"), // Send history
                    userMessage
                ],
                model: "llama-3.3-70b-versatile", // Using a reliable model available on Groq
                temperature: 0.5,
                max_completion_tokens: 1024,
                top_p: 1,
                stream: false, // Simple implementation first, change to stream if needed (user gave code for stream but this is easier for state)
            });

            const botResponseContent = chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't process that.";

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: botResponseContent },
            ]);

        } catch (error) {
            console.error("Groq API Error:", error);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "I'm having trouble connecting right now. Please try again later." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!servicesData.length && !solutionsData.length) {
        // Optional: Don't render or show loading state if data isn't ready, 
        // but usually we want to let it load in background.
    }

    return (
        <>
            {/* Floating Action Button - Left Side */}
            <div className="fixed bottom-8 left-8 z-[100]">
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "h-14 w-14 rounded-full shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-teal-500 hover:scale-105",
                        isOpen ? "rotate-90" : "animate-bounce-slow"
                    )}
                >
                    {isOpen ? <X className="h-6 w-6 text-white" /> : <MessageCircle className="h-7 w-7 text-white" />}
                </Button>
            </div>

            {/* Chat Window */}
            <div
                className={cn(
                    "fixed bottom-24 left-8 z-[99] w-[350px] sm:w-[400px] transition-all duration-300 ease-in-out transform origin-bottom-left",
                    isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
                )}
            >
                <Card className="border-border/50 shadow-2xl backdrop-blur-md bg-card/95 flex flex-col h-[500px]">
                    <CardHeader className="bg-gradient-to-r from-blue-600/10 to-teal-500/10 border-b border-border/50 py-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-blue-500 to-teal-400 p-2 rounded-lg">
                                <Bot className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-600">NextGlide Assistant</CardTitle>
                                <p className="text-xs text-muted-foreground">Ask me about Services & Solutions</p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 p-0 overflow-hidden">
                        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                            <div className="flex flex-col gap-4">
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "flex items-start gap-2 max-w-[85%]",
                                            msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                            msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                                        )}>
                                            {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                        </div>
                                        <div className={cn(
                                            "p-3 rounded-2xl text-sm prose prose-sm max-w-none break-words dark:prose-invert",
                                            msg.role === "user"
                                                ? "bg-primary text-primary-foreground rounded-tr-none prose-headings:text-primary-foreground prose-p:text-primary-foreground prose-strong:text-primary-foreground prose-li:text-primary-foreground"
                                                : "bg-muted text-foreground rounded-tl-none"
                                        )}>
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm ml-10">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Thinking...
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>

                    <CardFooter className="p-3 border-t border-border/50 bg-muted/20">
                        <div className="flex w-full items-center gap-2">
                            <Input
                                placeholder="Type a message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-1 bg-background/50 focus-visible:ring-indigo-500"
                            />
                            <Button
                                size="icon"
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}
