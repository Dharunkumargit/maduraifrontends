import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "../../../assets/images/MaduraiLogo.png";
import { IoMdArrowDropdown } from "react-icons/io";
import Title from "../../../components/Title";
import { API } from "../../../../const";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Wardwisereport = () => {
  // 🔥 TODAY DEFAULTS
  const today = new Date().toISOString().split('T')[0];
  const [reportData, setReportData] = useState([]);
  const [overall, setOverall] = useState({});
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [loading, setLoading] = useState(false);

  // 🔥 WARD-WISE FROM ZONE API (Grouped by ward)
  const fetchWardReport = async () => {
    try {
      setLoading(true);
      const from = fromDate || today;
      const to = toDate || today;
      
      const res = await axios.get(`${API}/binfullevents/analytics?from=${from}&to=${to}`);
      const apiData = res.data.data;

      // 🔥 MAP ZONE DATA TO WARD FORMAT (aggregate wards within zones)
      const wardData = [];
      
      // Process each zone's wards
      apiData.zones?.forEach(zone => {
        const wards = zone.wards || []; // Assuming wards array exists
        wards.forEach((wardName, wardIndex) => {
          wardData.push({
            wardname: `${wardName} (${zone._id.zone})`,
            zonename: zone._id.zone,
            totalbins: Math.round(zone.totalBins / wards.length), // Distribute bins
            activebins: Math.round((zone.totalFullEvents || 0) / wards.length),
            clearedCount: Math.round((zone.totalClearedEvents || 0) / wards.length),
            avgClearTime: zone.avgClearTimeMins || 0,
            clearedWeightKg: (zone.totalTonsCleared || 0) / wards.length,
            compliance: `${zone.clearanceRate || 0}%`
          });
        });
      });

      setReportData(wardData);
      setOverall({
        totalZones: apiData.overall?.totalZones || 0,
        totalBins: apiData.overall?.totalBins || 0,
        totalTons: apiData.overall?.totalTonsCleared || 0
      });
      setLoading(false);
    } catch (error) {
      console.error("Ward Report Error:", error);
      setReportData([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWardReport(); // Load TODAY immediately
  }, []);

  useEffect(() => {
    fetchWardReport(); // Auto-refresh on date change
  }, [fromDate, toDate]);

  // PDF Export
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Ward-wise Waste Management Report", 14, 16);
    
    autoTable(doc, {
      startY: 25,
      head: [["S.no", "Ward Name", "Zone", "Total Bins", "Active Alerts", "Cleared", "Avg Response (mins)", "Tons"]],
      body: reportData.map((item, index) => [
        index + 1, item.wardname, item.zonename, item.totalbins,
        item.activebins, item.clearedCount, item.avgClearTime,
        `${item.clearedWeightKg?.toFixed(2)}`
      ])
    });
    
    doc.save(`WardReport_${fromDate}_to_${toDate}.pdf`);
  };

  // Excel Export
  const exportExcel = () => {
    const data = reportData.map((item, index) => ({
      "S.no": index + 1,
      "Ward Name": item.wardname,
      "Zone Name": item.zonename,
      "Total Bins": item.totalbins,
      "Active Alerts": item.activebins,
      "Cleared Count": item.clearedCount,
      "Avg Response (mins)": item.avgClearTime,
      "Tons Cleared": item.clearedWeightKg
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "WardReport");
    const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    saveAs(new Blob([buf]), `WardReport_${fromDate}_to_${toDate}.xlsx`);
  };

  return (
    <div>
      {/* Header */}
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

          <button className="flex items-center bg-white rounded-md px-4 py-3 text-gray-700" onClick={exportPDF}>
            Export PDF <IoMdArrowDropdown className="ml-1" />
          </button>

          <button className="flex items-center bg-white rounded-md px-4 py-3 text-gray-700" onClick={exportExcel}>
            Export Excel <IoMdArrowDropdown className="ml-1" />
          </button>
        </div>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-t-lg pl-10 pt-5 h-33 ml-5 mr-7 pr-10">
        <div className="flex items-center justify-between w-full">
          <img src={logo} alt="Logo" className="w-22 rounded-full mr-2" />
          <div className="flex-1 text-center">
            <h2 className="text-xl font-semibold">Ward-wise Report</h2>
            {fromDate && toDate && (
              <p className="text-gray-500 text-sm">
                {new Date(fromDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} — 
                {new Date(toDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
            )}
          </div>
          <div className="text-right">
            <p>Total Wards: {reportData.length}</p>
            <p className="text-sm font-medium">
              <span className="text-gray-700 font-semibold">Date:</span> {new Date().toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-b-lg pt-2 ml-5 mr-7 mt-1.5 mb-13">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full border border-light-grey text-sm text-black">
            <thead className="bg-[#EBEBEB] h-35">
              <tr>
                <th className="border border-light-grey p-6">S.no</th>
                <th className="border border-light-grey p-4">Ward Name</th>
                <th className="border border-light-grey p-4">Zone Name</th>
                <th className="border border-light-grey p-3">Total Bins</th>
                <th className="border border-light-grey p-3">Active Alerts</th>
                <th className="border border-light-grey p-3">Cleared</th>
                <th className="border border-light-grey p-3">Avg Response (mins)</th>
                <th className="border border-light-grey p-3">Tons Cleared</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center p-12">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <span>Loading ward data...</span>
                    </div>
                  </td>
                </tr>
              ) : reportData.length > 0 ? (
                reportData.map((item, index) => (
                  <tr key={`${item.wardname}-${index}`} className="text-center text-input-grey hover:bg-gray-50">
                    <td className="border border-input-grey p-4">{index + 1}</td>
                    <td className="border border-input-grey p-4 font-medium">{item.wardname}</td>
                    <td className="border border-input-grey p-4">{item.zonename}</td>
                    <td className="border border-input-grey p-4">{item.totalbins}</td>
                    <td className="border border-input-grey p-4 b font-semibold">{item.activebins}</td>
                    <td className="border border-input-grey p-4">{item.clearedCount}</td>
                    <td className="border border-input-grey p-4">{item.avgClearTime} mins</td>
                    <td className="border border-input-grey p-4 font-bold text-green-600">
                      {item.clearedWeightKg?.toFixed(2)} tons
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-12 px-4">
                    <div className="space-y-3">
                      <div className="text-3xl mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        ✅
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">No data available</h3>
                        <p className="text-gray-500 text-sm">
                          No ward clearance records for {new Date(fromDate).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="text-center text-input-grey text-sm py-4">
          Report generated on {new Date().toLocaleDateString("en-IN")} | Powered by 
          <span className="font-semibold"> Madurai Municipal Corporation</span>
        </p>
      </div>
    </div>
  );
};

export default Wardwisereport;
