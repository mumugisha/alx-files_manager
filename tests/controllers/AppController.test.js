/* eslint-disable import/no-named-as-default */
import dbClient from '../../utils/db';

describe('AppController', () => {
  before(function(done) {
    this.timeout(10000);
    Promise.all([
      dbClient.usersCollection(),
      dbClient.filesCollection()
    ])
      .then(([usersCollection, filesCollection]) => {
        Promise.all([
          usersCollection.deleteMany({}),
          filesCollection.deleteMany({})
        ])
          .then(() => done())
          .catch((deleteErr) => done(deleteErr));
      })
      .catch((connectErr) => done(connectErr));
  });

  describe('GET: /status', () => {
    it('Returns correct status about services', function(done) {
      request
        .get('/status')
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.deep.eql({
            redis: true,
            db: true
          });
          done();
        });
    });
  });

  describe('GET: /stats', () => {
    it('Returns correct empty statistics about db collections', function(done) {
      request
        .get('/stats')
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.deep.eql({
            users: 0,
            files: 0
          });
          done();
        });
    });

    it('Returns correct statistics after inserting documents', function(done) {
      this.timeout(10000);
      Promise.all([
        dbClient.usersCollection(),
        dbClient.filesCollection()
      ])
        .then(([usersCollection, filesCollection]) => {
          Promise.all([
            usersCollection.insertMany([
              { email: 'john@mail.com' }
            ]),
            filesCollection.insertMany([
              { name: 'foo.txt', type: 'file' },
              { name: 'pic.png', type: 'image' }
            ])
          ])
            .then(() => {
              request
                .get('/stats')
                .expect(200)
                .end((err, res) => {
                  if (err) {
                    return done(err);
                  }
                  expect(res.body).to.deep.eql({
                    users: 1,
                    files: 2
                  });
                  done();
                });
            })
            .catch((insertErr) => done(insertErr));
        })
        .catch((connectErr) => done(connectErr));
    });
  });
});
