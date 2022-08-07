var csvDateParse = d3.timeParse("%m/%d/%Y");
var urlDateParse = d3.timeParse("%m-%d-%Y");
var dateFormat = d3.timeFormat("%m-%d-%Y");

var csvUrlForSeason = function(id) {
    return "https://j-ometry.com/csvs/" + id + ".csv";
};

var csvUrlForTocPeriod = function(id) {
    return "https://j-ometry.com/csvs/" + id + "_full.csv";
};

var getNameForTocPeriod = function(id) {
    switch(id) {
        case 'TOC2022R':    return '2022 TOC Regular Play (S37-S38)';
        case 'TOC2021R':    return '2021 TOC Regular Play (S35-S37)';
        case 'TOC2019R':    return '2019 TOC Regular Play (S34-35)';
        case 'TOC2022P':    return '2022 Professors Tournament (S38)';
        case 'TOC2021T':    return '2020 Teachers Tournament (S36)';
        case 'TOC2019T2':   return '2019 Teachers Tournament (S35)';
        case 'TOC2019T1':   return '2018 Teachers Tournament (S34)';
        case 'NCC2022':     return '2022 National College Championship';
        case 'TOC2021C':    return '2020 College Championship (S36)';
        case 'TOC2019C':    return '2018 College Championship (S34)';
    }
}

var getContestantNameFromData = function(data, contestantId) {
    if (d3.map(data, cd => cd['Jometry Contestant Id']).includes(contestantId)) {
        return d3.filter(data, cd => cd['Jometry Contestant Id'] === contestantId)[0]['Contestant'];
    } else {
        return undefined;
    }
};

var controlTable = function(tableId, controlClasses) {
    var currentClassIndex = 0;
    d3.selectAll(tableId + ' th.controlled').style('display','none');
    d3.selectAll(tableId + ' td.controlled').style('display','none');
    d3.selectAll(tableId + ' th.' + controlClasses[currentClassIndex]).style('display','table-cell');
    d3.selectAll(tableId + ' td.' + controlClasses[currentClassIndex]).style('display','table-cell');

    var updateTable = function(step) {
        currentClassIndex += step;
        if (currentClassIndex < 0) {
            currentClassIndex = controlClasses.length - 1;
        } else if (currentClassIndex >= controlClasses.length) {
            currentClassIndex = 0;
        }
        d3.selectAll(tableId + ' th.controlled').style('display','none');
        d3.selectAll(tableId + ' td.controlled').style('display','none');
        d3.selectAll(tableId + ' th.' + controlClasses[currentClassIndex]).style('display','table-cell');
        d3.selectAll(tableId + ' td.' + controlClasses[currentClassIndex]).style('display','table-cell');            
    };

    d3.selectAll(tableId + ' .table-control-left').on('click', function() {
        updateTable(-1);
    });
    d3.selectAll(tableId + ' .table-control-right').on('click', function() {
        updateTable(1);
    });
};