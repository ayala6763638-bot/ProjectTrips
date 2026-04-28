
export const dmsToDecimal = (dms) => {
    if (!dms) return null;
    return parseFloat(dms.degrees) + (parseFloat(dms.minutes) / 60) + (parseFloat(dms.seconds) / 3600);
};

export const haversineKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const isLocationValid = (newCoords, prevCoords, thresholdKm = 50) => {
    if (!newCoords) return false;

    const lat = dmsToDecimal(newCoords.latitude);
    const lng = dmsToDecimal(newCoords.longitude);
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return false;
    if (!prevCoords) return true;

    const prevLat = dmsToDecimal(prevCoords.latitude);
    const prevLng = dmsToDecimal(prevCoords.longitude);
    if (!isLocationValid(updatedStudent.lastLocation.coordinates, prevLocation)) {
        console.warn("❌ ה-Validation פסל את העדכון עבור:", updatedStudent.id);
        console.warn("נתונים שהתקבלו:", updatedStudent.lastLocation.coordinates);
        return;
    }
    const dist = haversineKm(prevLat, prevLng, lat, lng);
    return dist <= thresholdKm;
};

export function isValidId(id) {
    if (!id) return false;
    let s = String(id).replace(/\D/g, '').trim();
    if (s.length < 5 || s.length > 9) return false;
    s = s.padStart(9, '0');
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      let num = Number(s[i]);
      let prod = num * ((i % 2) + 1);
      if (prod > 9) prod -= 9; 
      sum += prod;
    }
    return sum % 10 === 0;
  }