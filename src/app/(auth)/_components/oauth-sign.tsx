'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';

import { oauthProviders } from '../config';
import { useTransition } from 'react';
import { signIn } from '@/auth';

export function OAuthSignIn() {
  const [isPending, startTransition] = useTransition();
  const handleSignIn = async (provider: string) => {
    startTransition(async () => {
      await signIn(provider);
    });
  };

  return (
    <div className="flex flex-row items-center gap-4">
      {oauthProviders.map(provider => {
        return (
          <Button
            key={provider.name}
            variant="outline"
            className="w-full bg-background"
            onClick={() => handleSignIn(provider.name)}
            disabled={isPending}
          >
            {isPending && <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />}
            {provider.icon}
            {provider.name}
            <span className="sr-only">{provider.title}</span>
          </Button>
        );
      })}
    </div>
  );
}
