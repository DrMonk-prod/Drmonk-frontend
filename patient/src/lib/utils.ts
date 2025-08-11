import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function convertTo24Hour(time12h: string) {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier.toLowerCase() === 'pm' && hours !== 12) {
    hours += 12;
  }
  if (modifier.toLowerCase() === 'am' && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function convertTo12Hour(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).toLowerCase()
}


export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m`;
  } else {
    return `${distanceKm.toFixed(1)} km`;
  }
}
