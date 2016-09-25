/**************
* This is the main page for the bot. Contains all the main actions it can make. 
***************/
//Link to add JimBot:https://discordapp.com/oauth2/authorize?&client_id=227100406654828544&scope=bot&permissions=0

//Initializations
var Discord = require('discord.io');
var key = require('./config/keys.js');
var bot = new Discord.Client({
    autorun: true,
    token: key.discordKey
});

var Forecast = require('forecast.io');

var options = {
  APIKey: key.forecastKey,
  timeout: 1000
},
forecast = new Forecast(options);

bot.on('ready', function(event) {
    console.log('Logged in as %s - %s\n', bot.username, bot.id);
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
    if (message.startsWith(prefix + "alive?")) {
        
        awake(user, userID, channelID, message, event);
    }

    //Drunk command
    if (message.startsWith(prefix + "drunk?")){

    	drunk(user, userID, channelID, message, event);


    }

    //Weather command
    if (message.startsWith(prefix + "weather")){

    	weather(user, userID, channelID, message, event);


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
		+ "*~awake?*  <-  Fun command to test if I'm responding \n"
		+ "*~drunk?* [*#drinks*] [*time(hours)*]  <-  Some nonesense to calculate if you should keep drinking, please take it with a grain of salt\n" 
		+ "*~weather* [*address/ zip code*]  <-  Useful command that lists off weather information. Its pretty straightforward here." 
	});

}


/* 	
@Command: alive?
@Desc: Nonesensical command that if sent this text the bot will state its awake
*/
function awake (user, userID, channelID, message, event){

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
				message: '**Currently:** \n' + weatherDataMinutely +' ( Temp: ' + weatherDataCurTemp  + ' °F,  Humidity: ' + weatherDataCurHumidity + '% )'
						+ '\n\n**For the rest of the day:** \n' + weatherDataHourly 
						+ '\n\n**For the rest of the week:** \n' + weatherDataDaily
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
* Snippet to check if its an integer
*/
function isInt(n){
    return Number(n) === n && n % 1 === 0;
}