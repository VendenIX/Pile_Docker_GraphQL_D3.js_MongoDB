import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { fetchDepartments, fetchGeoJsonData } from '../services/api.js'; 
import '../styles/global.css'; 

const MapFrance = () => {
    const mapRef = useRef(null);

    useEffect(() => {
        const width = 700, height = 550;
        const projection = d3.geoConicConformal()
            .center([2.454071, 46.279229])
            .scale(2600)
            .translate([width / 2 - 50, height / 2]);
        const path = d3.geoPath().projection(projection);

        const svg = d3.select(mapRef.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "Blues");

        const loadData = async () => {
            try {
                const geojsonData = await fetchGeoJsonData('/departments.json');
                console.log("LE LAC TI TI CA CA EST MAGIQUE")
                console.log(geojsonData)
                const departmentData = await fetchDepartments();

                const departments = svg.append("g");
                departments.selectAll("path")
                    .data(geojsonData.features)
                    .enter()
                    .append("path")
                    .attr("d", path)
                    .attr('id', d => "d" + d.properties.CODE_DEPT);

                // Échelle de quantile pour le coloriage des départements
                const quantile = d3.scaleQuantile()
                    .domain([0, d3.max(departmentData.departments, e => e.count)])
                    .range(d3.range(9));

                // Coloriage des départements en fonction des données de vente
                departmentData.departments.forEach(function (e) {
                    d3.select("#d" + e.id)
                        .attr("class", d => "department q" + quantile(e.count) + "-9");
                });

                // Création de la légende
                const legend = svg.append('g')
                    .attr('transform', 'translate(525, 150)')
                    .attr('id', 'legend');

                legend.selectAll('.colorbar')
                    .data(d3.range(9))
                    .enter().append('svg:rect')
                    .attr('y', d => d * 20 + 'px')
                    .attr('height', '20px')
                    .attr('width', '20px')
                    .attr('x', '0px')
                    .attr("class", d => "q" + d + "-9");

                const legendScale = d3.scaleLinear()
                    .domain([0, d3.max(departmentData.departments, e => e.count)])
                    .range([0, 9 * 20]);

                svg.append("g")
                    .attr('transform', 'translate(550, 150)')
                    .call(d3.axisRight(legendScale).ticks(6));

            } catch (error) {
                console.error("Error loading data:", error);
            }
        };

        loadData();

        return () => {
            d3.select(mapRef.current).select("svg").remove();
        };
    }, []);

    return <div ref={mapRef} id="map"></div>;
};

export default MapFrance;
