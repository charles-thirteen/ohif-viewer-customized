import { useState, useCallback, useRef } from 'react';
import { useSystem } from '../contextProviders/SystemProvider';
import type StatePersistenceService from '../services/StatePersistenceService/StatePersistenceService';

type SerializedAnnotation = {
  annotationUID: string;
  metadata: Record<string, unknown>;
  data: Record<string, unknown>;
};

type Preferences = {
  hotkeys?: Record<string, string[]>;
  theme?: string;
};

export function useStatePersistence() {
  const { servicesManager } = useSystem();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const serviceRef = useRef<StatePersistenceService | null>(null);

  const getService = useCallback((): StatePersistenceService | null => {
    if (!serviceRef.current) {
      serviceRef.current = servicesManager.services
        .statePersistenceService as StatePersistenceService;
    }
    return serviceRef.current;
  }, [servicesManager]);

  const saveAnnotations = useCallback(
    async (studyUID: string, annotations: SerializedAnnotation[]) => {
      const service = getService();
      if (!service) return;

      setIsSaving(true);
      setError(null);
      try {
        await service.saveAnnotations(studyUID, annotations);
        setLastSaved(new Date());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Save failed');
      } finally {
        setIsSaving(false);
      }
    },
    [getService]
  );

  const loadAnnotations = useCallback(
    async (studyUID: string): Promise<SerializedAnnotation[]> => {
      const service = getService();
      if (!service) return [];

      setError(null);
      try {
        return await service.loadAnnotations(studyUID);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Load failed');
        return [];
      }
    },
    [getService]
  );

  const savePreferences = useCallback(
    async (preferences: Preferences) => {
      const service = getService();
      if (!service) return;

      setIsSaving(true);
      setError(null);
      try {
        await service.savePreferences(preferences);
        setLastSaved(new Date());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Save failed');
      } finally {
        setIsSaving(false);
      }
    },
    [getService]
  );

  const loadPreferences = useCallback(async (): Promise<Preferences | null> => {
    const service = getService();
    if (!service) return null;

    setError(null);
    try {
      return await service.loadPreferences();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Load failed');
      return null;
    }
  }, [getService]);

  const flush = useCallback(() => {
    const service = getService();
    if (service) {
      service.flush();
    }
  }, [getService]);

  return {
    saveAnnotations,
    loadAnnotations,
    savePreferences,
    loadPreferences,
    flush,
    isSaving,
    lastSaved,
    error,
  };
}
