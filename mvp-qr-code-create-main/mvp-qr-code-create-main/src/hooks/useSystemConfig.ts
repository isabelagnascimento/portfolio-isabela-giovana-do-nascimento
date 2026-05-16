import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface SystemConfig {
  publicMode: boolean;
  hiResExport: boolean;
  aiDesigner: boolean;
}

const defaultConfig: SystemConfig = {
  publicMode: true,
  hiResExport: true,
  aiDesigner: true,
};

export const useSystemConfig = () => {
  const [config, setConfig] = useState<SystemConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'system', 'config'), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setConfig(prev => ({
          ...prev,
          ...data
        }));
      }
      setLoading(false);
    }, (error) => {
      console.error("Config fetch error:", error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { config, loading };
};
