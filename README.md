Create a simple web application that monitors load average on your machine:

Collect the machine load (using “uptime” for example)
Display in the application the key statistics as well as a history of load over the past 10 minutes in 10s intervals. We’d suggest a graphical representation using D3.js, but feel free to use another tool or representation if you prefer. Make it easy for the end-user to picture the situation!
Make sure a user can keep the web page open and monitor the load on their machine.
Whenever the load for the past 2 minutes exceeds 1 on average, add a message saying that “High load generated an alert - load = {value}, triggered at {time}”
Whenever the load average drops again below 1 on average for the past 2 minutes, Add another message explaining when the alert recovered.
Make sure all messages showing when alerting thresholds are crossed remain visible on the page for historical reasons.
Write a test for the alerting logic
Explain how you’d improve on this application design

## uptime

```
23:55  up 11:28, 9 users, load averages: 4.58 4.05 4.50
Sybil:~ sarahmeyer$ uptime
23:58  up 11:31, 9 users, load averages: 2.00 3.04 3.99
Sybil:~ sarahmeyer$ uptime
23:59  up 11:32, 9 users, load averages: 2.84 3.07 3.93
```

## Plan
* Node script that runs `uptime` every 10s with `setInterval` and parses and records the results.
* Preact component using D3 libraries to display load averages
* Web application which displays 1, 5, 15 min load averages using the aforementioned Preact component, and also the uptime and user numbers
* Keep message history in localStorage
* PouchDB database

## Setup

This application requires Apache CouchDB, which can be downloaded [here](https://couchdb.apache.org/#download). Please follow [all directions](https://pouchdb.com/guides/setup-couchdb.html) for installing PouchDB, built on CouchDB, including CORS installation.

This application also requires `node` and `npm`.

All other application requirements can be installed by running.
```
npm install
```
After all requirements have been installed, the script that monitors and records system performance can be run here:
```
npm run load-runner
```
WARNING: without running this script, the application will not have any data to use!

Once the `load-runner` script is running, the application can be locally built and run with the command:
```
npm run start
```
At this point, the application can be viewed at `localhost:3000`.


