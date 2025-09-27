
import { User, UserRole, Feedback, FeedbackStatus } from '../types';

// --- MOCK DATABASE ---
const users: User[] = [
  { id: 1, name: 'Alice Johnson', role: UserRole.EMPLOYEE, username: 'alice' },
  { id: 2, name: 'Bob Williams', role: UserRole.EMPLOYEE, username: 'bob' },
  { id: 100, name: 'Charlie Brown', role: UserRole.ADMIN, username: 'admin' },
];

let feedbackItems: Feedback[] = [
  {
    id: 1,
    employeeId: 1,
    employeeName: 'Alice Johnson',
    title: 'Cafeteria food quality',
    category: 'Workplace',
    description: 'The quality of food in the cafeteria has declined over the past few weeks. Could we look into new vendors?',
    status: FeedbackStatus.IN_PROGRESS,
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    adminResponse: "Thanks for the feedback, Alice. We are currently reviewing our vendor contracts and will provide an update soon."
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: 'Bob Williams',
    title: 'Need more standing desks',
    category: 'Ergonomics',
    description: 'It would be great to have more standing desks available for employees. It helps with posture and productivity.',
    status: FeedbackStatus.PENDING,
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
    {
    id: 3,
    employeeId: 1,
    employeeName: 'Alice Johnson',
    title: 'Project management tool suggestion',
    category: 'Software',
    description: 'I suggest we evaluate a new project management tool like Asana or Monday.com to improve our workflow.',
    status: FeedbackStatus.RESOLVED,
    submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    adminResponse: 'We have evaluated the tools and decided to stick with our current solution for now, but we appreciate the suggestion.'
  },
];

// --- MOCK API FUNCTIONS ---

// Simulate network latency
const FAKE_DELAY = 700;

export const login = (username: string): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
      resolve(user || null);
    }, FAKE_DELAY);
  });
};

export const getFeedbackForEmployee = (employeeId: number): Promise<Feedback[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const employeeFeedback = feedbackItems
        .filter((f) => f.employeeId === employeeId)
        .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
      resolve(employeeFeedback);
    }, FAKE_DELAY);
  });
};

export const getAllFeedback = (): Promise<Feedback[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...feedbackItems].sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()));
    }, FAKE_DELAY);
  });
};

export const submitFeedback = (feedbackData: Omit<Feedback, 'id' | 'submittedAt' | 'status'>): Promise<Feedback> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newFeedback: Feedback = {
        ...feedbackData,
        id: Math.max(0, ...feedbackItems.map(f => f.id)) + 1,
        submittedAt: new Date(),
        status: FeedbackStatus.PENDING,
      };
      feedbackItems = [newFeedback, ...feedbackItems];
      resolve(newFeedback);
    }, FAKE_DELAY);
  });
};

export const updateFeedback = (feedbackId: number, updates: { status?: FeedbackStatus; adminResponse?: string }): Promise<Feedback | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let updatedFeedback: Feedback | null = null;
      feedbackItems = feedbackItems.map((item) => {
        if (item.id === feedbackId) {
          const newItem = { ...item, ...updates };
          updatedFeedback = newItem;
          return newItem;
        }
        return item;
      });
      resolve(updatedFeedback);
    }, FAKE_DELAY);
  });
};
