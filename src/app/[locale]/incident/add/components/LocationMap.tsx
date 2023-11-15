import Map from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'

const LocationMap = () => {
  return (
    <Map
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14,
      }}
      style={{ width: 600, height: 400 }}
      mapStyle={`${process.env.NEXT_PUBLIC_MAPTILER_MAP}/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`}
    />
  )
}

export { LocationMap }
