const express = require('express');
const setup_api = require('../../api')

function api() {
  const app = setup_api(express());
  app.get('/user', function(req, res) {
    res.status(200).json({ name: 'tobi' });
  });
  return app;
}


module.exports = {
  api
}