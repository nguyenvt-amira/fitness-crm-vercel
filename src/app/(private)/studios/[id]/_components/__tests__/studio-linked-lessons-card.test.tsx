import type { LinkedLessonSummary } from '@/app/api/_schemas/studio-detail.schema';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { StudioLinkedLessonsCard } from '../studio-linked-lessons-card';

/**
 * Test suite for StudioLinkedLessonsCard component
 * Validates reservation rate tier color rendering and lesson navigation
 */
describe('StudioLinkedLessonsCard', () => {
  describe('threshold color rendering', () => {
    it('displays success tier color (green) for reservation_rate >= 80', () => {
      const lessons: LinkedLessonSummary[] = [
        {
          lesson_id: 'LSN-001',
          lesson_name: 'High Demand Class',
          category: 'Yoga',
          schedule_text: 'Mon 19:00',
          reservation_rate: 85,
          reservation_tier: 'success',
        },
      ];

      const { container } = render(<StudioLinkedLessonsCard lessons={lessons} />);

      // Check for success tier styling (green color)
      const tierBadge = container.querySelector('[class*="bg-green"]');
      expect(tierBadge).toBeInTheDocument();
    });

    it('displays warning tier color (amber) for reservation_rate 60-79', () => {
      const lessons: LinkedLessonSummary[] = [
        {
          lesson_id: 'LSN-002',
          lesson_name: 'Medium Demand Class',
          category: 'Dance',
          schedule_text: 'Wed 18:00',
          reservation_rate: 70,
          reservation_tier: 'warning',
        },
      ];

      const { container } = render(<StudioLinkedLessonsCard lessons={lessons} />);

      // Check for warning tier styling (amber color)
      const tierBadge = container.querySelector('[class*="bg-amber"]');
      expect(tierBadge).toBeInTheDocument();
    });

    it('displays default tier color (gray) for reservation_rate < 60', () => {
      const lessons: LinkedLessonSummary[] = [
        {
          lesson_id: 'LSN-003',
          lesson_name: 'Low Demand Class',
          category: 'Fitness',
          schedule_text: 'Fri 10:00',
          reservation_rate: 45,
          reservation_tier: 'default',
        },
      ];

      const { container } = render(<StudioLinkedLessonsCard lessons={lessons} />);

      // Check for default tier styling (gray color)
      const tierBadge = container.querySelector('[class*="bg-slate"]');
      expect(tierBadge).toBeInTheDocument();
    });

    it('displays correct color for mixed reservation rates', () => {
      const lessons: LinkedLessonSummary[] = [
        {
          lesson_id: 'LSN-001',
          lesson_name: 'Class A',
          category: 'Yoga',
          schedule_text: 'Mon 19:00',
          reservation_rate: 82,
          reservation_tier: 'success',
        },
        {
          lesson_id: 'LSN-002',
          lesson_name: 'Class B',
          category: 'Dance',
          schedule_text: 'Wed 18:00',
          reservation_rate: 65,
          reservation_tier: 'warning',
        },
        {
          lesson_id: 'LSN-003',
          lesson_name: 'Class C',
          category: 'Fitness',
          schedule_text: 'Fri 10:00',
          reservation_rate: 50,
          reservation_tier: 'default',
        },
      ];

      render(<StudioLinkedLessonsCard lessons={lessons} />);

      // All three classes should be rendered with their names
      expect(screen.getByText('Class A')).toBeInTheDocument();
      expect(screen.getByText('Class B')).toBeInTheDocument();
      expect(screen.getByText('Class C')).toBeInTheDocument();
    });
  });

  describe('lesson information display', () => {
    it('displays lesson name, category, and schedule', () => {
      const lessons: LinkedLessonSummary[] = [
        {
          lesson_id: 'LSN-001',
          lesson_name: 'Zumba基礎',
          category: 'ダンス',
          schedule_text: '月/水 19:00',
          reservation_rate: 82,
          reservation_tier: 'success',
        },
      ];

      render(<StudioLinkedLessonsCard lessons={lessons} />);

      expect(screen.getByText('Zumba基礎')).toBeInTheDocument();
      expect(screen.getByText('ダンス')).toBeInTheDocument();
      expect(screen.getByText('月/水 19:00')).toBeInTheDocument();
    });

    it('displays reservation percentage', () => {
      const lessons: LinkedLessonSummary[] = [
        {
          lesson_id: 'LSN-001',
          lesson_name: 'Test Class',
          category: 'Yoga',
          schedule_text: 'Mon 19:00',
          reservation_rate: 75,
          reservation_tier: 'warning',
        },
      ];

      render(<StudioLinkedLessonsCard lessons={lessons} />);

      expect(screen.getByText('75%')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('displays empty state message when no lessons', () => {
      render(<StudioLinkedLessonsCard lessons={[]} />);

      expect(screen.getByText(/レッスンはまだリンクされていません/i)).toBeInTheDocument();
    });
  });

  describe('lesson navigation', () => {
    it('renders lesson row as a link to lesson detail page', () => {
      const lessons: LinkedLessonSummary[] = [
        {
          lesson_id: 'LSN-0001',
          lesson_name: 'Yoga Class',
          category: 'Yoga',
          schedule_text: 'Mon 19:00',
          reservation_rate: 82,
          reservation_tier: 'success',
        },
      ];

      render(<StudioLinkedLessonsCard lessons={lessons} />);

      const lessonLink = screen.getByRole('link', { name: /Yoga Class/i });
      expect(lessonLink).toHaveAttribute('href', '/lessons/LSN-0001');
    });

    it('navigates to correct lesson detail for each row', () => {
      const lessons: LinkedLessonSummary[] = [
        {
          lesson_id: 'LSN-001',
          lesson_name: 'Class A',
          category: 'Yoga',
          schedule_text: 'Mon 19:00',
          reservation_rate: 82,
          reservation_tier: 'success',
        },
        {
          lesson_id: 'LSN-002',
          lesson_name: 'Class B',
          category: 'Dance',
          schedule_text: 'Wed 18:00',
          reservation_rate: 65,
          reservation_tier: 'warning',
        },
      ];

      render(<StudioLinkedLessonsCard lessons={lessons} />);

      const classALink = screen.getByRole('link', { name: /Class A/i });
      const classBLink = screen.getByRole('link', { name: /Class B/i });

      expect(classALink).toHaveAttribute('href', '/lessons/LSN-001');
      expect(classBLink).toHaveAttribute('href', '/lessons/LSN-002');
    });
  });

  describe('progress bar styling', () => {
    it('applies success tier colors to progress bar', () => {
      const lessons: LinkedLessonSummary[] = [
        {
          lesson_id: 'LSN-001',
          lesson_name: 'High Demand',
          category: 'Yoga',
          schedule_text: 'Mon 19:00',
          reservation_rate: 85,
          reservation_tier: 'success',
        },
      ];

      const { container } = render(<StudioLinkedLessonsCard lessons={lessons} />);

      // Progress bar should have green (success) colors
      const progressBar = container.querySelector('[class*="bg-green"]');
      expect(progressBar).toBeInTheDocument();
    });

    it('applies warning tier colors to progress bar', () => {
      const lessons: LinkedLessonSummary[] = [
        {
          lesson_id: 'LSN-002',
          lesson_name: 'Medium Demand',
          category: 'Dance',
          schedule_text: 'Wed 18:00',
          reservation_rate: 70,
          reservation_tier: 'warning',
        },
      ];

      const { container } = render(<StudioLinkedLessonsCard lessons={lessons} />);

      // Progress bar should have amber (warning) colors
      const progressBar = container.querySelector('[class*="bg-amber"]');
      expect(progressBar).toBeInTheDocument();
    });

    it('applies default tier colors to progress bar', () => {
      const lessons: LinkedLessonSummary[] = [
        {
          lesson_id: 'LSN-003',
          lesson_name: 'Low Demand',
          category: 'Fitness',
          schedule_text: 'Fri 10:00',
          reservation_rate: 45,
          reservation_tier: 'default',
        },
      ];

      const { container } = render(<StudioLinkedLessonsCard lessons={lessons} />);

      // Progress bar should have slate (default) colors
      const progressBar = container.querySelector('[class*="bg-slate"]');
      expect(progressBar).toBeInTheDocument();
    });
  });
});
