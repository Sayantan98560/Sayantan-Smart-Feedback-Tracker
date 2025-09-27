
import React, { useState } from 'react';
import { Feedback, FeedbackStatus, User, UserRole } from '../types';

interface FeedbackItemProps {
  feedback: Feedback;
  currentUser: User;
  onUpdate: (feedbackId: number, updates: { status?: FeedbackStatus; adminResponse?: string }) => Promise<void>;
}

const statusColors: Record<FeedbackStatus, string> = {
  [FeedbackStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  [FeedbackStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800 border-blue-300',
  [FeedbackStatus.RESOLVED]: 'bg-green-100 text-green-800 border-green-300',
};

const FeedbackItem: React.FC<FeedbackItemProps> = ({ feedback, currentUser, onUpdate }) => {
  const [newStatus, setNewStatus] = useState<FeedbackStatus>(feedback.status);
  const [response, setResponse] = useState(feedback.adminResponse || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const isAdmin = currentUser.role === UserRole.ADMIN;

  const handleUpdate = async () => {
    setIsUpdating(true);
    await onUpdate(feedback.id, { status: newStatus, adminResponse: response });
    setIsUpdating(false);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4 border border-gray-200 transition-shadow hover:shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{feedback.title}</h3>
          <p className="text-sm text-gray-500">
            Category: <span className="font-medium text-gray-700">{feedback.category}</span>
            {isAdmin && ` | Submitted by: ${feedback.employeeName}`}
          </p>
        </div>
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColors[feedback.status]}`}>
          {feedback.status}
        </span>
      </div>
      <p className="text-gray-600 mt-4">{feedback.description}</p>
      <p className="text-xs text-gray-400 mt-4">
        Submitted on: {feedback.submittedAt.toLocaleDateString()}
      </p>
      {feedback.adminResponse && (
        <div className="mt-4 p-4 bg-gray-50 border-l-4 border-indigo-300 rounded-r-lg">
          <p className="text-sm font-semibold text-gray-700">Admin Response:</p>
          <p className="text-sm text-gray-600 italic">"{feedback.adminResponse}"</p>
        </div>
      )}

      {isAdmin && (
        <div className="mt-6 border-t pt-4">
          <h4 className="font-semibold text-gray-700 mb-2">Admin Actions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor={`status-${feedback.id}`} className="block text-sm font-medium text-gray-700">Update Status</label>
              <select
                id={`status-${feedback.id}`}
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as FeedbackStatus)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {Object.values(FeedbackStatus).map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`response-${feedback.id}`} className="block text-sm font-medium text-gray-700">Add/Edit Response</label>
              <textarea
                id={`response-${feedback.id}`}
                rows={3}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Provide a response to the employee..."
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
            >
              {isUpdating ? 'Updating...' : 'Update Feedback'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackItem;
