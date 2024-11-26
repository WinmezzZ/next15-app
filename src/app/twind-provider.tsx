'use client';

import { install as installTwind } from '@twind/core';
import { useEffect } from 'react';
import twindConfig from '../../twind.config';

export default function TwindProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    window.addEventListener('warning', (event) => {
      const ev = event as CustomEvent
      if (ev.detail.code === "TWIND_INVALID_CLASS") {
        ev.preventDefault();
      }
    });

    installTwind(twindConfig, process.env.NODE_ENV === 'production');
  }, []);

  return <>{children}</>;
}