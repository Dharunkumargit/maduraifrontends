import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../../../const";
import Title from "../../../components/Title";
import logo from "../../../assets/images/MaduraiLogo.png";
import { IoMdArrowDropdown } from "react-icons/io";
import { useNavigate } from "react-router";

const Zonewisereport = () => {
  const navigate = useNavigate();
  const [zones, setZones] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const getZoneReport = async () => {
    try {
      const res = await axios.get(`${API}/zone/getzones`);
      setZones(res.data.data);
    } catch (error) {
      console.log("Zone Report Fetch Error:", error);
    }
  };

  useEffect(() => {
    getZoneReport();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 mr-4">
        <div>
          <Title title="Reports" sub_title="Table" page_title="Reports" />
        </div>

        <div className="flex items-center space-x-3">
          {/* DATE INPUTS */}
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

          <button className="flex items-center bg-white rounded-md px-4 py-3 text-gray-700">
            Export <IoMdArrowDropdown className="ml-1" />
          </button>

          <button className="bg-darkest-blue text-white rounded-md px-5 py-3">
            Continue
          </button>
        </div>
      </div>

      {/* Top Header Card */}
      <div className="bg-white rounded-t-lg pl-10 pt-5 h-33 ml-5 mr-7 pr-10">
        <div className="flex items-center justify-between w-full">

          <img src={logo} alt="Logo" className="w-22 rounded-full mr-2" />

          <div className="flex-1 text-center">

            <h2 className="text-xl font-semibold">Zone-wise Report</h2>

            {/* ==== SHOW DATE RANGE === */}
            {fromDate && toDate && (
              <p className="text-gray-500 text-sm mt-1">
                {fromDate} — {toDate}
              </p>
            )}

          </div>

          <div className="text-right">
            <p className="text-sm font-medium">
              <span className="text-gray-700 font-semibold">Date:</span>{" "}
              {new Date().toLocaleDateString()}
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
                <th className="border border-light-grey p-3">Zone Name</th>
                <th className="border border-light-grey p-3">
                  Total Bins Installed
                </th>
                <th className="border border-light-grey p-3">Active Alerts</th>
                <th className="border border-light-grey p-3">
                  No of Times cleared
                </th>
                <th className="border border-light-grey p-3">
                  Average Response Time
                </th>
                <th className="border border-light-grey p-3">
                  TAT Compliance (%)
                </th>
                <th className="border border-light-grey p-3">
                  No. of Escalations
                </th>
                <th className="border border-light-grey p-3">
                  Total Garbage Collected (Tons)
                </th>
              </tr>
            </thead>

            <tbody>
              {zones.length > 0 ? (
                zones.map((item, index) => (
                  <tr key={item._id} className="text-center text-input-grey">
                    <td className="border border-input-grey p-4">{index + 1}</td>

                    <td className="border border-input-grey p-4">
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

                    {/* Avg Response */}
                    <td className="border border-input-grey p-4">
                      {item.avgClearTime} mins
                    </td>

                    {/* TAT */}
                    <td className="border border-input-grey p-4">
                      {item.tatCompliance} %
                    </td>

                    {/* Static temporary */}
                    <td className="border border-input-grey p-4">0</td>
                    <td className="border border-input-grey p-4">{item.totalGarbageTons} tons</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="text-center text-gray-500 border p-4"
                  >
                    No Data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="text-center text-input-grey text-sm py-4">
          Report generated on {new Date().toLocaleDateString()} &nbsp;&nbsp;
          Powered by{" "}
          <span className="font-semibold">
            madurai municipal corporation
          </span>
        </p>
      </div>
    </div>
  );
};

export default Zonewisereport;
