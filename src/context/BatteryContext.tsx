import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BatteryMode } from '../types/journey';

interface BatteryContextType {
  batteryLevel: number;
  batteryMode: BatteryMode;
  isSimulated: boolean;
  hasDeviceBatteryAPI: boolean;
  overrideExitSaver: boolean;
  setBatteryLevel: (level: number) => void;
  setOverrideExitSaver: (val: boolean) => void;
  syncWithDeviceBattery: () => Promise<void>;
}

const BatteryContext = createContext<BatteryContextType | undefined>(undefined);

export const BatteryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Start with 100% by default, or read from session storage for persistence during navigation
  const [batteryLevel, setBatteryLevelState] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('journeyiq_battery_level');
      if (stored) return Number(stored);
    }
    return 100;
  });

  const [isSimulated, setIsSimulated] = useState<boolean>(true);
  const [hasDeviceBatteryAPI, setHasDeviceBatteryAPI] = useState<boolean>(false);
  const [overrideExitSaver, setOverrideExitSaver] = useState<boolean>(false);

  // Compute Battery Mode:
  // Normal: > 20%
  // Battery Saver: 6% - 20%
  // Critical Battery: <= 5%
  let batteryMode: BatteryMode = 'normal';
  if (batteryLevel <= 5) {
    batteryMode = 'critical';
  } else if (batteryLevel <= 20 && !overrideExitSaver) {
    batteryMode = 'saver';
  } else {
    batteryMode = 'normal';
  }

  // Check for Web Battery API availability
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      setHasDeviceBatteryAPI(true);
    }
  }, []);

  const syncWithDeviceBattery = async () => {
    if (typeof navigator !== 'undefined' && 'getBattery' in (navigator as any)) {
      try {
        const battery: any = await (navigator as any).getBattery();
        const level = Math.round(battery.level * 100);
        setBatteryLevelState(level);
        setIsSimulated(false);
        sessionStorage.setItem('journeyiq_battery_level', String(level));

        battery.addEventListener('levelchange', () => {
          const updated = Math.round(battery.level * 100);
          setBatteryLevelState(updated);
          sessionStorage.setItem('journeyiq_battery_level', String(updated));
        });
      } catch (err) {
        console.warn('Battery Status API error or blocked:', err);
      }
    }
  };

  const setBatteryLevel = (level: number) => {
    const clamped = Math.max(1, Math.min(100, Math.round(level)));
    setBatteryLevelState(clamped);
    setIsSimulated(true);
    if (clamped > 20) {
      setOverrideExitSaver(false);
    }
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('journeyiq_battery_level', String(clamped));
    }
  };

  return (
    <BatteryContext.Provider
      value={{
        batteryLevel,
        batteryMode,
        isSimulated,
        hasDeviceBatteryAPI,
        overrideExitSaver,
        setBatteryLevel,
        setOverrideExitSaver,
        syncWithDeviceBattery
      }}
    >
      {children}
    </BatteryContext.Provider>
  );
};

export const useBattery = (): BatteryContextType => {
  const context = useContext(BatteryContext);
  if (!context) {
    throw new Error('useBattery must be used within a BatteryProvider');
  }
  return context;
};
