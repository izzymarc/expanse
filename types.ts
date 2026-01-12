
export enum UserRole {
  ADMIN = 'ADMIN',
  CEO = 'CEO',
  ACCOUNTANT = 'ACCOUNTANT',
  STATION_MANAGER = 'STATION_MANAGER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  stationId?: string;
}

export enum FuelType {
  PMS = 'PMS', // Premium Motor Spirit (Petrol)
  AGO = 'AGO', // Automotive Gas Oil (Diesel)
  DPK = 'DPK'  // Dual Purpose Kerosene
}

export interface FuelInventory {
  type: FuelType;
  currentStock: number;
  capacity: number;
  rate: number;
  lowStockThreshold: number;
}

export interface Station {
  id: string;
  name: string;
  location: string;
  inventory: FuelInventory[];
  imageUrl?: string;
  healthScore: number;
}

export interface PaymentBreakdown {
  cash: number;
  pos: number;
  bankTransfer: number;
  creditSales: number;
}

export interface ExpenseBreakdown {
  generatorDiesel: number; // Diesel consumed by the station's own gen
  generatorHours: number;
  gridPowerCost: number;
  securityLevy: number;
  staffAllowances: number;
}

export enum EntryStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface AuditLog {
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
}

export interface DailyEntry {
  id: string;
  date: string;
  stationId: string;
  stationName: string;
  fuelType: FuelType;
  quantitySold: number;
  openingMeter: number;
  closingMeter: number;
  rate: number;
  amount: number;
  payments: PaymentBreakdown;
  expenses: ExpenseBreakdown;
  totalPayments: number;
  totalExpenses: number;
  netAmount: number;
  status: EntryStatus;
  reconciliationDelta: number;
  auditTrail: AuditLog[];
  approverComments?: string;
}

export enum AlertType {
  LOW_STOCK = 'LOW_STOCK',
  MISMATCH = 'MISMATCH',
  UNUSUAL_EXPENSE = 'UNUSUAL_EXPENSE',
  TRUCK_ARRIVAL = 'TRUCK_ARRIVAL'
}

export interface Alert {
  id: string;
  type: AlertType;
  stationId: string;
  stationName: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  timestamp: string;
  resolved: boolean;
}

export interface TruckArrival {
  id: string;
  stationId: string;
  date: string;
  truckPlate: string;
  waybillNumber: string;
  productType: FuelType;
  quantity: number;
  depotSource: string;
}

// Added missing StockPurchase interface
export interface StockPurchase {
  id: string;
  stationId: string;
  stationName: string;
  date: string;
  quantity: number;
  cost: number;
  supplier: string;
}
