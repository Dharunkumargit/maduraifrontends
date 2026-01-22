import React, { useEffect, useMemo, useState } from "react";
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

const API_URL =
  "http://ec2-54-157-168-45.compute-1.amazonaws.com:8000/latest";

/* 🕒 Always show CURRENT system time */
function getCurrentTime() {
  return new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const ViewBins = () => {
  const { state } = useLocation();
  const user = state?.item;

  const [selectedImage, setSelectedImage] = useState(null);
  const [binData, setBinData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("-");
  const [popupTime, setPopupTime] = useState("");

  /* 🔄 Fetch latest bin data every 10 seconds */
  useEffect(() => {
    let isMounted = true;

    const fetchBinData = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        if (isMounted) {
          setBinData(data);
          setLastUpdated(getCurrentTime());
        }
      } catch (err) {
        console.error("Failed to fetch bin data:", err);
      }
    };

    fetchBinData();
    const interval = setInterval(fetchBinData, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  /* 📸 Collect latest images */
  const latestPhotos = useMemo(() => {
    if (!binData) return [];

    return Object.keys(binData)
      .filter((k) => k.startsWith("latest_"))
      .map((k) => binData[k])
      .filter(Boolean)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [binData]);

  const filled = binData?.latest_1?.fill_level ?? "-";

  const mainFields = [
    { label: "Status", value: user?.status },
    { label: "Bin ID", value: binData?.bin_id ?? user?.binid },
    { label: "Zone", value: user?.zone },
    { label: "Ward", value: user?.ward },
    { label: "Bins", value: user?.bintype },
    { label: "Capacity", value: user?.capacity },
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
                {/* 📍 LOCATION */}
                {field.label === "Location" ? (
                  !selectedImage && user?.latitude && user?.longitude ? (
                    <MapContainer
                      center={[Number(user.latitude), Number(user.longitude)]}
                      zoom={14}
                      style={{ height: "200px", width: "60%" }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker
                        position={[
                          Number(user.latitude),
                          Number(user.longitude),
                        ]}
                      >
                        <Popup>{user?.street || "Bin Location"}</Popup>
                      </Marker>
                    </MapContainer>
                  ) : (
                    "-"
                  )
                ) : field.label === "Latest Photos" ? (
                  <div className="flex gap-3 flex-wrap">
                    {latestPhotos.map((p, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <img
                          src={p.image_url}
                          alt="bin"
                          className="w-24 h-24 rounded-lg cursor-pointer hover:scale-105 transition"
                          onClick={() => {
                            setSelectedImage(p.image_url);
                            setPopupTime(getCurrentTime()); // ✅ current time
                          }}
                        />
                        
                      </div>
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
          <div
            className=" p-4 rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="preview"
              className="max-w-lg rounded-xl shadow-2xl"
            />
            <p className="text-center text-sm text-white mt-2">
              Updated at: <span className="font-medium">{popupTime}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewBins;
