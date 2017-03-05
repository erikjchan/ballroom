
const express       = require('express')
const app           = express()
const path          = require('path')
const data          = require('./data')

/********************************* DATA PATHS *********************************/

app.post('*', (req, res) => {
  res.send({status: 'posted'})
})

app.get('/api/competitors', (req, res) => {
  res.send(data.competitors)
})

app.get('/api/competitions', (req, res) => {
  res.send(data.competitions)
})

app.get('/api/events', (req, res) => {
  res.send(data.events)
})

app.get('/api/rounds', (req, res) => {
  res.send(data.rounds)
})

app.get('/api/partnerships', (req, res) => {
  res.send(data.partnerships)
})

app.get('/api/organizations', (req, res) => {
  res.send(data.organizations)
})

app.get('/api/payment_records', (req, res) => {
  res.send(data.payment_records)
})

app.get('/api/callbacks', (req, res) => {
  res.send(data.callbacks)
})

app.get('/api/admins', (req, res) => {
  res.send(data.admins)
})

app.get('/api/judges', (req, res) => {
  res.send(data.judges)
})

app.get('/api/', (req, res) => {
  res.send({routes: [
    '/api/competitors',
    '/api/competitions',
    '/api/events',
    '/api/rounds',
    '/api/partnerships',
    '/api/corganizations',
    '/api/payment_records',
    '/api/callbacks',
    '/api/admins',
    '/api/judges'
  ]})
})

/*********************** Lets blow this popsicle stand~ ***********************/

app.listen(3000, () => {
  console.log('Mock API running on http://localhost:3000/api')
})