#!/bin/sh
node models/models.js
node queue/worker.js
node server.js