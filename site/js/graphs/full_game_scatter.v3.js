var fullGameScatter = function(
    containerId,
    data,
    xField,
    xDomain,
    xAxisLabel,
    yField,
    yDomain,
    yAxisLabel,
    colorFunction,
    opacityFunction,
    labelFunction,
    width,
    height,
    margin,
    dotFilter = d => true,
    squareFilter = d => false,
    hoverFunction = d => d['Contestant'] + ", " + dateFormat(d['Date'])
) {
    var svg = d3.select(containerId)
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    x.domain(xDomain);
    y.domain(yDomain);

    var Tooltip = d3.select(containerId)
        .append("div")
        .style("display", "none")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("z-index", "1000")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px");
    var mouseover = function(event) {
        Tooltip.style("display", "block");
    };
    var mousemove = function(event, d) {
        Tooltip
            .html(hoverFunction(d))
            .style("left", (event['pageX']+10) + "px")
            .style("top", (event['pageY']) + "px");
    }
    var mouseleave = function(event) {
        Tooltip.style("display", "none");
    };
    var size = 5;

    svg.selectAll("dot")
        .data(d3.filter(data, dotFilter))
        .enter()
        .append("circle")
        .attr("r", size)
        .attr("cx", function(d) { return x(d[xField]); })
        .attr("cy", function(d) { return y(d[yField]); })
        .style("stroke", "black")
        .style("fill", colorFunction)
        .style("opacity", opacityFunction)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);

    svg.selectAll("rect")
        .data(d3.filter(data, squareFilter))
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d[xField]) - size; })
        .attr("y", function(d) { return y(d[yField]) - size; })
        .attr("width", size*2)
        .attr("height", size*2)
        .style("stroke", "black")
        .style("fill", colorFunction)
        .style("opacity", opacityFunction)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);

    svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(labelFunction)
        .attr("x", function(d) {
            return x(d[xField]) + 7;
        })
        .attr("y", function(d) {
            return y(d[yField]) + 2;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", colorFunction);

    var xAxisY = 0;
    if (d3.min(xDomain) > 0) {
        xAxisY = d3.min(xDomain);
    }
    
    svg.append("g")
        .attr("transform", "translate(0," + y(xAxisY) + ")")
        .call(d3.axisBottom(x).ticks(10));

    svg.append("text")             
        .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text(xAxisLabel);

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", xAxisY - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(yAxisLabel);

    return svg;
};