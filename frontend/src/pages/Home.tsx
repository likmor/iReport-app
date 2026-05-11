import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";



const KRAKOW: [number, number] = [50.0647, 19.945];

export const Home = () => {
  return (
    <div style={{ height: "calc(100vh - 60px)" }}>
      <MapContainer
        center={KRAKOW}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={KRAKOW}>
          <Popup>Kraków</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};