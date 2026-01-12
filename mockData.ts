
import { DailyEntry, EntryStatus, UserRole, Alert, AlertType } from './types';
import { INITIAL_STATIONS, FUEL_RATE } from './constants';

const generateRandomData = () => {
  const entries: DailyEntry[] = [];
  const alerts: Alert[] = [];
  const today = new Date();

  INITIAL_STATIONS.forEach((station, sIdx) => {
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const quantitySold = 3000 + Math.random() * 2000;
      const amount = quantitySold * FUEL_RATE;
      
      // Simulate some mismatches for Accountant testing
      const hasMismatch = Math.random() > 0.8;
      const cash = (amount * 0.4) - (hasMismatch ? 5000 : 0);
      const pos = amount * 0.3;
      const transfers = amount * 0.2;
      const noneSales = amount * 0.05;
      const airRtt = amount * 0.05;

      const totalPayments = cash + pos + transfers + noneSales + airRtt;
      
      const expenses = {
        dieselCost: 25000,
        posCharges: totalPayments * 0.01,
        operationalExpenses: 15000
      };
      
      const totalExpenses = expenses.dieselCost + expenses.posCharges + expenses.operationalExpenses;

      entries.push({
        id: `e-${station.id}-${dateStr}`,
        date: dateStr,
        stationId: station.id,
        stationName: station.name,
        quantitySold,
        rate: FUEL_RATE,
        amount,
        payments: { cash, pos, transfers, noneSales, airRtt },
        expenses,
        totalPayments,
        totalExpenses,
        netAmount: totalPayments - totalExpenses,
        status: i === 0 ? EntryStatus.PENDING : EntryStatus.APPROVED,
        reconciliationDelta: amount - totalPayments,
        auditTrail: [
          {
            timestamp: new Date().toISOString(),
            userId: 'u4',
            userName: 'David Manager',
            action: 'CREATED',
            details: 'Initial entry created by station manager'
          }
        ]
      });

      // Low stock alerts
      if (station.currentStock < station.lowStockThreshold) {
        alerts.push({
          id: `a-low-${station.id}`,
          type: AlertType.LOW_STOCK,
          stationId: station.id,
          stationName: station.name,
          message: `Station ${station.name} is below threshold: ${station.currentStock.toLocaleString()}L left.`,
          severity: 'error',
          timestamp: new Date().toISOString(),
          resolved: false
        });
      }

      // Reconciliation alert
      if (hasMismatch) {
        alerts.push({
          id: `a-mis-${station.id}-${dateStr}`,
          type: AlertType.MISMATCH,
          stationId: station.id,
          stationName: station.name,
          message: `Reconciliation mismatch for ${dateStr} at ${station.name}. Delta: ${Math.abs(amount - totalPayments).toLocaleString()}`,
          severity: 'warning',
          timestamp: new Date().toISOString(),
          resolved: false
        });
      }
    }
  });

  return { entries, alerts };
};

export const { entries: SEED_ENTRIES, alerts: SEED_ALERTS } = generateRandomData();
