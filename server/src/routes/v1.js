const v1Router = require('express').Router();

const planetsRouter = require('./planets/planets.router');
const launchesRouter = require('./launches/launches.router');

v1Router.use('/planets', planetsRouter);
v1Router.use('/launches', launchesRouter);

module.exports = v1Router;