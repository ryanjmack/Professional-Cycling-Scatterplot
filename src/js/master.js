
import { dataset } from './data.js';

// constants for svg and graph dimensions
const circleRadius = 6;
const height = 500;
const nonAxisPadding = 10;
const width = 800;
const xAxisPadding = 50;
const yAxisPadding = 50;

// create the svg
const svg = d3.select('main')
  .append('svg')
  .attr('height', height)
  .attr('width', width)
  .attr('overflow', 'visible');


// set up the x and y scales
const xScale = d3.scaleLinear()
  .domain([d3.min(dataset, (cyclist) => cyclist.year) - 1, d3.max(dataset, (cyclist) => cyclist.year)])
  .range([xAxisPadding, width - nonAxisPadding]);

const yScale = d3.scaleLinear()
  // add a little buffer to the domain of inputs
  .domain([d3.max(dataset, (cyclist) => cyclist.seconds) + 10, d3.min(dataset, (cyclist) => cyclist.seconds) - 10])
  .range([height - yAxisPadding, nonAxisPadding]);


// populate the scatterplot
svg.selectAll('circle')
  .data(dataset)
  .enter()
  .append('circle')
  .attr('cx', (cyclist) => xScale(cyclist.year))
  .attr('cy', (cyclist) => yScale(cyclist.seconds))
  .attr('r', circleRadius)
  .attr('fill', (cyclist) => (cyclist.doping) ? "#e10d0d" : "#3fac03")
  .attr('stroke', '#222')
  .append('title')
  .text(cyclist => {
    let output = `${cyclist.name}: ${cyclist.nationality}\nTime: ${cyclist.time}\nYear: ${cyclist.year}`;

    if (cyclist.doping) {
        output += `\n\n${cyclist.doping}\nSource: ${cyclist.url}`
    }
    return output;
  });


// create the x axis
const xAxis = d3.axisBottom(xScale)
  .tickFormat(n => n);

svg.append('g')
  .attr('transform', `translate(0, ${height - yAxisPadding})`)
  .call(xAxis);

svg.append('text')
  .text('Year')
  .attr('transform', `translate(${width / 2}, ${height})`)
  .attr('font-size', '20');


// create the y axis
const yAxis = d3.axisLeft(yScale)
  .tickFormat(d => {
    let mins = Math.floor(d / 60);
    let seconds = d % 60;
    return `${mins}:${(seconds < 10) ? seconds.toString() + '0' : seconds}`;
  })
  .tickSize(width - yAxisPadding - nonAxisPadding);

svg.append('g')
  .attr('transform', `translate(${width - nonAxisPadding}, 0)`)
  .call(yAxis);

svg.append('text')
  .text('Time in Minutes')
  .attr('transform', `rotate(270)translate(${-height / 1.64}, 0)`)
  .attr('font-size', '20');


/*
  Legend at the top of the graph
*/
// legend for cyclists not accused of doping
svg.append('circle')
  .attr('r', circleRadius)
  .attr('cx', yAxisPadding + nonAxisPadding)
  .attr('cy', -nonAxisPadding * 3)
  .attr('fill', '#3fac03')
  .attr('stroke', '#222');

svg.append('text')
  .text('Never accused of doping')
  .attr('x', yAxisPadding + nonAxisPadding * 2)
  .attr('y', -nonAxisPadding * 3 + nonAxisPadding / 2)
  .attr('font-size', 12);

// legend for riders accused of doping
svg.append('circle')
  .attr('r', circleRadius)
  .attr('cx', yAxisPadding + nonAxisPadding)
  .attr('cy', -nonAxisPadding)
  .attr('fill', '#e10d0d')
  .attr('stroke', '#222');

svg.append('text')
  .text('Accused of doping')
  .attr('x', yAxisPadding + nonAxisPadding * 2)
  .attr('y', -nonAxisPadding / 2)
  .attr('font-size', 12);


// resize axes font-sizes
svg.selectAll('g')
  .attr('font-size', '15');
