'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';

import { signIn } from 'next-auth/react';
import { oauthProviders } from '../config';

export function OAuthSignIn() {
  const [loading, setLoading] = React.useState(false);

  const handleSignIn = async (provider: string) => {
    setLoading(true);
    await signIn(provider);
    setLoading(false);
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
            disabled={loading}
          >
            {loading && <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />}
            {provider.icon}
            {provider.name}
            <span className="sr-only">{provider.name}</span>
          </Button>
        );
      })}
    </div>
  );
}
