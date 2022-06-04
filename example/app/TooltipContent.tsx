import { Tooltip } from '../../dist';

export const TooltipContent: Parameters<typeof Tooltip>[0]['content'] = ({
  event,
  series,
}) => (
  <div
    style={{
      padding: 16,
      borderRadius: 8,
      backgroundColor: 'rgba(255, 0, 0, 0.5)',
      color: 'white',
    }}
  >
    {series && <div>Series: {event.seriesPrices.get(series)?.toString()}</div>}
    {event.hoveredSeries && (
      <div>
        Hovered series:{' '}
        {event.seriesPrices.get(event.hoveredSeries)?.toString()}
      </div>
    )}
    {event.hoveredMarkerId && (
      <div>Hovered marker id: {event.hoveredMarkerId}</div>
    )}
    {typeof event.time === 'number' && (
      <div>Time: {new Date(event.time * 1000).toLocaleDateString()}</div>
    )}
  </div>
);
