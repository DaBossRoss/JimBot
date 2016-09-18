//Link to add JimBot:https://discordapp.com/oauth2/authorize?&client_id=227100406654828544&scope=bot&permissions=0
var Discord = require('discord.io');
var bot = new Discord.Client({
    autorun: true,
    token: "MjI3MTAwNDA2NjU0ODI4NTQ0.CsBPSQ.dA_4h6UAhd07gyviljzbHEHC2Sc"
});

bot.on('ready', function(event) {
    console.log('Logged in as %s - %s\n', bot.username, bot.id);
});

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
		+ "~help <- It's help, your already doing it!\n"
		+ "~awake <- Fun command to test if I'm responding \n"
		+ "~drunk <- Some nonesense to calculate if you should keep drinking, please take it with a grain of salt" 
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
		message: "Woah, please send integer values in the format: '~drunk? [#drinks] [time(hours)]'"
	});
}

}


/*
* Snippet to check if its an integer
*/
function isInt(n){
    return Number(n) === n && n % 1 === 0;
}