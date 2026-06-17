'use client';

import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import { GetCrmSurveysResponse } from '@/lib/api/types.gen';
import { cn } from '@/lib/utils';

import { SURVEY_TRIGGER_LABELS } from '../_constants/constants';
import { useSurveyDuplicateTrigger } from '../_hooks/use-survey-form';
import { type SurveyFormSubmitValues, type SurveyFormValues } from '../_schemas/survey-form.schema';
import { SurveyFormBasicInfoSection } from './survey-form-basic-info';
import { SurveyFormQuestionsSection } from './survey-form-questions';
import { SurveyFormStatusSection } from './survey-form-status';
import { SurveyFormStoreVisibilitySection } from './survey-form-store-visibility';

interface SurveyFormProps {
  isEdit?: boolean;
  isSubmitting?: boolean;
  surveyId?: string;
  existingSurveys: GetCrmSurveysResponse['surveys'];
  onCancel: () => void;
  onSubmit: (values: SurveyFormSubmitValues) => void;
}

export function SurveyForm({
  isEdit = false,
  isSubmitting = false,
  surveyId,
  existingSurveys,
  onCancel,
  onSubmit,
}: Readonly<SurveyFormProps>) {
  const form = useFormContext<SurveyFormValues>();
  const trigger = useWatch({ control: form.control, name: 'trigger' });
  const [deleteTarget, setDeleteTarget] = useState<{ index: number; hasResponses: boolean } | null>(
    null,
  );
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [pendingSubmitValues, setPendingSubmitValues] = useState<SurveyFormSubmitValues | null>(
    null,
  );

  const duplicateSurvey = useSurveyDuplicateTrigger(existingSurveys, trigger, surveyId);

  const handleFormSubmit = form.handleSubmit((values) => {
    const duplicate = duplicateSurvey ?? undefined;
    if (duplicate) {
      setPendingSubmitValues(values);
      setDuplicateDialogOpen(true);
      return;
    }

    onSubmit(values);
  });

  const confirmDuplicateSave = () => {
    if (!pendingSubmitValues || !duplicateSurvey) {
      setDuplicateDialogOpen(false);
      setPendingSubmitValues(null);
      return;
    }

    onSubmit({
      ...pendingSubmitValues,
      replaceExistingSurveyId: duplicateSurvey.id,
    });
    setDuplicateDialogOpen(false);
    setPendingSubmitValues(null);
  };

  const confirmDeleteQuestion = () => {
    if (!deleteTarget) return;

    if (!deleteTarget.hasResponses) {
      const questions = form.getValues('questions');
      form.setValue(
        'questions',
        questions.filter((_question, index: number) => index !== deleteTarget.index),
        { shouldDirty: true, shouldValidate: true },
      );
    }

    setDeleteTarget(null);
  };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <div className="flex flex-col gap-6">
          <SurveyFormBasicInfoSection isEdit={isEdit} />

          <SurveyFormQuestionsSection
            onDeleteQuestion={(index) => {
              const question = form.getValues(`questions.${index}`);
              setDeleteTarget({ index, hasResponses: question.hasResponses });
            }}
          />

          {isEdit && <SurveyFormStoreVisibilitySection />}

          <SurveyFormStatusSection />

          <div className="flex items-center justify-end gap-2 border-t p-4">
            <Button
              size="lg"
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              キャンセル
            </Button>
            <Button size="lg" type="submit" disabled={isSubmitting}>
              {isEdit ? '変更を保存する' : '登録する'}
            </Button>
          </div>
        </div>
      </form>

      <AlertDialog open={duplicateDialogOpen} onOpenChange={setDuplicateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>同一トリガーのアンケートが既に存在します</AlertDialogTitle>
            <AlertDialogDescription>
              「{SURVEY_TRIGGER_LABELS[trigger]}」のアンケート（{duplicateSurvey?.name}
              ）が既に有効です。 新しい方を有効にすると既存は自動的に無効化されます。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDuplicateDialogOpen(false);
                setPendingSubmitValues(null);
              }}
            >
              キャンセル
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDuplicateSave}>
              既存を無効化して登録
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteTarget?.hasResponses ? 'この設問を削除できません' : 'この設問を削除しますか？'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.hasResponses
                ? 'この設問には回答データがあります。削除はできませんが、非表示に設定できます。'
                : 'この操作は取り消せません。'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              className={cn(
                deleteTarget?.hasResponses &&
                  'bg-warning text-warning-foreground hover:bg-warning/90',
              )}
              onClick={confirmDeleteQuestion}
            >
              {deleteTarget?.hasResponses ? '非表示にする' : '削除する'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
