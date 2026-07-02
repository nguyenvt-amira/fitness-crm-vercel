import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { StudioDetailHeaderActions } from '../studio-detail-header-actions';

/**
 * Test suite for StudioDetailHeaderActions component
 * Validates role-based action visibility and permissions
 */
describe('StudioDetailHeaderActions', () => {
  const mockOnDelete = vi.fn();
  const studioId = 'STU-101';

  beforeEach(() => {
    mockOnDelete.mockClear();
  });

  describe('action visibility by role', () => {
    it('shows Edit and Delete buttons for system role', () => {
      render(
        <StudioDetailHeaderActions studioId={studioId} userRole="system" onDelete={mockOnDelete} />,
      );

      expect(screen.getByRole('link', { name: /編集/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /削除/i })).toBeInTheDocument();
    });

    it('shows Edit and Delete buttons for headquarter role', () => {
      render(
        <StudioDetailHeaderActions
          studioId={studioId}
          userRole="headquarter"
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.getByRole('link', { name: /編集/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /削除/i })).toBeInTheDocument();
    });

    it('shows Edit and Delete buttons for manager role', () => {
      render(
        <StudioDetailHeaderActions
          studioId={studioId}
          userRole="manager"
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.getByRole('link', { name: /編集/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /削除/i })).toBeInTheDocument();
    });

    it('shows Edit button but not Delete for staff role', () => {
      render(
        <StudioDetailHeaderActions studioId={studioId} userRole="staff" onDelete={mockOnDelete} />,
      );

      expect(screen.getByRole('link', { name: /編集/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /削除/i })).not.toBeInTheDocument();
    });

    it('hides Edit and Delete buttons for trainer role', () => {
      render(
        <StudioDetailHeaderActions
          studioId={studioId}
          userRole="trainer"
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.queryByRole('link', { name: /編集/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /削除/i })).not.toBeInTheDocument();
    });

    it('hides Edit and Delete buttons for observer role', () => {
      render(
        <StudioDetailHeaderActions
          studioId={studioId}
          userRole="observer"
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.queryByRole('link', { name: /編集/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /削除/i })).not.toBeInTheDocument();
    });
  });

  describe('delete button interaction', () => {
    it('calls onDelete when delete button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <StudioDetailHeaderActions
          studioId={studioId}
          userRole="headquarter"
          onDelete={mockOnDelete}
        />,
      );

      const deleteButton = screen.getByRole('button', { name: /削除/i });
      await user.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalled();
    });
  });

  describe('edit link routing', () => {
    it('Edit link points to correct edit URL', () => {
      render(
        <StudioDetailHeaderActions studioId={studioId} userRole="system" onDelete={mockOnDelete} />,
      );

      const editLink = screen.getByRole('link', { name: /編集/i });
      expect(editLink).toHaveAttribute('href', `/studios/${studioId}/edit`);
    });
  });
});
