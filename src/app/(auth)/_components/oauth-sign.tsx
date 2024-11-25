'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { AlignCenter, Github, Loader } from 'lucide-react';

import { signIn } from 'next-auth/react';

const oauthProviders = [
  { name: 'Google', icon: AlignCenter },
  { name: 'Github', icon: Github },
] satisfies {
  name: string;
  icon: any;
}[];

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
        const Icon = provider.icon;

        return (
          <Button
            key={provider.name}
            variant="outline"
            className="w-full bg-background"
            onClick={() => handleSignIn(provider.name)}
            disabled={loading}
          >
            {loading ? (
              <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Icon className="mr-2 size-4" aria-hidden="true" />
            )}
            {provider.name}
            <span className="sr-only">{provider.name}</span>
          </Button>
        );
      })}
    </div>
  );
}
