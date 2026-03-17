import { NextRequest, NextResponse } from 'next/server';

import type {
  BodyRecord,
  CardioRecord,
  StrengthTrainingRecord,
  TrainingSummary,
} from '@/types/api/member.type';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const mockData = {
      summary: {
        recorded_days: 15,
        total_training_time: 1200,
        average_training_time: 80,
        frequent_exercises: ['ベンチプレス', 'スクワット', 'デッドリフト'],
      } as TrainingSummary,
      strengthRecords: [
        {
          id: 'str-001',
          date: '2025-03-10T10:00:00+09:00',
          exercise_name: 'ベンチプレス',
          weight: 60,
          reps: 10,
          sets: 3,
          notes: 'フォーム改善',
        },
        {
          id: 'str-002',
          date: '2025-03-08T09:30:00+09:00',
          exercise_name: 'スクワット',
          weight: 80,
          reps: 8,
          sets: 3,
        },
      ] as StrengthTrainingRecord[],
      cardioRecords: [
        {
          id: 'card-001',
          date: '2025-03-10T11:00:00+09:00',
          exercise_type: 'ランニング',
          duration: 30,
          distance: 5,
          calories: 320,
        },
        {
          id: 'card-002',
          date: '2025-03-05T20:00:00+09:00',
          exercise_type: 'バイク',
          duration: 25,
          distance: 12,
          calories: 260,
        },
      ] as CardioRecord[],
      bodyRecords: [
        {
          id: 'body-001',
          date: '2025-03-01',
          weight: 68,
          body_fat: 18.5,
          muscle_mass: 52,
          bmi: 22.1,
          notes: 'コンディション良好',
        },
        {
          id: 'body-002',
          date: '2025-02-15',
          weight: 69,
          body_fat: 19,
          muscle_mass: 51.5,
          bmi: 22.4,
        },
      ] as BodyRecord[],
      trainingMenus: [
        {
          id: 'menu-001',
          name: '全身トレーニングメニュー',
          exercise_count: 8,
          created_at: '2024-10-01T10:00:00+09:00',
          last_used_at: '2025-03-08T10:00:00+09:00',
        },
        {
          id: 'menu-002',
          name: '下半身集中メニュー',
          exercise_count: 5,
          created_at: '2024-11-15T10:00:00+09:00',
          last_used_at: '2025-03-05T09:30:00+09:00',
        },
      ],
    };

    return NextResponse.json(mockData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch training records' }, { status: 500 });
  }
}
