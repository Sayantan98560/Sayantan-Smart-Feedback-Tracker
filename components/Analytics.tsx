
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Feedback, FeedbackStatus } from '../types';

interface AnalyticsProps {
  feedbackData: Feedback[];
}

const COLORS: Record<FeedbackStatus, string> = {
    [FeedbackStatus.PENDING]: '#FBBF24', // amber-400
    [FeedbackStatus.IN_PROGRESS]: '#60A5FA', // blue-400
    [FeedbackStatus.RESOLVED]: '#4ADE80', // green-400
};

const Analytics: React.FC<AnalyticsProps> = ({ feedbackData }) => {
    const chartData = useMemo(() => {
        const counts = feedbackData.reduce((acc, feedback) => {
            acc[feedback.status] = (acc[feedback.status] || 0) + 1;
            return acc;
        }, {} as Record<FeedbackStatus, number>);
        
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [feedbackData]);

    if (feedbackData.length === 0) {
        return (
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-700">No feedback data available to generate analytics.</h3>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Feedback Status Overview</h2>
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.name as FeedbackStatus]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Analytics;
