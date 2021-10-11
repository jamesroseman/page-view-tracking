
export type TimeseriesDatum = {
  date: Date,
  value?: number,
  count?: number,
}

export type TimeseriesBucketMap<T extends TimeseriesDatum> = {
  [key: string]: {
    [timestamp: string]: T
  }
}

export enum BucketType {
  Hourly = 1,
  Daily
}

/**
 * A utility class with helpers for efficient clientside timeseries bucketing.
 */
export default class BucketUtils {
  /**
   * Bucket timeseries data into hourly buckets.
   */
  static bucketData<T extends TimeseriesDatum>(
    data: T[],
    getKeyFromDatum: (datum: T) => string,
    bucketType: BucketType = BucketType.Hourly,
    combineData: (datumA: T, datumB: T) => T = (a: T, _: T) => a,
  ): TimeseriesBucketMap<T> {
    const bucketMap: TimeseriesBucketMap<T> = data.reduce(
      (aggBucketMap: TimeseriesBucketMap<T>, datum: T) => {
        const { date, value } = datum;
        const key: string = getKeyFromDatum(datum);
        if (!aggBucketMap.hasOwnProperty(key)) {
          aggBucketMap[key] = {};
        }
        const adjustedDate: Date = new Date(date);
        adjustedDate.setHours(adjustedDate.getHours(), 0, 0, 0);
        if (bucketType === BucketType.Daily) {
          adjustedDate.setHours(0);
        }
        const adjustedTimestamp: string = adjustedDate.getTime().toString();
        if (!aggBucketMap[key].hasOwnProperty(adjustedTimestamp)) {
          aggBucketMap[key][adjustedTimestamp] = {
            ...datum,
            date: adjustedDate,
            value,
            count: 1,
          };
        } else {
          const currDatum: T = aggBucketMap[key][adjustedTimestamp];
          aggBucketMap[key][adjustedTimestamp] = {
            ...combineData(datum, currDatum),
            date: adjustedDate,
            value: (value ?? 0) + (currDatum.value ?? 0),
            count: (currDatum.count ?? 1) + 1,
          };
        }
        return aggBucketMap;
      },
      {}
    );
    return bucketMap;
  }
}