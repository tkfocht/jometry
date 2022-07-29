var renderHighlightContestantBoxPlot = function(
    data,
    highlightContestantIds,
    mappingFunction,
    divId,
    title,
    filterFunction
) {
    var colorList = d3.schemeCategory10.concat(d3.schemeDark2);
    data = d3.filter(data, filterFunction);
    var availableHighlightContestantIds = d3.filter(highlightContestantIds.slice(), cid => d3.map(data, cd => cd['Jometry Contestant Id']).includes(cid));
    var xData = d3.map(availableHighlightContestantIds, cid => getContestantNameFromData(data, cid));
    var yData = d3.map(availableHighlightContestantIds, cid => d3.map(d3.filter(data, cd => cd['Jometry Contestant Id'] === cid), mappingFunction));
    var dateData = d3.map(availableHighlightContestantIds, cid => d3.map(d3.filter(data, cd => cd['Jometry Contestant Id'] === cid), cd1 => dateFormat(cd1['Date'])));
    xData.push('Others');
    yData.push(d3.map(d3.filter(data, cd => !highlightContestantIds.includes(cd['Jometry Contestant Id'])), mappingFunction));
    dateData.push(d3.map(d3.filter(data, cd => !highlightContestantIds.includes(cd['Jometry Contestant Id'])), cd1 => cd1['Contestant'] + " " + dateFormat(cd1['Date'])));

    var plotData = [];
    for ( var i = 0; i < xData.length; i ++ ) {
        var result = {
            type: 'box',
            y: yData[i],
            name: xData[i],
            text: dateData[i],
            boxpoints: 'all',
            jitter: 0.3,
            whiskerwidth: 0.2,
            marker: {
                size: 4,
                color: colorList[i]
            },
            fillcolor: colorList[i],
            line: {
                width: 1.5,
                color: 'black'
            }
        };
        plotData.push(result);
    };

    layout = {
        title: title,
        yaxis: {
            autorange: true,
            showgrid: true,
            zeroline: true,
            gridwidth: 1,
            zerolinewidth: 2,
            zeroline: true,
            title: title
        },
        margin: {
            l: 60,
            r: 30,
            b: 80,
            t: 100
        },
        showlegend: false
    };

    Plotly.newPlot(divId, plotData, layout);
}

var renderDayPodiumContestantBoxPlot = function(
    data,
    mappingFunction,
    divId,
    title,
    filterFunction
) {
    var colorList = d3.schemeCategory10.concat(d3.schemeDark2);
    data = d3.filter(data, filterFunction);
    data = d3.group(data, cd => d3.timeFormat("%A")(cd['Date']) + " " + (cd['Podium'] == 1 ? '1' : '2/3'));
    var xData = ['Monday 1', 'Tuesday 1', 'Wednesday 1', 'Thursday 1', 'Friday 1',
        'Monday 2/3', 'Tuesday 2/3', 'Wednesday 2/3', 'Thursday 2/3', 'Friday 2/3'];
    var yData = d3.map(xData, x => d3.map(data.get(x), mappingFunction));
    var dateData = d3.map(xData, x => d3.map(data.get(x), cd1 => dateFormat(cd1['Date']) + " " + cd1['Contestant']));

    var plotData = [];
    for ( var i = 0; i < xData.length; i ++ ) {
        var result = {
            type: 'box',
            y: yData[i],
            name: xData[i],
            text: dateData[i],
            boxpoints: 'all',
            jitter: 0.3,
            whiskerwidth: 0.2,
            marker: {
                size: 4,
                color: colorList[i]
            },
            fillcolor: colorList[i],
            line: {
                width: 1.5,
                color: 'black'
            }
        };
        plotData.push(result);
    };

    layout = {
        title: title,
        yaxis: {
            autorange: true,
            showgrid: true,
            zeroline: true,
            gridwidth: 1,
            zerolinewidth: 2,
            zeroline: true,
            title: title
        },
        xaxis: {
            title: 'Day of week and podium'
        },
        margin: {
            l: 60,
            r: 30,
            b: 80,
            t: 100
        },
        //paper_bgcolor: 'rgb(243, 243, 243)',
        //plot_bgcolor: 'rgb(243, 243, 243)',
        showlegend: false
    };

    Plotly.newPlot(divId, plotData, layout);
}

var renderHighlightContestantRoundLinePlot = function(
    data,
    highlightContestantIds,
    mappingFunctionLeft,
    mappingFunctionRight,
    divId,
    title,
    filterFunction,
    yAxisLabel
) {
    var colorList = d3.schemeCategory10.concat(d3.schemeDark2);
    data = d3.filter(data, filterFunction);
    highlightContestantIds = d3.filter(highlightContestantIds, cid => d3.map(data, cd => cd['Jometry Contestant Id']).includes(cid));
    var traces = [];
    for ( var i = 0; i < highlightContestantIds.length; i ++ ) {
        var trace = {
            x: ['J', 'DJ'],
            y: [
                d3.mean(d3.map(d3.filter(d3.filter(data, filterFunction), cd => cd['Jometry Contestant Id'] === highlightContestantIds[i]), mappingFunctionLeft)),
                d3.mean(d3.map(d3.filter(d3.filter(data, filterFunction), cd => cd['Jometry Contestant Id'] === highlightContestantIds[i]), mappingFunctionRight))
            ],
            type: 'scatter',
            name: getContestantNameFromData(data, highlightContestantIds[i]),
            marker: {
                color: colorList[i]
            }
        };
        traces.push(trace);
    }

    layout = {
        title: title,
        yaxis: {
            autorange: true,
            showgrid: true,
            title: {
                text: yAxisLabel
            }
        },
        margin: {
            l: 60,
            r: 30,
            b: 80,
            t: 100
        },
        showlegend: true
    };

    Plotly.newPlot(divId, traces, layout);
};