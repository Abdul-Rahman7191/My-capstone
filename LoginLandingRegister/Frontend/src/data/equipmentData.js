export const equipmentList = [
  {
    id: 'EX-203',
    name: 'Excavator Heavy',
    type: 'Hydraulic Excavator',
    category: 'Heavy Duty',
    status: 'critical',
    location: 'Kuching Quarry Sector 4',
    fleet: 'Primary Extraction Fleet',
    healthScore: 42,
    failureRisk: 91,
    confidenceScore: 87,
    failureWindow: '48-72 hours',
    model: 'CAT 320D3 L',
    serialNumber: 'S/N: CAT0320D3HX8842A',
    currentOperator: 'R. Vance',
    utilizationRate: 84,
    availabilityRate: 92,
    operatingHours: 9452,
    lastMaintenanceDate: '2026-05-10',
    nextScheduledMaintenanceDate: '2026-07-25',
    predictedIssue: 'Hydraulic seal degradation (High impact)',
    recommendedActionShort: 'Seal replacement & hydraulic flush',
    predictedDowntimeHours: 18,
    maintenanceUrgency: 'immediate',

    fuelLevel: 58,
    unplannedDowntimeMTD: 16,
    downtimeMTD: 22,
    lastDowntimeDate: '2026-05-10',
    availabilityTrend: '-2.4%',
    fleetComparison: {
      efficiency: '+8% vs Avg',
      cost: '+12% vs Avg',
      utilizationTrend: '+6% vs Fleet'
    },
    usageBreakdown: {
      active: 65,
      idle: 15,
      maintenance: 20
    },

    assetInfo: {
      acquisition: { purchaseYear: 2021, purchaseCost: 1200000 },
      lifecycle: { ageYears: 5, remainingUsefulLifeYears: 4.2, currentValue: 720000, replacementValue: 1350000 },
      maintenance: { totalRepairs: 14, maintenanceSpendToDate: 340000 },
      repairDecision: { estimatedRepairCost: 14500, berThresholdPercent: 45, recommendation: 'repair' },
      downtimeEconomics: { downtimeCostPerHour: 4777.78, estimatedDowntimeAvoidedHours: 18 },
      decisionRationale: { recommendationReason: 'The current repair estimate is compared directly with the BER threshold calculated from the asset purchase cost. Completing the repair also protects planned quarry output.' },
    },
    aiAnalysis: {
      rootCauseAnalysis: 'Telemetry data suggests abnormal hydraulic pressure fluctuations and elevated vibration activity near the primary lift cylinder.',
      primaryTrigger: {
        label: 'Fluid Temperature Increase (+14°C)',
        description: 'Persistent temperature elevation was observed during high-load excavation cycles between 14:00 and 17:00.'
      },
      secondaryEffect: {
        label: 'Acoustic and Vibration Anomaly',
        description: 'High-frequency vibration readings show a pattern that may be consistent with early-stage fluid seal bypassing.'
      },
      operationalImpact: {
        risk: {
          label: 'Elevated Risk of Unplanned Stoppage',
          description: 'Continued operation without inspection may increase the likelihood of unplanned maintenance.'
        },
        slaImpact: {
          label: 'Sector 4 Output Constraint',
          description: 'Loss of this unit forces downstream reliance on reserve excavation units.'
        },
        resolutionWindow: {
          label: 'Within 48 Operational Hours',
          description: 'Addressing the seal now may reduce the likelihood of further hydraulic system wear.'
        }
      },
      recommendedActionSOP: 'Immediate seal kit replacement required for primary lift cylinder, accompanied by high-pressure filtration flush.',
      topPredictionFactors: [
        { factor: 'Hydraulic Pressure Variance', impact: 42, trend: 'increasing' },
        { factor: 'Vibration (Axis Z / Cylinder)', impact: 28, trend: 'increasing' },
        { factor: 'Operating Hours since PM', impact: 15, trend: 'stable' }
      ],
      recurringFailurePatterns: [
        {
          date: '2026-07-12',
          event: 'Hydraulic Pressure Instability Detected',
          notes: 'Active anomaly matching standard R-992 seal degradation profile.',
          relevance: 'High Anomaly'
        },
        {
          date: '2026-03-05',
          event: 'Similar micro-cavitation flagged on sister unit EX-198',
          notes: 'Resolved via emergency seal replacement.',
          relevance: 'Historical Case'
        },
        {
          date: '2025-08-11',
          event: 'Baseline Profile Established',
          notes: 'Initial signature map completed during general scheduled overhaul.',
          relevance: 'Baseline Calibration'
        }
      ],
      sensorCorrelationInsights: [
        {
          sensors: 'Lift Cylinder Temperature vs. Return Line Pressure',
          correlation: 0.89,
          insight: 'When temperature exceeds 90°C, return pressure decreases by approximately 8%, which may indicate seal bypass.'
        },
        {
          sensors: 'Chassis Vibration (Z-Axis) vs. Pump Duty Cycle',
          correlation: 0.76,
          insight: 'Micro-vibration levels increase during pump loads above 80%, suggesting possible fluid cavitation.'
        }
      ]
    },
    maintenanceHistory: [
      {
        id: 'WO-1092',
        date: '2026-05-10',
        type: 'preventive',
        description: 'Scheduled 9,000-Hour Preventive Maintenance Overhaul',
        technician: 'K. Salleh (Senior Hydraulic Tech)',
        durationHours: 6.5,
        downtimeHours: 8.0,
        cost: 18500,
        partsReplaced: ['Engine Oil Filter', 'Hydraulic Fluid Filter', 'Fuel Injector Nozzles'],
        notes: 'General fluid analysis indicated normal wear profiles.'
      },
      {
        id: 'WO-0941',
        date: '2026-01-18',
        type: 'corrective',
        description: 'Primary Hydraulic Hose Replacement & Coupling Retorque',
        technician: 'A. Rahim',
        durationHours: 3.0,
        downtimeHours: 4.5,
        cost: 6200,
        partsReplaced: ['High-Pressure Hydraulic Hose (H4)', 'Split Flange Clamps'],
        notes: 'Addressed minor pressure weeping near the main valve block.'
      },
      {
        id: 'WO-0733',
        date: '2025-09-05',
        type: 'corrective',
        description: 'Mid-Year Comprehensive Telemetry Calibration & Diagnostic Audit',
        technician: 'M. Hafiz',
        durationHours: 2.0,
        downtimeHours: 2.0,
        cost: 1500,
        partsReplaced: ['Z-Axis Vibration Sensor Probe'],
        notes: 'Recalibrated telemetry transmitter. Installed updated firmware patch v3.4.1.'
      }
    ],
    performanceHistory: [
      { month: '2026-01', availabilityRate: 95, downtimeHours: 5, downtimeEvents: 1, mttrHours: 3.0, maintenanceCost: 6200 },
      { month: '2026-02', availabilityRate: 94, downtimeHours: 6, downtimeEvents: 1, mttrHours: 3.5, maintenanceCost: 1500 },
      { month: '2026-03', availabilityRate: 93, downtimeHours: 8, downtimeEvents: 2, mttrHours: 3.0, maintenanceCost: 8200 },
      { month: '2026-04', availabilityRate: 93, downtimeHours: 7, downtimeEvents: 1, mttrHours: 4.0, maintenanceCost: 3500 },
      { month: '2026-05', availabilityRate: 92, downtimeHours: 8, downtimeEvents: 2, mttrHours: 2.5, maintenanceCost: 18500 },
      { month: '2026-06', availabilityRate: 92, downtimeHours: 10, downtimeEvents: 2, mttrHours: 3.0, maintenanceCost: 4500 }
    ],
    telemetry: [
      {
        name: 'Hydraulic Pressure',
        currentValue: 1180,
        unit: 'PSI',
        status: 'below-normal',
        baseline: 1350,
        sensorStatus: 'Poor',
        history24h: [
          { time: '24h ago', value: 1345 },
          { time: '18h ago', value: 1330 },
          { time: '12h ago', value: 1290 },
          { time: '6h ago', value: 1220 },
          { time: 'Now', value: 1180 }
        ]
      },
      {
        name: 'Operating Temperature',
        currentValue: 94,
        unit: '°C',
        status: 'elevated',
        baseline: 80,
        sensorStatus: 'Moderate',
        history24h: [
          { time: '24h ago', value: 79 },
          { time: '18h ago', value: 81 },
          { time: '12h ago', value: 85 },
          { time: '6h ago', value: 91 },
          { time: 'Now', value: 94 }
        ]
      },
      {
        name: 'Z-Axis Cylinder Vibration',
        currentValue: 2.8,
        unit: 'g RMS',
        status: 'elevated',
        baseline: 1.2,
        sensorStatus: 'Moderate',
        history24h: [
          { time: '24h ago', value: 1.1 },
          { time: '18h ago', value: 1.3 },
          { time: '12h ago', value: 1.7 },
          { time: '6h ago', value: 2.4 },
          { time: 'Now', value: 2.8 }
        ]
      },
      {
        name: 'Oil Quality / Insolubles',
        currentValue: 14,
        unit: 'ppm',
        status: 'normal',
        baseline: 10,
        sensorStatus: 'Healthy',
        history24h: [
          { time: '24h ago', value: 11 },
          { time: '18h ago', value: 12 },
          { time: '12h ago', value: 12 },
          { time: '6h ago', value: 13 },
          { time: 'Now', value: 14 }
        ]
      },
      {
        name: 'Total Engine Hours',
        currentValue: 9452,
        unit: 'hrs',
        status: 'normal',
        baseline: 0,
        sensorStatus: 'Healthy',
        history24h: [
          { time: '24h ago', value: 9428 },
          { time: '18h ago', value: 9434 },
          { time: '12h ago', value: 9440 },
          { time: '6h ago', value: 9446 },
          { time: 'Now', value: 9452 }
        ]
      }
    ]
  },
  {
    id: 'DT-845',
    name: 'Dump Truck 50T',
    type: 'Off-Highway Hauler',
    category: 'Heavy Duty',
    status: 'warning',
    location: 'Kuching Quarry Sector 2',
    fleet: 'Secondary Transport Fleet',
    healthScore: 74,
    failureRisk: 48,
    confidenceScore: 79,
    failureWindow: '7-10 days',
    model: 'CAT 773E',
    serialNumber: 'S/N: CAT0773EHT5519B',
    currentOperator: 'Ahmad Syah',
    utilizationRate: 78,
    availabilityRate: 89,
    operatingHours: 12840,
    lastMaintenanceDate: '2026-05-20',
    nextScheduledMaintenanceDate: '2026-07-18',
    predictedIssue: 'Transmission fluid shear (Medium impact)',
    recommendedActionShort: 'Transmission flush & filter replacement',
    predictedDowntimeHours: 12,
    maintenanceUrgency: 'medium',

    fuelLevel: 45,
    unplannedDowntimeMTD: 10,
    downtimeMTD: 15,
    lastDowntimeDate: '2026-05-20',
    availabilityTrend: '+1.5%',
    fleetComparison: {
      efficiency: '-2% vs Avg',
      cost: '+5% vs Avg',
      utilizationTrend: '-3% vs Fleet'
    },
    usageBreakdown: {
      active: 55,
      idle: 30,
      maintenance: 15
    },

    assetInfo: {
      acquisition: { purchaseYear: 2018, purchaseCost: 850000 },
      lifecycle: { ageYears: 8, remainingUsefulLifeYears: 1.5, currentValue: 250000, replacementValue: 980000 },
      maintenance: { totalRepairs: 22, maintenanceSpendToDate: 480000 },
      repairDecision: { estimatedRepairCost: 12000, berThresholdPercent: 45, recommendation: 'repair' },
      downtimeEconomics: { downtimeCostPerHour: 3500, estimatedDowntimeAvoidedHours: 12 },
      decisionRationale: { recommendationReason: 'The transmission repair estimate remains below the BER threshold, while the asset has a short remaining useful life and should be budgeted for planned replacement after current quarry milestones.' },
      purchaseYear: 2018,
      age: 8,
      purchaseCost: 850000,
      lifetimeMaintenanceCost: 480000,
      downtimeCost: 240000,
      currentValue: 250000,
      replacementValue: 980000,
      remainingUsefulLifeYears: 1.5,
      totalRepairs: 22,
      berScore: 56,
      berRecommendation: 'repair',
      aiRecommendationReason: 'Asset is approaching its standard economic life (8 years, BER index 56%). However, completing the current transmission PM is strongly recommended.',
      estimatedDowntimeAvoidedHours: 12,
      estimatedSavings: 42000
    },
    aiAnalysis: {
      rootCauseAnalysis: 'Slight slip detection in the third gear torque converter clutch coupled with rising transmission oil temperature.',
      primaryTrigger: {
        label: 'Fluid Viscosity Drop (-18%)',
        description: 'Progressive fluid shear under high-torque climbing climbs under full 50-tonne payload conditions.'
      },
      secondaryEffect: {
        label: 'Torque Converter Clutch Slippage',
        description: 'Micro-slippage detected (0.4% above tolerance), leading to incremental friction plate wear.'
      },
      operationalImpact: {
        risk: {
          label: 'Moderate Risk of Performance Degradation',
          description: 'Continued high-payload hauling may accelerate clutch wear before the next scheduled service.'
        },
        slaImpact: {
          label: 'Sector 2 Haul Cycle Slowdown',
          description: 'Worsening slippage may reduce effective haul capacity.'
        },
        resolutionWindow: {
          label: 'Within 7-10 Operational Days',
          description: 'Aligns with the next scheduled transmission service window.'
        }
      },
      recommendedActionSOP: 'Drain transmission fluid, replace internal filter element, inspect magnetic sump plug for metallic shavings, refill with CAT TO-4 spec oil.',
      topPredictionFactors: [
        { factor: 'Transmission Temperature', impact: 38, trend: 'increasing' },
        { factor: 'Clutch Slip Rate', impact: 30, trend: 'increasing' },
        { factor: 'Fluid Operating Age', impact: 22, trend: 'stable' }
      ],
      recurringFailurePatterns: [
        {
          date: '2026-07-10',
          event: 'Viscosity Degradation Alert',
          notes: 'Diagnostic trend matches thermal degradation baseline.',
          relevance: 'Active Trend'
        },
        {
          date: '2024-11-12',
          event: 'Similar clutch slip resolved via fluid service',
          notes: 'Fluid flush restored transmission lock-up torque fully.',
          relevance: 'Historical Precedent'
        }
      ],
      sensorCorrelationInsights: [
        {
          sensors: 'Transmission Sump Temp vs. Lockup Solenoid Current',
          correlation: 0.81,
          insight: 'When oil temp hits 98°C, solenoid current increases by 12% to sustain engagement.'
        }
      ]
    },
    maintenanceHistory: [
      {
        id: 'WO-0985',
        date: '2026-05-20',
        type: 'preventive',
        description: 'Scheduled General Powertrain and Brake Inspection',
        technician: 'F. Rahman',
        durationHours: 4.0,
        downtimeHours: 6.0,
        cost: 9500,
        partsReplaced: ['Brake Caliper Seals', 'Air Cleaners', 'Transmission Breather Cap'],
        notes: 'Inspected brake wear profiles, normal for hauling service.'
      },
      {
        id: 'WO-0810',
        date: '2025-12-04',
        type: 'corrective',
        description: 'Wheel Hub Seal Repair & Hub Overhaul',
        technician: 'A. Rahim',
        durationHours: 5.5,
        downtimeHours: 8.0,
        cost: 14200,
        partsReplaced: ['Rear Right Wheel Hub Seal', 'Duo-Cone Seal Assembly'],
        notes: 'Addressed visual gear oil leak on rear hub.'
      },
      {
        id: 'WO-0892',
        date: '2025-08-15',
        type: 'corrective',
        description: 'Transmission Cooler Line Replacement',
        technician: 'K. Salleh',
        durationHours: 2.0,
        downtimeHours: 3.0,
        cost: 3800,
        partsReplaced: ['Transmission Cooler Return Line', 'O-Ring Kit'],
        notes: 'Minor leak at cooler line coupling.'
      }
    ],
    performanceHistory: [
      { month: '2026-01', availabilityRate: 91, downtimeHours: 8, downtimeEvents: 2, mttrHours: 4.0, maintenanceCost: 5200 },
      { month: '2026-02', availabilityRate: 90, downtimeHours: 9, downtimeEvents: 2, mttrHours: 4.5, maintenanceCost: 3800 },
      { month: '2026-03', availabilityRate: 90, downtimeHours: 7, downtimeEvents: 1, mttrHours: 5.0, maintenanceCost: 6100 },
      { month: '2026-04', availabilityRate: 89, downtimeHours: 10, downtimeEvents: 2, mttrHours: 3.5, maintenanceCost: 4800 },
      { month: '2026-05', availabilityRate: 89, downtimeHours: 6, downtimeEvents: 1, mttrHours: 4.0, maintenanceCost: 9500 },
      { month: '2026-06', availabilityRate: 88, downtimeHours: 8, downtimeEvents: 2, mttrHours: 4.5, maintenanceCost: 7200 }
    ],
    telemetry: [
      {
        name: 'Transmission Temp',
        currentValue: 92,
        unit: '°C',
        status: 'elevated',
        baseline: 82,
        sensorStatus: 'Moderate',
        history24h: [
          { time: '24h ago', value: 81 },
          { time: '18h ago', value: 83 },
          { time: '12h ago', value: 86 },
          { time: '6h ago', value: 90 },
          { time: 'Now', value: 92 }
        ]
      },
      {
        name: 'Clutch Slip Rate',
        currentValue: 1.2,
        unit: '%',
        status: 'elevated',
        baseline: 0.5,
        sensorStatus: 'Moderate',
        history24h: [
          { time: '24h ago', value: 0.5 },
          { time: '18h ago', value: 0.6 },
          { time: '12h ago', value: 0.8 },
          { time: '6h ago', value: 1.0 },
          { time: 'Now', value: 1.2 }
        ]
      },
      {
        name: 'Engine Oil Pressure',
        currentValue: 62,
        unit: 'PSI',
        status: 'normal',
        baseline: 65,
        sensorStatus: 'Healthy',
        history24h: [
          { time: '24h ago', value: 65 },
          { time: '18h ago', value: 64 },
          { time: '12h ago', value: 63 },
          { time: '6h ago', value: 62 },
          { time: 'Now', value: 62 }
        ]
      },
      {
        name: 'Coolant Temperature',
        currentValue: 85,
        unit: '°C',
        status: 'normal',
        baseline: 83,
        sensorStatus: 'Healthy',
        history24h: [
          { time: '24h ago', value: 82 },
          { time: '18h ago', value: 83 },
          { time: '12h ago', value: 84 },
          { time: '6h ago', value: 84 },
          { time: 'Now', value: 85 }
        ]
      }
    ]
  },
  {
    id: 'CL-102',
    name: 'Wheel Loader Medium',
    type: 'Articulated Loader',
    category: 'Standard Fleet',
    status: 'normal',
    location: 'Kuching Quarry Sector 1',
    fleet: 'Stockpile & Loading Fleet',
    healthScore: 95,
    failureRisk: 5,
    confidenceScore: 94,
    failureWindow: 'N/A (Nominal)',
    model: 'CAT 950GC',
    serialNumber: 'S/N: CAT0950GCHD4821C',
    currentOperator: 'Marcus Lim',
    utilizationRate: 88,
    availabilityRate: 97,
    operatingHours: 3120,
    lastMaintenanceDate: '2026-06-28',
    nextScheduledMaintenanceDate: '2026-08-10',
    predictedIssue: 'None Detected',
    recommendedActionShort: 'Routine inspections per scheduled interval',
    predictedDowntimeHours: 0,
    maintenanceUrgency: 'low',

    fuelLevel: 82,
    unplannedDowntimeMTD: 2,
    downtimeMTD: 4,
    lastDowntimeDate: '2026-06-28',
    availabilityTrend: '+5.8%',
    fleetComparison: {
      efficiency: '+15% vs Avg',
      cost: '-12% vs Avg',
      utilizationTrend: '+10% vs Fleet'
    },
    usageBreakdown: {
      active: 75,
      idle: 15,
      maintenance: 10
    },

    assetInfo: {
      acquisition: { purchaseYear: 2024, purchaseCost: 650000 },
      lifecycle: { ageYears: 2, remainingUsefulLifeYears: 8.5, currentValue: 540000, replacementValue: 700000 },
      maintenance: { totalRepairs: 2, maintenanceSpendToDate: 45000 },
      repairDecision: { estimatedRepairCost: 0, berThresholdPercent: 45, recommendation: 'repair' },
      downtimeEconomics: { downtimeCostPerHour: 2000, estimatedDowntimeAvoidedHours: 0 },
      decisionRationale: { recommendationReason: 'Asset is highly productive, in near-new condition, and has exceptionally low cumulative wear metrics. No corrective actions are predicted. Standard operations are optimized by following normal preventive maintenance timelines.' },
      purchaseYear: 2024,
      age: 2,
      purchaseCost: 650000,
      lifetimeMaintenanceCost: 45000,
      downtimeCost: 20000,
      currentValue: 540000,
      replacementValue: 700000,
      remainingUsefulLifeYears: 8.5,
      totalRepairs: 2,
      berScore: 7,
      berRecommendation: 'repair',
      aiRecommendationReason: 'Asset is highly productive, in near-new condition, and has exceptionally low cumulative wear metrics.',
      estimatedDowntimeAvoidedHours: 0,
      estimatedSavings: 0
    },
    aiAnalysis: {
      rootCauseAnalysis: 'All sensor arrays and mechanical systems are operating within nominal baseline parameters.',
      primaryTrigger: {
        label: 'None',
        description: 'Systems within safe envelope.'
      },
      secondaryEffect: {
        label: 'None',
        description: 'No anomalous thermal or physical gradients recorded.'
      },
      operationalImpact: {
        risk: {
          label: 'No Elevated Risk Identified',
          description: 'Equipment is operating within normal parameters.'
        },
        slaImpact: {
          label: 'No Fleet Impact',
          description: 'Asset is fully available and is not constraining downstream operations.'
        },
        resolutionWindow: {
          label: 'Routine Monitoring Only',
          description: 'No accelerated resolution window required.'
        }
      },
      recommendedActionSOP: 'Follow the baseline Caterpillar factory service handbook for 3,000-hour general inspection.',
      topPredictionFactors: [
        { factor: 'Overall System Stability', impact: 95, trend: 'stable' },
        { factor: 'Operational Hours Balance', impact: 3, trend: 'stable' }
      ],
      recurringFailurePatterns: [
        {
          date: '2026-06-28',
          event: 'Standard 3,000-Hour PM Performed',
          notes: 'Completed successfully. Full synthetic engine oil upgrade added.',
          relevance: 'Baseline'
        }
      ],
      sensorCorrelationInsights: [
        {
          sensors: 'Loader Linkage Stress vs. Engine Torque',
          correlation: 0.94,
          insight: 'Stress vectors perfectly scale with torque load, demonstrating zero joint slop or mechanical fatigue.'
        }
      ]
    },
    maintenanceHistory: [
      {
        id: 'WO-1051',
        date: '2026-06-28',
        type: 'preventive',
        description: 'Scheduled 3,000-Hour Fluid and Linkage PM',
        technician: 'F. Rahman',
        durationHours: 3.0,
        downtimeHours: 3.0,
        cost: 4200,
        partsReplaced: ['Engine Lubricating Oil', 'Lube Filters', 'Cabin Air Pre-filter'],
        notes: 'Replaced oil. Greased boom linkages.'
      }
    ],
    performanceHistory: [
      { month: '2026-01', availabilityRate: 96, downtimeHours: 2, downtimeEvents: 0, mttrHours: 0, maintenanceCost: 3200 },
      { month: '2026-02', availabilityRate: 96, downtimeHours: 2, downtimeEvents: 0, mttrHours: 0, maintenanceCost: 2800 },
      { month: '2026-03', availabilityRate: 97, downtimeHours: 1, downtimeEvents: 0, mttrHours: 0, maintenanceCost: 3500 },
      { month: '2026-04', availabilityRate: 97, downtimeHours: 1, downtimeEvents: 0, mttrHours: 0, maintenanceCost: 3100 },
      { month: '2026-05', availabilityRate: 97, downtimeHours: 1, downtimeEvents: 0, mttrHours: 0, maintenanceCost: 3800 },
      { month: '2026-06', availabilityRate: 97, downtimeHours: 3, downtimeEvents: 0, mttrHours: 0, maintenanceCost: 4200 }
    ],
    telemetry: [
      {
        name: 'Engine Oil Pressure',
        currentValue: 66,
        unit: 'PSI',
        status: 'normal',
        baseline: 65,
        sensorStatus: 'Healthy',
        history24h: [
          { time: '24h ago', value: 65 },
          { time: '18h ago', value: 65 },
          { time: '12h ago', value: 66 },
          { time: '6h ago', value: 66 },
          { time: 'Now', value: 66 }
        ]
      },
      {
        name: 'Hydraulic Oil Temp',
        currentValue: 74,
        unit: '°C',
        status: 'normal',
        baseline: 75,
        sensorStatus: 'Healthy',
        history24h: [
          { time: '24h ago', value: 72 },
          { time: '18h ago', value: 73 },
          { time: '12h ago', value: 74 },
          { time: '6h ago', value: 74 },
          { time: 'Now', value: 74 }
        ]
      }
    ]
  }
];
