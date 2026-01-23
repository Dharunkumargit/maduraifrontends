import React, { useMemo, useState } from "react";
import Title from "../../components/Title";
import { useLocation } from "react-router";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* 🔧 Leaflet Marker Fix */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const ViewBins = () => {
  const { state } = useLocation();
  const bin = state?.item; // data passed from table
  const [selectedImage, setSelectedImage] = useState(null);

  if (!bin) return <p>No bin data available</p>;

  // 🕒 Get latest timestamp from history or latest_1
  const history = bin.history ?? [];
  const allUpdates = [
    ...(bin.latest_1 ? [bin.latest_1] : []),
    ...(bin.latest_2 ? [bin.latest_2] : []),
    ...(bin.latest_3 ? [bin.latest_3] : []),
    ...(bin.latest_4 ? [bin.latest_4] : []),
    ...(bin.latest_5 ? [bin.latest_5] : []),
    ...history,
  ].filter(Boolean);

  const sortedUpdates = allUpdates.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  const latest = sortedUpdates[0];
  const filled = latest?.fill_level ?? bin.filled ?? "-";
  const lastUpdated = latest?.timestamp
    ? new Date(latest.timestamp).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

  const mainFields = [
    { label: "Status", value: bin.status },
    { label: "Bin ID", value: bin.binid },
    { label: "Zone", value: bin.zone },
    { label: "Ward", value: bin.ward },
    { label: "Bin Type", value: bin.bintype },
    { label: "Capacity", value: bin.capacity },
    { label: "Filled", value: filled !== "-" ? `${filled}%` : "-" },
    { label: "Location" },
    { label: "Last Updated", value: lastUpdated },
    { label: "Latest Photos" },
  ];

  return (
    <div>
      <Title title="Bin" sub_title="View" page_title="Bin" />

      <div className="bg-lightest-blue p-4 rounded-2xl border-4 border-white mt-3 mr-4 mb-15">
        <div className="grid grid-cols-11 gap-2 items-center">
          {mainFields.map((field, idx) => (
            <React.Fragment key={idx}>
              <p className="col-span-4 font-medium">{field.label}</p>
              <div className="col-span-6">
                {field.label === "Location" ? (
                  !selectedImage && bin.latitude && bin.longitude ? (
                    <MapContainer
                      center={[Number(bin.latitude), Number(bin.longitude)]}
                      zoom={14}
                      style={{ height: "200px", width: "60%" }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker
                        position={[Number(bin.latitude), Number(bin.longitude)]}
                      >
                        <Popup>{bin.street || "Bin Location"}</Popup>
                      </Marker>
                    </MapContainer>
                  ) : (
                    "-"
                  )
                ) : field.label === "Latest Photos" ? (
                  <div className="flex gap-3 flex-wrap">
                    {sortedUpdates.map((p, i) => (
                      <img
                        key={i}
                        src={p.image_url}
                        alt="bin"
                        className="w-24 h-24 rounded-lg cursor-pointer hover:scale-105 transition"
                        onClick={() => setSelectedImage(p.image_url)}
                      />
                    ))}
                  </div>
                ) : (
                  <span
                    className={`font-medium ${
                      field.label === "Filled" && filled > 80
                        ? "text-red-600"
                        : "text-gray-700"
                    }`}
                  >
                    {field.value || "-"}
                  </span>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 🖼️ IMAGE MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 flex justify-center items-center backdrop-blur-sm bg-black/40 z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="preview"
            className="max-w-lg rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};

export default ViewBins;
