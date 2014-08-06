var prettyDate = {
    beautify: function(date) {
        console.log(date)
        var time = prettyDate.formatTimeToAMPM(date.getHours(), date.getMinutes());
        var weekDay = prettyDate.getDayName(date.getDay());
        var day = prettyDate.getOrdinalDay(date.getDate());
        var month = prettyDate.getMonthName(date.getMonth());
        return time + ' on ' + weekDay + ' the ' + day + ' of ' + month;
    },

    getDayName: function(day) {
        return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][day];
    },

    getOrdinalDay: function(num) {
        var ord = {
            1: 'st',
            2: 'nd',
            3: 'rd',
            21: 'st',
            22: 'nd',
            23: 'rd',
            31: 'st'
        };
        if (ord[num] != undefined) {
            return num + ord[num];
        } else {
            return num + 'th';
        }
    },

    formatTimeToAMPM: function(hrs, mins) {
        var ampm = hrs >= 12 ? 'PM' : 'AM';
        hrs = hrs % 12;
        //the hour '0' should be '12'
        hrs = hrs ? hrs : 12;
        return hrs + ':' + mins + ' ' + ampm;
    },

    getMonthName: function(month) {
        return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][month];
    },
}

module.exports = prettyDate;