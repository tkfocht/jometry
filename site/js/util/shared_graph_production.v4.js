var renderSharedGraphs = function(
    data,
    colorFunction,
    opacityFunction,
    labelFunction,
    legendContestants,
    legendColors,
    width,
    height,
    margin
) {

    var addLegend = function(
        svg,
        xTranslation = 175,
        yTranslation = 0
    ) {
        var legend = svg.append("g")
            .attr("transform", "translate(" + (xTranslation - width) + "," + yTranslation + ")")
            .attr("font-size", 13)
            .attr("text-anchor", "start")
            .selectAll("g")
            .data(legendContestants)
            .enter().append("g")
            .attr("transform", function(d, i) { return "translate(0," + i * 16 + ")"; });
        legend.append("circle")
            .attr("cx", width - 142)
            .attr("cy", 4)
            .attr("r", 5)
            .attr("fill", legendColors)
            .attr("stroke", "black");
        legend.append("text")
            .attr("x", width - 133)
            .attr("y", 5.5)
            .attr("dy", "0.22em")
            .text(d => (d));
    }

    var renderStandard = function(
        containerId,
        graphPrefix,
        headerText,
        descriptionText,
        xAttr,
        yAttr,
        gameXRange,
        gameYRange,
        roundXRange,
        roundYRange,
        xLabel,
        yLabel,
        legendPosition
    ) {
        var section = d3.select(containerId);
        section.append('h1').text(headerText);
        section.append('div').attr('class', 'graph-description')
            .text(descriptionText);
        section.append('h2').text('Full Game');
        section.append('div').attr('id', graphPrefix + '-game');
        section.append('h2').text('By Round');
        var jDJContainer = section.append('div').attr('class','j-dj-container');
        jDJContainer.append('div').attr('id', graphPrefix + '-j');
        jDJContainer.append('div').attr('id', graphPrefix + '-dj');

        var gameSvg = fullGameScatter(
            '#' + graphPrefix + '-game',
            data,
            xAttr, gameXRange, xLabel,
            yAttr, gameYRange, yLabel,
            colorFunction, opacityFunction, labelFunction,
            width, height, margin,
            d => +d['Wins'] === 0,
            d => +d['Wins'] > 0
        );
        addLegend(gameSvg, legendPosition === 'R' ? width : 175, 0);
        var jSvg = fullGameScatter(
            '#' + graphPrefix + '-j',
            data,
            'J' + xAttr, roundXRange, 'J! ' + xLabel,
            'J' + yAttr, roundYRange, 'J! ' + yLabel,
            colorFunction, opacityFunction, labelFunction,
            width/2, height, margin,
            d => +d['Wins'] === 0,
            d => +d['Wins'] > 0
        );
        addLegend(jSvg, legendPosition === 'R' ? width/2 : 175, 0);
        var djSvg = fullGameScatter(
            '#' + graphPrefix + '-dj',
            data,
            'DJ' + xAttr, roundXRange, 'DJ! ' + xLabel,
            'DJ' + yAttr, roundYRange, 'DJ! ' + yLabel,
            colorFunction, opacityFunction, labelFunction,
            width/2, height, margin,
            d => +d['Wins'] === 0,
            d => +d['Wins'] > 0
        );
        addLegend(djSvg, legendPosition === 'R' ? width/2 : 175, 0);
    };

    //Speed and Solo
    renderStandard(
        '#section-speed-solo',
        'scatter-speed-solo',
        'Speed and Solo',
        "Speed is an estimate of additional buzzes a contestant creates through speed (or opponents' " +
            "lack of speed). A higher Speed represents winning a higher number of buzzer races. Solo is an " +
            "estimate of how many of a contestant's correct responses did not have an opponent ringing in " +
            "with a possibly-correct response. Higher Solo represents a contestant that is the only player " +
            "ringing in more often. Wins are squares, losses are circles.",
        'Solo',
        'Speed',
        [0, Math.ceil(d3.max(d3.map(data, d => +d['Solo'])))],
        [Math.floor(d3.min(d3.map(data, d => +d['Speed']))), Math.ceil(d3.max(d3.map(data, d => +d['Speed'])))],
        [0, Math.ceil(d3.max(d3.map(data, d => d3.max([+d['JSolo'], +d['DJSolo']]))))],
        [Math.floor(d3.min(d3.map(data, d => d3.min([+d['JSpeed'], +d['DJSpeed']])))), Math.ceil(d3.max(d3.map(data, d => d3.max([+d['JSpeed'], +d['DJSpeed']]))))],
        'Solo',
        'Speed',
        'R'
    );

    //Att and ExpBuz
    renderStandard(
        '#section-att-exp-buz',
        'att-exp-buz',
        'Att and ExpBuz',
        "The actual number of attempts by a contestant and the expected number of buzzes, based on the " +
            "contestant's and opponents' attempt counts. Higher ExpBuz at the same attempt count reflects " +
            "less competition on the buzzers. Wins are squares, losses are circles.",
        'Att',
        'ExpBuz',
        [0, Math.ceil(d3.max(d3.map(data, d => +d['Att'])))],
        [0, Math.ceil(d3.max(d3.map(data, d => +d['ExpBuz'])))],
        [0, Math.ceil(d3.max(d3.map(data, d => d3.max([+d['JAtt'], +d['DJAtt']]))))],
        [0, Math.ceil(d3.max(d3.map(data, d => d3.max([+d['JExpBuz'], +d['DJExpBuz']]))))],
        'Att',
        'ExpBuz',
        'L'
    );

    //ExpBuz and Buz
    renderStandard(
        '#section-exp-buz-buz',
        'exp-buz-buz',
        'ExpBuz and Buz',
        "The actual number of buzzes by a contestant and the expected number of buzzes, based on the " +
            "contestant's and opponents' attempt counts. Higher Buz at similar ExpBuz reflects " +
            "a contestant winning more buzzer races. Wins are squares, losses are circles.",
        'ExpBuz',
        'Buz',
        [0, Math.ceil(d3.max(d3.map(data, d => +d['ExpBuz'])))],
        [0, Math.ceil(d3.max(d3.map(data, d => +d['Buz'])))],
        [0, Math.ceil(d3.max(d3.map(data, d => d3.max([+d['JExpBuz'], +d['DJExpBuz']]))))],
        [0, Math.ceil(d3.max(d3.map(data, d => d3.max([+d['JBuz'], +d['DJBuz']]))))],
        'ExpBuz',
        'Buz',
        'L'
    );
    
    //ExpBuz and Buz$/Buz
    renderStandard(
        '#section-exp-buz-buz-score-per-buz',
        'exp-buz-buz-score-per-buz',
        'ExpBuz and Buz$/Buz',
        "The actual score on buzz per buzz by a contestant and the expected number of buzzes, based on the " +
            "contestant's and opponents' attempt counts. Wins are squares, losses are circles.",
        'ExpBuz',
        'Buz$/Buz',
        [0, Math.ceil(d3.max(d3.map(data, d => +d['ExpBuz'])))],
        [Math.floor(d3.min(d3.map(data, d => +d['Buz$/Buz']))), Math.ceil(d3.max(d3.map(data, d => +d['Buz$/Buz'])))],
        [0, Math.ceil(d3.max(d3.map(data, d => d3.max([+d['JExpBuz'], +d['DJExpBuz']]))))],
        [Math.floor(d3.min(d3.map(data, d => d3.min([+d['JBuz$/Buz'], +d['DJBuz$/Buz']])))), Math.ceil(d3.max(d3.map(data, d => d3.max([+d['JBuz$/Buz'], +d['DJBuz$/Buz']]))))],
        'ExpBuz',
        'Buz$/Buz',
        'L'
    );

    //ExpBuz and Buz$
    renderStandard(
        '#section-exp-buz-buz-score',
        'exp-buz-buz-score',
        'ExpBuz and Buz$',
        "The actual total score on buzz by a contestant and the expected number of buzzes, based on the " +
            "contestant's and opponents' attempt counts. Wins are squares, losses are circles.",
        'ExpBuz',
        'Buz$',
        [0, Math.ceil(d3.max(d3.map(data, d => +d['ExpBuz'])))],
        [Math.floor(d3.min(d3.map(data, d => +d['Buz$']))), Math.ceil(d3.max(d3.map(data, d => +d['Buz$'])))],
        [0, Math.ceil(d3.max(d3.map(data, d => d3.max([+d['JExpBuz'], +d['DJExpBuz']]))))],
        [Math.floor(d3.min(d3.map(data, d => d3.min([+d['JBuz$'], +d['DJBuz$']])))), Math.ceil(d3.max(d3.map(data, d => d3.max([+d['JBuz$'], +d['DJBuz$']]))))],
        'ExpBuz',
        'Buz$',
        'L'
    );

    //ExpBuz and Speed
    renderStandard(
        '#section-exp-buz-speed',
        'exp-buz-speed',
        'ExpBuz and Speed',
        "The Speed rating for a contestant and the expected number of buzzes, based on the " +
            "contestant's and opponents' attempt counts. Wins are squares, losses are circles. " + 
            "Naively, these metrics are expected to be mostly independent.",
        'ExpBuz',
        'Speed',
        [0, Math.ceil(d3.max(d3.map(data, d => +d['ExpBuz'])))],
        [Math.floor(d3.min(d3.map(data, d => +d['Speed']))), Math.ceil(d3.max(d3.map(data, d => +d['Speed'])))],
        [0, Math.ceil(d3.max(d3.map(data, d => d3.max([+d['JExpBuz'], +d['DJExpBuz']]))))],
        [Math.floor(d3.min(d3.map(data, d => d3.min([+d['JSpeed'], +d['DJSpeed']])))), Math.ceil(d3.max(d3.map(data, d => d3.max([+d['JSpeed'], +d['DJSpeed']]))))],
        'ExpBuz',
        'Speed',
        'L'
    );

    //ExpBuz and Solo
    renderStandard(
        '#section-exp-buz-solo',
        'exp-buz-solo',
        'ExpBuz and Solo',
        "The Solo rating for a contestant and the expected number of buzzes, based on the " +
            "contestant's and opponents' attempt counts. Wins are squares, losses are circles. " +
            "Naively, there is a relationship between attempting more and have more Solo attempts, " +
            "but how many Solo attempts would be out of a contestants' control.",
        'ExpBuz',
        'Solo',
        [0, Math.ceil(d3.max(d3.map(data, d => +d['ExpBuz'])))],
        [0, Math.ceil(d3.max(d3.map(data, d => +d['Solo'])))],
        [0, Math.ceil(d3.max(d3.map(data, d => d3.max([+d['JExpBuz'], +d['DJExpBuz']]))))],
        [0, Math.ceil(d3.max(d3.map(data, d => d3.max([+d['JSolo'], +d['DJSolo']]))))],
        'ExpBuz',
        'Solo',
        'L'
    );     

}