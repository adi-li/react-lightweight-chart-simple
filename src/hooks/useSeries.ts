import { useContext } from 'react';

import { SeriesContext } from '../context';

/**
 * Get the series api object.
 *
 * ❗Only use inside `<Series />`.
 *
 * @returns series: `ISeriesApi`
 */
export function useSeries() {
  return useContext(SeriesContext);
}
