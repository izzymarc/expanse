
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User, UserRole, Station, DailyEntry, Alert } from './types';
import { INITIAL_USERS, INITIAL_STATIONS } from './constants';
import { SEED_ENTRIES, SEED_ALERTS } from './mockData';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DailyEntryPage from './pages/DailyEntry';
import Approvals from './pages/Approvals';
import StationsPage from './pages/Stations';
import ReportsPage from './pages/Reports';
import LoginPage from './pages/Login';
import AuditLogs from './pages/AuditLogs';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('expanse_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [stations, setStations] = useState<Station[]>(() => {
    const saved = localStorage.getItem('expanse_stations');
    return saved ? JSON.parse(saved) : INITIAL_STATIONS;
  });

  const [entries, setEntries] = useState<DailyEntry[]>(() => {
    const saved = localStorage.getItem('expanse_entries');
    return saved ? JSON.parse(saved) : SEED_ENTRIES;
  });

  const [alerts, setAlerts] = useState<Alert[]>(() => {
    const saved = localStorage.getItem('expanse_alerts');
    return saved ? JSON.parse(saved) : SEED_ALERTS;
  });

  // Persist state
  useEffect(() => {
    localStorage.setItem('expanse_stations', JSON.stringify(stations));
    localStorage.setItem('expanse_entries', JSON.stringify(entries));
    localStorage.setItem('expanse_alerts', JSON.stringify(alerts));
    if (user) localStorage.setItem('expanse_user', JSON.stringify(user));
    else localStorage.removeItem('expanse_user');
  }, [stations, entries, alerts, user]);

  const handleLogin = (email: string) => {
    const foundUser = INITIAL_USERS.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  const updateEntry = (updated: DailyEntry) => {
    setEntries(prev => prev.map(e => e.id === updated.id ? updated : e));
  };

  const addEntry = (newEntry: DailyEntry) => {
    setEntries(prev => [newEntry, ...prev]);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <Layout user={user} alerts={alerts} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard user={user} entries={entries} stations={stations} alerts={alerts} />} />
          <Route path="/entry" element={<DailyEntryPage user={user} stations={stations} onAddEntry={addEntry} existingEntries={entries} />} />
          <Route path="/approvals" element={<Approvals user={user} entries={entries} onUpdateEntry={updateEntry} />} />
          <Route path="/stations" element={<StationsPage user={user} stations={stations} setStations={setStations} />} />
          <Route path="/reports" element={<ReportsPage entries={entries} stations={stations} />} />
          <Route path="/audit" element={<AuditLogs entries={entries} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
