import { z } from 'zod';

export const BaseResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});

export type BaseResponse = z.infer<typeof BaseResponseSchema>;
