import { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import mapService from '../../services/mapService';

const SearchBox = ({ onPlaceSelected, placeholder = 'Enter location...', className = '' }) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // Replace Google Autocomplete with Geoapify geocoding on blur/enter
    const onKey = async (e) => {
      if (e.key === 'Enter') {
        const text = inputRef.current.value;
        try {
          const loc = await mapService.geocodePlace(text);
          onPlaceSelected({ address: text, lat: loc.lat, lng: loc.lng, raw: loc.raw });
          setLoadError(false);
        } catch (err) {
          console.error('[SearchBox] Geocoding failed', err);
          setLoadError(true);
        }
      }
    };

    const onBlur = async () => {
      const text = inputRef.current.value;
      if (!text) return;
      try {
        const loc = await mapService.geocodePlace(text);
        onPlaceSelected({ address: text, lat: loc.lat, lng: loc.lng, raw: loc.raw });
        setLoadError(false);
      } catch (err) {
        console.error('[SearchBox] Geocoding failed', err);
        setLoadError(true);
      }
    };

    const el = inputRef.current;
    el && el.addEventListener('keydown', onKey);
    el && el.addEventListener('blur', onBlur);

    return () => {
      el && el.removeEventListener('keydown', onKey);
      el && el.removeEventListener('blur', onBlur);
    };
  }, [onPlaceSelected]);

  return (
    <div className={`relative ${className}`}>
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all"
      />
      {loadError && (
        <p className="mt-2 text-xs text-red-300">
          Geocoding failed. Check your Geoapify API key and billing settings.
        </p>
      )}
    </div>
  );
};

export default SearchBox;