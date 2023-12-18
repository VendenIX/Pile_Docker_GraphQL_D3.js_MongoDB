import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { fetchDepartments, fetchGeoJsonData } from '../services/api'; 
import '../styles/global.css'; 
import '../styles/colorbrewer.css';

const MapFrance = () => {
    const mapRef = useRef(null);

    useEffect(() => {
        // Initialisation de la carte
        initMap();

        // Fonction de nettoyage pour éviter les doublons
        return () => {
            if (mapRef.current) {
                d3.select(mapRef.current).select("svg").remove();
            }
        };
    }, []);

    const initMap = async () => {
        // Logique de nettoyage: Supprime le SVG existant si présent
        if (mapRef.current) {
            d3.select(mapRef.current).select("svg").remove();
        }
        // Configuration initiale
        const width = 700, height = 550;
        const projection = d3.geoConicConformal()
            .center([2.454071, 46.279229])
            .scale(2600)
            .translate([width / 2 - 50, height / 2]);
        const path = d3.geoPath().projection(projection);

        // Création du SVG
        const svg = d3.select(mapRef.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "Blues");

        // Chargement des données
        const geojsonData = await fetchGeoJsonData('/departments.json');
        const departmentData = await fetchDepartments();
        console.log("geojsonData:",geojsonData.features.map(d => d.properties.CODE_DEPT));
        console.log("departmentData:",departmentData.sales.map(dept => dept.departementId));
        // Affichage des départements
        renderDepartments(svg, geojsonData, departmentData, path);

        // Création de la légende
        createLegend(svg, departmentData);
    };

    const renderDepartments = (svg, geojsonData, departmentData, path) => {
        // Créez une échelle de couleurs en fonction du compte
        const colorScale = d3.scaleQuantile()
            .domain([0, d3.max(departmentData.sales, e => +e.count)])
            .range(['#f7fbff', '#08306b']); // Vous pouvez personnaliser les couleurs ici
    
        const departments = svg.append("g");
        const departmentPaths = departments.selectAll("path")
            .data(geojsonData.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr('id', d => "d" + d.properties.CODE_DEPT)
            .attr("class", d => {
                const dept = departmentData.sales.find(dept => dept.departementId === parseInt(d.properties.CODE_DEPT));
                return dept ? "department" : "department"; // Vous pouvez laisser la classe de base ici
            })
            .style("fill", d => {
                const dept = departmentData.sales.find(dept => dept.departementId === parseInt(d.properties.CODE_DEPT));
                return dept ? colorScale(dept.count) : "#ccc"; // Remplacez la couleur par celle de l'échelle
            });
    
        // Ajouter un gestionnaire d'événements de clic pour afficher le nom du département
        departmentPaths.on("click", function (event, d) {
            const dept = departmentData.sales.find(dept => dept.departementId === parseInt(d.properties.CODE_DEPT));
            if (dept) {
                console.log("Département : " + dept.departementId);
            }
        });
    };
    
    
    
    const createLegend = (svg, departmentData) => {
        // Création du groupe pour la légende
        const legend = svg.append('g')
            .attr('transform', 'translate(525, 150)')
            .attr('id', 'legend');
    
        // Création des barres de couleur pour la légende
        legend.selectAll('.colorbar')
            .data(d3.range(9))
            .enter().append('rect')
            .attr('y', d => d * 20 + 'px')
            .attr('height', '20px')
            .attr('width', '20px')
            .attr('x', '0px')
            .attr("class", d => "q" + d + "-9");
    
        // Création de l'échelle pour l'axe de la légende
        const legendScale = d3.scaleLinear()
            .domain([0, d3.max(departmentData.sales, e => e.count)])
            .range([0, 9 * 20]);
    
        // Ajout de l'axe à la légende
        const legendAxis = d3.axisRight(legendScale).ticks(6);
        svg.append("g")
            .attr('transform', 'translate(550, 150)')
            .call(legendAxis);
    };
    

    return <div ref={mapRef} id="map"></div>;
    
};

export default MapFrance;
