import { useContext } from 'react';

import { SeriesContext } from '../context';

export function useSeries() {
  return useContext(SeriesContext);
}
