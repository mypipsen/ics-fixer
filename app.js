const express = require('express');
const http = require('http');
const fs = require('fs');
const readline = require('readline');
const env = require('./env');

const app = express();
const port = env.PORT;
const calendar = env.CALENDAR_URL;
const filename = env.FILENAME;

app.get(`/${env.ENDPOINT}`, (req, res) => {

    const file = fs.createWriteStream(filename);

    http.get(calendar, (response) => {
        response.pipe(file);

        file.on('finish', () => {

            file.close(() => {

                const reader = readline.createInterface({
                    input: fs.createReadStream(filename)
                });

                let output = '';
                let event = null;

                reader.on('line', (line) => {

                    switch (true) {
                        case line === 'BEGIN:VEVENT':
                            event = line + '\n';
                            break;

                        case line === 'END:VEVENT':
                            event += line + '\n';

                            if (event.indexOf('STATUS:Cancelled') === -1) {
                                output += event;
                            }

                            event = null;
                            break;

                        case event !== null:
                            event += line + '\n';
                            break;

                        default:
                            output += line + '\n';
                            break;
                    }

                });

                reader.on('close', () => {
                    res.send(output);
                });

            });

        });

    }).on('error', (err) => {
        console.log(err);
        res.status(500).send('An error occurred');
    });

});

app.get('/*', (req, res) => {
    res.status(404).send('404 - Calendar not found')
});

app.listen(port, () => console.log(`ics fixer listening on port ${port}`));