import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CalendarIcon, RefreshCw, MessageSquare, Download } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface ChatLog {
    _id: string;
    question: string;
    answer: string;
    timestamp: string;
}

export default function ChatLogViewer() {
    const [logs, setLogs] = useState<ChatLog[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<ChatLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState<Date | undefined>(undefined);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/chat-logs`);
            if (response.ok) {
                const data = await response.json();
                setLogs(data);
                setFilteredLogs(data);
            }
        } catch (error) {
            console.error('Error fetching chat logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    useEffect(() => {
        if (date) {
            const selectedDateStr = format(date, 'yyyy-MM-dd');
            const filtered = logs.filter((log) => {
                const logDateStr = format(new Date(log.timestamp), 'yyyy-MM-dd');
                return logDateStr === selectedDateStr;
            });
            setFilteredLogs(filtered);
        } else {
            setFilteredLogs(logs);
        }
    }, [date, logs]);

    const clearFilter = () => {
        setDate(undefined);
    };

    const exportToCSV = () => {
        if (filteredLogs.length === 0) return;

        const headers = ['Time', 'User Question', 'AI Answer'];
        const csvContent = [
            headers.join(','),
            ...filteredLogs.map(log => [
                `"${format(new Date(log.timestamp), 'PP p').replace(/"/g, '""')}"`,
                `"${log.question.replace(/"/g, '""')}"`,
                `"${log.answer.replace(/"/g, '""')}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `chatbot_logs_${format(new Date(), 'yyyy-MM-dd')}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Chatbot Q&A Logs</h2>
                    <p className="text-muted-foreground">
                        Monitor questions asked by users and the AI's responses.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={'outline'}
                                className={cn(
                                    'w-[240px] justify-start text-left font-normal',
                                    !date && 'text-muted-foreground'
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, 'PPP') : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    {date && (
                        <Button variant="ghost" onClick={clearFilter}>
                            Clear Filter
                        </Button>
                    )}
                    <Button variant="outline" size="icon" onClick={fetchLogs} title="Refresh Logs">
                        <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                    </Button>
                    <Button variant="outline" size="icon" onClick={exportToCSV} disabled={filteredLogs.length === 0} title="Export to CSV">
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[180px]">Time</TableHead>
                            <TableHead className="w-[30%]">User Question</TableHead>
                            <TableHead>AI Answer</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center">
                                    Loading logs...
                                </TableCell>
                            </TableRow>
                        ) : filteredLogs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center">
                                    No logs found for the selected criteria.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredLogs.map((log) => (
                                <TableRow key={log._id} className="group hover:bg-muted/50">
                                    <TableCell className="align-top whitespace-nowrap text-muted-foreground">
                                        {format(new Date(log.timestamp), 'PP p')}
                                    </TableCell>
                                    <TableCell className="align-top font-medium">
                                        <div className="flex gap-2">
                                            <span className="mt-1 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                                            {log.question}
                                        </div>
                                    </TableCell>
                                    <TableCell className="align-top text-muted-foreground">
                                        <div className="flex gap-2">
                                            <MessageSquare className="mt-1 h-4 w-4 text-green-500 shrink-0" />
                                            <div className="prose prose-sm max-w-none dark:prose-invert line-clamp-4 group-hover:line-clamp-none transition-all">
                                                {log.answer}
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
