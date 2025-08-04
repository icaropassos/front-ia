import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import StoryListing from './components/StoryListing';
import StoryDetails from './components/StoryDetails';
import ScenarioDetails from './components/ScenarioDetails';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<StoryListing />} />
          <Route path="/historia/:id" element={<StoryDetails />} />
          <Route path="/historia/:id/cenario/:cenarioIndex" element={<ScenarioDetails />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;