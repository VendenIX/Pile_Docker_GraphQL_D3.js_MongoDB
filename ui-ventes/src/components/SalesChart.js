import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { fetchSalesByYears } from '../services/api'; // Importez la fonction de requête que vous avez créée
const SalesChart = ({ departmentId }) => {
  const chartRef = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if(departmentId) {
      try {
        const result = await fetchSalesByYears(undefined, departmentId, undefined);
        // Transformation des données
        const transformedData = result.nbSalesByTrimester.map(item => ({
          ...item,
          date: new Date(item.date.year, item.date.trimester * 3 - 3, 1) // Convertit année et trimestre en date
        })).sort((a, b) => a.date - b.date); 
        setData(transformedData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données du département :", error);
      }
    };
  }
    fetchData();
  }, [departmentId]);

  useEffect(() => {
    // Assurez-vous que le SVG est nettoyé avant de dessiner un nouveau graphique
    const cleanUpSvg = () => {
      if (chartRef.current) {
        d3.select(chartRef.current).selectAll("*").remove();
      }
    };
  
    // Nettoyage du SVG lors du démontage du composant
    return cleanUpSvg;
  }, []);

  useEffect(() => {
    // Dessiner le graphique uniquement si les données sont disponibles
    if (data && data.length > 0) {
      drawChart();
    }
  }, [data]);


  const drawChart = () => {
    d3.select(chartRef.current).selectAll("*").remove(); // Nettoyage du SVG

    const width = 928;
    const height = 500;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 50;

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([marginLeft, width - marginRight]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.sum)])
      .range([height - marginBottom, marginTop]);

    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y));

    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.sum));

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);
  };

  return (
    <div ref={chartRef}></div>
  );
};

export default SalesChart;