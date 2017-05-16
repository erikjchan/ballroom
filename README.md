[Google Drive Files](https://drive.google.com/drive/u/1/folders/0B_QgKIp964MaRkFIa2RBTE10OEU)

To set up database, run `psql -U postgres -d postgres -1 -f <path/to/db.sql>`

# Background
The client describes the goals of the project as follows:

"There are dozens of collegiate level ballroom dance competitions that happen throughout the year. The aim of this project is to develop a system to manage these competitions. At present, the standard way (if not only way) to organize and manage the competition is through a service called o2cm. The interface is a nightmare for those hosting as well as those signing up.

"Cornell hosts a ballroom competition in the Fall. If the project is polished enough by the beginning of the Fall semester, we would be super excited to use it. The people who work with us that help host different competitions will probably see this implementation and bring it to the other competitions they host year-round."

# Project Summary
Once a competition starts, there are several rounds of dancing, where about 20 couples dance on the floor. Judges walking around have to write down the numbers of the couples that they want to call back to the next round. At present, this is done with paper and pen, and someone has to take the time to enter all the numbers by hand. There are only a few minutes and lots of numbers to enter in before the next round starts. The system tallies them up and figures out who should be moving on to the next round. These results then need to be displayed on a projector so dancers can see if they made it or not.

The system needs to serve three categories of users and support them with a good back end to keep track of everything.

* Competitors
	* Easy interface for competitors to register
	* Lead/follow, different partners
	* Way to see schedule of event
	* See callbacks
* Organizer
	* Easy interface to look at competitors by school, event, how much they owe
	* Definable limits on what events a competitor can register for
	* Time based changing of prices for registration/deadlines
	* Define events (e.g., Newcomer Tango vs PreChamp Tango)
* Judges
	* App for their phone (or accessible web site) to easily tap their callbacks
	* Display how many couples need to be called back from how many rounds

# APIs
API for viewing and updating database.

## POST
* Create a Competitor based on Auth0
	* URL		:	/api/create_user
	* Method	:	POST
	* Request	:
				{body:
				{
				profile: string, 
				firstname: string, 
				lastname: string, 
				email: string, 
				mailingaddress: string, 
				affiliationname： string
				}
				}

	* Response	:	{}

* Update Competitor Information
	* URL		:	/api/update_competitor
	* Method	:	POST
	* Request	:
				{body:
				{
				id: int, 
				firstname: string, 
				lastname: string,
				mailingaddress: string, 
				affiliationid： int,
				hasregistered: bool
				}
				}

	* Response	:	{}

* Create a Competition
	* URL		:	/api/create_competition
	* Method	:	POST
	* Request	: 
				{body:
				{
				name: string, 
				leadidstartnum: int,
				locationname: string, 
				earlyprice: float, 
				regularprice: float, 
				lateprice: float, 
				startdate： date,
				enddate： date,
				regstartdate： date,
				earlyregdeadline: date,
				regularregdeadline: date,
				lateregdeadline: date,
				description: string
				}
				}
	* Response: {id: int // id of newly created competition}

* Create an Official
	* URL		:	/api/create_official
	* Method	:	POST
	* Request	: 
				{body:
				{
				token: string, 
				firstname: string,
				lastname: string, 
				roleid: int, 
				competitionid: int
				}
				}
	* Response	:	{}
	
* Delete an Official by id
	* URL		:	/api/delete_official
	* Method	:	POST
	* Request	: 
				{body:
				{
				id: int
				}
				}
	* Response	:	{}
	
* Clear the Amount Owed by Organization
	* URL		:	/api/clear_organization_owed
	* Method	:	POST
	* Request	: 
				{body:
				{
				competitionid: int, 
				affiliationid: int
				}
				}
	* Response	:	{}
	* Description	:	This sets all the amount owed for the given competition by competitors who have affiliated with the given organization and indicated to pay with organization to zero.

* Create Payment Record
	* URL		:	/api/create_paymentrecord
	* Method	:	POST
	* Request	: 
				{body:
				{
				competitionid: int, 
				competitorid: int,
				amount: float, 
				online: bool, 
				paidwithaffiliation: bool
				}
				}
	* Response	:	{}
	* Description	:	Nothing happens if the payment record is already created for the given competition and competitor pair.

* Get the Amount Owed by an Organization
	* URL		:	/api/create_paymentrecord
	* Method	:	POST
	* Request	: 
				{body:
				{
				cid: int, // competition id 
				aid: int  // organization id
				}
				}
	* Response	:	{coalesce: float}
	* Description	:	This returns the total amount owed for the given competition by competitors who have affiliated with the given organization and indicated to pay with organizatio.
	
* Create Partnership
	* URL		:	/api/create_partnership
	* Method	:	POST
	* Request	: 
				{body:
				{
				leadcompetitorid: int,
				followcompetitorid: int,
				eventid: int,
				competitionid: int
				}
				}
	* Response	:	{}

* Delete Partnership
	* URL		:	/api/delete_partnership
	* Method	:	POST
	* Request	: 
				{body:
				{
				leadcompetitorid: int,
				followcompetitorid: int,
				eventid: int
				}
				}
	* Response	:	{}
	
app.post('/api/competition/generateRounds', (req, res) => {
    query.create_rounds_for_events_for_competition(req.body.cid).then(value => {
        log_debug(2)(value)
        res.end(value);
    });
});

app.post('/api/competition/updateEvents', (req, res) => {
    query.update_events_for_competition(req.body).then(value => {
        log_debug(2)(value)
        res.end(value);
    });
});

app.post('/api/competition/updateLevelsStyles', (req, res) => {
    query.update_levels_and_styles_for_competition(req.body).then(value => {
        log_debug(2)(value)
        res.end(value);
    });
});

app.post('/api/competition/updateRounds', (req, res) => {
    query.update_rounds_for_competition(req.body).then(value => {
        log_debug(2)(value)
        res.end(value);
    });
});

app.post('/api/competition/updateCompetitionInfo', (req, res) => {
    query.update_competition_info(req.body).then(value => {
        console.log(value)
        res.send(value);
    }, err =>{
        console.log(err);
        res.send(err);
    });
});

app.post('/api/competition/updateCompetitionCurrentRoundId', (req, res) => {
    query.update_competition_current_round_id(req.body).then(value => {
        log_debug(2)(value)
        res.end(value);
    });
});
    
app.post('/api/payment_records/update/', (req, res) => {
    const competitionid = parseInt(req.body.competitionid)
    const competitorid = parseInt(req.body.competitorid)
    const amount = parseFloat(req.body.amount)
    const online = req.body.online
    const paidwithaffiliation = req.body.paidwithaffiliation
    query2.update_paymentrecord(competitionid, competitorid, amount, online, paidwithaffiliation).then(function (value) {
        log_debug(2)(value)
        res.send(value);
    });
});

## GET

app.get('/api/competition/:id', (req, res) => {
    query.get_competition_info(req.params.id).then(value => {
        log_debug(2)(value)
        res.send(value[0]);
    });
})

app.get('/api/competition/:cid/affiliations', (req, res) => {
    query.get_affiliations_for_competition(req.params.cid).then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/affiliations/:id', (req, res) => {
    query2.get_affiliation(req.params.id).then(value => {
        log_debug(2)(value)
        res.send(value[0]);
    });
})

app.get('/api/competition/:cid/competitors', (req, res) => {
    query.get_competitors_for_competition(req.params.cid).then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/competition/:cid/competitors_styles', (req, res) => {
    query.get_num_competitors_per_style_for_competition(req.params.cid).then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/competition/:cid/events', (req, res) => {
    query.get_events_for_competition(req.params.cid).then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/competition/:cid/officials', (req, res) => {
    query.get_officials_for_competition(req.params.cid).then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/competition/:cid/judges', (req, res) => {
    query.get_judges_for_competition(req.params.cid).then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/competition/:cid/levels', (req, res) => {
    query.get_levels_for_competition(req.params.cid).then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/competition/:cid/level/:lid/styles', (req, res) => {
    query2.get_styles_for_competition_level(req.params.cid, req.params.lid).then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/competition/:cid/level/:lid/style/:sid', (req, res) => {
    query2.get_events_for_competition_level_style(req.params.cid, req.params.lid, req.params.sid).then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/competition/:cid/rounds', (req, res) => {
    query.get_rounds_for_competition(req.params.cid).then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/competition/:cid/styles', (req, res) => {
    query.get_styles_for_competition(req.params.cid).then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/competitors/:id', (req, res) => {
    const id = parseInt(req.params.id)
    query2.get_competitor_by_id(req.params.id).then(value => {
        log_debug(2)(value)
        res.send(value[0]);
    });
})

app.get('/api/competitors/', (req, res) => {
    query2.get_all_competitors().then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/competitors/round/:rid', (req, res) => {
    query.get_competitors_for_round(req.params.rid).then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/competitors/:id/:cid/events', (req, res) => {
    const id = parseInt(req.params.id)
    const cid = parseInt(req.params.cid)
    query2.get_confirmed_partnerships_by_competition_competitor(cid, id).then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/competitions', (req, res) => {
    query.get_competitions().then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/competitions/:cid', (req, res) => {
    const cid = parseInt(req.params.cid)
    query.get_your_competitions(cid).then(value => {
        console.log(value)
        res.send(value);
    });
})
app.get('/api/competitions/:cid/unregistered', (req, res) => {
    const cid = parseInt(req.params.cid)
    query.get_other_competitions(cid).then(value => {
        console.log(value)
        res.send(value);
    });
})

app.get('/api/event/:eid/', (req, res) => {
    const eid =  parseInt(req.params.eid)
    const events = data.events.filter(e => e.id === eid)
    res.send(events[0])
})

app.get('/api/event/rounds/:rid', (req, res) => {
    const rid = parseInt(req.params.rid)
    query.get_rounds_in_same_event_as_round(rid).then(value => {
        console.log(value);
        res.send(value);
    });
})

app.get('/api/affiliations', (req, res) => {
    query.get_affiliations().then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/payment_records', (req, res) => {
    query2.get_all_paymentrecords().then(function (value) {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/payment_records/competition/:id', (req, res) => {
    const id = parseInt(req.params.id)
    query2.get_paymentrecords_by_competition(id).then(function (value) {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/payment_records/competitor/:id', (req, res) => {
    const id = parseInt(req.params.id)
    query2.get_paymentrecords_by_competitior(id).then(function (value) {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/payment_records/:competitionid/:competitorid', (req, res) => {
    const competitionid = parseInt(req.params.competitionid)
    const competitorid = parseInt(req.params.competitorid)
    query2.get_paymentrecord_by_competition_competitor(competitionid, competitorid).then(function (value) {
        log_debug(2)(value)
        res.send(value[0]);
    });
})

app.post('/api/callbacks/update', (req, res) => {
   query.update_callbacks_for_round_and_judge(req.body).then(function(value) {
      log_debug(2)(value);
      res.send(value);
   });
});

app.post('/api/callbacks/calculate', (req, res) => {
    query.calculate_callbacks_for_round(req.body).then(function(value) {
        log_debug(2)(value);
        res.send(value);
    });
});

app.get('/api/admins', (req, res) => {
    query.get_all_admins().then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/roles', (req, res) => {
    query.get_roles().then(value => {
      log_debug(2)(value);
      res.send(value);
    });
})

app.get('/api/officials/:id', (req, res) => {
    query.get_official(req.params.id).then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/judges/round/:rid', (req, res) => {
    query.get_judges_submitted_round(req.params.rid).then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})
