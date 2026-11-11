// app/dashboard/individual/tabs/LocationTab.tsx
"use client";

import { useState } from "react";
import { MapPin, Navigation, Loader2, ExternalLink } from "lucide-react";
import { LocationItem } from "@/lib/individualService";

interface TabProps {
  isEditing?: boolean;
  locations?: LocationItem[];
  onChange: (locations: LocationItem[]) => void;
}

export default function LocationTab({
  isEditing = false,
  locations = [],
  onChange,
}: TabProps) {
  // প্রথম প্রাইমারি লোকেশনটি রিড করা
  const primaryLoc: LocationItem = locations[0] || {
    address_line: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    is_primary: true,
  };

  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const updateLocationField = (field: keyof LocationItem, val: string) => {
    const updated: LocationItem = {
      ...primaryLoc,
      [field]: val,
      is_primary: true,
    };
    onChange([updated]);
  };

  // ডিভাইস GPS দিয়ে অটোমেটিক লোকেশন বের করা
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setCoords({ lat, lng: lon });

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
          );
          const result = await response.json();

          if (result && result.address) {
            const addr = result.address;
            const detectedCity =
              addr.city || addr.town || addr.municipality || addr.suburb || "";
            const detectedState = addr.state || "";
            const detectedPincode = addr.postcode || "";
            const detectedStreet =
              result.display_name?.split(",").slice(0, 3).join(",") ||
              addr.road ||
              "";

            onChange([
              {
                ...primaryLoc,
                city: detectedCity,
                state: detectedState,
                pincode: detectedPincode,
                address_line: detectedStreet,
                country: addr.country || "India",
                is_primary: true,
              },
            ]);
          }
        } catch {
          // ফেচ ব্যর্থ হলেও স্থানাঙ্ক সেট থাকবে
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGeoError(
            "Location permission denied. Please allow location access in your browser.",
          );
        } else {
          setGeoError("Unable to get your location.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const hasCoordinates = coords.lat !== 0 && coords.lng !== 0;
  const mapQuery = hasCoordinates
    ? `${coords.lat},${coords.lng}`
    : primaryLoc.city
      ? encodeURIComponent(
          `${primaryLoc.address_line || ""} ${primaryLoc.city} ${primaryLoc.state}`,
        )
      : "";

  const googleMapEmbedUrl = mapQuery
    ? `https://maps.google.com/maps?q=${mapQuery}&z=14&output=embed`
    : "";

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-200">

      {!isEditing ? (
        /* READ ONLY VIEW */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-neutral-50/70 border border-neutral-200/80 rounded-xs">
              <span className="text-[10px] font-mono uppercase text-neutral-400 block">
                City / Town
              </span>
              <p className="text-xs font-mono font-medium text-neutral-900 mt-0.5">
                {primaryLoc.city || "Not Set"}
              </p>
            </div>
            <div className="p-3 bg-neutral-50/70 border border-neutral-200/80 rounded-xs">
              <span className="text-[10px] font-mono uppercase text-neutral-400 block">
                State
              </span>
              <p className="text-xs font-mono font-medium text-neutral-900 mt-0.5">
                {primaryLoc.state || "Not Set"}
              </p>
            </div>
            <div className="p-3 bg-neutral-50/70 border border-neutral-200/80 rounded-xs">
              <span className="text-[10px] font-mono uppercase text-neutral-400 block">
                PIN Code
              </span>
              <p className="text-xs font-mono font-medium text-neutral-900 mt-0.5">
                {primaryLoc.pincode || "Not Set"}
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-neutral-50/70 border border-neutral-200/80 rounded-xs flex items-start gap-3">
            <MapPin className="h-4 w-4 text-neutral-600 mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-mono uppercase text-neutral-400 block">
                Full Address
              </span>
              <p className="text-xs font-sans text-neutral-800 mt-0.5">
                {primaryLoc.address_line || "No address added yet."}
              </p>
            </div>
          </div>

          {/* গুগল ম্যাপ প্রিভিউ */}
          {googleMapEmbedUrl ? (
            <div className="border border-neutral-200/80 rounded-xs overflow-hidden bg-neutral-50">
              <div className="p-2.5 bg-neutral-100/70 border-b border-neutral-200/70 flex justify-between items-center text-[10px] font-mono text-neutral-500">
                <span className="flex items-center gap-1.5 font-medium text-neutral-700">
                  <MapPin className="h-3 w-3 text-neutral-500" />
                  Map View
                </span>
                <a
                  href={`https://www.google.com/maps?q=${mapQuery}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-neutral-800 hover:text-black font-semibold transition-colors"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
              <div className="h-52 w-full bg-neutral-200">
                <iframe
                  title="Google Map Location View"
                  src={googleMapEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          ) : (
            <div className="p-6 border border-dashed border-neutral-300 bg-neutral-50/40 rounded-xs text-center space-y-1">
              <MapPin className="h-5 w-5 text-neutral-400 mx-auto" />
              <p className="text-xs font-mono text-neutral-600">
                No map location added.
              </p>
              <span className="text-[11px] text-neutral-400 block font-sans">
                Switch to edit mode to set your address and map pin.
              </span>
            </div>
          )}
        </div>
      ) : (
        /* EDIT MODE */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-neutral-50 border border-neutral-200/80 rounded-xs">
            <div className="space-y-0.5">
              <span className="text-xs font-mono font-semibold text-neutral-900 flex items-center gap-1.5">
                <Navigation className="h-3.5 w-3.5 text-neutral-800" />
                Auto-Find My Location
              </span>
              <p className="text-[11px] font-mono text-neutral-500">
                Click to detect your current location and auto-fill your
                address.
              </p>
            </div>
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              disabled={isLocating}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-400 text-white text-xs font-mono uppercase tracking-wider rounded-xs cursor-pointer transition-colors shadow-2xs shrink-0"
            >
              {isLocating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Finding...</span>
                </>
              ) : (
                <>
                  <Navigation className="h-3.5 w-3.5" />
                  <span>Get Location</span>
                </>
              )}
            </button>
          </div>

          {geoError && (
            <p className="text-[11px] font-mono text-red-600 bg-red-50 p-2.5 border border-red-200 rounded-xs">
              ⚠️ {geoError}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                City / Town
              </label>
              <input
                type="text"
                value={primaryLoc.city || ""}
                placeholder="e.g. Kolkata"
                onChange={(e) => updateLocationField("city", e.target.value)}
                className="w-full border border-neutral-200 bg-neutral-50/30 px-3.5 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                State
              </label>
              <input
                type="text"
                value={primaryLoc.state || ""}
                placeholder="e.g. West Bengal"
                onChange={(e) => updateLocationField("state", e.target.value)}
                className="w-full border border-neutral-200 bg-neutral-50/30 px-3.5 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                PIN Code
              </label>
              <input
                type="text"
                value={primaryLoc.pincode || ""}
                placeholder="e.g. 700014"
                onChange={(e) => updateLocationField("pincode", e.target.value)}
                className="w-full border border-neutral-200 bg-neutral-50/30 px-3.5 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
              Full Address
            </label>
            <input
              type="text"
              value={primaryLoc.address_line || ""}
              placeholder="e.g. House No, Street Name, Area"
              onChange={(e) =>
                updateLocationField("address_line", e.target.value)
              }
              className="w-full border border-neutral-200 bg-neutral-50/30 px-3.5 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
            />
          </div>

          {googleMapEmbedUrl && (
            <div className="border border-neutral-200/80 rounded-xs overflow-hidden bg-neutral-50">
              <div className="p-2 bg-neutral-100 border-b border-neutral-200 text-[10px] font-mono text-neutral-500 flex justify-between items-center">
                <span>Map Preview</span>
                <span className="text-[9.5px]">Auto-updates with location</span>
              </div>
              <div className="h-44 w-full bg-neutral-200">
                <iframe
                  title="Google Map Edit Preview"
                  src={googleMapEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}