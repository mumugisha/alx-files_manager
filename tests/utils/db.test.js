/* eslint-disable import/no-named-as-default */
import dbClient from '../../utils/db';
import { expect } from 'chai';

describe('+ DBClient utility', () => {
  before((done) => {
    this.timeout(10000);
    Promise.all([dbClient.usersCollection(), dbClient.filesCollection()])
      .then(([usersCollection, filesCollection]) => 
        Promise.all([
          usersCollection.deleteMany({}),
          filesCollection.deleteMany({}),
        ])
      )
      .then(() => done())
      .catch((error) => done(error));
  });

  it('+ Client is alive', () => {
    expect.assertions(1);
    expect(dbClient.isAlive()).to.equal(true);
  });

  it('+ nbUsers returns the correct value', async () => {
    expect.assertions(1);
    const users = await dbClient.nbUsers();
    expect(users).to.equal(0);
  });

  it('+ nbFiles returns the correct value', async () => {
    expect.assertions(1);
    const files = await dbClient.nbFiles();
    expect(files).to.equal(0);
  });
});

