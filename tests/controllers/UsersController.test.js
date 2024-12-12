/* eslint-disable import/no-named-as-default */
import dbClient from '../../utils/db';
import request from 'supertest';
import { expect } from 'chai';
import app from '../../app'; // Adjust path to your app

describe('+ UserController', () => {
  const mockUser = {
    email: 'believe@glo.com',
    password: 'melody1982',
  };

  before(function (done) {
    this.timeout(10000);
    dbClient.usersCollection()
      .then((usersCollection) => {
        return usersCollection.deleteMany({ email: mockUser.email });
      })
      .then(() => done())
      .catch(done);
  });

  describe('+ POST: /users', () => {
    it('+ Fails when no email but password is provided', function (done) {
      this.timeout(5000);
      request(app)
        .post('/users')
        .send({ password: mockUser.password })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.deep.eql({ error: 'Missing email' });
          done();
        });
    });

    it('+ Fails when email is provided but no password', function (done) {
      this.timeout(5000);
      request(app)
        .post('/users')
        .send({ email: mockUser.email })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.deep.eql({ error: 'Missing password' });
          done();
        });
    });

    it('+ Succeeds with valid email and password', function (done) {
      this.timeout(5000);
      request(app)
        .post('/users')
        .send(mockUser)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.email).to.eql(mockUser.email);
          expect(res.body.id).to.have.length.greaterThan(0);
          done();
        });
    });

    it('+ Fails when user already exists', function (done) {
      this.timeout(5000);
      request(app)
        .post('/users')
        .send(mockUser)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.deep.eql({ error: 'Already exist' });
          done();
        });
    });
  });
});
