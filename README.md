# Planbook Scraper
This project takes a link from planbook.com, and it returns an RSS Feed using the `feed` Node.JS module.

# Node.JS Version
This script was made with Node.JS `v12.22.5`. Compatibility is not guaranteed on older versions of Node.JS!

# Configuration
This file requires you to edit the `index.js` file to edit values in the configuration. This may change in the future.

`planbookURL` - This takes three values. The first string is the API URL. You can find this by doing the following.
1. Open your Planbook.com link.
2. Go into Inspect Element
3. Go into the Network section 
4. Click XHR
5. Refresh the page
6. Look for the URL that contains "launchStudent".

You need to split the URL. Cut everything in between `monday=` and `&_=`. Take the first half and put it into the first string in the planbookURL array. Take the second part and put it into the second string in the planbookURL array. The third string needs to have the regular URL for visiting the Planbook.com site, like if you were to access it on another PC.

`websiteURL` - This value contains the URL of the website you plan on hosting the RSS Feed on. Make sure you include the `https://` or `http://` part and also include a `/` at the end of the URL.

`outputFile` - This value contains the file name and extension for the RSS feed. Make sure you have created a blank file with the exact same name and file extension, as this script will delete it upon running.

`type` - This value determines the feed type. This can either be `atom` or `rss2`. 

`feed.title` - This value contains the Feed Title. This can be anything.

`feed.instructor.name` - This value contains the Instructor's name. This can also be anything.

`feed.instructor.email` - This value contains the Instructor's email. Make sure this is a public email address, as this will be displayed on the feed.

`feed.instructor.link` - This value contains a link to the Instructor's website. Make sure this is a public website, as this will be displayed on the feed.

# Running This Script
Running this script is easy. Make sure you have installed the node modules using the `npm install` command. Make sure you have also installed the `feed` module from THIS repository. The `feed` module is modified for this script to work.
```
node index.js
```
