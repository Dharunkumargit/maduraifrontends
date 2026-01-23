import React from "react";
import Title from "../../components/Title";
import SummaryCard from "../../components/SummaryCard";
import { HiOutlineTrash } from "react-icons/hi";
import DonutChart from "../../components/DonutChart";
import {
  Barcolors,
  Bardata,
  Piechartprojectdata,
  Projectcolor,
} from "../../components/Data";
import ChartTitle from "../../components/ChartTitle";
import { TbReportAnalytics, TbTrashX } from "react-icons/tb";

const Dashboard = () => {
  const binsData = [
    { id: 1, zone: "Zone", bin: 4, waste: "5 Ton" },
    { id: 2, zone: "Zone", bin: 4, waste: "5 Ton" },
    { id: 3, zone: "Zone", bin: 4, waste: "5 Ton" },
    { id: 4, zone: "Zone", bin: 4, waste: "5 Ton" },
  ];

  const wardsdata = [
    { ward: "ward", bin: "4", waste: "5 Ton" },
    { ward: "ward", bin: "4", waste: "5 Ton" },
    { ward: "ward", bin: "4", waste: "5 Ton" },
    { ward: "ward", bin: "4", waste: "5 Ton" },
  ];

  const hotspotdata = [
    { location: "Arappalayam", waste: "5 Ton" },
    { location: "Arappalayam", waste: "5 Ton" },
    { location: "Arappalayam", waste: "5 Ton" },
    { location: "Arappalayam", waste: "5 Ton" },
  ];

  const escalationdata = [
    { engineer: "Name", escalation: "5" },
    { engineer: "Name", escalation: "5" },
    { engineer: "Name", escalation: "5" },
    { engineer: "Name", escalation: "5" },
  ];

  return (
    <div className="h-full mb-30 mr-3">
     
      <Title
        title="Dashboard"
        sub_title="Main Dashboard"
        page_title="Main Dashboard"
      />

      <div className="mt-4 space-y-3 overflow-y-auto h-full no-scrollbar">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
          <SummaryCard
            status="Waste collected"
            value="80  Tons"
            title="Total Waste Collected"
            icon={<HiOutlineTrash size={20} />}
          />
          <SummaryCard
            status="Waste Collected"
            value="12  Tons"
            title="Month Wise Waste Collected"
            icon={<HiOutlineTrash size={20} />}
          />
          <SummaryCard
            status="Waste Collected"
            value="24  Tons"
            title="Average Waste Collected"
            icon={<HiOutlineTrash size={20} />}
          />
          <SummaryCard
            status="Collected Bins"
            value="24 Tons"
            title="Waste Collected"
            icon={<TbTrashX  size={21} />}
          />
          <SummaryCard
            status="Active Alerts"
            value="24"
            title="Active Bins"
            icon={<TbTrashX  size={21} />}
          />
          <SummaryCard
            title="Excellence"
            value="43"
            status="Total Escalations"
            icon={<TbReportAnalytics size={21} />}
          />
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <DonutChart
            title="HotSpot-Zone Wise"
            data={Piechartprojectdata}
            colors={Projectcolor}
          />

          <ChartTitle
            title="Daily Waste Collection"
            data={Bardata}
            colors={Barcolors}
          />

          
          <div className="bg-lightest-blue rounded-xl border-3 border-white font-roboto-flex">
            <div className="mb-6 pt-6 px-5">
              <h2 className="text-base font-semibold text-black">
                Zone Wise Bins
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden mt-2">
                <thead>
                  <tr className="bg-white text-center text-black font-semibold border-b-3 border-light-blue ">
                    <th className="py-4 px-4 text-sm">S.No</th>
                    <th className="py-4 px-4 text-sm">Zone</th>
                    
                    <th className="py-4 px-4 text-sm">Waste Collected</th>
                  </tr>
                </thead>
                <tbody>
                  {binsData.map((bin, index) => (
                    <tr
                      key={bin.id}
                      className="text-gray-600 border-b-2 border-light-blue last:border-none text-center text-sm"
                    >
                      <td className="py-3 px-4 text-sm">{index + 1}</td>
                      <td className="py-3 px-4 text-sm">{bin.zone}</td>
                      
                      <td className="py-3 px-4 text-sm">{bin.waste}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

       
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          
          <div className="bg-lightest-blue rounded-xl border-3 border-white h-74 font-roboto-flex">
            <h2 className="text-base font-semibold p-4 text-black">
              Top 10 Wards
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-xl overflow-hidden">
                <thead>
                  <tr className="bg-white text-center text-black font-bold border-b-3 border-light-blue text-sm">
                    <th className="py-4 px-5 text-sm">S.no</th>
                    <th className="py-4 px-5 text-sm">Ward</th>
                    
                    <th className="py-4 px-5 text-sm">Waste collected</th>
                  </tr>
                </thead>
                <tbody>
                  {wardsdata.map((bin, index) => (
                    <tr
                      key={index}
                      className="text-light-grey border-b-2 border-light-blue last:border-none text-center text-sm"
                    >
                      <td className="py-3 px-5 text-sm">{index + 1}</td>
                      <td className="py-3 px-5 text-sm">{bin.ward}</td>
                     
                      <td className="py-3 px-5 text-sm">{bin.waste}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          
          <div className="bg-lightest-blue rounded-xl border-3 border-white h-74 font-roboto-flex">
            <h2 className="text-base font-semibold p-4 text-black">
              Top 10 Hotspot
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-white text-center text-black font-semibold border-b-3 border-light-blue text-sm">
                    <th className="py-4 px-5 text-sm">S.no</th>
                    <th className="py-4 px-5 text-sm">Location</th>
                    <th className="py-4 px-5 text-sm">Waste collected</th>
                  </tr>
                </thead>
                <tbody>
                  {hotspotdata.map((bin, index) => (
                    <tr
                      key={index}
                      className="text-light-grey border-b-2 border-light-blue last:border-none text-center text-sm"
                    >
                      <td className="py-3 px-5 text-sm">{index + 1}</td>
                      <td className="py-3 px-5 text-sm">{bin.location}</td>
                      <td className="py-3 px-5 text-sm">{bin.waste}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

         
          <div className="bg-lightest-blue rounded-xl border-3 border-white h-74">
            <h2 className="text-base font-semibold p-4 text-black">
              Top 10 Escalation
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-white text-center text-black font-semibold border-b-3 border-light-blue text-sm">
                    <th className="py-4 px-5 ">S.no</th>
                    <th className="py-4 px-5 text-sm">Engineer</th>
                    <th className="py-4 px-5 text-sm">Escalation</th>
                  </tr>
                </thead>
                <tbody>
                  {escalationdata.map((bin, index) => (
                    <tr
                      key={index}
                      className="text-light-grey border-b-2 border-light-blue last:border-none text-center text-sm"
                    >
                      <td className="py-3 px-5 text-sm">{index + 1}</td>
                      <td className="py-3 px-5 text-sm">{bin.engineer}</td>
                      <td className="py-3 px-5 text-sm">{bin.escalation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
