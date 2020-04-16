const path = require('path');
const { parseCsv } = require('./csv.util');

describe('csv.util tests', () => {
  describe('parseCsv', () => {
    const sharedConfig = {
      vin: 0,
      make: 1,
      model: 2,
      mileague: 3,
      year: 4,
      price: 5,
      zipCode: 6,
      createDate: 7,
      updateDate: 8,
    };

    test('csv with no extra columns', async () => {
      const filePath = path.resolve(__dirname + '/testData/no-extra-column.csv');
      const { data, total } = await parseCsv(filePath, sharedConfig, 10);

      expect(total).toEqual(3);
      const results = data[0];

      expect(results[0].vin).toEqual('YV426MDB1F2523466');
      expect(results[0].make).toEqual('Buick');
      expect(results[0].model).toEqual('Riviera');
      expect(results[0].mileague).toEqual('42788');
      expect(results[0].year).toEqual('1986');
      expect(results[0].price).toEqual('5871');
      expect(results[0].zipCode).toEqual('31007');
      expect(results[0].createDate).toEqual('2019-08-23T17:31:27Z');
      expect(results[0].updateDate).toEqual('2019-04-26T23:02:09Z');

      expect(results[1].vin).toEqual('WAUGFAFRXCA908699');
      expect(results[1].make).toEqual('Bentley');
      expect(results[1].model).toEqual('Azure');
      expect(results[1].mileague).toEqual('24183');
      expect(results[1].year).toEqual('2010');
      expect(results[1].price).toEqual('2498');
      expect(results[1].zipCode).toEqual('32338');
      expect(results[1].createDate).toEqual('2019-05-06T02:49:41Z');
      expect(results[1].updateDate).toEqual('2019-06-27T05:43:16Z');

      expect(results[2].vin).toEqual('4T1BK1EB5FU420305');
      expect(results[2].make).toEqual('Chrysler');
      expect(results[2].model).toEqual('Aspen');
      expect(results[2].mileague).toEqual('29157');
      expect(results[2].year).toEqual('2008');
      expect(results[2].price).toEqual('2857');
      expect(results[2].zipCode).toEqual('22968');
      expect(results[2].createDate).toEqual('2020-01-16T16:02:28Z');
      expect(results[2].updateDate).toEqual('2020-02-28T21:36:05Z');
    });

    test('csv with mixed extra columns', async () => {
      const filePath = path.resolve(__dirname + '/testData/extra-column.csv');
      const config = {
        vin: 1,
        make: 2,
        model: 3,
        mileague: 5,
        year: 6,
        price: 7,
        zipCode: 8,
        createDate: 9,
        updateDate: 12,
      };

      const { data, total } = await parseCsv(filePath, config, 10);

      expect(total).toEqual(2);
      const results = data[0];

      expect(results[0].vin).toEqual('5UMBT93518L866937');
      expect(results[0].make).toEqual('Nissan');
      expect(results[0].model).toEqual('NV1500');
      expect(results[0].mileague).toEqual('13363');
      expect(results[0].year).toEqual('2012');
      expect(results[0].price).toEqual('32377');
      expect(results[0].zipCode).toEqual('41319');
      expect(results[0].createDate).toEqual('2019-07-05T05:17:16Z');
      expect(results[0].updateDate).toEqual('2020-03-18T17:41:50Z');

      expect(results[1].vin).toEqual('3C6JD6CT2CG703849');
      expect(results[1].make).toEqual('Chevrolet');
      expect(results[1].model).toEqual('TrailBlazer');
      expect(results[1].mileague).toEqual('6131');
      expect(results[1].year).toEqual('2004');
      expect(results[1].price).toEqual('25488');
      expect(results[1].zipCode).toEqual('14663');
      expect(results[1].createDate).toEqual('2020-02-17T05:59:18Z');
      expect(results[1].updateDate).toEqual('2019-05-03T21:32:16Z');
    });

    test('returns chunks with no remainders', async () => {
      const filePath = path.resolve(__dirname + '/testData/no-remainders.csv');
      const chunkSize = 1;
      const { data, total } = await parseCsv(filePath, sharedConfig, chunkSize);

      expect(total).toEqual(3);
      expect(data.length).toEqual(3);

      expect(data[0][0].vin).toEqual('YV426MDB1F2523466');
      expect(data[0][0].make).toEqual('Buick');
      expect(data[0][0].model).toEqual('Riviera');
      expect(data[0][0].mileague).toEqual('42788');
      expect(data[0][0].year).toEqual('1986');
      expect(data[0][0].price).toEqual('5871');
      expect(data[0][0].zipCode).toEqual('31007');
      expect(data[0][0].createDate).toEqual('2019-08-23T17:31:27Z');
      expect(data[0][0].updateDate).toEqual('2019-04-26T23:02:09Z');

      expect(data[1][0].vin).toEqual('WAUGFAFRXCA908699');
      expect(data[1][0].make).toEqual('Bentley');
      expect(data[1][0].model).toEqual('Azure');
      expect(data[1][0].mileague).toEqual('24183');
      expect(data[1][0].year).toEqual('2010');
      expect(data[1][0].price).toEqual('2498');
      expect(data[1][0].zipCode).toEqual('32338');
      expect(data[1][0].createDate).toEqual('2019-05-06T02:49:41Z');
      expect(data[1][0].updateDate).toEqual('2019-06-27T05:43:16Z');

      expect(data[2][0].vin).toEqual('4T1BK1EB5FU420305');
      expect(data[2][0].make).toEqual('Chrysler');
      expect(data[2][0].model).toEqual('Aspen');
      expect(data[2][0].mileague).toEqual('29157');
      expect(data[2][0].year).toEqual('2008');
      expect(data[2][0].price).toEqual('2857');
      expect(data[2][0].zipCode).toEqual('22968');
      expect(data[2][0].createDate).toEqual('2020-01-16T16:02:28Z');
      expect(data[2][0].updateDate).toEqual('2020-02-28T21:36:05Z');
    })

    test('returns chunks with remainders', async () => {
      const filePath = path.resolve(__dirname + '/testData/remainders.csv');
      const chunkSize = 2;
      const { data, total } = await parseCsv(filePath, sharedConfig, chunkSize);

      expect(total).toEqual(3);
      expect(data.length).toEqual(2);

      expect(data[0].length).toEqual(2);
      expect(data[0][0].vin).toEqual('YV426MDB1F2523466');
      expect(data[0][0].make).toEqual('Buick');
      expect(data[0][0].model).toEqual('Riviera');
      expect(data[0][0].mileague).toEqual('42788');
      expect(data[0][0].year).toEqual('1986');
      expect(data[0][0].price).toEqual('5871');
      expect(data[0][0].zipCode).toEqual('31007');
      expect(data[0][0].createDate).toEqual('2019-08-23T17:31:27Z');
      expect(data[0][0].updateDate).toEqual('2019-04-26T23:02:09Z');

      expect(data[0][1].vin).toEqual('WAUGFAFRXCA908699');
      expect(data[0][1].make).toEqual('Bentley');
      expect(data[0][1].model).toEqual('Azure');
      expect(data[0][1].mileague).toEqual('24183');
      expect(data[0][1].year).toEqual('2010');
      expect(data[0][1].price).toEqual('2498');
      expect(data[0][1].zipCode).toEqual('32338');
      expect(data[0][1].createDate).toEqual('2019-05-06T02:49:41Z');
      expect(data[0][1].updateDate).toEqual('2019-06-27T05:43:16Z');

      expect(data[1].length).toEqual(1);
      expect(data[1][0].vin).toEqual('4T1BK1EB5FU420305');
      expect(data[1][0].make).toEqual('Chrysler');
      expect(data[1][0].model).toEqual('Aspen');
      expect(data[1][0].mileague).toEqual('29157');
      expect(data[1][0].year).toEqual('2008');
      expect(data[1][0].price).toEqual('2857');
      expect(data[1][0].zipCode).toEqual('22968');
      expect(data[1][0].createDate).toEqual('2020-01-16T16:02:28Z');
      expect(data[1][0].updateDate).toEqual('2020-02-28T21:36:05Z');
    });
  });
});
