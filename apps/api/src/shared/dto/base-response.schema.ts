import { z } from 'zod';

export const baseResponseSchema = z.object({
  success: z.boolean(),
  timestamp: z.string().datetime(),
  requestId: z.string().uuid().optional(),
});

export const errorResponseSchema = baseResponseSchema.extend({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
});

export const successResponseSchema = baseResponseSchema.extend({
  success: z.literal(true),
  data: z.unknown().optional(),
});

export type BaseResponse = z.infer<typeof baseResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type SuccessResponse = z.infer<typeof successResponseSchema>;

export function createSuccessResponse<T>(data?: T, requestId?: string): SuccessResponse {
  return {
    success: true,
    timestamp: new Date().toISOString(),
    requestId,
    data,
  };
}

export function createErrorResponse(
  code: string,
  message: string,
  details?: unknown,
  requestId?: string
): ErrorResponse {
  return {
    success: false,
    timestamp: new Date().toISOString(),
    requestId,
    error: {
      code,
      message,
      details,
    },
  };
}
