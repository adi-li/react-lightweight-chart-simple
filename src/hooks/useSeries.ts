import { useContext } from 'react';

import { SeriesContext } from '../context';

/**
 * Get the series api object.
 * Only available inside any series component.
 */
export function useSeries() {
  return useContext(SeriesContext);
}
