
import React from 'react';
import { User, Station, UserRole } from './types';

export const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'John Admin', email: 'admin@expanse.com', role: UserRole.ADMIN },
  { id: 'u2', name: 'Sarah CEO', email: 'ceo@expanse.com', role: UserRole.CEO },
  { id: 'u3', name: 'Mark Accountant', email: 'mark@expanse.com', role: UserRole.ACCOUNTANT },
  { id: 'u4', name: 'David Manager', email: 'david@expanse.com', role: UserRole.STATION_MANAGER, stationId: 's1' },
  { id: 'u5', name: 'Alice Manager', email: 'alice@expanse.com', role: UserRole.STATION_MANAGER, stationId: 's2' },
];

export const INITIAL_STATIONS: Station[] = [
  { id: 's1', name: 'Expanse Station - Lagos', location: 'Lekki Phase 1', currentStock: 45000, capacity: 60000, lowStockThreshold: 10000 },
  { id: 's2', name: 'Expanse Station - Abuja', location: 'Maitama District', currentStock: 12000, capacity: 50000, lowStockThreshold: 10000 },
  { id: 's3', name: 'Expanse Station - Port Harcourt', location: 'GRA Phase 2', currentStock: 8000, capacity: 50000, lowStockThreshold: 10000 },
];

export const FUEL_RATE = 650; // Constant rate for simulation
