/**
 * Return width and height for the `entry`
 * @param entry ResizeObserverEntry
 * @returns [width, height] as `[number, number]`
 */
export const getSizeFromEntry = (
  entry: ResizeObserverEntry,
): [number, number] => {
  if (entry.contentBoxSize) {
    if (Array.isArray(entry.contentBoxSize)) {
      return [
        entry.contentBoxSize[0].inlineSize as number,
        entry.contentBoxSize[0].blockSize as number,
      ];
    } else {
      // Firefox implements `contentBoxSize` as a single content rect, rather than an array
      /* eslint-disable @typescript-eslint/no-explicit-any */
      return [
        (entry.contentBoxSize as any).inlineSize as number,
        (entry.contentBoxSize as any).blockSize as number,
      ];
      /* eslint-enable @typescript-eslint/no-explicit-any */
    }
  }
  return [entry.contentRect.width, entry.contentRect.height];
};
