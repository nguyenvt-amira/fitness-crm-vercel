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
          date: '2024-11-25T10:00:00Z',
          exercise_name: 'ベンチプレス',
          weight: 60,
          reps: 10,
          sets: 3,
          notes: 'フォーム改善',
        },
      ] as StrengthTrainingRecord[],
      cardioRecords: [
        {
          id: 'card-001',
          date: '2024-11-25T11:00:00Z',
          exercise_type: 'ランニング',
          duration: 30,
          distance: 5,
          calories: 300,
        },
      ] as CardioRecord[],
      bodyRecords: [
        {
          id: 'body-001',
          date: '2024-11-01',
          weight: 55,
          body_fat: 20,
          muscle_mass: 44,
          bmi: 21.5,
        },
      ] as BodyRecord[],
    };

    return NextResponse.json(mockData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch training records' }, { status: 500 });
  }
}
