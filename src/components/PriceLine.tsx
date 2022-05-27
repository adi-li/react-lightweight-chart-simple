import { IPriceLine, PriceLineOptions } from 'lightweight-charts';
import { useEffect, useRef } from 'react';

import { useSeries } from '../hooks/useSeries';

/**
 * Create a price line for the series, should only be nested inside any series component.
 */
export const PriceLine = (props: Partial<PriceLineOptions>) => {
  const series = useSeries();
  const priceLineRef = useRef<IPriceLine>();

  // create price line
  useEffect(() => {
    if (!priceLineRef.current) {
      priceLineRef.current = series?.createPriceLine(props as PriceLineOptions);
    } else {
      priceLineRef.current.applyOptions(props);
    }
  }, [series, props]);

  // remove price line
  useEffect(() => {
    return () => {
      if (!priceLineRef.current) return;
      // suppress error when series is trying remove a removed price line
      try {
        series?.removePriceLine(priceLineRef.current);
      } catch {} // eslint-disable-line no-empty
      priceLineRef.current = undefined;
    };
  }, [series]);

  return null;
};
