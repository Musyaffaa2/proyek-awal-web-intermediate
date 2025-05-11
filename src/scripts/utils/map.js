import CONFIG from '../config';

export function updateCoordinates(lat, lng, latInput, lonInput, latDisplay, lonDisplay) {
  latInput.value = lat;
  lonInput.value = lng;
  latDisplay.value = lat;
  lonDisplay.value = lng;
}

export async function getPlaceNameByCoordinate(latitude, longitude) {
  const url = `https://api.maptiler.com/geocoding/${longitude},${latitude}.json?key=${CONFIG.MAP_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      return data.features[0].place_name;
    } else {
      return 'Lokasi tidak ditemukan';
    }
  } catch (error) {
    console.error('Gagal mendapatkan nama lokasi:', error);
    return 'Terjadi kesalahan';
  }
}