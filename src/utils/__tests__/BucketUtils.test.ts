import BucketUtils, { TimeseriesBucketMap, TimeseriesDatum } from "../BucketUtils";

type TestDatum = {
  name: string;
} & TimeseriesDatum;

describe('BucketUtils', () => {
  describe('bucketData', () => {
    it('should bucket data into hourly buckets', () => {
      const now: Date = new Date();
      const hourAgo: Date = new Date();
      hourAgo.setHours(hourAgo.getHours() - 1);
      const twoHoursAgo: Date = new Date();
      twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);
      const data: TestDatum[] = [
        {
          date: now,
          name: 'PageView',
        },
        {
          date: now,
          name: 'PageView',
        },
        {
          date: now,
          name: 'Purchase',
          value: 10,
        },
        {
          date: hourAgo,
          name: 'Purchase',
          value: 10,
        },
        {
          date: twoHoursAgo,
          name: 'Purchase',
          value: 10,
        },
        {
          date: twoHoursAgo,
          name: 'Purchase',
          value: 10,
        },
        {
          date: twoHoursAgo,
          name: 'Purchase',
          value: 10,
        }
      ];
      const bucketedNow: Date = new Date();
      bucketedNow.setHours(bucketedNow.getHours(), 0, 0, 0);
      const bucketedHourAgo: Date = new Date();
      bucketedHourAgo.setHours(bucketedHourAgo.getHours() - 1, 0, 0, 0);
      const bucketedTwoHoursAgo: Date = new Date();
      bucketedTwoHoursAgo.setHours(bucketedTwoHoursAgo.getHours() - 2, 0, 0, 0);
      const expectedBucketMap: TimeseriesBucketMap<TestDatum> = {
        'PageView': {
          [bucketedNow.getTime().toString()]: {
              date: bucketedNow,
              count: 2,
              name: 'PageView',
              value: 0,
          }
        },
        'Purchase': {
          [bucketedNow.getTime().toString()]: {
            date: bucketedNow,
            count: 1,
            value: 10,
            name: 'Purchase',
          },
          [bucketedHourAgo.getTime().toString()]: {
            date: bucketedHourAgo,
            count: 1,
            value: 10,
            name: 'Purchase',
          },
          [bucketedTwoHoursAgo.getTime().toString()]: {
            date: bucketedTwoHoursAgo,
            count: 3,
            value: 30,
            name: 'Purchase',
          },
        }
      };
      const getKeyFromDatum: (datum: TestDatum) => string = (datum: TestDatum) => datum.name;
      const actualBucketMap: TimeseriesBucketMap<TestDatum> = BucketUtils.bucketData<TestDatum>(data, getKeyFromDatum);
      expect(actualBucketMap).toEqual(expectedBucketMap);
    });
  });
});