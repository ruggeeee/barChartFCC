document.addEventListener('DOMContentLoaded', function() {
    const dataUrl = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

    fetch(dataUrl)
        .then(response => response.json())
        .then(data => {
            const dataset = data.data;
            const width = 800;
            const height = 400;
            const padding = 40;

            const svg = d3.select('#chart')
                .append('svg')
                .attr('width', width + 2 * padding)
                .attr('height', height + 2 * padding);

            const xScale = d3.scaleTime()
                .domain([new Date(d3.min(dataset, d => d[0])), new Date(d3.max(dataset, d => d[0]))])
                .range([padding, width - padding]);

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(dataset, d => d[1])])
                .range([height - padding, padding]);

            const xAxis = d3.axisBottom(xScale);
            const yAxis = d3.axisLeft(yScale);

            svg.append('g')
                .attr('id', 'x-axis')
                .attr('transform', `translate(0, ${height - padding})`)
                .call(xAxis);

            svg.append('g')
                .attr('id', 'y-axis')
                .attr('transform', `translate(${padding}, 0)`)
                .call(yAxis);

            svg.selectAll('.bar')
                .data(dataset)
                .enter()
                .append('rect')
                .attr('class', 'bar')
                .attr('x', d => xScale(new Date(d[0])))
                .attr('y', d => yScale(d[1]))
                .attr('width', (width - 2 * padding) / dataset.length)
                .attr('height', d => height - padding - yScale(d[1]))
                .attr('data-date', d => d[0])
                .attr('data-gdp', d => d[1]);

            const tooltip = d3.select('body').append('div')
                .attr('id', 'tooltip')
                .style('opacity', 0);

            svg.selectAll('.bar')
                .on('mouseover', function(event, d) {
                    tooltip.transition()
                        .duration(200)
                        .style('opacity', .9);
                    tooltip.html(`Date: ${d[0]}<br>GDP: ${d[1]}`)
                        .attr('data-date', d[0])
                        .style('left', (event.pageX + 5) + 'px')
                        .style('top', (event.pageY - 28) + 'px');
                })
                .on('mouseout', function() {
                    tooltip.transition()
                        .duration(500)
                        .style('opacity', 0);
                });
        });
});
