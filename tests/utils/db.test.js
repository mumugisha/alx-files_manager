import dbClient from '../../utils/db';
import { expect } from 'chai';

describe('+ DBClient utility', () => {
  before(function (done) {
    this.timeout(10000);
    Promise.all([dbClient.usersCollection(), dbClient.filesCollection()])
      .then(([usersCollection, filesCollection]) => {
        return Promise.all([
          usersCollection.deleteMany({}),
          filesCollection.deleteMany({})
        ]);
      })
      .then(() => done())
      .catch((err) => done(err));
  });

  it('+ Client is alive', () => {
    expect(dbClient.isAlive()).to.equal(true);
  });

  it('+ nbUsers returns the correct value', async () => {
    const nbUsers = await dbClient.nbUsers();
    expect(nbUsers).to.equal(0);
  });

  it('+ nbFiles returns the correct value', async () => {
    const nbFiles = await dbClient.nbFiles();
    expect(nbFiles).to.equal(0);
  });
});
