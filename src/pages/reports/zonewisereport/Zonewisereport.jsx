import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../../../const";
import Title from "../../../components/Title";
import logo from "../../../assets/images/MaduraiLogo.png";
import { IoMdArrowDropdown } from "react-icons/io";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Zonewisereport = () => {
  const today = new Date().toISOString().split("T")[0];
  const [zones, setZones] = useState([]);
  const [overall, setOverall] = useState({});
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [loading, setLoading] = useState(false);

  // 🔥 MAP TO YOUR NEW API ENDPOINT
  const getZoneReport = async () => {
    try {
      setLoading(true);

      // ✅ YOUR ZONE API!
      const url = `${API}/binfullevents/analytics${fromDate && toDate ? `?from=${fromDate}&to=${toDate}` : ""}`;
      const res = await axios.get(url);

      // ✅ MAP API RESPONSE TO TABLE FORMAT
      const apiData = res.data.data;

      // Overall totals (top summary)
      setOverall({
        totalZones: apiData.overall?.totalZones || 0,
        totalBins: apiData.overall?.totalBins || 0,
        totalTonsCleared: apiData.overall?.totalTonsCleared || 0,
      });

      // Zone data for table (map API structure)
      const zoneData = (apiData.zones || []).map((zone) => ({
        zonename: zone._id.zone || "Unknown",
        totalbins: zone.totalBins || 0,
        activebins: zone.totalFullEvents || 0, // Full events as alerts
        totalClearedCount: zone.totalClearedEvents || 0,
        avgClearTime: zone.avgClearTimeMins || 0,
        totalGarbageTons: zone.totalTonsCleared || 0,
        wards: zone.totalWards || 0,
        clearanceRate: zone.clearanceRate || 0,
      }));

      setZones(zoneData);
      setLoading(false);
    } catch (error) {
      console.error(
        "Zone Report Error:",
        error.response?.data || error.message,
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    getZoneReport(); // Initial load (live data)
  }, []);

  useEffect(() => {
    if (fromDate && toDate) {
      getZoneReport(); // Filtered data
    }
  }, [fromDate, toDate]);

  // PDF Export - Updated for new data structure
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Zone-wise Waste Management Report", 14, 16);

    autoTable(doc, {
      startY: 25,
      head: [
        [
          "S.no",
          "Zone Name",
          "Total Bins",
          "Active Alerts",
          "Cleared",
          "Avg Response (mins)",
          "Tons Cleared",
        ],
      ],
      body: zones.map((item, index) => [
        index + 1,
        item.zonename,
        item.totalbins,
        item.activebins,
        item.totalClearedCount,
        `${item.avgClearTime || 0}`,
        `${item.totalGarbageTons || 0}`,
      ]),
      foot: [
        [
          "TOTAL",
          overall.totalBins || 0,
          "",
          "",
          "",
          "",
          `${overall.totalTonsCleared || 0}`,
        ],
      ],
    });

    doc.save(
      fromDate && toDate
        ? `ZoneReport_${fromDate}_to_${toDate}.pdf`
        : "ZoneReport.pdf",
    );
  };

  // Excel Export - Updated
  const exportExcel = () => {
    const dataForExcel = zones.map((item, index) => ({
      "S.no": index + 1,
      "Zone Name": item.zonename,
      "Total Bins Installed": item.totalbins,
      "Active Alerts": item.activebins,
      "No of Times cleared": item.totalClearedCount,
      "Average Response Time": `${item.avgClearTime || 0} mins`,
      "Total Garbage Collected (Tons)": `${item.totalGarbageTons || 0} tons`,
    }));

    const ws = XLSX.utils.json_to_sheet(dataForExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ZoneWiseReport");

    const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    saveAs(
      new Blob([buf], { type: "application/octet-stream" }),
      fromDate && toDate
        ? `ZoneReport_${fromDate}_to_${toDate}.xlsx`
        : "ZoneReport.xlsx",
    );
  };

  return (
    <div>
      {/* Header - SAME */}
      <div className="flex items-center justify-between mb-4 mr-4">
        <div>
          <Title title="Reports" sub_title="Table" page_title="Reports" />
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="date"
            className="bg-white rounded-md px-4 py-3"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <input
            type="date"
            className="bg-white rounded-md px-4 py-3"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />

          <button
            className="flex items-center bg-white rounded-md px-4 py-3 text-gray-700"
            onClick={exportPDF}
          >
            Export PDF <IoMdArrowDropdown className="ml-1" />
          </button>

          <button
            className="flex items-center bg-white rounded-md px-4 py-3 text-gray-700"
            onClick={exportExcel}
          >
            Export Excel <IoMdArrowDropdown className="ml-1" />
          </button>

          {/* <button
            className="bg-darkest-blue text-white rounded-md px-5 py-3"
            onClick={getZoneReport}
          >
            Apply Filter
          </button> */}
        </div>
      </div>

      {/* Top Header - Updated with Overall Stats */}
      <div className="bg-white rounded-t-lg pl-10 pt-5 h-33 ml-5 mr-7 pr-10">
        <div className="flex items-center justify-between w-full">
          <img src={logo} alt="Logo" className="w-22 rounded-full mr-2" />
          <div className="flex-1 text-center">
            <h2 className="text-xl font-semibold">
              Zone-wise  Report
            </h2>
            {fromDate && toDate && (
              <p className="text-gray-500 text-sm mt-1">
                {new Date(fromDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}{" "}
                —
                {new Date(toDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">
              <span className="text-gray-700 font-semibold">Total Zones:</span>{" "}
              {overall.totalZones || 0} |
              <span className="text-gray-700 font-semibold"> Bins:</span>{" "}
              {overall.totalBins || 0}
            </p>
            <p className="text-sm font-medium">
              <span className="text-gray-700 font-semibold">Date:</span>{" "}
              {new Date().toLocaleDateString("en-GB")}
            </p>
          </div>
        </div>
      </div>

      {/* Table - SAME STRUCTURE, MAPPED DATA */}
      <div className="bg-white rounded-b-lg pt-2 ml-5 mr-7 mt-1.5 mb-13">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full border border-light-grey text-sm text-black">
            <thead className="bg-[#EBEBEB] h-35">
              <tr>
                <th className="border border-light-grey p-6">S.no</th>
                <th className="border border-light-grey p-3">Zone Name</th>
                <th className="border border-light-grey p-3">
                  Total Bins Installed
                </th>
                <th className="border border-light-grey p-3">Active Alerts</th>
                <th className="border border-light-grey p-3">
                  No of Times Cleared
                </th>
                <th className="border border-light-grey p-3">
                  Avg Response (mins)
                </th>
                <th className="border border-light-grey p-3">
                  Total Garbage Collected (Tons Cleared)
                </th>
              </tr>
              
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center p-4">
                    Loading Zone data...
                  </td>
                </tr>
              ) : zones.length > 0 ? (
                zones.map((item, index) => (
                  <tr
                    key={`${item.zonename}-${index}`}
                    className="text-center text-input-grey"
                  >
                    <td className="border border-input-grey p-4">
                      {index + 1}
                    </td>
                    <td className="border border-input-grey p-4 font-semibold">
                      {item.zonename}
                    </td>
                    <td className="border border-input-grey p-4">
                      {item.totalbins}
                    </td>
                    <td className="border border-input-grey p-4">
                      {item.activebins}
                    </td>
                    <td className="border border-input-grey p-4">
                      {item.totalClearedCount}
                    </td>
                    <td className="border border-input-grey p-4">
                      {item.avgClearTime} mins
                    </td>
                    <td className="border border-input-grey p-4 font-bold text-green-600">
                      {item.totalGarbageTons} tons
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 border p-6 py-12">
        {fromDate === toDate ? (
          // 🔥 TODAY - Specific message
          <div className="space-y-2">
            <div className="text-2xl">🚛</div>
            <h3 className="text-lg font-semibold text-gray-700">No cleared garbage today</h3>
            <p className="text-sm">All zones are running smoothly. No full bins reported for {new Date(fromDate).toLocaleDateString('en-IN')}</p>
          </div>
        ) : (
          // 🔥 DATE RANGE - Different message
          <div className="space-y-2">
            <div className="text-2xl">📊</div>
            <h3 className="text-lg font-semibold text-gray-700">No cleared data found</h3>
            <p className="text-sm">
              No garbage clearance recorded between{' '}
              <strong>{new Date(fromDate).toLocaleDateString('en-GB')}</strong> and{' '}
              <strong>{new Date(toDate).toLocaleDateString('en-GB')}</strong>
            </p>
            <p className="text-xs text-gray-400">Try adjusting the date range</p>
          </div>
        )}
      </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="text-center text-input-grey text-sm py-4">
          Report generated on {new Date().toLocaleDateString("en-GB")} | Powered by
          Madurai Municipal Corporation
        </p>
      </div>
    </div>
  );
};

export default Zonewisereport;
