/* eslint-disable import/no-named-as-default */
import redisClient from '../utils/redis';
import { expect } from 'chai';

describe('+ RedisClient utility', () => {
  before(function(done) {
    this.timeout(10000);
    setTimeout(done, 4000);
  });

  it('+ Client is alive', () => {
    expect(redisClient.isAlive()).to.equal(true);
  });

  it('+ Setting and getting a value', async function () {
    await redisClient.set('test_key', 345, 10);
    const value = await redisClient.get('test_key');
    expect(value).to.equal('345');
  });

  it('+ Setting and getting an expired value', function (done) {
    this.timeout(5000);
    redisClient.set('test_key', 356, 1).then(() => {
      setTimeout(async () => {
        const value = await redisClient.get('test_key');
        expect(value).to.be.null;
        done();
      }, 2000);
    });
  });

  it('+ Setting and getting a deleted value', function (done) {
    this.timeout(5000);
    redisClient.set('test_key', 345, 10).then(() => {
      redisClient.del('test_key').then(() => {
        setTimeout(async () => {
          const value = await redisClient.get('test_key');
          console.log('del: test_key ->', value);
          expect(value).to.be.null;
          done();
        }, 2000);
      });
    });
  });
});
