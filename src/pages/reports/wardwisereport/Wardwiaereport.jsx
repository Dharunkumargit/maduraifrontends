import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "../../../assets/images/MaduraiLogo.png";
import { IoMdArrowDropdown } from "react-icons/io";
import Title from "../../../components/Title";
import { API } from "../../../../const";

const Wardwiaereport = () => {
  const [reportData, setReportData] = useState([]);

  // API CALL FUNCTION
  const fetchWardReport = async () => {
    try {
      const res = await axios.get(`${API}/ward/getwards`);

      setReportData(res.data.data);
    } catch (error) {
      console.log("Ward Report Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchWardReport();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 mr-4">
        <div>
          <Title title="Reports" sub_title="Table" page_title="Reports" />
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <input
              type="date"
              placeholder="From"
              className=" bg-white rounded-md pl-6 pr-4 py-3 focus:outline-none"
            />
          </div>

          <div className="relative">
            <input
              type="date"
              placeholder="To"
              className=" bg-white rounded-md pl-6 pr-4 py-3 focus:outline-none"
            />
          </div>

          <button className="flex items-center justify-between bg-white rounded-md px-4 py-3 text-gray-700">
            Export <IoMdArrowDropdown className="ml-1" />
          </button>

          <button className="bg-darkest-blue text-white rounded-md px-5 py-3">
            Continue
          </button>
        </div>
      </div>

      <div className="bg-white rounded-t-lg  pl-10 pt-5 h-33 ml-5 mr-7 pr-10  ">
        <div className="flex items-center justify-between w-full">
          <div className="flex-">
            <img src={logo} alt="Logo" className="w-22  rounded-full mr-2" />
          </div>

          <div className="flex-1 text-center">
            <h2 className="text-xl font-semibold">Ward-wise Report</h2>
            <p className="text-gray-500 text-sm">01.10.2025 - 10.10.2025</p>
          </div>

          <div className="text-right ">
            <p className="text-sm font-medium">
              <span className="text-gray-700 font-semibold">Date:</span>{" "}
              10.10.2025
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-b-lg  pt-2 ml-5 mr-7  mt-1.5 mb-13">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full border border-light-grey text-sm  text-black">
            <thead className="bg-[#EBEBEB] h-35">
              <tr>
                <th className="border border-light-grey p-6  ">S.no</th>
                <th className="border border-light-grey p-4 ">Ward Name </th>
                <th className="border border-light-grey p-4 ">Zone Name</th>
                <th className="border border-light-grey p-3 ">
                  Total Bins Installed
                </th>
                <th className="border border-light-grey p-3 ">Active Alerts</th>
                <th className="border border-light-grey p-3 ">
                  No of Times cleared
                </th>
                <th className="border border-light-grey p-3 ">
                  Average Response Time
                </th>
                <th className="border border-light-grey p-3 ">
                  TAT Compliance (%)
                </th>
                <th className="border border-light-grey p-3 ">
                  No. of Escalations
                </th>
                <th className="border border-light-grey p-3 ">
                  Total Garbage Collected (Tons)
                </th>
              </tr>
            </thead>

            <tbody>
              {reportData.map((item, index) => (
                <tr key={item._id} className="text-center text-input-grey">
                  <td className="border border-input-grey p-4">{index + 1}</td>
                  <td className="border border-input-grey p-4">
                    {item.wardname}
                  </td>
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
                    {item.clearedCount}
                  </td>
                  <td className="border border-input-grey p-4">
                    {item.avgClearTime}
                  </td>
                  <td className="border border-input-grey p-4">
                    {item.compliance}
                  </td>
                  <td className="border border-input-grey p-4">
                    {item.escalations}
                  </td>
                  <td className="border border-input-grey p-4">
                    {item.clearedWeightKg} Tons
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-center text-input-grey text-sm  py-4">
          Report generated on 10.01.2025 &nbsp; &nbsp; Powered by{" "}
          <span className="font-semibold">madurai municipal corporation</span>
        </p>
      </div>
    </div>
  );
};

export default Wardwiaereport;
