import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { StudioDeleteDialog } from '../studio-delete-dialog';

/**
 * Test suite for StudioDeleteDialog component
 * Validates delete confirmation UI and in-use studio blocking logic
 */
describe('StudioDeleteDialog', () => {
  const mockOnDelete = vi.fn();
  const mockOnOpenChange = vi.fn();
  const studioName = 'Zumbaスタジオ';

  beforeEach(() => {
    mockOnDelete.mockClear();
    mockOnOpenChange.mockClear();
  });

  describe('dialog rendering', () => {
    it('displays delete confirmation dialog when open=true', () => {
      render(
        <StudioDeleteDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          studioName={studioName}
          assignedLessonCount={0}
          onDelete={mockOnDelete}
        />,
      );

      expect(
        screen.getByRole('heading', { name: /スタジオを削除しますか？/i }),
      ).toBeInTheDocument();
      expect(screen.getByText(new RegExp(`${studioName}を削除します`, 'i'))).toBeInTheDocument();
    });

    it('hides dialog when open=false', () => {
      const { container } = render(
        <StudioDeleteDialog
          open={false}
          onOpenChange={mockOnOpenChange}
          studioName={studioName}
          assignedLessonCount={0}
          onDelete={mockOnDelete}
        />,
      );

      // Dialog should not be visible
      const dialog = container.querySelector('[role="alertdialog"]');
      if (dialog) {
        expect(dialog).not.toBeVisible();
      }
    });
  });

  describe('in-use studio warning', () => {
    it('shows warning when assigned_lesson_count > 0', () => {
      render(
        <StudioDeleteDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          studioName={studioName}
          assignedLessonCount={3}
          onDelete={mockOnDelete}
        />,
      );

      expect(
        screen.getByText(/このスタジオは.*件のレッスンにリンクされています/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/削除する前にすべてのリンクを解除してください/i)).toBeInTheDocument();
    });

    it('hides warning when assigned_lesson_count === 0', () => {
      render(
        <StudioDeleteDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          studioName={studioName}
          assignedLessonCount={0}
          onDelete={mockOnDelete}
        />,
      );

      expect(
        screen.queryByText(/このスタジオは.*件のレッスンにリンクされています/i),
      ).not.toBeInTheDocument();
    });

    it('displays correct lesson count in warning', () => {
      const lessonCount = 5;
      render(
        <StudioDeleteDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          studioName={studioName}
          assignedLessonCount={lessonCount}
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.getByText(new RegExp(`${lessonCount}件のレッスン`, 'i'))).toBeInTheDocument();
    });
  });

  describe('delete button behavior', () => {
    it('delete button is disabled when assigned_lesson_count > 0', () => {
      render(
        <StudioDeleteDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          studioName={studioName}
          assignedLessonCount={3}
          onDelete={mockOnDelete}
        />,
      );

      const deleteButton = screen.getByRole('button', { name: /削除する/i });
      expect(deleteButton).toBeDisabled();
    });

    it('delete button is enabled when assigned_lesson_count === 0', () => {
      render(
        <StudioDeleteDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          studioName={studioName}
          assignedLessonCount={0}
          onDelete={mockOnDelete}
        />,
      );

      const deleteButton = screen.getByRole('button', { name: /削除する/i });
      expect(deleteButton).not.toBeDisabled();
    });

    it('calls onDelete when delete button is clicked and studio is not in use', async () => {
      const user = userEvent.setup();
      render(
        <StudioDeleteDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          studioName={studioName}
          assignedLessonCount={0}
          onDelete={mockOnDelete}
        />,
      );

      const deleteButton = screen.getByRole('button', { name: /削除する/i });
      await user.click(deleteButton);

      await waitFor(() => {
        expect(mockOnDelete).toHaveBeenCalled();
      });
    });

    it('does not call onDelete when delete button is disabled', async () => {
      const user = userEvent.setup();
      render(
        <StudioDeleteDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          studioName={studioName}
          assignedLessonCount={3}
          onDelete={mockOnDelete}
        />,
      );

      const deleteButton = screen.getByRole('button', { name: /削除する/i });
      // Button should be disabled, so click won't have effect
      try {
        await user.click(deleteButton);
      } catch {
        // Expected - disabled button can't be clicked
      }

      expect(mockOnDelete).not.toHaveBeenCalled();
    });
  });

  describe('dialog interaction', () => {
    it('calls onOpenChange with false when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <StudioDeleteDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          studioName={studioName}
          assignedLessonCount={0}
          onDelete={mockOnDelete}
        />,
      );

      const cancelButton = screen.getByRole('button', { name: /キャンセル/i });
      await user.click(cancelButton);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it('calls onOpenChange with false after successful delete', async () => {
      const user = userEvent.setup();
      render(
        <StudioDeleteDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          studioName={studioName}
          assignedLessonCount={0}
          onDelete={mockOnDelete}
        />,
      );

      const deleteButton = screen.getByRole('button', { name: /削除する/i });
      await user.click(deleteButton);

      await waitFor(() => {
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });
});
