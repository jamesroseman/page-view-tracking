import { FunctionComponent, useState } from 'react';
import { Chart, ChartOptions } from 'react-charts';

import { TrackerEvent } from '../models/TrackerEvent';
import BucketUtils, { TimeseriesBucketMap, TimeseriesDatum } from '../utils/BucketUtils';
import Button from './ui/Button';

import styles from './AnalyticsGraph.module.css';

export type AnalyticsGraphProps = {
  events: TrackerEvent[];
}

type TrackerEventDatapoint = {
  name: string,
} & TimeseriesDatum;

type Series = {
  label: string;
  data: TrackerEventDatapoint[];
}

type TimeSelection = {
  last24Hours: boolean;
  last7Days: boolean;
  last30Days: boolean;
  last90Days: boolean;
}

type FilterSelection = {
  [eventName: string]: boolean;
}

const AnalyticsGraph: FunctionComponent<AnalyticsGraphProps> = ({
  events,
}) => {
  const [timeSelection, setTimeSelection] = useState<TimeSelection>({
    last24Hours: true,
    last7Days: false,
    last30Days: false,
    last90Days: false,
  });

  const eventNames: string[] = Array.from(new Set(events.map((event: TrackerEvent) => event.name)));
  const defaultFilterSelection: FilterSelection = eventNames.reduce(
    (filterSelection: FilterSelection, eventName: string) => ({
      ...filterSelection,
      [eventName]: true,
    }),
    {}
  );
  const [filterSelection, setFilterSelection] = useState<FilterSelection>(defaultFilterSelection);

  return (
    <div className={styles['container']}>
      {renderTimeselectors(timeSelection, setTimeSelection)}
      <div className={styles['content-container']}>
        {renderGraph(events, timeSelection, filterSelection)}
        {renderEventNameFilters(eventNames, filterSelection, setFilterSelection)}
      </div>
    </div>
  );
}

function renderTimeselectors(timeSelection: TimeSelection, setTimeSelection: React.Dispatch<React.SetStateAction<TimeSelection>>) {
  const defaultTimeSelection: TimeSelection = {
    last24Hours: false,
    last7Days: false,
    last30Days: false,
    last90Days: false,
  };

  return (
    <div className={styles['timeselectors-container']}>
      <div className={styles['timeselectors-buttons']}>
        <Button isActive={timeSelection.last24Hours} label='24h' onClick={() => setTimeSelection({ ...defaultTimeSelection, last24Hours: true })} />
        <Button isActive={timeSelection.last7Days} label='7d' onClick={() => setTimeSelection({ ...defaultTimeSelection, last7Days: true })} />
        <Button isActive={timeSelection.last30Days} label='30d' onClick={() => setTimeSelection({ ...defaultTimeSelection, last30Days: true })} />
        <Button isActive={timeSelection.last90Days} label='90d' onClick={() => setTimeSelection({ ...defaultTimeSelection, last90Days: true })} />
      </div>
    </div>
  );
}

function renderGraph(events: TrackerEvent[], timeSelection: TimeSelection, filterSelection: FilterSelection) {
  // Filter events by active filters.
  const activeFilters: string[] = Object.keys(filterSelection).filter((eventName: string) => filterSelection[eventName]);
  const filteredEvents: TrackerEvent[] = events.filter((event: TrackerEvent) => activeFilters.includes(event.name));

  const datapoints: TrackerEventDatapoint[] = filteredEvents.map((event: TrackerEvent) => ({
    date: new Date(parseInt(event.timestamp)),
    value: event.value,
    name: event.name,
  } as TrackerEventDatapoint));
  const bucketMap: TimeseriesBucketMap<TrackerEventDatapoint> = BucketUtils.bucketData(
    datapoints,
    (datapoint: TrackerEventDatapoint) => datapoint.name,
  );
  const eventNames: string[] = Object.keys(bucketMap);
  const seriesData: Series[] = eventNames.map((eventName: string) => {
    const label: string = eventName;
    const timestamps: string[] = Object.keys(bucketMap[eventName]);
    const timestampDatapoints: TrackerEventDatapoint[] = timestamps.map((timestamp: string) => bucketMap[eventName][timestamp]);
    return {
      label,
      data: timestampDatapoints,
    }
  });

  const minDate: Date = new Date();
  if (timeSelection.last24Hours) {
    minDate.setDate(minDate.getDate() - 1);
  } else if (timeSelection.last7Days) {
    minDate.setDate(minDate.getDate() - 7);
  } else if (timeSelection.last30Days) {
    minDate.setDate(minDate.getDate() - 30);
  } else if (timeSelection.last90Days) {
    minDate.setDate(minDate.getDate() - 90);
  }

  const chart: JSX.Element = (
    <Chart
      options={{
        primaryAxis: {
          getValue: (datum: TrackerEventDatapoint) => datum.date,
          min: minDate,
        },
        secondaryAxes: [{
          getValue: (datum: TrackerEventDatapoint) => datum.count,
          min: 0,
        }],
        data: seriesData,
      } as ChartOptions<TrackerEventDatapoint>}
    />
  );
  return (
    <div className={styles['graph-container']}>
      {chart}
    </div>
  )
}

function renderEventNameFilters(eventNames: string[], filterSelection: FilterSelection, setFilterSelection: React.Dispatch<React.SetStateAction<FilterSelection>>) {
  // Toggle the filter. At least one filter must be selected.
  const activateDeactivateFilter: (eventName: string) => void = (eventName: string) => {
    const currentToggle: boolean = filterSelection[eventName];
    const updatedFilterSelection: FilterSelection = {
      ...filterSelection,
      [eventName]: !currentToggle,
    }
    const eventNames: string[] = Object.keys(updatedFilterSelection);
    const isAtLeastOneFilterActive: boolean = eventNames.reduce((result: boolean, eventName: string) => result || updatedFilterSelection[eventName], false);
    if (isAtLeastOneFilterActive) {
      setFilterSelection(updatedFilterSelection);
    }
  };

  return (
    <div className={styles['filters-container']}>
      {eventNames.map((eventName: string) => (
        <Button isActive={filterSelection[eventName] ?? false} label={eventName} onClick={() => activateDeactivateFilter(eventName)} />
      ))}
    </div>
  );
}

export default AnalyticsGraph;