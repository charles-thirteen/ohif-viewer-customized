import { PubSubService } from '../_shared/pubSubServiceInterface';

const API_BASE = 'http://localhost:3050';

const EVENTS = {
  STATE_LOADED: 'event::statePersistence:stateLoaded',
  STATE_SAVED: 'event::statePersistence:stateSaved',
  STATE_ERROR: 'event::statePersistence:stateError',
};

type Preferences = {
  hotkeys?: Record<string, string[]>;
  theme?: string;
};

type SerializedAnnotation = {
  annotationUID: string;
  metadata: Record<string, unknown>;
  data: Record<string, unknown>;
};

class StatePersistenceService extends PubSubService {
  static REGISTRATION = {
    name: 'statePersistenceService',
    altName: 'StatePersistenceService',
    create: ({
      configuration,
      servicesManager,
    }: {
      configuration?: Record<string, unknown>;
      servicesManager?: any;
    }) => {
      return new StatePersistenceService(configuration, servicesManager);
    },
  };

  static EVENTS = EVENTS;

  private _saveAnnotationsTimer: ReturnType<typeof setTimeout> | null = null;
  private _savePreferencesTimer: ReturnType<typeof setTimeout> | null = null;
  private _debounceMs: number;
  private _servicesManager: any;

  constructor(configuration?: Record<string, unknown>, servicesManager?: any) {
    super(EVENTS);
    this._debounceMs = (configuration?.debounceMs as number) ?? 2000;
    this._servicesManager = servicesManager;
  }

  private _getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Get Keycloak token directly from the OIDC user object
    // (getAuthorizationHeader() is intentionally empty to avoid sending tokens to PACS)
    const userAuthService = this._servicesManager?.services?.userAuthenticationService;
    if (userAuthService) {
      const user = userAuthService.getUser();
      if (user?.access_token) {
        headers['Authorization'] = `Bearer ${user.access_token}`;
      }
    }

    return headers;
  }

  private async _fetch(path: string, options: RequestInit = {}): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
          ...this._getAuthHeaders(),
          ...(options.headers || {}),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (error) {
      console.warn('[StatePersistenceService] API request failed:', path, error);
      this._broadcastEvent(EVENTS.STATE_ERROR, { error, path });
      return null;
    }
  }

  // --- Annotations ---

  async saveAnnotations(
    studyUID: string,
    annotations: SerializedAnnotation[]
  ): Promise<void> {
    const result = await this._fetch(`/api/state/annotations/${studyUID}`, {
      method: 'PUT',
      body: JSON.stringify({ annotations }),
    });

    if (result !== null) {
      this._broadcastEvent(EVENTS.STATE_SAVED, {
        type: 'annotations',
        studyUID,
        count: annotations.length,
      });
    }
  }

  async loadAnnotations(studyUID: string): Promise<SerializedAnnotation[]> {
    const result = await this._fetch(`/api/state/annotations/${studyUID}`);

    if (result?.annotations) {
      this._broadcastEvent(EVENTS.STATE_LOADED, {
        type: 'annotations',
        studyUID,
        count: result.annotations.length,
      });
      return result.annotations;
    }

    return [];
  }

  async deleteAnnotations(studyUID: string): Promise<void> {
    await this._fetch(`/api/state/annotations/${studyUID}`, {
      method: 'DELETE',
    });
  }

  saveAnnotationsDebounced(
    studyUID: string,
    annotations: SerializedAnnotation[]
  ): void {
    if (this._saveAnnotationsTimer) {
      clearTimeout(this._saveAnnotationsTimer);
    }
    this._saveAnnotationsTimer = setTimeout(() => {
      this._saveAnnotationsTimer = null;
      this.saveAnnotations(studyUID, annotations);
    }, this._debounceMs);
  }

  // --- Preferences ---

  async savePreferences(preferences: Preferences): Promise<void> {
    const result = await this._fetch('/api/state/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });

    if (result !== null) {
      this._broadcastEvent(EVENTS.STATE_SAVED, {
        type: 'preferences',
      });
    }
  }

  async loadPreferences(): Promise<Preferences | null> {
    const result = await this._fetch('/api/state/preferences');

    if (result) {
      this._broadcastEvent(EVENTS.STATE_LOADED, {
        type: 'preferences',
      });
      return result;
    }

    return null;
  }

  savePreferencesDebounced(preferences: Preferences): void {
    if (this._savePreferencesTimer) {
      clearTimeout(this._savePreferencesTimer);
    }
    this._savePreferencesTimer = setTimeout(() => {
      this._savePreferencesTimer = null;
      this.savePreferences(preferences);
    }, this._debounceMs);
  }

  // --- Flush ---

  flush(): void {
    if (this._saveAnnotationsTimer) {
      clearTimeout(this._saveAnnotationsTimer);
      this._saveAnnotationsTimer = null;
    }
    if (this._savePreferencesTimer) {
      clearTimeout(this._savePreferencesTimer);
      this._savePreferencesTimer = null;
    }
  }

  onModeExit(): void {
    this.flush();
  }
}

export default StatePersistenceService;
