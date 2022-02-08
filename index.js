// Planbook Scraper 
// Made by Wolfie
// wolf1e.ga

const fetch = require('axios');
const fs = require('fs');
const feed = require('feed').Feed;
const config = require('./config.json');

// logo
console.log(`██████  ██████      ████████  ██████      ██████  ███████ ███████            ██ ███████ 
██   ██ ██   ██        ██    ██    ██     ██   ██ ██      ██                 ██ ██      
██████  ██████         ██    ██    ██     ██████  ███████ ███████            ██ ███████ 
██      ██   ██        ██    ██    ██     ██   ██      ██      ██       ██   ██      ██ 
██      ██████         ██     ██████      ██   ██ ███████ ███████     ██ █████  ███████ 
                                                                                        `);
console.log(`Made by Wolfie
wolf1e.ga
Version: ${require('./package.json').version}
---------------------------------------------------`);
                                                                                                                       
// checks configuration for missing fields
function checkConfig() {
	if(config.planbookURL[0].length === 0 || config.planbookURL[1].length === 0 || config.planbookURL[2].length === 0) {
		console.error("[ERR] No information was provided for the planbookURL field in the configuration!");
		return process.exit();
	} else if(config.websiteURL.length === 0) {
		console.error("[ERR] No information was provided for the websiteURL field in the configuration!");
		return process.exit();
	} else if(config.outputFile.length === 0) {
		console.error("[ERR] No information was provided for the outputFile field in the configuration!");
		return process.exit();
	} else if(config.type.length === 0) {
		console.error("[ERR] No information was provided for the type field in the configuration!");
		return process.exit();
	} else if(config.type !== "atom" && config.type !== "rss2") {
		console.error("[ERR] An invalid option was provided in the type field in the configuration! Options are \"rss2\" and \"atom\"");
		return process.exit();
	} else if(config.feed.title.length === 0) {
		console.error("[ERR] No information was provided for the feed.title field in the configuration!");
		return process.exit();
	} else if(config.feed.instructor.name.length === 0) {
		console.error("[ERR] No information was provided for the feed.instructor.name field in the configuration!");
		return process.exit();
	} else if(config.feed.instructor.email.length === 0) {
		console.error("[ERR] No information was provided for the feed.instructor.email field in the configuration!");
		return process.exit();
	} else if(config.feed.instructor.link.length === 0) {
		console.error("[ERR] No information was provided for the feed.instructor.link field in the configuration!");
		return process.exit();
	} else {
		return console.log("[INFO] Configuration is valid! Proceeding.");
	}
}

async function createFeed() {
	console.log("[INFO] Getting information from Planbook...");
	let month = new Date; month = month.getMonth() + 1;
	let day = new Date; day = day.getDate();
	let year = new Date; year = year.getFullYear();
	// request the data from the api
	const results = await fetch({
		methodType: 'get',
		responseType: 'json',
		url: config.planbookURL[0] + month + "%2F" + day + "%2F" + year + config.planbookURL[1],
		headers: {
			"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:96.0.3) Gecko/20100101 Firefox/-96.0.3",
			"Accept": "application/json, text/javascript, */*; q=0.01",
			"Accept-Language": "en-US,en;q=0.5",
			"Authorization": "Bearer null",
			"X-PB-MOMENT-TZ": "America/Chicago",
			"X-Requested-With": "XMLHttpRequest",
			"DNT": "1",
			"Connection": "keep-alive",
			"Referer": config.planbookURL[2],
			"TE": "Trailers"
		}
	});
	let days = {
		monday: {},
		tuesday: {},
		wednesday: {},
		thursday: {},
		friday: {}
	};
	if(!results || results.length === 0) {
		console.error("[ERR] There are no results! Something went wrong!");
		return process.exit();
	}
	for(let objects of results.data.days) {
		// this filters our results into a simple object
		switch(objects.dayOfWeek) {
			case 'Monday':
				days.monday = objects;
			break;
			case 'Tuesday':
				days.tuesday = objects;
			break;
			case 'Wednesday':
				days.wednesday = objects;
			case 'Thursday': 
				days.thursday = objects;
			case 'Friday':
				days.friday = objects;
			break;
		}
	}
	// WIP: One day, I will add a lessonText detector to see how many lessons there are. 
	// Until then, add lessons yourself using this line below in the content variable
	// + days[day].objects[<number>].lessonText
	function checkEvent(day) {
		let capitalDay = day.charAt(0).toUpperCase() + day.slice(1);
		if(days[day].objects[0] === null || days[day].objects[0] === 0 || !days[day].objects[0]) {
			return "<h1><strong>" + capitalDay + "</strong></h1><br>No lesson for this day.<br>No events or lesson detected.";
		} else if(days[day].objects[0].eventTitle) {
			return "<h1><strong>" + capitalDay + "</strong></h1><br>No lesson for this day.<br>" + days[day].objects[0].eventTitle;
		} else {
			let notes = (config.notes[day].length != 0) ? config.notes[day] : "None.";
			let content = "<h1><strong>" + capitalDay + " - " + days[day].date + "</strong></h1><br><p><strong>Notes: </strong>" + notes  + "<br>" + days[day].objects[0].lessonText;
			return content;
		}
	};


	const daysFormatted = [
		{
			title: "Monday",
			date: days.monday.date,
			content: checkEvent("monday")

		},
	        {
			title: "Tuesday",
			date: days.tuesday.date,
			content: checkEvent("tuesday")
		},
		{
			title: "Wednesday",
			date: days.wednesday.date,
			content: checkEvent("wednesday")
},
		{
			title: "Thursday",
			date: days.thursday.date,
			content: checkEvent("thursday")
		},
		{
			title: "Friday",
			date: days.friday.date,
			content: checkEvent("friday")
		}
	];
	console.log("[INFO] Planbook data received! Creating RSS feed...");
	const todayDate = new Date;
	const todayDateISO = todayDate.toISOString();
	// feel free to change the author field as long as you still provide credit.
	const rssFeed = new feed({
		title: config.feed.title,
		description: "A planbook scrapper for Node.JS. Made by Wolfie#7968 (wolf1e.ga).",
		id: config.websiteURL,
		link: config.websiteURL,
		language: "en",
		feedLinks: {
			atom: config.websiteURL + config.outputFile
		},
		author: {
			name: "Wolfie#7968",
			email: "wolfiediscord@gmail.com",
			link: "https://wolf1e.ga"
		},
		updated: todayDateISO
	});

	const postContent = []; 
	daysFormatted.forEach(post => {
		postContent.push(post.content + "<br><br>");
		});
	rssFeed.addItem({
		title: "Planbook for Week of: " + todayDateISO,
		id: config.websiteURL,
		link: config.websiteURL,
		description: postContent.join("\n\n"),
		content: postContent.join("\n\n"),
		author: [
				{
					name: config.feed.instructor.name,
					email: config.feed.instructor.email,
					link: config.feed.instructor.link
				}
			],
		date: todayDateISO
	});

	rssFeed.addCategory("Planbook");
	fs.unlink(config.outputFile, (err) => {
		if(err) {
			return console.error("[ERR]", err);
		} else {
			console.log("[INFO] Old RSS Feed file successfully deleted!");
		}
	})
	let filetype;
	if (config.type === "atom") filetype = rssFeed.atom1();
	if (config.type === "rss2") filetype = rssFeed.rss2();
	fs.writeFile(config.outputFile, filetype, (err) => {
		if(err) {
			return console.error("[ERR]", err);
		} else {
			return console.log("[INFO] Feed file successfully created! Filename: " + config.outputFile);
		}
	})
	}

checkConfig();
createFeed();
