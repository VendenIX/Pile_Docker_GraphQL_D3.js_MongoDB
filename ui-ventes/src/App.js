import React from 'react';
import MapFrance from './components/MapFrance';
import DepartmentDetails from './components/DepartmentDetails';
import SalesChart from './components/SalesChart';
import './styles/global.css';

function App() {
  return (
    <div className="main-container">
      <div className="left-panel">
        <DepartmentDetails />
        <SalesChart />
      </div>
      <div className="right-panel">
        <MapFrance />
      </div>
    </div>
  );
};


export default App;
