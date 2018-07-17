
import { dataset } from './data.js';

// constants for svg and graph dimensions
const circleRadius = 7;
const height = 500;
const nonAxisPadding = 10;
const width = 800;
const xAxisPadding = 50;
const yAxisPadding = 50;

// set up the x and y scales
const xScale = d3.scaleLinear()
  .domain([d3.min(dataset, (cyclist) => cyclist.year), d3.max(dataset, (cyclist) => cyclist.year)])
  .range([xAxisPadding, width - nonAxisPadding]);

const yScale = d3.scaleLinear()
  .domain([d3.max(dataset, (cyclist) => cyclist.seconds), d3.min(dataset, (cyclist) => cyclist.seconds)])
  .range([height - yAxisPadding, nonAxisPadding]);

// create the svg
const svg = d3.select('main')
  .append('svg')
  .attr('height', height)
  .attr('width', width);

// populate the scatterplot
svg.selectAll('circle')
  .data(dataset)
  .enter()
  .append('circle')
  .attr('cx', (cyclist) => xScale(cyclist.year))
  .attr('cy', (cyclist) => yScale(cyclist.seconds))
  .attr('r', circleRadius)
  .attr('fill', (cyclist) => (cyclist.doping) ? "red" : "blue")
  .append('title')
  .text(cyclist => {
    let output = `${cyclist.name}: ${cyclist.nationality}\nTime: ${cyclist.time}`;

    if (cyclist.doping) {
        output += `\n\n${cyclist.doping}\nSource: ${cyclist.url}`
    }
    return output;
  });
