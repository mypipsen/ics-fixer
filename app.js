const express = require('express');
const needle = require('needle');
const fs = require('fs');
const readline = require('readline');
const env = require('./env');

const app = express();
const port = env.PORT;
const calendar = env.CALENDAR_URL;
const filename = env.FILENAME;

app.get('/', (req, res) => {

    needle.get(calendar, {output: filename}, (err) => {

        if (err) {
            res.status(500).send('Error occurred');
        }

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

app.listen(port, () => console.log(`ics fixer listening on port ${port}`));