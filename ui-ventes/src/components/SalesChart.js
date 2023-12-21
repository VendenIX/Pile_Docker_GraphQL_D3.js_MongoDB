import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const SalesChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (data && data.length > 0) {
      drawChart();
    }
  }, [data]);

  const drawChart = () => {
    const width = 928;
    const height = 500;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 40;

    const x = d3.scaleUtc()
      .domain(d3.extent(data, d => d.date))
      .rangeRound([marginLeft, width - marginRight]);

    const y = d3.scaleLinear()
      .domain(d3.extent(data, d => d.salesCount)).nice()
      .rangeRound([height - marginBottom, marginTop]);

    const color = d3.scaleOrdinal(data.map(d => d.condition), d3.schemeCategory10);

    const line = d3.line()
      .curve(d3.curveStep)
      .x(d => x(d.date))
      .y(d => y(d.salesCount));

    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
      .call(g => g.select(".domain").remove());

    svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove())
      .call(g => g.select(".tick:last-of-type text").append("tspan").text("Sales Count"));

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color(data[0].condition))
      .attr("stroke-width", 2)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line);
  };

  return (
    <div ref={chartRef}></div>
  );
};

export default SalesChart;
