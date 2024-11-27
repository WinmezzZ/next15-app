// import {
//   twind,
//   virtual,
//   cssom,
//   tx as tx$,
//   cx as cx$,
//   injectGlobal as injectGlobal$,
//   keyframes as keyframes$,
// } from '@twind/core';
// import config from '../../twind.config';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// export const tw = /* #__PURE__ */ twind(
//   config,
//   typeof document === 'undefined' ? virtual() : cssom('style[data-library]'),
// );
// // export const cn = /* #__PURE__ */ tx$.bind(tw);
// export const cx = /* #__PURE__ */ cx$.bind(tw);
// export const injectGlobal = /* #__PURE__ */ injectGlobal$.bind(tw);
// export const keyframes = /* #__PURE__ */ keyframes$.bind(tw);

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
