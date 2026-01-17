import AsyncStorage from '@react-native-async-storage/async-storage';

type EventName = 'place_opened' | 'filters_used' | 'favorite_toggled';

type AnalyticsEvent = {
  name: EventName;
  timestamp: number;
  data?: Record<string, unknown>;
};

const ANALYTICS_KEY = '@WhereToBaku:analytics';
const MAX_EVENTS = 200;

async function readEvents(): Promise<AnalyticsEvent[]> {
  try {
    const raw = await AsyncStorage.getItem(ANALYTICS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AnalyticsEvent[];
  } catch (error) {
    console.error('Analytics read error', error);
    return [];
  }
}

async function writeEvents(events: AnalyticsEvent[]) {
  try {
    await AsyncStorage.setItem(ANALYTICS_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
  } catch (error) {
    console.error('Analytics write error', error);
  }
}

export async function logEvent(name: EventName, data?: Record<string, unknown>) {
  const events = await readEvents();
  events.push({ name, timestamp: Date.now(), data });
  await writeEvents(events);
}

export async function summarizeDecisionSpeed() {
  const events = await readEvents();
  const placeEvents = events.filter(e => e.name === 'place_opened');
  const withFilters = placeEvents.filter(e => e.data?.filterUsed === true);
  const withoutFilters = placeEvents.filter(e => e.data?.filterUsed === false);

  const avg = (items: typeof placeEvents) =>
    items.length === 0
      ? null
      : items.reduce((sum, e) => sum + (Number(e.data?.elapsedMs) || 0), 0) / items.length;

  return {
    sampleSize: {
      withFilters: withFilters.length,
      withoutFilters: withoutFilters.length,
    },
    avgMs: {
      withFilters: avg(withFilters),
      withoutFilters: avg(withoutFilters),
    },
  };
}

export async function summarizeFavorites() {
  const events = await readEvents();
  const favEvents = events.filter(e => e.name === 'favorite_toggled');
  const saves = favEvents.filter(e => e.data?.action === 'save');
  const unsaves = favEvents.filter(e => e.data?.action === 'unsave');
  const uniqueSavedIds = new Set(
    favEvents
      .filter(e => e.data?.action === 'save')
      .map(e => String(e.data?.placeId ?? ''))
      .filter(Boolean)
  );

  return {
    totalEvents: favEvents.length,
    saves: saves.length,
    unsaves: unsaves.length,
    uniquePlacesSaved: uniqueSavedIds.size,
    lastTotalFavorites: (favEvents[favEvents.length - 1]?.data?.totalFavorites as number | undefined) ?? null,
  };
}
