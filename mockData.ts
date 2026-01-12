
import { DailyEntry, EntryStatus, Alert, AlertType, FuelType, PaymentBreakdown, ExpenseBreakdown } from './types';
import { INITIAL_STATIONS, FUEL_RATE } from './constants';

const generateRandomData = () => {
  const entries: DailyEntry[] = [];
  const alerts: Alert[] = [];
  const today = new Date();

  INITIAL_STATIONS.forEach((station) => {
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const quantitySold = 3000 + Math.random() * 2000;
      const amount = quantitySold * FUEL_RATE;
      
      // Simulate some mismatches for Accountant testing
      const hasMismatch = Math.random() > 0.8;
      
      // Fixed PaymentBreakdown to match types.ts
      const payments: PaymentBreakdown = {
        cash: (amount * 0.4) - (hasMismatch ? 5000 : 0),
        pos: amount * 0.3,
        bankTransfer: amount * 0.2,
        creditSales: amount * 0.1
      };

      const totalPayments = Object.values(payments).reduce((acc, val) => acc + val, 0);
      
      // Fixed ExpenseBreakdown to match types.ts
      const expenses: ExpenseBreakdown = {
        generatorDiesel: 25000,
        generatorHours: 5,
        gridPowerCost: totalPayments * 0.01,
        securityLevy: 5000,
        staffAllowances: 10000
      };
      
      const totalExpenses = Object.values(expenses).reduce((acc, val) => acc + val, 0);

      entries.push({
        id: `e-${station.id}-${dateStr}`,
        date: dateStr,
        stationId: station.id,
        stationName: station.name,
        fuelType: FuelType.PMS,
        quantitySold,
        openingMeter: 100000,
        closingMeter: 100000 + quantitySold,
        rate: FUEL_RATE,
        amount,
        payments,
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

      // Fixed low stock alerts by accessing station inventory
      station.inventory.forEach(inv => {
        if (inv.currentStock < inv.lowStockThreshold) {
          alerts.push({
            id: `a-low-${station.id}-${inv.type}`,
            type: AlertType.LOW_STOCK,
            stationId: station.id,
            stationName: station.name,
            message: `Station ${station.name} is below threshold: ${inv.currentStock.toLocaleString()}L left of ${inv.type}.`,
            severity: 'error',
            timestamp: new Date().toISOString(),
            resolved: false
          });
        }
      });

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
