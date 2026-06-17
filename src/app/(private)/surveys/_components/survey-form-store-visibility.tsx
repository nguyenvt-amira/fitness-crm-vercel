'use client';

import { Fragment, useMemo, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

const MOCK_QUESTIONS = [
  {
    id: 1,
    content: '入会のきっかけを教えてください',
    answerType: '選択式（複数）',
    hasResponses: true,
    visible: true,
    choices: [
      { id: 1, text: '友人の紹介', visible: true },
      { id: 2, text: 'Web広告', visible: true },
      { id: 3, text: 'チラシ', visible: true },
      { id: 4, text: '通りがかり', visible: true },
      { id: 5, text: 'その他', visible: true },
    ],
  },
  {
    id: 2,
    content: '主に利用したい時間帯はいつですか？',
    answerType: '選択式（単一）',
    hasResponses: true,
    visible: true,
    choices: [
      { id: 1, text: '平日午前', visible: true },
      { id: 2, text: '平日午後', visible: true },
      { id: 3, text: '平日夜間', visible: true },
      { id: 4, text: '土日祝', visible: true },
    ],
  },
  {
    id: 3,
    content: '運動経験を教えてください',
    answerType: '選択式（単一）',
    hasResponses: true,
    visible: false,
    choices: [
      { id: 1, text: '初心者', visible: true },
      { id: 2, text: '1年未満', visible: true },
      { id: 3, text: '1〜3年', visible: true },
      { id: 4, text: '3年以上', visible: true },
    ],
  },
  {
    id: 4,
    content: '当ジムに期待することを教えてください',
    answerType: '自由記述',
    hasResponses: false,
    visible: true,
    choices: [],
  },
  {
    id: 5,
    content: 'ご意見・ご要望（自由記入）',
    answerType: '自由記述',
    hasResponses: false,
    visible: true,
    choices: [],
  },
] as const;

type QuestionState = Record<number, boolean>;
type ChoiceState = Record<string, boolean>;

function hasChoice(answerType: string) {
  return answerType === '選択式（単一）' || answerType === '選択式（複数）';
}

export function SurveyFormStoreVisibilitySection() {
  const [questionVisible, setQuestionVisible] = useState<QuestionState>(() =>
    Object.fromEntries(MOCK_QUESTIONS.map((question) => [question.id, question.visible])),
  );
  const [choiceVisible, setChoiceVisible] = useState<ChoiceState>(() =>
    Object.fromEntries(
      MOCK_QUESTIONS.flatMap((question) =>
        question.choices.map((choice) => [`${question.id}-${choice.id}`, choice.visible]),
      ),
    ),
  );

  const hasChoices = useMemo(
    () =>
      MOCK_QUESTIONS.some(
        (question) => hasChoice(question.answerType) && question.choices.length > 0,
      ),
    [],
  );

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="px-4 pt-4 pb-3">
        <CardTitle className="text-base">店舗別表示設定（自店舗）</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <p className="text-muted-foreground mb-3 text-xs">
          FR-003 に基づく自店舗の表示/非表示設定。対象: 自店舗（ヘッダー選択中）
        </p>

        <div className="flex flex-col gap-0">
          {MOCK_QUESTIONS.map((question) => {
            const isVisible = questionVisible[question.id] ?? true;
            const showChoices = hasChoice(question.answerType) && question.choices.length > 0;

            return (
              <Fragment key={question.id}>
                <div className="border-b last:border-b-0">
                  <div className="flex items-center justify-between gap-3 py-2">
                    <span
                      className={`flex-1 text-sm ${!isVisible ? 'text-muted-foreground line-through' : ''}`}
                    >
                      {question.content}
                    </span>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-muted-foreground text-xs">
                        {isVisible ? '表示' : '非表示'}
                      </span>
                      <Switch
                        checked={isVisible}
                        onCheckedChange={(checked) =>
                          setQuestionVisible((prev) => ({ ...prev, [question.id]: checked }))
                        }
                      />
                    </div>
                  </div>

                  {showChoices && (
                    <div className="bg-muted/30 mb-2 ml-6 overflow-hidden rounded-md border">
                      <div className="bg-muted/50 border-b px-3 py-2">
                        <span className="text-muted-foreground text-xs font-semibold">
                          回答選択肢の表示設定
                        </span>
                      </div>
                      <div className="px-3">
                        {question.choices.map((choice) => {
                          const checked = choiceVisible[`${question.id}-${choice.id}`] ?? true;
                          const disabled = !isVisible;
                          return (
                            <div
                              key={choice.id}
                              className="flex items-center justify-between gap-3 border-b py-2 last:border-b-0"
                            >
                              <span
                                className={`flex-1 text-xs ${
                                  !checked || !isVisible ? 'text-muted-foreground line-through' : ''
                                }`}
                              >
                                {choice.text}
                              </span>
                              <div className="flex shrink-0 items-center gap-2">
                                <span className="text-muted-foreground text-xs">
                                  {checked ? '表示' : '非表示'}
                                </span>
                                <Switch
                                  checked={checked}
                                  disabled={disabled}
                                  onCheckedChange={(nextChecked) =>
                                    setChoiceVisible((prev) => ({
                                      ...prev,
                                      [`${question.id}-${choice.id}`]: nextChecked,
                                    }))
                                  }
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </Fragment>
            );
          })}
        </div>

        {!hasChoices && (
          <p className="text-muted-foreground mt-3 text-xs">
            選択式の設問がないため、選択肢の表示設定はありません。
          </p>
        )}
      </CardContent>
    </Card>
  );
}
