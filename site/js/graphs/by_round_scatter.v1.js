var byRoundScatter = function(
    containerId,
    data,
    xFields,
    xDomain,
    xAxisLabel,
    yFields,
    yDomain,
    yAxisLabel,
    colorFunction,
    opacityFunction,
    labelFunction,
    width,
    height,
    margin
) {
    var svg = d3.select(containerId)
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    x.domain(xDomain);
    y.domain(yDomain);

    pathLayer = svg.append('g');
    pathLayer.selectAll("path")
        .data(data)
        .enter()
        .append("path")
        .attr("d", function(d) {
            var path = d3.path();
            path.moveTo(x(d[xFields[0]]), y(d[yFields[0]]));
            path.lineTo(x(d[xFields[1]]), y(d[yFields[1]]));
            path.closePath();
            return path;
        })
        .style("stroke", colorFunction)
        .style("opacity", opacityFunction);

    jGroup = svg.append('g');
    jGroup.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("cx", function(d) { return x(d[xFields[0]]); })
        .attr("cy", function(d) { return y(d[yFields[0]]); })
        .style("stroke", "black")
        .style("fill", colorFunction)
        .style("opacity", opacityFunction);
    jGroup.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function(d) {
            var label = labelFunction(d);
            if (label) {
                return label + ", J!";
            }
            return label;
        })
        .attr("x", function(d) {
            return x(d[xFields[0]]) + 7;
        })
        .attr("y", function(d) {
        return y(d[yFields[0]]) + 2;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", colorFunction);

    djGroup = svg.append('g');
    djGroup.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", function(d) { return x(d[xFields[1]]) - 5; })
        .attr("y", function(d) { return y(d[yFields[1]]) - 5; })
        .style("stroke", "black")
        .style("fill", colorFunction)
        .style("opacity", opacityFunction);
    djGroup.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function(d) {
            var label = labelFunction(d);
            if (label) {
                return label + ", DJ!";
            }
            return label;
        })
        .attr("x", function(d) {
            return x(d[xFields[1]]) + 7;
        })
        .attr("y", function(d) {
            return y(d[yFields[1]]) + 2;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", colorFunction);

    svg.append("g")
        .attr("transform", "translate(0," + y(0) + ")")
        .call(d3.axisBottom(x).ticks(10));

    svg.append("text")
        .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text(xAxisLabel);

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(yAxisLabel); 
    
    return svg;
};