# Planbook to RSS.JS
This project takes a link from planbook.com, and it returns an RSS Feed using the `feed` Node.JS module.

# Node.JS Version
This script was made with Node.JS `v12.22.5`. Compatibility is not guaranteed on older versions of Node.JS!

# Configuration
You need to edit the `config.json` file to edit the configuration. 

`planbookURL` - This takes three values. The first string is the API URL. You can find this by doing the following (using Firefox 91.5.0esr, but it should work on any modern browser).
1. Open your Planbook.com link.
2. Go into Inspect Element
3. Go into the Network section 
4. Click XHR
5. Refresh the page
6. Look for the URL that contains "launchStudent".

You need to split the URL. Cut everything in between `monday=` and `&_=`. Take the first half and put it into the first string in the planbookURL array. Take the second part and put it into the second string in the planbookURL array. The third string needs to have the regular URL for visiting the Planbook.com site, like if you were to access it on another PC.

`websiteURL` - This value contains the URL of the website you plan on hosting the RSS Feed on. Make sure you include the `https://` or `http://` part and also include a `/` at the end of the URL.

`outputFile` - This value contains the file name and extension for the RSS feed. Upon first running, you may see an error stating the file does not exist. Ignore it, as this script will create the file and delete it when updating the feed.

`type` - This value determines the feed type. This can either be `atom` or `rss2`. The `rss2` option is recommended.

`feed.title` - This value contains the Feed Title. Set this to the title of your website or RSS feed. 

`feed.instructor.name` - This value contains the Instructor's name. Set this to your Instructor's name or whoever is managing the RSS feed. Make sure they approve of you using their name, as this will be displayed on the feed.

`feed.instructor.email` - This value contains the Instructor's email. Make sure this is a public email address, as this will be displayed on the feed.

`feed.instructor.link` - This value contains a link to the Instructor's website. Make sure this is a public website, as this will be displayed on the feed.

`notes` - This value allows you to set notes for the specified day. These notes appear under the date in the RSS feed. 

# Running This Script
Running this script is easy. Make sure you have installed the node modules using the `npm install` command. Make sure you have also installed the `feed` module from THIS repository. The `feed` module is modified for this program to work.
```
node index.js
```
