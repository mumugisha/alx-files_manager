import supertest from 'supertest';
import chai from 'chai';
import api from '../server.js';

global.app = api;
global.request = supertest(api);
global.expect = chai.expect;
global.assert = chai.assert;
