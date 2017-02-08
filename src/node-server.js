import React from 'react';
import ReactDOM from 'react-dom/server';
import express from 'express';
import configureStore from 'reducers/site';
import { match, RouterContext } from 'react-router';

const server = express();
server.disable('x-powered-by');

/**
 *  Process requests
 */
server.use((req, res) => {
  res.status(200).end('it works!');
});

/* global NODE_PORT */
server.listen(NODE_PORT, () => {
  console.log(`Server listening on: ${NODE_PORT}`);
});