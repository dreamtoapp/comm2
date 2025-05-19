import { useCallback, useEffect, useRef, useState } from 'react';

import { toast } from 'sonner';

type GeolocationOptions = {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  accuracyThreshold?: number;
  maxRetries?: number; // Maximum retry attempts
};

type GeolocationState = {
  geoLatitude: number | null;
  geoLongitude: number | null;
  geoAccuracy: number | null;
  geoError: string | null;
  geoIsLoading: boolean;
};

const useAccurateGeolocation = (options: GeolocationOptions = {}) => {
  const [state, setState] = useState<GeolocationState>({
    geoLatitude: null,
    geoLongitude: null,
    geoAccuracy: null,
    geoError: null,
    geoIsLoading: false,
  });

  const retryCountRef = useRef(0);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup function to clear timers
  const clearResources = () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  };

  // Function to fetch geolocation
  const getGeolocation = useCallback(() => {
    const defaultOptions: GeolocationOptions = {
      enableHighAccuracy: true,
      timeout: 30000, // 30 seconds
      maximumAge: 0,
      accuracyThreshold: 10, // 10 meters
      maxRetries: 3, // 3 retries
    };

    const mergedOptions = { ...defaultOptions, ...options };
    retryCountRef.current = 0;

    setState((prev) => ({
      ...prev,
      geoIsLoading: true, // Start loading
      geoError: null,
    }));

    const attemptFetch = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;

          if (accuracy <= (mergedOptions.accuracyThreshold || 10)) {
            setState((prev) => ({
              ...prev,
              geoLatitude: latitude,
              geoLongitude: longitude,
              geoAccuracy: accuracy,
              geoError: null,
              geoIsLoading: false, // Loading complete
            }));
            toast.success(`دقة الموقع: ${accuracy.toFixed(1)}m`);
          } else {
            retryCountRef.current += 1;

            // Always update state with the best available location
            setState((prev) => ({
              ...prev,
              geoLatitude: latitude,
              geoLongitude: longitude,
              geoAccuracy: accuracy,
              geoIsLoading: true, // Loading continues for retry
            }));

            if (retryCountRef.current < (mergedOptions.maxRetries || 3)) {
              timeoutIdRef.current = setTimeout(attemptFetch, 5000); // Retry after 5 seconds
              toast.warning(`الدقة ${accuracy}m. جاري إعادة المحاولة...`);
            } else {
              setState((prev) => ({
                ...prev,
                geoError: `أفضل دقة متاحة: ${accuracy.toFixed(1)}m`,
                geoIsLoading: false, // Loading complete after max retries
              }));
              // toast.error(`أقصى دقة: ${accuracy.toFixed(1)}m`);
            }
          }
        },
        (error) => {
          let errorMessage = 'فشل تحديد الموقع';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'السماح بالوصول إلى الموقع مطلوب';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'الخدمة غير متاحة';
              break;
            case error.TIMEOUT:
              if (retryCountRef.current < (mergedOptions.maxRetries || 3)) {
                setState((prev) => ({
                  ...prev,
                  geoIsLoading: true, // Loading starts again for retry
                }));

                timeoutIdRef.current = setTimeout(attemptFetch, 5000);
                return;
              }
              errorMessage = 'انتهى الوقت. تأكد من اتصال GPS';
              break;
          }

          setState((prev) => ({
            ...prev,
            geoError: errorMessage,
            geoIsLoading: false, // Loading complete after error
          }));
          toast.error(errorMessage);
        },
        {
          enableHighAccuracy: mergedOptions.enableHighAccuracy,
          timeout: mergedOptions.timeout,
          maximumAge: mergedOptions.maximumAge,
        },
      );
    };

    attemptFetch();
  }, [options]);

  // Cleanup resources on unmount
  useEffect(() => {
    return () => clearResources();
  }, []);

  return {
    ...state,
    getGeolocation,
    getGoogleMapsLink: () => {
      if (!state.geoLatitude || !state.geoLongitude) return null;
      return `https://www.google.com/maps?q=${state.geoLatitude},${state.geoLongitude}`;
    },
  };
};

export default useAccurateGeolocation;
