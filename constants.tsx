
import { User, Station, UserRole, FuelType } from './types';

// Exported FUEL_RATE to resolve import errors in mockData.ts
export const FUEL_RATE = 650;

export const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Alhaji Musa', email: 'admin@expanse.com', role: UserRole.ADMIN },
  { id: 'u2', name: 'Sarah Okoro', email: 'ceo@expanse.com', role: UserRole.CEO },
  { id: 'u3', name: 'Chidi Finance', email: 'mark@expanse.com', role: UserRole.ACCOUNTANT },
  { id: 'u4', name: 'Tunde Lekki', email: 'david@expanse.com', role: UserRole.STATION_MANAGER, stationId: 's1' },
];

export const INITIAL_STATIONS: Station[] = [
  { 
    id: 's1', 
    name: 'Expanse Mega - Lekki Epe', 
    location: 'Lekki Expressway, Lagos', 
    healthScore: 94,
    inventory: [
      { type: FuelType.PMS, currentStock: 45000, capacity: 60000, rate: 650, lowStockThreshold: 10000 },
      { type: FuelType.AGO, currentStock: 12000, capacity: 30000, rate: 1150, lowStockThreshold: 5000 }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1563906267088-b029e7101114?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: 's2', 
    name: 'Expanse Hub - Maitama', 
    location: 'Gana Street, Abuja', 
    healthScore: 88,
    inventory: [
      { type: FuelType.PMS, currentStock: 15000, capacity: 50000, rate: 680, lowStockThreshold: 10000 },
      { type: FuelType.AGO, currentStock: 5000, capacity: 20000, rate: 1200, lowStockThreshold: 3000 }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?q=80&w=800&auto=format&fit=crop'
  }
];
