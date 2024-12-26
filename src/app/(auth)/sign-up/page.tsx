'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button, buttonVariants } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { Github, Loader } from 'lucide-react';
import Image from 'next/image';
import { Card, CardTitle, CardDescription, CardHeader, CardFooter, CardContent } from '@/components/ui/card';
import { OAuthSignIn } from '../_components/oauth-sign';
import { useRouter } from 'next/navigation';

const userAuthSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 8 characters long.'),
});

type FormData = z.infer<typeof userAuthSchema>;

export default function AuthForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOTP] = useState('');
  const [countdown, setCountdown] = useState(30);
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);

      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    }
  }, [countdown]);

  async function onEmailSubmit(data: FormData) {
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }
      setCurrentStep(2);
      toast({
        title: 'OTP sent!',
        description: 'Please check your mail inbox',
      });
      setCountdown(30);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      toast({
        title: 'Failed to send OTP',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onOTPSubmit(data: FormData) {
    setIsVerifying(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, code: otp }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }
      setCountdown(0);
      reset();
      toast({
        title: '验证成功',
      });
      router.push('/');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      toast({
        title: 'Failed to verify OTP',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResend() {
    if (!getValues('email')) return;
    setCountdown(0);
    setOTP('');
    await onEmailSubmit(getValues());
  }

  return (
    <section className="grid items-center gap-8 w-[400px]">
      <Card className="px-8">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">注册</CardTitle>
          {currentStep === 2 && <CardDescription>邮箱验证</CardDescription>}
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className={cn('mt-4 flex max-w-full flex-col gap-4')}>
            {currentStep === 1 && (
              <>
                <form onSubmit={handleSubmit(onEmailSubmit)}>
                  <div className="flex flex-col gap-2.5">
                    <div>
                      <Label className="sr-only" htmlFor="email">
                        Email
                      </Label>
                      <Input
                        id="email"
                        placeholder="name@example.com"
                        disabled={isLoading || isGithubLoading}
                        {...register('email')}
                      />
                      {errors?.email && <p className="mt-2 text-xs text-destructive">{errors?.email.message}</p>}
                    </div>
                    <div>
                      <Label className="sr-only" htmlFor="password">
                        Password
                      </Label>
                      <Input
                        id="password"
                        placeholder="password"
                        type="password"
                        disabled={isLoading || isGithubLoading}
                        {...register('password')}
                      />
                      {errors?.password && <p className="mt-2 text-xs text-destructive">{errors?.password.message}</p>}
                    </div>
                    <button
                      type="submit"
                      className={cn(buttonVariants())}
                      disabled={isLoading || isGithubLoading || isVerifying}
                    >
                      {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                      Send OTP
                    </button>
                  </div>
                </form>
              </>
            )}
            {currentStep === 2 && (
              <>
                <p className="mb-4 text-center">
                  <span className="break-all">我们给 {getValues('email')} 发了一个6位数的验证码.</span>{' '}
                  请在下面输入框输入进行验证.
                </p>
                <form onSubmit={handleSubmit(onOTPSubmit)} className="flex flex-col gap-2.5">
                  <div>
                    <Label className="sr-only" htmlFor="otp">
                      Enter OTP
                    </Label>
                    <div className="">
                      <InputOTP
                        id="otp"
                        autoFocus
                        disabled={isLoading}
                        value={otp}
                        onChange={setOTP}
                        maxLength={6}
                        className="flex justify-between"
                      >
                        <InputOTPGroup className="flex w-full items-center justify-between [&>div]:rounded-md [&>div]:border">
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>
                  <Button type="submit" disabled={isVerifying || otp.length !== 6} className="mt-4">
                    {isVerifying && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                    验证邮箱
                  </Button>
                </form>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                  <span>没有收到验证码或已过期?</span>
                  {countdown > 0 ? (
                    <span>{countdown}秒后重新发送</span>
                  ) : (
                    <Button variant="link" onClick={handleResend} className="h-auto p-0" disabled={isLoading}>
                      {isLoading ? '重发中...' : '重新发送'}
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>

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
            已有账号？{' '}
            <Link
              aria-label="Sign in"
              href="/sign-in"
              className="text-primary underline-offset-4 transition-colors hover:underline"
            >
              去登录
            </Link>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
}
