
import React, { useState, useEffect, useCallback } from 'react';
import { User, Feedback, FeedbackStatus } from '../types';
import { getAllFeedback, updateFeedback } from '../services/feedbackService';
import FeedbackItem from './FeedbackItem';
import Spinner from './Spinner';
import Analytics from './Analytics';

interface AdminDashboardProps {
  currentUser: User;
}

enum AdminView {
    FEEDBACK_LIST,
    ANALYTICS,
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser }) => {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<AdminView>(AdminView.FEEDBACK_LIST);

  const fetchAllFeedback = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllFeedback();
      setFeedbackList(data);
    } catch (err) {
      setError('Failed to fetch feedback.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllFeedback();
  }, [fetchAllFeedback]);

  const handleUpdate = async (feedbackId: number, updates: { status?: FeedbackStatus; adminResponse?: string }) => {
    const updatedFeedback = await updateFeedback(feedbackId, updates);
    if (updatedFeedback) {
      setFeedbackList(prevList =>
        prevList.map(item => (item.id === feedbackId ? updatedFeedback : item))
      );
    }
  };

  const renderContent = () => {
    if (isLoading) return <Spinner />;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    switch(view) {
        case AdminView.ANALYTICS:
            return <Analytics feedbackData={feedbackList} />;
        case AdminView.FEEDBACK_LIST:
        default:
            return feedbackList.length > 0 ? (
                feedbackList.map(item => (
                    <FeedbackItem key={item.id} feedback={item} currentUser={currentUser} onUpdate={handleUpdate} />
                ))
            ) : (
                <p className="text-gray-500 bg-white p-6 rounded-lg shadow-sm text-center">No feedback has been submitted yet.</p>
            );
    }
  }

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Admin Dashboard</h2>
            <div className="flex space-x-2 bg-gray-200 p-1 rounded-lg">
                <button 
                    onClick={() => setView(AdminView.FEEDBACK_LIST)}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${view === AdminView.FEEDBACK_LIST ? 'bg-white text-indigo-700 shadow' : 'text-gray-600 hover:bg-gray-300'}`}
                >
                    All Feedback
                </button>
                <button 
                    onClick={() => setView(AdminView.ANALYTICS)}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${view === AdminView.ANALYTICS ? 'bg-white text-indigo-700 shadow' : 'text-gray-600 hover:bg-gray-300'}`}
                >
                    Analytics
                </button>
            </div>
        </div>
        <div>
            {renderContent()}
        </div>
    </div>
  );
};

export default AdminDashboard;
