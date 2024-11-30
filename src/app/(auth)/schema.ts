import { z } from 'zod';

export const signInSchema = z.object({
  username: z.string({ required_error: '用户名不能为空' }).min(1, '用户名最少为4位数'),
  password: z.string({ required_error: '密码不能为空' }).min(6, '密码最少为6位数').max(32, '密码最多为32位数'),
});
