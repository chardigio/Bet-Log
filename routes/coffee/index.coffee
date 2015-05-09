express = require('express')
router = express.Router()
Group = require('../models/Group.js')

#GLOBAL FUNCTIONS
render404 = (res) ->
    res.render '404',
        givenTitle: 'BetLog'
    return

#GET REQUESTS
router.get '/', (req, res) ->
	res.render 'home',
		givenTitle: 'Bet Log'
	return

router.get '/group/', (req, res) ->
	render404(res)

router.get '/event/', (req, res) ->
	render404(res)

router.get '/group/:groupName', (req, res) ->
	groupName = req.params.groupName
	Group.findGroup groupName, (err, result) ->
		if err
			throw err
		if result == 'found'
			Group.findGroupEvents groupName, (err, events, options) ->
				res.render 'groupfound',
					givenTitle: groupName
					events: events
					options: options
				return
		else
			render404(res)
		return
	return

router.get '/event/:eventId', (req, res) ->
	eventId = req.params.eventId
	Group.findEvent eventId, (err, eventy, options, bets) ->
		if eventy == undefined
			render404(res)
			return
		else
			res.render 'event',
				givenTitle: eventy.eventName
				event: eventy
				options: options
				bets: bets
			return
	return

router.get '/creategrouppage', (req, res) ->
	res.render 'creategroup',
		givenTitle: 'Bet Log'
	return

router.get '/creategroupnametaken', (req, res) ->
	res.render 'groupnametaken',
		givenTitle: 'Bet Log'
	return

router.get '/groupnotfound', (req, res) ->
	res.render 'groupnotfound',
		givenTitle: 'Bet Log'
	return

router.get '/joingrouppage', (req, res) ->
	res.render 'joingroup',
		givenTitle: 'Bet Log'
	return

router.get '/about', (req, res) ->
	res.render 'homeinstructions',
		givenTitle: 'Bet Log'
	return

#POST REQUESTS
router.post '/creategrouppage', (req, res) ->
	res.render 'creategroup',
		givenTitle: 'Bet Log'
	return

router.post '/joingrouppage', (req, res) ->
	res.render 'joingroup',
		givenTitle: 'Bet Log'
	return

router.post '/creategroup', (req, res) ->
	groupName = req.body.groupName
	Group.addGroup groupName, (err, group) ->
		if err
			throw err
		if group == 'found'
			res.redirect '/creategroupnametaken'
		else
			res.redirect '/group/' + groupName
		return
	return

router.post '/joingroup', (req, res) ->
	groupName = req.body.groupName
	Group.findGroup groupName, (err, result) ->
		if result == 'notfound'
			res.redirect '/groupnotfound'
		else if result == 'found'
			res.redirect '/group/' + groupName
		return
	return

router.post '/createeventpage', (req, res) ->
	groupName = req.body.groupName
	res.render 'createevent',
		givenTitle: 'Create Event'
		groupName: groupName
	return
router.post '/createevent', (req, res) ->
	options = []
	groupName = req.body.groupName
	eventName = req.body.eventName
	eventCreator = req.body.eventCreator
	eventPassword = req.body.eventPassword
	options[0] = req.body.option1
	options[1] = req.body.option2
	Group.addEvent groupName, eventName, eventPassword, eventCreator, options, (err, eventId) ->
		if err
			throw err
		res.redirect '/event/' + eventId
		return
	return

router.post '/createbetpage', (req, res) ->
	optionId = req.body.optionId
	eventId = req.body.eventId
	groupName = req.body.groupName
	optionName = req.body.optionName
	res.render 'createbet',
		givenTitle: 'Place Bet'
		groupName: groupName
		optionId: optionId
		optionName: optionName
		eventId: eventId
	return

router.post '/createbet', (req, res) ->
	eventId = req.body.eventId
	optionId = req.body.optionId
	optionName = req.body.optionName
	betterName = req.body.betterName
	betterAmount = req.body.betterAmount
	betterAddress = req.body.betterAddress
	carrier = req.body.carrier
	adr = undefined
	amt = undefined
	if betterAmount[0] != '$' and (betterAmount[0] == '0' or betterAmount[0] == '1' or betterAmount[0] == '2' or betterAmount[0] == '3' or betterAmount[0] == '4' or betterAmount[0] == '5' or betterAmount[0] == '6' or betterAmount[0] == '7' or betterAmount[0] == '8' or betterAmount[0] == '9')
		#so ashamed of this^
		amt = '$' + betterAmount
	else
		amt = betterAmount
	if betterAddress.length < 10 || parseInt(betterAddress) == NaN
		adr = null
	else if carrier == 'AT&T'
		adr = betterAddress + '@txt.att.net'
	else if carrier == 'Sprint'
		adr = betterAddress + '@messaging.sprintpcs.com'
	else if carrier == 'T-Mobile'
		adr = betterAddress + '@tmomail.net'
	else if carrier == 'Verizon'
		adr = betterAddress + '@vtext.com'
	else if carrier == 'Virgin Mobile'
		adr = betterAddress + '@vmobl.com'
	else
		adr = null
	Group.addBet eventId, optionId, optionName, betterName, amt, adr, (err) ->
		if err
			throw err
		res.redirect '/event/' + eventId
		return
	return

router.post '/selectwinpage', (req, res) ->
	eventId = req.body.eventId
	eventName = req.body.eventName
	eventCreator = req.body.eventCreator
	groupName = req.body.groupName
	opt1id = req.body.opt1id
	opt2id = req.body.opt2id
	opt1name = req.body.opt1name
	opt2name = req.body.opt2name
	res.render 'selectwinpage',
		givenTitle: eventName
		groupName: groupName
		eventCreator: eventCreator
		eventName: eventName
		eventId: eventId
		opt1id: opt1id
		opt2id: opt2id
		opt1name: opt1name
		opt2name: opt2name
	return

router.post '/eventPass', (req, res) ->
	eventId = req.body.eventId
	eventName = req.body.eventName
	eventCreator = req.body.eventCreator
	groupName = req.body.groupName
	opt1id = req.body.opt1id
	opt2id = req.body.opt2id
	opt1name = req.body.opt1name
	opt2name = req.body.opt2name
	eventPassword = req.body.eventPassword
	Group.checkPassword eventId, eventPassword, (err, bool) ->
		if err
			throw err
		if bool
			res.render 'selectwinner',
				givenTitle: eventName
				groupName: groupName
				eventCreator: eventCreator
				eventName: eventName
				eventId: eventId
				opt1id: opt1id
				opt2id: opt2id
				opt1name: opt1name
				opt2name: opt2name
		else
			res.render 'selectwinpage',
				givenTitle: eventName
				groupName: groupName
				eventCreator: eventCreator
				eventName: eventName
				eventId: eventId
				opt1id: opt1id
				opt2id: opt2id
				opt1name: opt1name
				opt2name: opt2name
		return
	return

router.post '/selectwin', (req, res) ->
	groupName = req.body.groupName
	eventId = req.body.eventId
	winOptId = req.body.winOptId
	loseOptId = req.body.loseOptId
	Group.declareWin eventId, winOptId, loseOptId, (err) ->
		if err
			throw err
		res.redirect '/event/' + eventId
		return
	return

router.post '/createbetmatchpage', (req, res) ->
	eventId = req.body.eventId
	optionId = req.body.optionId
	option2Id = req.body.option2Id
	option2Name = req.body.option2Name
	optionName = req.body.optionName
	betId = req.body.betId
	betterName = req.body.name
	betterAmount = req.body.amount
	betterAddress = req.body.address
	groupName = req.body.groupName
	res.render 'matchbet',
		givenTitle: 'Match Bet'
		groupName: groupName
		eventId: eventId
		matchName: betterName
		optionId: optionId
		optionName: optionName
		betterName: betterName
		betterAmount: betterAmount
		betterAddress: betterAddress
		option2Name: option2Name
		option2Id: option2Id
		matchId: betId
	return

router.post '/createbetmatch', (req, res) -> 
	eventId = req.body.eventId
	optionId = req.body.optionId
	matchId = req.body.matchId
	matchName = req.body.matchName
	optionName = req.body.optionName
	betterName = req.body.betterName
	betterAmount = req.body.betterAmount
	betterAddress = req.body.betterAddress
	carrier = req.body.carrier
	adr = undefined
	if carrier == 'AT&T'
		adr = betterAddress + '@txt.att.net'
	else if carrier == 'Sprint'
		adr = betterAddress + '@messaging.sprintpcs.com'
	else if carrier == 'T-Mobile'
		adr = betterAddress + '@tmomail.net'
	else if carrier == 'Verizon'
		adr = betterAddress + '@vtext.com'
	else if carrier == 'Virgin Mobile'
		adr = betterAddress + '@vmobl.com'
	else
		adr = null
	Group.addBetMatch eventId, optionId, matchId, matchName, optionName, betterName, betterAmount, adr, (err) ->
		if err
			throw err
		res.redirect '/event/' + eventId
		return
	return

module.exports = router