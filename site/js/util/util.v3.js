var csvDateParse = d3.timeParse("%m/%d/%Y");
var urlDateParse = d3.timeParse("%m-%d-%Y");
var dateFormat = d3.timeFormat("%m-%d-%Y");

var csvUrlForSeason = function(id) {
    return "https://j-ometry.com/csvs/" + id + ".csv";
};

var csvUrlForTocPeriod = function(id) {
    return "https://j-ometry.com/csvs/" + id + "_full.csv";
};

var csvUrlForGameClue = function(id) {
    return "https://j-ometry.com/csvs/game_clue/" + id + ".csv";
};

var getNameForTocPeriod = function(id) {
    switch(id) {
        case 'TOC2023R':    return '2023 TOC Regular Play (S39)';
        case 'TOC2022H':    return '2022 Tournament of Champions (S39)';
        case 'TOC2022R':    return '2022 TOC Regular Play (S37-S38)';
        case 'TOC2021H':    return '2021 Tournament of Champions (S37)';
        case 'TOC2021R':    return '2021 TOC Regular Play (S35-S37)';
        case 'TOC2019R':    return '2019 TOC Regular Play (S34-35)';
        case 'TOC2022P':    return '2022 Professors Tournament (S38)';
        case 'TOC2021T':    return '2020 Teachers Tournament (S36)';
        case 'TOC2019H':    return '2019 Tournament of Champions (S36)';
        case 'TOC2019T2':   return '2019 Teachers Tournament (S35)';
        case 'TOC2019T1':   return '2018 Teachers Tournament (S34)';
        case 'NCC2022':     return '2022 National College Championship';
        case 'TOC2021C':    return '2020 College Championship (S36)';
        case 'TOC2019C':    return '2018 College Championship (S34)';
        case 'PCJ2023':     return 'Primetime Celebrity Jeopardy! S1';
    }
}

var getContestantNameFromData = function(data, contestantId) {
    if (d3.map(data, cd => cd['Jometry Contestant Id']).includes(contestantId)) {
        return d3.filter(data, cd => cd['Jometry Contestant Id'] === contestantId)[0]['Contestant'];
    } else {
        return undefined;
    }
};

var csvDataAccessor = function(row) {
    var r = {};
    for (var k in row) {
        if (k === 'Date') {
            r[k] = csvDateParse(row[k]);
        } else if (row[k] === '') {
            r[k] = undefined;
        } else {
            r[k] = +row[k];
            if (isNaN(r[k])) {
                r[k] = row[k];
            }
        }
    }
    if (r['FJCor'] === '') r['FJCor'] = undefined;

    r['Buz%'] = 100.0 * r['Buz'] / r['Att'];
    r['JBuz%'] = 100.0 * r['JBuz'] / r['JAtt'];
    r['DJBuz%'] = 100.0 * r['DJBuz'] / r['DJAtt'];
    r['TJBuz%'] = 100.0 * r['TJBuz'] / r['TJAtt'];
    r['BuzC'] = r['JBuzC'] + r['DJBuzC'];
    r['BuzInc'] = r['JBuzInc'] + r['DJBuzInc'];
    r['BuzC$'] = r['JBuzC$'] + r['DJBuzC$'];
    r['BuzI$'] = r['JBuzI$'] + r['DJBuzI$'];
    r['DDF'] = r['JDDF'] + r['DJDDF'] + ('TJDDF' in r ? r['TJDDF'] : 0);
    r['DD+'] = r['JDD+'] + r['DJDD+'] + ('TJDD+' in r ? r['TJDD+'] : 0);
    r['DD$'] = d3.sum(d3.map(['JDD','DJDD1','DJDD2'], k => r[k] === undefined ? 0 : r[k]));
    r['JDD$'] = d3.sum(d3.map(['JDD'], k => r[k] === undefined ? 0 : r[k]));
    r['DJDD$'] = d3.sum(d3.map(['DJDD1','DJDD2'], k => r[k] === undefined ? 0 : r[k]));
    r['TJDD$'] = d3.sum(d3.map(['TJDD1','TJDD2','TJDD3'], k => r[k] === undefined ? 0 : r[k]));
    r['FJ$'] = r['FJCor'] === undefined ? undefined : (-1 + (2 * r['FJCor'])) * r['FJWager'];
    return r;
};

var formatNumber = function(n, p, dropZeros = true, sign = false) {
    if (n === undefined) {
        return undefined;
    }
    if (isNaN(n)) {
        return undefined;
    }
    var s = n.toFixed(p);
    if (dropZeros) {
        s = s.replace(/[.,]0+$/, "");
    }
    if (sign && n >= 0) {
        s = '+' + s;
    }
    return s;
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