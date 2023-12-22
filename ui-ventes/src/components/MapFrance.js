import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { fetchDepartments, fetchGeoJsonData } from '../services/api';
import '../styles/global.css';
import '../styles/colorbrewer.css';
import DepartmentDetails from './DepartmentDetails';
import SalesChart from './SalesChart';

const MapFrance = () => {
    const mapRef = useRef(null);
    const [tooltipInfo, setTooltipInfo] = useState(null); // État pour le tooltip
    const [selectedDepartmentId, setSelectedDepartmentId] = useState(null); // État pour l'ID du département sélectionné
    // Ajoutez un nouvel état pour stocker le nom du département
    const [selectedDepartmentName, setSelectedDepartmentName] = useState(null);


    useEffect(() => {
        // Initialisation de la carte
        initMap();
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

        // Affichage des départements
        renderDepartments(svg, geojsonData, departmentData, path);
    };

    const renderDepartments = (svg, geojsonData, departmentData, path) => {
        // Créez une échelle de couleurs en fonction du compte

        const quantile = d3.scaleQuantile()
            .domain([0, d3.max(departmentData.departments, e => +e.count)])
            .range(d3.range(9).map(n => `q${n}-9`)); // Mappe à des classes telles que 'q0-9', 'q1-9', etc.



        // ajout des chemins de chaque département
        const departmentPaths = svg.selectAll("path")
        .data(geojsonData.features)
        .enter()
        .append("path")
        .attr('id', d => "d" + d.properties.CODE_DEPT)
        .attr("d", path)
        .attr("class", d => {
            const dept = departmentData.departments.find(dept => dept.id === parseInt(d.properties.CODE_DEPT));
            // Utilisez uniquement la classe de quantile ici, sans style "fill"
            return dept ? `department ${quantile(dept.count)}` : "department";
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
                // Mettez à jour l'ID du département sélectionné
                setSelectedDepartmentId(dept.id);
                console.log("very interesting", dept)
                setSelectedDepartmentName(dept.name);
            }
        });

        // Réglez la Corse comme complètement transparente
        const corsePaths = svg.selectAll("path")
            .filter(d => d.properties.CODE_DEPT === "2A" || d.properties.CODE_DEPT === "2B");

        corsePaths.style("fill", "rgb(0, 0, 0)");
    };

    return (
        <div className="map-container">
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
          <div className="department-details">
            {/* Affichez le composant DepartmentDetails avec l'ID du département sélectionné */}
            {selectedDepartmentId && <DepartmentDetails departmentId={selectedDepartmentId}  nameDepartment = {selectedDepartmentName}  />}
            {selectedDepartmentId && <SalesChart departmentId={selectedDepartmentId} nameDepartment = {selectedDepartmentName} />}
          </div>
        </div>
      );
};

export default MapFrance;
