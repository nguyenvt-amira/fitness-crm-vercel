import { NextRequest, NextResponse } from 'next/server';

import type {
  BodyRecord,
  CardioRecord,
  StrengthTrainingRecord,
  TrainingSummary,
} from '@/types/member.type';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const mockData = {
      summary: {
        recordedDays: 15,
        totalTrainingTime: 1200,
        averageTrainingTime: 80,
        frequentExercises: ['ベンチプレス', 'スクワット', 'デッドリフト'],
      } as TrainingSummary,
      strengthRecords: [
        {
          id: 'str-001',
          date: '2024-11-25T10:00:00Z',
          exerciseName: 'ベンチプレス',
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
          exerciseType: 'ランニング',
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
          bodyFat: 20,
          muscleMass: 44,
          bmi: 21.5,
        },
      ] as BodyRecord[],
    };

    return NextResponse.json(mockData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch training records' }, { status: 500 });
  }
}
