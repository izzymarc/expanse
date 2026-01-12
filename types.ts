
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
  stationId?: string; // Only for Station Managers
}

export interface Station {
  id: string;
  name: string;
  location: string;
  currentStock: number;
  capacity: number;
  lowStockThreshold: number;
}

export interface PaymentBreakdown {
  cash: number;
  pos: number;
  transfers: number;
  noneSales: number;
  airRtt: number;
}

export interface ExpenseBreakdown {
  dieselCost: number;
  posCharges: number;
  operationalExpenses: number;
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
  quantitySold: number;
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
  UNUSUAL_TRANSACTION = 'UNUSUAL_TRANSACTION'
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

export interface StockPurchase {
  id: string;
  stationId: string;
  date: string;
  quantity: number;
  supplier: string;
}
