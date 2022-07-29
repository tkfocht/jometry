var renderHighlightScatterHistogram = function(
    data,
    container,
    title,
    filterFunction,
    highlightFilterFunction,
    xLabel,
    xFunction,
    xBins,
    yLabel,
    yFunction,
    yBins,
    highlightColorFunction,
    highlightLabelFunction
) {
    data = d3.filter(data, filterFunction);
    var histTrace = {
        x: d3.map(data, xFunction),
        y: d3.map(data, yFunction),
        autobinx: false,
        xbins: xBins,
        ybins: yBins,
        type: 'histogram2d',
        colorscale : [['0' , 'white'],['1', '#999999']]
    };
    var scatterTrace = {
        x: d3.map(d3.filter(data, highlightFilterFunction), xFunction),
        y: d3.map(d3.filter(data, highlightFilterFunction), yFunction),
        mode: 'markers+text',
        marker: {
            symbol: 'circle',
            size: 6,
            opacity: 1,
            line: {
                color: 'black',
                width: 0.5
            },
            color: d3.map(d3.filter(data, highlightFilterFunction), highlightColorFunction),
        },
        type: 'scatter',
        textcolor: d3.map(d3.filter(data, highlightFilterFunction), highlightColorFunction),
        textfont: {
            family: 'Roboto'
        },
        textposition: 'center right',
        text: d3.map(d3.filter(data, highlightFilterFunction), highlightLabelFunction)
    };
    var layout = {
        title: title,
        xaxis: {
            title: xLabel
        },
        yaxis: {
            title: yLabel
        }
    };
    Plotly.newPlot(container, [scatterTrace, histTrace], layout);
}

var renderHighlightHistogram = function(
    data,
    container,
    title,
    filterFunction,
    highlightFilterFunction,
    xLabel,
    xFunction,
    xBins,
    highlightGameColorFunction,
    highlightGameLabelFunction
) {
    data = d3.filter(data, filterFunction);
    var highlightData = d3.filter(data, highlightFilterFunction);
    var histTrace = {
        x: d3.map(data, xFunction),
        autobinx: false,
        xbins: xBins,
        marker: {
            color: '#CCCCCC'
        },
        type: 'histogram',
        showlegend: false
    };
    var yIndex = 2;
    var yAdjustment = Math.min(3, 10.0 / highlightData.length);
    var scatterTrace = {
        x: d3.map(highlightData, xFunction),
        y: d3.map(highlightData, d => {
            yIndex = yIndex + yAdjustment;
            return yIndex - yAdjustment;
        }),
        mode: 'markers+text',
        marker: {
            symbol: 'circle',
            size: 6,
            opacity: 1,
            line: {
                color: 'black',
                width: 0.5
            },
            color: d3.map(highlightData, highlightGameColorFunction),
        },
        type: 'scatter',
        textcolor: d3.map(highlightData, highlightGameColorFunction),
        textfont: {
            family: 'Roboto'
        },
        textposition: 'center right',
        text: d3.map(highlightData, highlightGameLabelFunction),
        showlegend: false
    };
    var layout = {
        bargap: 0.05,
        title: title,
        xaxis: {
            title: xLabel
        }
    }
    Plotly.newPlot(container, [histTrace, scatterTrace], layout);
}