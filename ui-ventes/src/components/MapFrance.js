import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { fetchDepartments, fetchGeoJsonData } from '../services/api'; 
import '../styles/global.css'; 
import '../styles/colorbrewer.css';

const MapFrance = () => {
    const mapRef = useRef(null);
    const [tooltipInfo, setTooltipInfo] = useState(null); // État pour le tooltip

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
        console.log("debug ultime: ", geojsonData)

        // Affichage des départements
        renderDepartments(svg, geojsonData, departmentData, path);

        // Création de la légende
        createLegend(svg, departmentData);
    };

    const renderDepartments = (svg, geojsonData, departmentData, path) => {
        // Créez une échelle de couleurs en fonction du compte
        const colorScale = d3.scaleQuantile()
            .domain([0, d3.max(departmentData.departments, e => +e.count)]) // Utilisez departmentData directement
            .range(['#f7fbff', '#08306b']); // Vous pouvez personnaliser les couleurs ici
    
        // ajout des chemins de chaque département
        const departmentPaths = svg.selectAll("path") // Utilisez selectAll pour les chemins existants
            .data(geojsonData.features)
            .enter()
            .append("path")
            .attr('id', d => "d" + d.properties.CODE_DEPT)
            .attr("d", path)
            .attr("class", d => {
                const dept = departmentData.departments.find(dept => dept.id === parseInt(d.properties.CODE_DEPT));
                return dept ? "department" : "department"; // Vous pouvez laisser la classe de base ici
            })
            .style("fill", d => {
                const dept = departmentData.departments.find(dept => dept.id === parseInt(d.properties.CODE_DEPT));
                return dept ? colorScale(dept.count) : "#ccc"; // Remplacez la couleur par celle de l'échelle
            })
            .on("mouseenter", function (event, d) {
                const dept = departmentData.departments.find(dept => dept.id === parseInt(d.properties.CODE_DEPT));
                if (dept) {
                    // Afficher le tooltip avec les informations du département
                    setTooltipInfo({
                        id: dept.id,
                        count: dept.count,
                        x: event.pageX + 30,
                        y: event.pageY - 30,
                    });
                }
            })
            .on("mouseleave", function () {
                // Masquer le tooltip lorsque la souris quitte le département
                setTooltipInfo(null);
            });
    
        // Ajouter un gestionnaire d'événements de clic pour afficher le nom du département
        departmentPaths.on("click", function (event, d) {
            const dept = departmentData.departments.find(dept => dept.id === parseInt(d.properties.CODE_DEPT));
            if (dept) {
                console.log("Département : " + dept.id + " - " + dept.count);
            }
        });
    
        // Réglez la Corse comme complètement transparente
        const corsePaths = svg.selectAll("path")
            .filter(d => d.properties.CODE_DEPT === "2A" || d.properties.CODE_DEPT === "2B");
        
        corsePaths.style("fill", "rgb(204, 204, 204)");
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
            .domain([0, d3.max(departmentData.departments, e => e.count)])
            .range([0, 9 * 20]);
    
        // Ajout de l'axe à la légende
        const legendAxis = d3.axisRight(legendScale).ticks(6);
        svg.append("g")
            .attr('transform', 'translate(550, 150)')
            .call(legendAxis);
    };
    

    return (
        <div ref={mapRef} id="map">
            {/* Affichage du tooltip */}
            {tooltipInfo && (
                <div
                    className="tooltip"
                    style={{ left: tooltipInfo.x + 'px', top: tooltipInfo.y + 'px' }}
                >
                    <b>Département : </b>{tooltipInfo.id}<br />
                    <b>Count : </b>{tooltipInfo.count}<br />
                </div>
            )}
        </div>
    );
    
};

export default MapFrance;
