var csvDateParse = d3.timeParse("%m/%d/%Y");
var urlDateParse = d3.timeParse("%m-%d-%Y");
var dateFormat = d3.timeFormat("%m-%d-%Y");

var csvUrlForSeason = function(id) {
    return "https://j-ometry.com/csvs/" + id + ".csv";
};

var csvUrlForTocPeriod = function(id) {
    return "https://j-ometry.com/csvs/" + id + "_full.csv";
};

var getContestantNameFromData = function(data, contestantId) {
    if (d3.map(data, cd => cd['Jometry Contestant Id']).includes(contestantId)) {
        return d3.filter(data, cd => cd['Jometry Contestant Id'] === contestantId)[0]['Contestant'];
    } else {
        return undefined;
    }
};

var controlTable = function(tableId, controlClasses) {

};