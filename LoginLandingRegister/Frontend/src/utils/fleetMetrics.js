function safeNum(v, fallback = 0) {
  return (typeof v === 'number' && !Number.isNaN(v)) ? v : fallback;
}

function safeRound(v, decimals = 1) {
  const n = safeNum(v);
  return Math.round(n * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

export function getCurrentMonthLabel() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

const MONTHS = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06'];
const MONTH_LABELS = { '2026-01': 'Jan', '2026-02': 'Feb', '2026-03': 'Mar', '2026-04': 'Apr', '2026-05': 'May', '2026-06': 'Jun' };

export function getMonthLabel(m) {
  return MONTH_LABELS[m] || m;
}

export function getAllMonths() {
  return MONTH_LABELS;
}

export function sumMaintenanceCosts(equipmentList) {
  let total = 0;
  for (const asset of equipmentList) {
    for (const record of (asset.maintenanceHistory || [])) {
      total += safeNum(record.cost);
    }
  }
  return total;
}

export function sumPreventiveCosts(equipmentList) {
  let total = 0;
  for (const asset of equipmentList) {
    for (const record of (asset.maintenanceHistory || [])) {
      if (record.type === 'preventive') total += safeNum(record.cost);
    }
  }
  return total;
}

export function sumCorrectiveCosts(equipmentList) {
  let total = 0;
  for (const asset of equipmentList) {
    for (const record of (asset.maintenanceHistory || [])) {
      if (record.type === 'corrective') total += safeNum(record.cost);
    }
  }
  return total;
}

export function countDowntimeEvents(equipmentList) {
  let count = 0;
  for (const asset of equipmentList) {
    for (const record of (asset.maintenanceHistory || [])) {
      if (record.type === 'corrective') count++;
    }
  }
  return count;
}

export function sumDowntimeHoursFromHistory(equipmentList) {
  let total = 0;
  for (const asset of equipmentList) {
    for (const record of (asset.maintenanceHistory || [])) {
      total += safeNum(record.downtimeHours);
    }
  }
  return total;
}

export function calculateMTTR(equipmentList) {
  let totalDuration = 0;
  let eventCount = 0;
  for (const asset of equipmentList) {
    for (const record of (asset.maintenanceHistory || [])) {
      if (record.type === 'corrective') {
        totalDuration += safeNum(record.durationHours);
        eventCount++;
      }
    }
  }
  if (eventCount === 0) return null;
  return safeRound(totalDuration / eventCount, 1);
}

export function calculateMTTRByAsset(equipmentList) {
  const result = {};
  for (const asset of equipmentList) {
    let totalDuration = 0;
    let eventCount = 0;
    for (const record of (asset.maintenanceHistory || [])) {
      if (record.type === 'corrective') {
        totalDuration += safeNum(record.durationHours);
        eventCount++;
      }
    }
    result[asset.id] = eventCount > 0 ? safeRound(totalDuration / eventCount, 1) : null;
  }
  return result;
}

export function calculateFleetAvailability(equipmentList) {
  if (equipmentList.length === 0) return 0;
  const totalRate = equipmentList.reduce((sum, a) => sum + safeNum(a.availabilityRate, 100), 0);
  return safeRound(totalRate / equipmentList.length, 1);
}

export function calculateMTTRTrend(equipmentList) {
  const monthlyMTTR = {};
  for (const asset of equipmentList) {
    for (const record of (asset.performanceHistory || [])) {
      if (record.mttrHours > 0) {
        monthlyMTTR[record.month] = (monthlyMTTR[record.month] || 0) + record.mttrHours;
      }
    }
  }
  return monthlyMTTR;
}

export function getPerformanceTrend(equipmentList, metric) {
  const monthlyData = {};
  const countMap = {};
  for (const asset of equipmentList) {
    for (const record of (asset.performanceHistory || [])) {
      if (!monthlyData[record.month]) {
        monthlyData[record.month] = 0;
        countMap[record.month] = 0;
      }
      monthlyData[record.month] += safeNum(record[metric]);
      countMap[record.month]++;
    }
  }
  const result = [];
  for (const m of MONTHS) {
    if (monthlyData[m] !== undefined && countMap[m] > 0) {
      const val = metric === 'availabilityRate'
        ? safeRound(monthlyData[m] / countMap[m], 1)
        : safeRound(monthlyData[m], 1);
      result.push({ month: m, label: MONTH_LABELS[m], value: val });
    }
  }
  return result;
}

export function getDowntimeByEquipment(equipmentList) {
  return equipmentList.map(a => ({
    id: a.id,
    name: a.name,
    status: a.status,
    downtimeHours: safeNum(a.downtimeMTD),
    unplannedDowntime: safeNum(a.unplannedDowntimeMTD),
  })).sort((a, b) => b.downtimeHours - a.downtimeHours);
}

export function getMaintenanceCostByEquipment(equipmentList) {
  return equipmentList.map(a => {
    let preventive = 0;
    let corrective = 0;
    for (const r of (a.maintenanceHistory || [])) {
      if (r.type === 'preventive') preventive += safeNum(r.cost);
      else if (r.type === 'corrective') corrective += safeNum(r.cost);
    }
    return { id: a.id, name: a.name, status: a.status, preventive, corrective, total: preventive + corrective };
  });
}

export function getTopRiskAssets(equipmentList) {
  return [...equipmentList]
    .sort((a, b) => safeNum(b.failureRisk) - safeNum(a.failureRisk))
    .map(a => ({
      id: a.id,
      name: a.name,
      type: a.type,
      status: a.status,
      healthScore: safeNum(a.healthScore),
      failureRisk: safeNum(a.failureRisk),
      predictedIssue: a.predictedIssue || 'None',
      predictedDowntimeHours: safeNum(a.predictedDowntimeHours),
      predictedFinancialLoss: safeNum(a.predictedFinancialLoss),
      recommendedAction: a.recommendedActionShort || 'Routine monitoring',
    }));
}

export function compareToPreviousPeriod(equipmentList, metric) {
  const latestMonth = MONTHS[MONTHS.length - 1];
  const prevMonth = MONTHS[MONTHS.length - 2];
  let currentTotal = 0;
  let prevTotal = 0;
  let currentCount = 0;
  let prevCount = 0;
  for (const asset of equipmentList) {
    for (const record of (asset.performanceHistory || [])) {
      if (record.month === latestMonth) {
        currentTotal += safeNum(record[metric]);
        currentCount++;
      }
      if (record.month === prevMonth) {
        prevTotal += safeNum(record[metric]);
        prevCount++;
      }
    }
  }
  const currentVal = currentCount > 0 ? currentTotal / currentCount : 0;
  const prevVal = prevCount > 0 ? prevTotal / prevCount : 0;
  return { current: safeRound(currentVal, 1), previous: safeRound(prevVal, 1), change: prevVal > 0 ? safeRound(((currentVal - prevVal) / prevVal) * 100, 1) : 0 };
}

export function getTotalDowntimeMTD(equipmentList) {
  return equipmentList.reduce((sum, a) => sum + safeNum(a.downtimeMTD), 0);
}

export function getTotalUnplannedDowntimeEvents(equipmentList) {
  return equipmentList.reduce((sum, a) => sum + safeNum(a.unplannedDowntimeMTD), 0);
}

export function getMaintenanceCostComparison(equipmentList) {
  return compareToPreviousPeriod(equipmentList, 'maintenanceCost');
}

export function getTotalMaintenanceCost(equipmentList) {
  let total = 0;
  for (const asset of equipmentList) {
    for (const record of (asset.performanceHistory || [])) {
      total += safeNum(record.maintenanceCost);
    }
  }
  return total;
}

export function generateInsights(equipmentList) {
  const insights = [];
  const topRisk = getTopRiskAssets(equipmentList);

  if (topRisk.length > 0 && topRisk[0].failureRisk > 70) {
    insights.push(`${topRisk[0].id} (${topRisk[0].name}) has the highest failure risk at ${topRisk[0].failureRisk}% and should be prioritised for immediate maintenance.`);
  }

  const downtimeByEq = getDowntimeByEquipment(equipmentList);
  if (downtimeByEq.length > 0 && downtimeByEq[0].downtimeHours > 0) {
    insights.push(`${downtimeByEq[0].id} contributes the highest downtime exposure in the fleet at ${downtimeByEq[0].downtimeHours} hours.`);
  }

  const costs = getMaintenanceCostByEquipment(equipmentList);
  const highCorrective = costs.filter(c => c.corrective > c.preventive && c.total > 0);
  for (const c of highCorrective) {
    insights.push(`Corrective maintenance spending (RM ${c.corrective.toLocaleString()}) exceeds preventive spending (RM ${c.preventive.toLocaleString()}) for ${c.id}.`);
  }

  const avail = calculateFleetAvailability(equipmentList);
  const totalDown = getTotalDowntimeMTD(equipmentList);
  const concAsset = downtimeByEq.filter(d => d.downtimeHours > 0);
  if (concAsset.length >= 2) {
    insights.push(`Fleet availability is currently ${avail}%, but ${totalDown} hours of downtime is concentrated in ${concAsset.length} assets.`);
  }

  const criticalCount = equipmentList.filter(a => a.status === 'critical').length;
  if (criticalCount > 0) {
    insights.push(`${criticalCount} asset(s) in critical condition require immediate management attention to prevent unplanned stoppages.`);
  }

  const mttr = calculateMTTR(equipmentList);
  if (mttr !== null) {
    insights.push(`Fleet-wide MTTR is ${mttr} hours — ${mttr > 4 ? 'response times need improvement to reduce downtime impact.' : 'repair response is within acceptable benchmarks.'}`);
  }

  return insights.slice(0, 5);
}
