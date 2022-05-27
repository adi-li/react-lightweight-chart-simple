import * as React from 'react';

const FALLBACK: [boolean, (cb: () => void) => void] = [false, (cb) => cb()];

export const useTransition = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return React.useTransition ? React.useTransition() : FALLBACK;
};
