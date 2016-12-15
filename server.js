/**************
* This is the main page for the bot. Contains all the main actions it can make. 
***************/
//Link to add JimBot:https://discordapp.com/oauth2/authorize?&client_id=227100406654828544&scope=bot&permissions=0

'use strict';

//Discord Bot API setup
var Discord = require('discord.io');
var key = require('./config/keys.js');
var bot = new Discord.Client({
    autorun: true,
    token: key.discordKey
});

//Lol API Setup
var LolApi = require('leagueapi');
LolApi.init(key.lolKey, 'na');
LolApi.setRateLimit(10, 500);

//ForecastAPI
var Forecast = require('forecast.io');
//Options for forecastAPI
var options = {
  APIKey: key.forecastKey,
  timeout: 1000
},
forecast = new Forecast(options);

bot.on('ready', function(event) {
    console.log('Logged in as %s - %s\n', bot.username, bot.id);
    //Sets the game to be played field to something useful
    bot.setPresence({
	game:{
		name:"Ready to Assist"
	}
});
});

//Actions taken from recieving messages from the server.
bot.on('message', function command(user, userID, channelID, message, event) {

	var prefix = '~'

if(message.startsWith(prefix)){

	
	//Help command
	if (message.startsWith(prefix + "help")){

		help(user, userID, channelID, message, event)
	}

	//Alive command
    if (message.startsWith(prefix + "alive")) {
        
        awake(user, userID, channelID, message, event);
    }

    //Drunk command
    if (message.startsWith(prefix + "drunk")){

    	drunk(user, userID, channelID, message, event);


    }

    //Weather command
    if (message.startsWith(prefix + "weather")){

    	weather(user, userID, channelID, message, event);


    }

    //League champion command
    if (message.startsWith(prefix + "lolRandomChamp")){

    	lolRandomChamp(user, userID, channelID, message, event);


    }

        //League champion command
    if (message.startsWith(prefix + "lolSummoner")){

    	lolSummoner(user, userID, channelID, message, event);


    }
}



});

/* 	
@Command: help
@Desc: The help command
*/
function help (user, userID, channelID, message, event){

	bot.sendMessage({
		to: userID,
		message: "Hello I'm Jim Bot and ~ is the command prefix (that's a tilde not a dash). \n \n Here are some of the commands: \n \n" 
		+ "*~help*  <-  It's help, your already doing it!\n"
		+ "*~alive*  <-  Fun command to test if I'm responding \n"
		+ "*~drunk* [*#drinks*] [*time(hours)*]  <-  Some nonesense to calculate if you should keep drinking, please take it with a grain of salt\n" 
		+ "*~weather* [*address/ zip code*]  <-  Useful command that lists off weather information. Its pretty straightforward here.\n"
		+ "*~lolRandomChamp* <- A command that gives you a random champion to play in league of legends" 
	});

}


/* 	
@Command: alive?
@Desc: Nonesensical command that if sent this text the bot will state its awake
*/
function awake (user, userID, channelID, message, event){

//Simulates typing for responses that may take longer
bot.simulateTyping(channelID);

	bot.sendMessage({
		to: channelID,
		message: "Its Alive!... Ahem... I mean I am here."
	});

}

/*
@Command: drunk?
@Desc: Nonesensical command that takes in 2 inputs to calculated how hammered you are.
*/
function drunk (user, userID, channelID, message, event){

//Slices out the actual text needed in the command. Then splits it to perform maths.
message = message.slice(7,message.length);

var values = message.split(" ");

//Simulates typing for responses that may take longer
bot.simulateTyping(channelID);

values[1] = parseInt(values[1], 10);
values[2] = parseInt(values[2], 10)

if (isInt(values[1]) && isInt(values[2])){

	var drinksPerHour = values[1]/values[2]

	if(drinksPerHour >= 2){

	bot.sendMessage({
		to: channelID,
		message: "Your on track to get hammered! Please be careful!"
	});

	}

	else if (drinksPerHour >= 1 && drinksPerHour < 2) {
	
	bot.sendMessage({
		to: channelID,
		message: "Decent rate, stick to it (but maybe stop) and you'll be ok tomorrow!"
	});

	}

	else if (drinksPerHour >= 0 && drinksPerHour < 1) {
	
	bot.sendMessage({
		to: channelID,
		message: "Excellent rate, you'll be fine in the morning... probably"
	});


	}

	else {
	bot.sendMessage({
		to: channelID,
		message: "Error does not compute!"
	});

	}
}


else {
		bot.sendMessage({
		to: channelID,
		message: "Woah, please send integer values in the format: '*~drunk? [#drinks] [time(hours)]*'"
	});
}

}

/* 	@Command: weather
	A simple command that uses google's MAPS API to get the coordinates for a location, and then sends that to forcast.io's API.
*/
function weather (user, userID, channelID, message, event){

//Slices out the actual text needed in the command.
var location = message.slice(8,message.length).trim();

//Simulates typing for responses that may take longer
bot.simulateTyping(channelID);

//If location is not null/ empty then 
if(location) {

var googleMapsClient = require('@google/maps').createClient({
  key: key.googleKey
});

// Geocode an address.
googleMapsClient.geocode({
  address: location
}, function(err, response) {
  if (!err) {
    var latitude = response.json.results[0].geometry.location.lat;
    var longitude = response.json.results[0].geometry.location.lng;
    //console.log(JSON.stringify(latitude) + ',' + JSON.stringify(longitude));

    forecast.get(latitude, longitude, function (err, response, data) {
  		if (!err) {
  			var weatherDataCurTemp = data.currently.temperature;
  			var weatherDataCurHumidity = (data.currently.humidity * 100);
  			var weatherDataMinutely = data.minutely.summary;
  			var weatherDataHourly = data.hourly.summary;
  			var weatherDataDaily = data.daily.summary;
  			//console.log(weatherDataHourly);
  			//console.log(weatherDataDaily);

		  	bot.sendMessage({
				to: channelID,
				message: '@'+ user + ' Here is the weather for your area!\n\n**Currently:** \n' + weatherDataMinutely +' ( Temp: ' + weatherDataCurTemp  + ' °F,  Humidity: ' + weatherDataCurHumidity + '% )'
						+ '\n\n**For the rest of the day:** \n' + weatherDataHourly 
						+ '\n\n**For the rest of the week:** \n' + weatherDataDaily + '\n\n *Powered by Dark Sky and Google Maps*'
			});
  		}
  		else{
  			console.log(err)
  		}
	});
  }
});

}
//If the user puts in a blank string we tell them how to use the command properly
else {

  	bot.sendMessage({
		to: channelID,
		message: "Whoa, glad your excited about checking the weather, but please use the format of '*~weather* [*address/ zip code*] '"
	});

}

}


/* 	
@Command: lolChamp
@Desc: Command that queries the Riot games API for champion information on a given champion.
*/
function lolRandomChamp (user, userID, channelID, message, event){

//var random number = Math.floor(Math.random()*(max-min+1)+min);
var popMessage = '**Here is a random champion you can use!:**\n';
var region = 'na';

//Simulates typing for responses that may take longer
bot.simulateTyping(channelID);

options = {champData: 'tags', locale: 'en_US', dataById: 'true'}
LolApi.Static.getChampionList(options, region, function(err, result){

//Will replace this with something more elegant, but I just wanted this feature to partly work first.
var count = Object.keys(result.data).length;
var results_ids = Object.keys(result.data);

var randomNumber = results_ids[Math.floor(Math.random() * count)];
console.log(randomNumber);

	getChamp(result.data[randomNumber].id, region, popMessage, function(returnMessage) {

		bot.sendMessage({
			to: channelID,
			message: returnMessage
		});
	});


});	
}

/*
* A function that gets the champion information and retuns it. Will be run as a callback
*/

function getChamp (champId, region, popMessage, callback) {

		//sets up the data needed to be brought back
		options = {champData: 'blurb,tags', locale: 'en_US'};

		//Allows for champion data to be brought back instead of just an Id
		 LolApi.Static.getChampionById(champId, options, region, function(err,result) {

		 	if(!err){

		 		console.log(result.name + ' ' + result.title);

		 		popMessage += '```Name: ' + result.name + ' ' + result.title + '\nType: ' + result.tags +'```\n';

		 		return callback(popMessage);
		 		
		 	}
		 

		 });

}


/* 	
@Command: lolSummoner
@Desc: Command that queries the Riot games API for information on a given user account.
*/



/*
* Snippet to check if its an integer
*/
function isInt(n){
    return Number(n) === n && n % 1 === 0;
}