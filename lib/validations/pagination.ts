import { z } from "zod";

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
}

export function calculatePagination(params: {
  page?: number;
  limit?: number;
  total: number;
}): {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  skip: number;
} {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 20));
  const total = Math.max(0, params.total);
  const totalPages = Math.ceil(total / limit) || 1;
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    total,
    totalPages,
    skip,
  };
}
