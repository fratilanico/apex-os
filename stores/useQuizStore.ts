import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Quiz question types
 */
export type QuestionType = 'multiple-choice' | 'true-false' | 'code-snippet';

/**
 * Quiz question interface
 */
export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  explanation?: string;
  points: number;
}

/**
 * Quiz definition
 */
export interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  passingScore: number; // Percentage (0-100)
  timeLimit?: number; // in seconds, optional
}

/**
 * User's answer to a question
 */
export interface QuizAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  answeredAt: string;
}

/**
 * Quiz submission record
 */
export interface QuizSubmission {
  quizId: string;
  moduleId: string;
  answers: QuizAnswer[];
  score: number; // Percentage (0-100)
  passed: boolean;
  timeSpent: number; // in seconds
  submittedAt: string;
}

/**
 * Active quiz session
 */
export interface ActiveQuizSession {
  quizId: string;
  moduleId: string;
  timeStarted: string;
  currentAnswers: QuizAnswer[];
}

/**
 * Quiz store state interface
 */
interface QuizState {
  // State
  activeQuiz: ActiveQuizSession | null;
  submissions: QuizSubmission[];

  // Actions
  startQuiz: (quizId: string, moduleId: string) => void;
  answerQuestion: (questionId: string, selectedAnswer: number, isCorrect: boolean) => void;
  submitQuiz: (quiz: Quiz) => QuizSubmission;
  clearActiveQuiz: () => void;

  // Computed helpers
  getQuizScore: (quizId: string) => QuizSubmission | null;
  hasPassedQuiz: (quizId: string) => boolean;
  getBestScore: (quizId: string) => number;
  getAttemptCount: (quizId: string) => number;
  getAllSubmissions: (moduleId?: string) => QuizSubmission[];
  getAverageScore: () => number;
}

/**
 * Quiz store with persistence
 * Manages quiz sessions, answers, and submission history
 */
export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      // Initial state
      activeQuiz: null,
      submissions: [],

      // Actions
      startQuiz: (quizId: string, moduleId: string) => {
        const session: ActiveQuizSession = {
          quizId,
          moduleId,
          timeStarted: new Date().toISOString(),
          currentAnswers: [],
        };

        set({ activeQuiz: session });
      },

      answerQuestion: (questionId: string, selectedAnswer: number, isCorrect: boolean) => {
        const { activeQuiz } = get();

        if (!activeQuiz) {
          console.warn('No active quiz session');
          return;
        }

        const answer: QuizAnswer = {
          questionId,
          selectedAnswer,
          isCorrect,
          answeredAt: new Date().toISOString(),
        };

        // Update or add answer
        const existingAnswerIndex = activeQuiz.currentAnswers.findIndex(
          (a) => a.questionId === questionId
        );

        let updatedAnswers: QuizAnswer[];
        if (existingAnswerIndex >= 0) {
          updatedAnswers = [...activeQuiz.currentAnswers];
          updatedAnswers[existingAnswerIndex] = answer;
        } else {
          updatedAnswers = [...activeQuiz.currentAnswers, answer];
        }

        set({
          activeQuiz: {
            ...activeQuiz,
            currentAnswers: updatedAnswers,
          },
        });
      },

      submitQuiz: (quiz: Quiz) => {
        const { activeQuiz, submissions } = get();

        if (!activeQuiz) {
          throw new Error('No active quiz session');
        }

        if (activeQuiz.quizId !== quiz.id) {
          throw new Error('Quiz ID mismatch');
        }

        // Calculate score
        const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
        const earnedPoints = activeQuiz.currentAnswers.reduce((sum, answer) => {
          if (!answer.isCorrect) return sum;
          const question = quiz.questions.find((q) => q.id === answer.questionId);
          return sum + (question?.points ?? 0);
        }, 0);

        const scorePercentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
        const passed = scorePercentage >= quiz.passingScore;

        // Calculate time spent
        const startTime = new Date(activeQuiz.timeStarted).getTime();
        const endTime = Date.now();
        const timeSpent = Math.floor((endTime - startTime) / 1000);

        const submission: QuizSubmission = {
          quizId: quiz.id,
          moduleId: activeQuiz.moduleId,
          answers: activeQuiz.currentAnswers,
          score: Math.round(scorePercentage),
          passed,
          timeSpent,
          submittedAt: new Date().toISOString(),
        };

        set({
          submissions: [...submissions, submission],
          activeQuiz: null,
        });

        return submission;
      },

      clearActiveQuiz: () => {
        set({ activeQuiz: null });
      },

      // Computed helpers
      getQuizScore: (quizId: string): QuizSubmission | null => {
        const { submissions } = get();
        const quizSubmissions = submissions.filter((s) => s.quizId === quizId);

        if (quizSubmissions.length === 0) {
          return null;
        }

        // Return most recent submission
        return quizSubmissions[quizSubmissions.length - 1] ?? null;
      },

      hasPassedQuiz: (quizId: string) => {
        const { submissions } = get();
        return submissions.some((s) => s.quizId === quizId && s.passed);
      },

      getBestScore: (quizId: string) => {
        const { submissions } = get();
        const quizSubmissions = submissions.filter((s) => s.quizId === quizId);

        if (quizSubmissions.length === 0) {
          return 0;
        }

        return Math.max(...quizSubmissions.map((s) => s.score));
      },

      getAttemptCount: (quizId: string) => {
        const { submissions } = get();
        return submissions.filter((s) => s.quizId === quizId).length;
      },

      getAllSubmissions: (moduleId?: string) => {
        const { submissions } = get();

        if (moduleId) {
          return submissions.filter((s) => s.moduleId === moduleId);
        }

        return submissions;
      },

      getAverageScore: () => {
        const { submissions } = get();

        if (submissions.length === 0) {
          return 0;
        }

        const totalScore = submissions.reduce((sum, s) => sum + s.score, 0);
        return Math.round(totalScore / submissions.length);
      },
    }),
    {
      name: 'vibe-quiz-storage',
      version: 1,
      // Persist submissions and active quiz
      partialize: (state) => ({
        activeQuiz: state.activeQuiz,
        submissions: state.submissions,
      }),
    }
  )
);
