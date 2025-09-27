
import React, { useState, useEffect, useCallback } from 'react';
import { User, Feedback } from '../types';
import { getFeedbackForEmployee, submitFeedback } from '../services/feedbackService';
import FeedbackItem from './FeedbackItem';
import Spinner from './Spinner';

interface EmployeeDashboardProps {
  currentUser: User;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ currentUser }) => {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const fetchFeedback = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getFeedbackForEmployee(currentUser.id);
      setFeedbackList(data);
    } catch (err) {
      setError('Failed to fetch feedback.');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser.id]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !description) {
        alert('Please fill out all fields.');
        return;
    }
    setIsSubmitting(true);
    setSubmitSuccess(null);
    
    await submitFeedback({
        employeeId: currentUser.id,
        employeeName: currentUser.name,
        title,
        category,
        description,
    });
    
    setIsSubmitting(false);
    setTitle('');
    setCategory('');
    setDescription('');
    setSubmitSuccess('Your feedback has been submitted successfully!');
    fetchFeedback(); // Refresh the list
    setTimeout(() => setSubmitSuccess(null), 5000);
  };

  const handleUpdate = async () => {
    // Employees cannot update, this is a placeholder
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Submit New Feedback</h2>
        <form onSubmit={handleSubmit} className="mt-4 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          {submitSuccess && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 border border-green-300 rounded-md">
              {submitSuccess}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <input type="text" id="category" value={category} onChange={e => setCategory(e.target.value)} required placeholder="e.g., Workplace, Software, HR" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
          </div>
          <div className="mt-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" rows={4} value={description} onChange={e => setDescription(e.target.value)} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"></textarea>
          </div>
          <div className="mt-6 text-right">
            <button type="submit" disabled={isSubmitting} className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300">
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800">Your Submitted Feedback</h2>
        <div className="mt-4">
          {isLoading ? (
            <Spinner />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : feedbackList.length > 0 ? (
            feedbackList.map(item => (
              <FeedbackItem key={item.id} feedback={item} currentUser={currentUser} onUpdate={handleUpdate} />
            ))
          ) : (
            <p className="text-gray-500 bg-white p-6 rounded-lg shadow-sm">You have not submitted any feedback yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
