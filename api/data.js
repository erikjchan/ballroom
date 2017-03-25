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
const randomLevel = _ => randomItem(['Newcomer', 'Bronze', 'Silver', 'Gold', 'Open', 'Syllabus']);
const randomStyle = _ => randomItem(['Latin', 'Rhythm', 'Smooth', 'Standard']);
const randomRound = _ => randomItem(['Round 1', 'Round 2', 'Quarterfinals', 'Semifinals', 'Finals']);
const randomEventTitle = _ => randomItem(['Event1', 'Event2', 'Event3', 'Event4']);
const randomCompName = _ => randomItem(['Cornell Dancesport Classic', 'RPI Ballroom Competition', 'Greendale Community College Ball-stravaganza!']);


const ORGANIZATIONS = 2
const COMPETITORS = ORGANIZATIONS * 50
const COMPETITIONS = 2
const EVENTS = COMPETITIONS * 5
const ROUNDS = EVENTS * 3
const JUDGES = 10
const PARTNERSHIPS = COMPETITORS // 2x more than needed just in case
const ADMINS = 5
const PAYMENTS = COMPETITORS
const COMPETITOR_EVENTS = 6


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
  "lead_number" : randomInt(0, 100),
}))

// So its not completley RNG
const get_callbacks = competitors => competitors
.filter(c => c.lead_number)
.map((c, i) => ({
  "id" : i,
  "timestamp" : randomDate({year: 2017}).toDateString(),
  "judge_id" : randomId(JUDGES),
  "lead_competitor_number" : c.lead_number,
  "round_id" : randomId(ROUNDS),
}))


const get_competitions = n => collection(n)(i => ({
  "id" : i,
  "Name" : randomCompName(),
  "leadIdStartNum" : 0, // TODO
  "LocationName" : randomData(1).city,
  "EarlyPrice" : randomInt(0, 100),
  "RegPrice" : randomInt(0, 100),
  "LatePrice" : randomInt(0, 100),
  "StartDate" : randomDate({year: 2018}).toDateString(),
  "EndDate" : randomDate({year: 2018}).toDateString(),
  "RegStartDate" : randomDate({year: 2017}).toDateString(),
  "RegEndDate" : randomDate({year: 2017}).toDateString(),
  "EarlyRegDeadline" : (randomDate({year: 2017})).toDateString(),
  "RegularRegDeadline" : randomDate({year: 2017}).toDateString(),
  "CompAdmin" : randomData().emailAddress,

}))

const get_events = n => collection(n)(i => ({
  "id" : i,
  "competition_id" : randomId(COMPETITIONS),
  "title" : randomEventTitle(),
  "style" : randomStyle(),
  "level" : randomLevel(),
}))

const get_rounds = n => collection(n)(i => ({
  "id" : i,
  "event" : randomId(EVENTS),
  "name" : randomRound(),
  "order_number" : i,
  "size" : randomInt(50, 100),
  "next_round" : randomInt(0, 20),
  "competitors": [0,1,2,3,4,5,6,7,8,9],
  "judge_1" : randomId(JUDGES),
  "judge_2" : randomId(JUDGES),
  "judge_3" : randomId(JUDGES),
  "judge_4" : randomId(JUDGES),
  "judge_5" : randomId(JUDGES),
  "judge_6" : randomBool() ? randomId(JUDGES) : null,
}))

const get_partnerships = n => collection(n)(i => ({
  "lead_number" : randomInt(0, 100),
  "lead_competitor_id" : randomId(COMPETITORS),
  "follow_competitor_id" : randomId(COMPETITORS),
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
  "competition_id" : randomId(COMPETITIONS),
  "Timestamp" : randomDate({year: 2017}).toDateString(),
  "competitor_id" : randomId(COMPETITORS),
  "Amount" : randomInt(50, 100)/2,
  "Online/offline" : randomBool(),
  "Payer name" : randomData(1).firstName + ' ' + randomData(1).lastName,
}))

const get_schedule = n => collection(n) (i => ({
  "id" : i, 
  "order_number" : i,
  "title" : randomEventTitle(),
  "style" : randomStyle(),
  "level" : randomLevel(),
  "round": randomRound(),
}))

const get_competitor_events = n => collection(n) (i => ({
  "title" : randomEventTitle(),
  "style" : randomStyle(),
  "level" : randomLevel(),
  "round" : randomRound(),
  "partner" : randomData(1).firstName.concat(" ").concat(randomData().lastName),
  "leading" : randomBool(),
}))

const get_competitor_competition_information = n => collection(n) (i => ({
  "id" : i,
  "name" : randomData(1).firstName.concat(" ").concat(randomData().lastName),
  "email" :  randomData().emailAddress,
  "organization_name" : randomData(1).company,
  "lead_number" : randomBool() ? randomInt(0, 100) : "N/A",
  "amount_owed" : randomInt(0, 100),
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
const competitor_events = get_competitor_events(COMPETITOR_EVENTS)
const competitor_competition_information = get_competitor_competition_information(COMPETITORS)

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
  competitor_events,
  competitor_competition_information,
}

  