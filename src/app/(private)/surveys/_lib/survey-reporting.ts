'use client';

import type {
  GetSurveyAnalyticsQuery,
  GetSurveyAnalyticsResponse,
  GetSurveyResponseDetailResponse,
  GetSurveyResponsesQuery,
  GetSurveyResponsesResponse,
} from '@/app/api/_schemas/survey-reporting.schema';
import { queryOptions } from '@tanstack/react-query';

export type GetCrmSurveysAnalyticsData = {
  query?: GetSurveyAnalyticsQuery;
};

export type GetCrmSurveysResponsesData = {
  query?: GetSurveyResponsesQuery;
};

export type GetCrmSurveysResponsesByResponseIdData = {
  path: {
    responseId: string;
  };
};

export type GetCrmSurveysAnalyticsResponse = GetSurveyAnalyticsResponse;
export type GetCrmSurveysResponsesResponse = GetSurveyResponsesResponse;
export type GetCrmSurveysResponsesByResponseIdResponse = GetSurveyResponseDetailResponse;

async function requestJson<T>(path: string): Promise<T> {
  const response = await fetch(`/api${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const payload = (await response.json().catch(() => null)) as { error?: string } | T | null;

  if (!response.ok) {
    throw new Error(
      payload && typeof payload === 'object' && 'error' in payload && payload.error
        ? payload.error
        : 'Request failed',
    );
  }

  return payload as T;
}

function toSearchParams(query?: Record<string, string | number | boolean | null | undefined>) {
  const params = new URLSearchParams();

  if (!query) return params;

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    params.set(key, String(value));
  });

  return params;
}

export function getCrmSurveysAnalyticsOptions(options: GetCrmSurveysAnalyticsData) {
  return queryOptions<GetSurveyAnalyticsResponse>({
    queryKey: ['crm-surveys-analytics', options.query ?? {}],
    queryFn: async () => {
      const params = toSearchParams(options.query);
      const query = params.toString();
      return requestJson<GetSurveyAnalyticsResponse>(
        `/crm/surveys/analytics${query ? `?${query}` : ''}`,
      );
    },
  });
}

export function getCrmSurveysResponsesOptions(options: GetCrmSurveysResponsesData) {
  return queryOptions<GetSurveyResponsesResponse>({
    queryKey: ['crm-surveys-responses', options.query ?? {}],
    queryFn: async () => {
      const params = toSearchParams(options.query);
      const query = params.toString();
      return requestJson<GetSurveyResponsesResponse>(
        `/crm/surveys/responses${query ? `?${query}` : ''}`,
      );
    },
  });
}

export function getCrmSurveysResponsesByResponseIdOptions(
  options: GetCrmSurveysResponsesByResponseIdData,
) {
  return queryOptions<GetSurveyResponseDetailResponse>({
    queryKey: ['crm-surveys-response-detail', options.path.responseId],
    queryFn: async () =>
      requestJson<GetSurveyResponseDetailResponse>(
        `/crm/surveys/responses/${options.path.responseId}`,
      ),
  });
}
