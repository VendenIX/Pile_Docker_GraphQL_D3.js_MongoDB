import React, { useState } from 'react';
import MapFrance from './components/MapFrance';
import DepartmentDetails from './components/DepartmentDetails';
import SalesChart from './components/SalesChart';
import './styles/global.css';

function App() {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);

  // Fonction pour mettre à jour l'ID du département sélectionné
  const handleDepartmentSelect = (departmentId) => {
    setSelectedDepartmentId(departmentId);
  };

  return (
    <div className="main-container">
      <div className="left-panel">
        <div className="left-panel-top">
          {selectedDepartmentId && <DepartmentDetails departmentId={selectedDepartmentId} />}
        </div>
        <div className="left-panel-bottom">
          <SalesChart />
        </div>
      </div>
      <div className="right-panel">
        <MapFrance onDepartmentSelect={handleDepartmentSelect} />
      </div>
    </div>
  );
}

export default App;
