const path = require('path');
const dbHelper = require('../../tests/db.helper');
const { getConfig, processBulkOrders, processUpload } = require('./upload.controller');
const { Config, Order } = require('../models');

const preloadConfig = () => {
  return Config.insertMany([{
    provider: 'test-provider-1',
    vin: 0,
    make: 1,
    model: 2,
    mileague: 3,
    year: 4,
    price: 5,
    zipCode: 6,
    createDate: 7,
    updateDate: 8,
  }, {
    provider: 'test-provider-2',
    vin: 1,
    make: 2,
    model: 3,
    mileague: 5,
    year: 6,
    price: 7,
    zipCode: 8,
    createDate: 9,
    updateDate: 12,
  }]);
};

describe('upload.controller tests', () => {
  beforeAll(async () => {
    await dbHelper.connect();
  });

  beforeEach(async () => {
    await preloadConfig();
  });

  afterEach(async () => {
    await dbHelper.clearDatabase();
  });

  afterAll(async () => {
    await dbHelper.closeDatabase();
  });

  describe('getConfig', () => {
    test('returns null if provider does not exists', async () => {
      const config = await getConfig('provider1');

      expect(config).toEqual(null);
    });

    test('returns a config based on a provider', async () => {
      const config = await getConfig('test-provider-1');

      expect(config).toEqual({
        provider: 'test-provider-1',
        vin: 0,
        make: 1,
        model: 2,
        mileague: 3,
        year: 4,
        price: 5,
        zipCode: 6,
        createDate: 7,
        updateDate: 8,
      });
    });
  });

  describe('processBulkOrders', () => {
    test('process chunks correctly', async () => {
      const chunks = [[{
        vin: 'YV426MDB1F2523466',
        make: 'Buick',
        model: 'Riviera',
        mileague: '42788',
        year: '1986',
        price: '5871',
        zipCode: '31007',
        createDate: '2019-08-23T17:31:27Z',
        updateDate: '2019-04-26T23:02:09Z',
      }], [{
        vin: 'WAUGFAFRXCA908699',
        make: 'Bentley',
        model: 'Azure',
        mileague: '24183',
        year: '2010',
        price: '2498',
        zipCode: '32338',
        createDate: '2019-05-06T02:49:41Z',
        updateDate: '2019-06-27T05:43:16Z',
      }]];
  
      await processBulkOrders(chunks);

      // Verify data in Order
      const orders = await Order.find();

      expect(orders.length).toEqual(2);
      expect(orders[0].vin).toEqual('YV426MDB1F2523466');
      expect(orders[0].make).toEqual('Buick');
      expect(orders[0].model).toEqual('Riviera');
      expect(orders[0].mileague).toEqual(42788);
      expect(orders[0].year).toEqual(1986);
      expect(orders[0].price).toEqual(5871);
      expect(orders[0].zipCode).toEqual('31007');
      expect(orders[0].createDate).toEqual('2019-08-23T17:31:27Z');
      expect(orders[0].updateDate).toEqual('2019-04-26T23:02:09Z');

      expect(orders[1].vin).toEqual('WAUGFAFRXCA908699');
      expect(orders[1].make).toEqual('Bentley');
      expect(orders[1].model).toEqual('Azure');
      expect(orders[1].mileague).toEqual(24183);
      expect(orders[1].year).toEqual(2010);
      expect(orders[1].price).toEqual(2498);
      expect(orders[1].zipCode).toEqual('32338');
      expect(orders[1].createDate).toEqual('2019-05-06T02:49:41Z');
      expect(orders[1].updateDate).toEqual('2019-06-27T05:43:16Z');
    });
  });

  describe('processUpload', () => {
    test('returns an error if there is no config for the given provider', async () => {
      try {
        await processUpload('path', 'invalid-provider');
        expect(true).toEqual(false); // will fail if code goes until here.
      } catch (error) {
        expect(error.message).toEqual('No config was found for provider invalid-provider');
      }
    });

    test('retrieves config and process data correctly', async () => {
      const file = path.resolve(__dirname + '/testData/process-upload.csv');
      await processUpload(file, 'test-provider-2');

      // Verify data in Orders
      const orders = await Order.find();

      expect(orders.length).toEqual(2);
      expect(orders[0].vin).toEqual('5UMBT93518L866937');
      expect(orders[0].make).toEqual('Nissan');
      expect(orders[0].model).toEqual('NV1500');
      expect(orders[0].mileague).toEqual(13363);
      expect(orders[0].year).toEqual(2012);
      expect(orders[0].price).toEqual(32377);
      expect(orders[0].zipCode).toEqual('41319');
      expect(orders[0].createDate).toEqual('2019-07-05T05:17:16Z');
      expect(orders[0].updateDate).toEqual('2020-03-18T17:41:50Z');

      expect(orders[1].vin).toEqual('3C6JD6CT2CG703849');
      expect(orders[1].make).toEqual('Chevrolet');
      expect(orders[1].model).toEqual('TrailBlazer');
      expect(orders[1].mileague).toEqual(6131);
      expect(orders[1].year).toEqual(2004);
      expect(orders[1].price).toEqual(25488);
      expect(orders[1].zipCode).toEqual('14663');
      expect(orders[1].createDate).toEqual('2020-02-17T05:59:18Z');
      expect(orders[1].updateDate).toEqual('2019-05-03T21:32:16Z');
    });
  });

});
