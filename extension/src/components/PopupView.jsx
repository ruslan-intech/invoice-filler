import React, { useState } from 'react';
import { Calendar, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { extractTimeEntries } from '../api/clockify';

const PopupView = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleExtract = async () => {
        if (!startDate || !endDate) {
            setError('Please select both start and end dates');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess(false);

        try {
            const data = await extractTimeEntries(startDate, endDate);
            setSuccess(true);
            // You might want to save the data or trigger a download here
            chrome.runtime.sendMessage({
                type: 'SAVE_TIME_ENTRIES',
                payload: data
            });
        } catch (err) {
            setError(err.message || 'Failed to extract time entries');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-80">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Invoice Filler
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full rounded-md border px-3 py-2"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium">End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full rounded-md border px-3 py-2"
                    />
                </div>

                <Button
                    onClick={handleExtract}
                    className="w-full"
                    disabled={!startDate || !endDate || isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Extracting...
                        </>
                    ) : (
                        <>
                            <Download className="mr-2 h-4 w-4" />
                            Extract Activities
                        </>
                    )}
                </Button>

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert className="bg-green-50 border-green-200">
                        <AlertDescription className="text-green-800">
                            Activities extracted successfully!
                        </AlertDescription>
                    </Alert>
                )}

                <div className="text-xs text-gray-500">
                    Select a date range to extract your Clockify activities. The data will be processed for invoice generation.
                </div>
            </CardContent>
        </Card>
    );
};

export default PopupView;