// Planbook Scraper 
// Made by Wolfie
// wolf1e.ga

const rp = require('request-promise-native');
const fs = require('fs');
const feed = require('feed').Feed;
// you will need to set this before running
// planbookURL - Get this by going to your Planbook.com page, Inspect Element > Network, click XHR, then Reload the page. Find the one that has launchStudent in the URL.
// Then you need to split the URL in half after "monday=". Then cutout the rest until "&_=". Put the rest of the URL starting with "&_=" in the second string in the array
// For the third string in the array, put the regular Planbook.com link that you would use to access Planbook
// websiteURL - This is the url of the website you are going to host the rss feed on. It NEEDS to contain the https:// or http:// part and a / at the end.
// outputFile - This is the name and file extension of the RSS feed. Make sure this file exists as a blank file with the same name and extension, so the script can delete it!
// type - This can either be "rss2" or "atom". Recommended option is atom.
// feed - This is the options for the RSS Feed
// title - This is the title of the RSS Feed
// instructor - This is the instructor's contact information
// name - The name of the instructor
// email - The email of the instructor
// link - The link to the instructor's website/school page/whatever you want
const config = {
	planbookURL: ["", "", ""],
	websiteURL: "",
	outputFile: "",
	type: "",
	feed: {
		title: "",
		instructor: {
			name: "",
			email: "",
			link: ""
		},

	}
};

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
	const results = await rp({
		url: config.planbookURL[0] + month + "%2F" + day + "%2F" + year + config.planbookURL[1],
		headers: {
			"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/-78.0",
			"Accept": "application/json, text/javascript, */*; q=0.01",
			"Accept-Language": "en-US,en;q=0.5",
			"Authorization": "Bearer null",
			"X-PB-MOMENT-TZ": "America/Chicago",
			"X-Requested-With": "XMLHttpRequest",
			"DNT": "1",
			"Connection": "keep-alive",
			"Referer": config.planbookURL[2],
			"TE": "Trailers"
		},
		json: true
	});
	console.log(results);
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
	for(let objects of results.days) {
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
	// I want to eventually have it work with multiple things on the same day in the objects variable, but I am too lazy rn so I am only doing one
	// Add it yourself using this line below in the content field
	// + days.<day>.objects[<number>].lessonText
	const daysFormatted = [
		{
			title: "Monday",
			date: days.monday.date,
			content: (!days.monday.objects[0].eventTitle) ? days.monday.objects[0].lessonText + "<br><br>" : "No Lesson for this day." + "<br>" + days.monday.objects[0].eventTitle

		},
	        {
			title: "Tuesday",
			date: days.tuesday.date,
			content: (!days.tuesday.objects[0].eventTitle) ? days.tuesday.objects[0].lessonText + "<br><br>" : "No Lesson for this day." + "<br>" + days.tuesday.objects[0].eventTitle
		},
		{
			title: "Wednesday",
			date: days.wednesday.date,
			content: (!days.wednesday.objects[0].eventTitle) ? days.wednesday.objects[0].lessonText + "<br><br>" : "No Lesson for this day.<br>" + days.wednesday.objects[0].eventTitle
},
		{
			title: "Thursday",
			date: days.thursday.date,
			content: (!days.thursday.objects[0].eventTitle) ? days.thursday.objects[0].lessonText + "<br><br>" : "No Lesson for this day.<br>" + days.thursday.objects[0].eventTitle 
		},
		{
			title: "Friday",
			date: days.friday.date,
			content: (!days.friday.objects[0].eventTitle) ? days.friday.objects[0].lessonText + "<br><br>" : "No Lesson for this day.<br>" + days.friday.objects[0].eventTitle 
		}
	];
	console.log("[INFO] Planbook data received! Creating RSS feed...");
	const todayDate = new Date;
	const todayDateISO = todayDate.toISOString();
	// feel free to change the author field as long as you still provide credit.
	const rssFeed = new feed({
		title: config.feed.title,
		description: "A planbook scrapper for node.js. Made by Wolfie#7968 (wolf1e.ga).",
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
		postContent.push("<h1><strong>" + post.date + "</strong></h1><br><br>" + post.content + "<br><br>");
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
