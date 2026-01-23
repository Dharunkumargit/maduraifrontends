import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "../../../assets/images/MaduraiLogo.png";
import { IoMdArrowDropdown } from "react-icons/io";
import Title from "../../../components/Title";
import { API } from "../../../../const";

const Binwisereport = () => {
  const today = new Date().toISOString().split("T")[0];
  const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "";

  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};


  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // -------------------------
  // Fetch bins once
  // -------------------------
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`${API}/bins/getallbins`);
    
        
        if (res.data.success) {
          setReportData(res.data.data);
          setFilteredData(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch bin report:", error);
      }
    };

    fetchReport();
  }, []);

  // -------------------------
  // Filter based on date range
  // -------------------------
  useEffect(() => {
    if (!fromDate || !toDate) return;

    const from = new Date(fromDate);
    from.setHours(0, 0, 0, 0);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);

    const filtered = reportData.filter((item) => {
      if (!item.lastReportedAt) return false;
      const reportedDate = new Date(item.lastReportedAt);
      return reportedDate >= from && reportedDate <= to;
    });

    setFilteredData(filtered);
  }, [fromDate, toDate, reportData]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 mr-4">
        <Title title="Reports" sub_title="Table" page_title="Reports" />

        <div className="flex items-center space-x-3">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="bg-white rounded-md pl-6 pr-4 py-3 focus:outline-none"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="bg-white rounded-md pl-6 pr-4 py-3 focus:outline-none"
          />

          <button className="flex items-center bg-white rounded-md px-4 py-3 text-gray-700">
            Export <IoMdArrowDropdown className="ml-1" />
          </button>

          <button className="bg-darkest-blue text-white rounded-md px-5 py-3">
            Continue
          </button>
        </div>
      </div>

      {/* Report Title */}
      <div className="bg-white rounded-t-lg pl-10 pt-5 h-34 ml-5 mr-7 pr-10">
        <div className="flex items-center justify-between">
          <img src={logo} alt="Logo" className="w-22 rounded-full" />

          <div className="text-center">
            <h2 className="text-xl font-semibold">Bin-wise Report</h2>
            <p className="text-gray-500 text-sm">
             {formatDisplayDate(fromDate)} - {formatDisplayDate(toDate)}
            </p>
          </div>

          <div className="text-right text-sm">
            <span className="font-semibold">Date:</span>{" "}
            {new Date().toLocaleDateString("en-IN")}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-b-lg pt-2 ml-5 mr-7 mt-1.5 mb-13">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full border border-light-grey text-sm text-black">
            <thead className="bg-[#EBEBEB]">
              <tr>
                <th className="border p-4">S.no</th>
                <th className="border p-4">Bin ID</th>
                <th className="border p-4">Ward</th>
                <th className="border p-4">Zone</th>
                <th className="border p-4">Filled %</th>
                <th className="border p-4">Times Cleared</th>
                <th className="border p-4">Avg Response (mins)</th>
                <th className="border p-4">Status</th>
                <th className="border p-4">Total Collected</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item._id} className="text-center text-input-grey">
                    <td className="border p-3">{index + 1}</td>
                    <td className="border p-3">{item.binid}</td>
                    <td className="border p-3">{item.ward}</td>
                    <td className="border p-3">{item.zone}</td>
                    <td className="border p-3">{item.filled}%</td>
                    <td className="border p-3">{item.clearedCount}</td>
                    <td className="border p-3">{item.avgClearTimeMins}</td>
                    <td className="border p-3">{item.status}</td>
                    <td className="border p-3">
                      {item.totalClearedAmount} Tons
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center p-4 text-gray-500">
                    No data for selected date range
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="text-center text-input-grey text-sm py-4">
          Report generated on {new Date().toLocaleDateString("en-IN")} &nbsp;
          Powered by <span className="font-semibold">Madurai Municipal Corporation</span>
        </p>
      </div>
    </div>
  );
};

export default Binwisereport;
