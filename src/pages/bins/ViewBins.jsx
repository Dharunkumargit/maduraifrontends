import React, { useMemo, useState } from "react";
import Title from "../../components/Title";
import { useLocation } from "react-router";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { binImages } from "../../binImages.js";

/* 🔧 FIX: Leaflet marker issue in production */
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
  const user = state?.item;

  /* 🖼 Popup Image State */
  const [selectedImage, setSelectedImage] = useState(null);

  /* 🔹 Filter images by BIN ID & sort latest first */
  const latestPhotos = useMemo(() => {
    return binImages
      .filter((img) => img.bin_id === user?.binid)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [user?.binid]);

  /* 🔹 Latest fill level */
  const latestFill =
    latestPhotos.length > 0 ? latestPhotos[0].fill_level : user?.filled;

  const mainFields = [
    { label: "Status", value: user?.status },
    { label: "Bin ID", value: user?.binid },
    { label: "Zone", value: user?.zone },
    { label: "Ward", value: user?.ward },
    { label: "Bins", value: user?.bintype },
    { label: "Filled", value: `${latestFill}%` },
    { label: "Last Updated", value: user?.lastcollected },
    { label: "Location", value: user?.location },
    { label: "Latest Photos", value: "" },
  ];

  return (
    <div>
      <Title title="Bin" sub_title="View" page_title="Bin" />

      <div className="bg-lightest-blue p-4 rounded-2xl space-y-3 border-4 border-white text-sm mt-3 mr-4 mb-15">
        <div className="grid grid-cols-11 gap-2 items-center mt-3">
          {mainFields.map((field, idx) => (
            <React.Fragment key={idx}>
              <p className="col-span-4 font-medium">{field.label}</p>

              <div className="col-span-6 text-light-grey">
                {/* 📍 LOCATION MAP (HIDDEN WHEN POPUP OPEN) */}
                {field.label === "Location" ? (
                  !selectedImage &&
                  user?.latitude &&
                  user?.longitude ? (
                    <div className="space-y-2">
                      <MapContainer
                        center={[
                          Number(user.latitude),
                          Number(user.longitude),
                        ]}
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

                      <p className="text-sm font-medium">
                        {user?.location}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Location not available
                    </p>
                  )
                ) : field.label === "Latest Photos" ? (
                  /* 🖼 LATEST BIN PHOTOS */
                  <div className="flex gap-4 mt-2 flex-wrap">
                    {latestPhotos.length > 0 ? (
                      latestPhotos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo.image_url}
                          alt={`Bin ${user?.binid}`}
                          className="w-24 h-24 object-cover rounded-lg shadow  cursor-pointer hover:scale-105 transition"
                          onClick={() =>
                            setSelectedImage(photo.image_url)
                          }
                        />
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        No images available
                      </p>
                    )}
                  </div>
                ) : (
                  /* 🔹 NORMAL TEXT FIELD */
                  <span
                    className={`text-sm font-medium ${
                      field.label === "Status" &&
                      field.value === "Pending Pickup"
                        ? "text-red-600"
                        : "text-light-grey"
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

      {/* 🖼 IMAGE POPUP MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 justify-center items-center backdrop-blur-xs backdrop-grayscale-50 flex drop-shadow-lg z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative rounded-xl p-4 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
           

            <img
              src={selectedImage}
              alt="Bin Preview"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewBins;
