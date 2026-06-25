import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/api/_mock-db';
import {
  type GetLessonContentsQuery,
  GetLessonContentsQuerySchema,
  type GetLessonContentsResponse,
  GetLessonContentsResponseSchema,
  type LessonContentItem,
} from '@/app/api/_schemas/lesson-content.schema';
import { ErrorResponseSchema } from '@/app/api/_schemas/member.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

registerRoute({
  method: 'get',
  path: '/crm/lesson-contents',
  summary: 'Get lesson contents list',
  description: 'Get paginated studio / body care lesson masters with filtering and sorting',
  tags: ['LessonContents'],
  query: GetLessonContentsQuerySchema,
  responses: [
    {
      status: 200,
      schema: GetLessonContentsResponseSchema,
      description: 'List of lesson contents',
    },
    {
      status: 400,
      schema: ErrorResponseSchema,
      description: 'Bad request - invalid query parameters',
    },
    {
      status: 500,
      schema: ErrorResponseSchema,
      description: 'Internal server error',
    },
  ],
});

export async function GET(request: NextRequest) {
  try {
    const queryObj: Record<string, string | string[]> = {};
    request.nextUrl.searchParams.forEach((value, key) => {
      const existing = queryObj[key];
      if (existing === undefined) {
        queryObj[key] = value;
      } else if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        queryObj[key] = [existing, value];
      }
    });

    const validationResult = GetLessonContentsQuerySchema.safeParse(queryObj);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const query: GetLessonContentsQuery = validationResult.data;
    const {
      kind,
      page,
      limit,
      search,
      lesson_category,
      category,
      brand,
      status,
      include_deleted,
      store_id,
      sort_by,
      sort_order,
    } = query;

    let rows: LessonContentItem[] = db.lessonContents.getList();

    // 1. Store scope
    if (store_id) {
      rows = rows.filter((row) => row.store_id === store_id);
    }

    // 2. Kind (Studio vs Body care)
    rows = rows.filter((row) => row.kind === kind);

    // 3. Search (partial match on name or id, case-insensitive)
    if (search) {
      const term = search.toLowerCase().trim();
      rows = rows.filter(
        (row) => row.name.toLowerCase().includes(term) || row.id.toLowerCase().includes(term),
      );
    }

    // 4. Detailed filters
    if (lesson_category && lesson_category.length > 0) {
      rows = rows.filter((row) => lesson_category.includes(row.lesson_category));
    }
    if (category && category.length > 0) {
      rows = rows.filter((row) => category.includes(row.category));
    }
    if (brand && brand.length > 0) {
      rows = rows.filter((row) => brand.includes(row.brand));
    }
    if (status && status.length > 0) {
      rows = rows.filter((row) => status.includes(row.status));
    }

    // 5. Include-deleted toggle
    if (!include_deleted) {
      rows = rows.filter((row) => !row.is_deleted && row.status !== 'inactive');
    }

    // 6. Sort
    rows = [...rows].sort((a, b) => {
      let comparison = 0;
      switch (sort_by) {
        case 'name':
          comparison = a.name.localeCompare(b.name, 'ja');
          break;
        case 'duration':
          comparison = a.duration - b.duration;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'brand':
          comparison = a.brand.localeCompare(b.brand);
          break;
        case 'id':
        default:
          comparison = a.id.localeCompare(b.id);
          break;
      }
      return sort_order === 'asc' ? comparison : -comparison;
    });

    // 7. Paginate
    const total = rows.length;
    const total_pages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginated = rows.slice(startIndex, startIndex + limit);

    const response: GetLessonContentsResponse = {
      data: paginated,
      pagination: { page, limit, total, total_pages },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching lesson contents:', error);
    return NextResponse.json({ error: 'Failed to fetch lesson contents' }, { status: 500 });
  }
}
