const randomInt = require('random-int');
const randomWord = require('random-word');
const randomDate = require('random-datetime');
const pg = require('phrase-generator');
const uuidV1 = require('uuid/v1');
var randomItem = require('random-item');
var Identity = require('fake-identity');

const array = n => new Array(n).fill(null)
const collection = n => cb => array(n).map((_, i) => cb(i))
const randomId = top => randomInt(top - 1)
const randomBool = _ => !randomInt(1)
const randomLevel = _ => randomItem(['beginner', 'intermediate', 'advanced']);

const ORGANIZATIONS = 2
const COMPETITORS = ORGANIZATIONS * 50
const COMPETITIONS = 2
const EVENTS = COMPETITIONS * 5
const ROUNDS = EVENTS * 3
const JUDGES = 10
const PARTNERSHIPS = COMPETITORS // 2x more than needed just in case
const ADMINS = 5
const PAYMENTS = COMPETITORS

let prevdata = null
const randomData = refresh => {
  if (refresh || !prevdata) prevdata = Identity.generate()
  return prevdata
}

const get_competitors = n => collection(n)(i => ({
  "id" : i,
  "first_name" : randomData(1).firstName,
  "last_name" : randomData().lastName,
  "email" :  randomData().emailAddress,
  "mailing_address" : randomData().street,
  "organization_id" : randomId(ORGANIZATIONS),
  "password" : uuidV1(),
  "registered" : randomBool(),
}))

// So its not completley RNG
const get_callbacks = competitors => competitors
.filter(c => c["Lead Number"])
.map((c, i) => ({
  "id" : i,
  "timestamp" : randomDate({year: 2017}),
  "judge_id" : randomId(JUDGES),
  "Lead Competitor number" : c["Lead Number"],
  "round_id" : randomId(ROUNDS),
}))


const get_competitions = n => collection(n)(i => ({
  "id" : i,
  "Name" : randomWord(),
  "leadIdStartNum" : 0, // TODO
  "LocationName" : randomData(1).city,
  "EarlyPrice" : randomInt(0, 100),
  "RegPrice" : randomInt(0, 100),
  "LatePrice" : randomInt(0, 100),
  "StartDate" : randomDate({year: 2018}),
  "EndDate" : randomDate({year: 2018}),
  "RegStartDate" : randomDate({year: 2017}),
  "RegEndDate" : randomDate({year: 2017}),
  "EarlyRegDeadline" : randomDate({year: 2017}),
  "RegularRegDeadline" : randomDate({year: 2017}),
  "CompAdmin" : randomData().emailAddress,
}))


const get_events = n => collection(n)(i => ({
  "id" : i,
  "competitionId" : randomId(COMPETITIONS),
  "title" : pg.generate(),
  "style" : pg.generate(),
  "level" : randomLevel(),
}))

const get_rounds = n => collection(n)(i => ({
  "id" : i,
  "event" : randomId(EVENTS),
  "name" : pg.generate(),
  "order_number" : i,
  "size" : randomInt(50, 100),
  "next_round" : randomInt(0, 20),
  "judge_1" : randomId(JUDGES),
  "judge_2" : randomId(JUDGES),
  "judge_3" : randomId(JUDGES),
  "judge_4" : randomId(JUDGES),
  "judge_5" : randomId(JUDGES),
  "judge_6" : randomBool() ? randomId(JUDGES) : null,
}))

const get_partnerships = n => collection(n)(i => ({
  "lead_number" : randomInt(0, 100),
  "Lead Competitor id" : randomId(COMPETITORS),
  "Follow Competitor id" : randomId(COMPETITORS),
  "Event Category" : randomId(EVENTS),
  "Lead Confirmed" : randomBool(),
  "Follow Confirmed" : randomBool(),
  "Called Back" : randomBool(),
  "Timestamp" : randomDate({year: 2017}),
}))

const get_organizations = n => collection(n)(i => ({
  "id" : i,
  "name" : randomData(1).company,
}))

const get_admins = n => collection(n)(i => ({
  "Username" : randomData(1).emailAddress,
  "Password" : uuidV1(),
}))

const get_judges = n => collection(n)(i => ({
  "id" : i,
  "Email address" : randomData(1).emailAddress,
  "Token" : uuidV1(),
  "First Name" : randomData().firstName,
  "Last Name" : randomData().lastName,  
}))

const get_payment_records = n => collection(n)(i => ({
  "id" : i,
  "competitionId" : randomId(COMPETITIONS),
  "Timestamp" : randomDate({year: 2017}),
  "Competitor id" : randomId(COMPETITORS),
  "Amount" : randomInt(50, 100)/2,
  "Online/offline" : randomBool(),
  "Payer name" : randomData(1).firstName + ' ' + randomData(1).lastName,
}))

const get_schedule = n => collection(n) (i => ({
  "id" : i, 
  "order_number" : i,
  "title" : pg.generate(),
  "style" : pg.generate(),
  "level" : randomLevel(),
  "round": randomInt(1, 5),
}))


const competitors = get_competitors(COMPETITORS)
const competitions = get_competitions(COMPETITIONS)
const events = get_events(EVENTS)
const rounds = get_rounds(ROUNDS)
const schedule = get_schedule(ROUNDS)
const partnerships = get_partnerships(PARTNERSHIPS)
const organizations = get_organizations(ORGANIZATIONS)
const payment_records = get_payment_records(PAYMENTS)
const callbacks = get_callbacks(competitors)
const admins = get_admins(ADMINS)
const judges = get_judges(JUDGES)


module.exports = {
  competitors,
  competitions,
  events,
  rounds,
  partnerships,
  organizations,
  payment_records,
  callbacks,
  admins,
  judges,
  schedule,
}

