export interface CountryOption {
  id: number;
  name: string;
  iso2: string;
  emoji: string;
}

export interface StateOption {
  id: number;
  name: string;
  iso2: string;
  type: string | null;
}

export interface CityOption {
  id: number;
  name: string;
  state_code: string;
  country_code: string;
}

const LOCATION_DATA_BASE = 'https://cdn.jsdelivr.net/npm/@countrystatecity/countries-browser@1.0.4/dist/data';
const REQUEST_TIMEOUT_MS = 8000;

const cache = new Map<string, unknown>();

async function loadJson<T>(path: string): Promise<T> {
  const cached = cache.get(path);
  if (cached !== undefined) return cached as T;

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${LOCATION_DATA_BASE}/${path}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Location data request failed (${response.status})`);
    }

    const data = (await response.json()) as T;
    cache.set(path, data);
    return data;
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function loadCountries(): Promise<CountryOption[]> {
  const countries = await loadJson<CountryOption[]>('countries.json');
  return [...countries].sort((a, b) => a.name.localeCompare(b.name));
}

export async function loadStates(countryCode: string): Promise<StateOption[]> {
  if (!countryCode) return [];
  try {
    const states = await loadJson<StateOption[]>(`states/${countryCode.toUpperCase()}.json`);
    return [...states].sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    return [];
  }
}

export async function loadCities(countryCode: string, stateCode: string): Promise<CityOption[]> {
  if (!countryCode || !stateCode) return [];
  try {
    const cities = await loadJson<CityOption[]>(
      `cities/${countryCode.toUpperCase()}-${stateCode.toUpperCase()}.json`,
    );
    return [...cities].sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    return [];
  }
}
