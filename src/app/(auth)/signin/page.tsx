'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Loader } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { Card, CardTitle, CardDescription, CardHeader, CardFooter, CardContent } from '@/components/ui/card';
import { OAuthSignIn } from '../_components/oauth-sign';
import { useRouter } from 'next/navigation';
import { signInSchema } from '../schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export default function SignIn() {
  const router = useRouter();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  });

  async function onEmailSubmit(data: z.infer<typeof signInSchema>) {
    const res = await signIn('credentials', { redirect: false, ...data });
    if (!res?.code) {
      toast({
        title: '登录失败',
        description: '请检查用户名和密码',
        variant: 'destructive',
      });
    } else {
      toast({
        title: '登录成功',
      });
      router.push('/');
    }
  }

  const isLoading = form.formState.isSubmitting;

  return (
    <section className="grid items-center gap-8 pb-8 pt-6 lg:py-6 container !max-w-xl py-8 md:py-10">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">登录</CardTitle>
          <CardDescription>选择一种登录方式</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onEmailSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>用户名</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.username?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage>{form.formState.errors.password?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                登录
              </Button>
            </form>
          </Form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">其他登录方式</span>
            </div>
          </div>

          <OAuthSignIn />
        </CardContent>

        <CardFooter>
          <div className="text-sm text-muted-foreground">
            没有账号？{' '}
            <Link
              aria-label="Sign in"
              href="/signin"
              className="text-primary underline-offset-4 transition-colors hover:underline"
            >
              去注册
            </Link>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
}
