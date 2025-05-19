type GeolocationResponse = {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null;
  source: 'gps' | 'ip' | 'unknown';
  timestamp: number;
  error?: string;
  warning?: string;
};

type GeolocationOptions = {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  retries?: number;
};

const DEFAULT_OPTIONS: GeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
  retries: 3,
};

const IP_GEOLOCATION_SERVICES = [
  'https://ipapi.co/json/',
  'https://ipinfo.io/json?token=YOUR_TOKEN', // Register for free token
  'https://geolocation-db.com/json/',
];

const validateCoordinates = (lat: number, lng: number): boolean =>
  Math.abs(lat) <= 90 && Math.abs(lng) <= 180 && !isNaN(lat) && !isNaN(lng);

const getGPSLocation = async (options: GeolocationOptions): Promise<GeolocationResponse> => {
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: options.enableHighAccuracy,
        timeout: options.timeout,
        maximumAge: options.maximumAge,
      });
    });

    if (!validateCoordinates(position.coords.latitude, position.coords.longitude)) {
      throw new Error('Invalid coordinates received from GPS');
    }

    return {
      coords: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      },
      source: 'gps',
      timestamp: position.timestamp,
    };
  } catch (error) {
    return {
      coords: null,
      source: 'gps',
      timestamp: Date.now(),
      error: error instanceof Error ? error.message : 'GPS location failed',
    };
  }
};

const getIPLocation = async (): Promise<GeolocationResponse> => {
  const errors: string[] = [];

  for (const serviceUrl of IP_GEOLOCATION_SERVICES) {
    try {
      const response = await fetch(serviceUrl);
      const data = await response.json();

      const lat = parseFloat(data.latitude || data.lat);
      const lng = parseFloat(data.longitude || data.lon || data.lng);

      if (validateCoordinates(lat, lng)) {
        return {
          coords: {
            latitude: lat,
            longitude: lng,
            accuracy: 50000,
          },
          source: 'ip',
          timestamp: Date.now(),
          warning: 'Approximate IP-based location',
        };
      }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Unknown IP service error');
    }
  }

  return {
    coords: null,
    source: 'ip',
    timestamp: Date.now(),
    error: `All IP services failed: ${errors.join(', ')}`,
  };
};

const getLocation = async (options: GeolocationOptions = {}): Promise<GeolocationResponse> => {
  const finalOptions = { ...DEFAULT_OPTIONS, ...options };
  let bestResult: GeolocationResponse | null = null;

  // Try GPS with retries
  for (let attempt = 0; attempt < (finalOptions.retries || 0); attempt++) {
    const result = await getGPSLocation(finalOptions);

    if (result.coords) {
      if (!bestResult || result.coords.accuracy < (bestResult.coords?.accuracy || Infinity)) {
        bestResult = result;
      }

      if (result.coords.accuracy < 50) {
        // Good enough accuracy
        return result;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  // Fallback to IP if GPS failed
  if (!bestResult?.coords) {
    const ipResult = await getIPLocation();
    return ipResult.coords
      ? ipResult
      : {
          ...ipResult,
          error: `GPS: ${bestResult?.error || 'Unknown error'}, IP: ${ipResult.error}`,
        };
  }

  return bestResult;
};

// Usage examples
const displayLocation = async () => {
  const result = await getLocation();

  if (result.error) {
    console.error('Error:', result.error);
    return;
  }

  if (result.coords) {
    console.warn(`Obtained ${result.source.toUpperCase()} location:
      Latitude: ${result.coords.latitude.toFixed(6)}
      Longitude: ${result.coords.longitude.toFixed(6)}
      Accuracy: ${result.coords.accuracy}m
      Timestamp: ${new Date(result.timestamp).toISOString()}`);

    if (result.warning) console.warn('Warning:', result.warning);
  }
};

// Comparison helper
const compareWithGPSNet = async () => {
  try {
    const ourLocation = await getLocation();
    const theirResponse = await fetch('https://www.gps-coordinates.net/api/current');
    const theirData = await theirResponse.json();

    console.warn('Comparison Results:', {
      ourLocation,
      theirData,
      latDifference: ourLocation.coords?.latitude
        ? ourLocation.coords.latitude - theirData.lat
        : null,
      lngDifference: ourLocation.coords?.longitude
        ? ourLocation.coords.longitude - theirData.lng
        : null,
    });
  } catch (error) {
    console.error('Comparison failed:', error);
  }
};

export const GeoLocator = {
  getLocation,
  validateCoordinates,
  compareWithGPSNet,
  displayLocation,
};
