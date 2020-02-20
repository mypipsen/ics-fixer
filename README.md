# ics-fixer

Some iCal files contain incorrect syntax that forces Google Calendar to throw the following error: `Unable to process your iCal/CSV file`.

This app fixes those problems, by removing incorrect syntax from an .ics file.

## How does it work?

* A request is made to this application's endpoint. For example: `http://localhost:3000/secrets`
* The app downloads the .ics file from the provided URL defined in `env.js`
* The app iterates each line of the .ics file and removes lines that cause Google Calendar import to fail
* The corrected .ics file is sent as a response to the initial request

## Installation

* Install node_modules: `npm i`
* Add environment variables: `cp env_example.js env.js`
* Start the application: `npm start`
* Go to your Google Calendar and import the calendar from the application's URL
