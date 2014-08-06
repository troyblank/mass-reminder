#Mass Reminder

This app uses a google calender and sends out a reminder emails to a group of people if that date is within a range. Currently this range is only as granular as one day, so only set it to run once a day.

##How to setup server to server authorization.
* Using [Google Developer Console](https://console.developers.google.com/ 'Google Developer Console') download a P12 key.
* From here convert it to a pem key by running:

        openssl pkcs12 -in in.p12 -out google_api_key.pem -nocerts -nodes
       
* Place the pem file in the app/authorization folder.
* Now you need to make a new config from the example file and fill it out the api section

        cp config.example.json config.json

##How to setup list configuration

In the config file there is dummy data for lists be sure to replace it with a calenderId and an actual list emails to send reminders to. You can add as many lists as you want to this array.
    
The calendarId can be found in the settings of your google calender. Please be sure to also share the calender with the email found in your auth.config.json file.
       
## License

(The MIT License)

Copyright (c) 2014 [Troy Blank](mailto:troy@troyblank.com, "Troy Blank")

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.