
import React, { useState } from 'react'
import { HiChevronDown } from 'react-icons/hi';
import {
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    BarChart,
} from "recharts";

const ChartTitle = ({
    title,
    data = [],
    colors = [],
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState("Daily");

    return (
        <div>
            <div className="bg-lightest-blue p-5 border-3 border-white rounded-xl h-80">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    
                    <div className="relative w-28 text-sm">
                        {/* Dropdown commented out - ready when needed */}
                    </div>
                </div>

                <div className="w-full">
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart 
                            data={data}
                            barCategoryGap="35%"           // Perfect left spacing
                            margin={{ top: 15, left: 0, right: 0, bottom: 15 }}
                        >
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: "#6b7280", fontWeight: 500 }}
                                padding={{ left: 20, right: 25 }}
                            />
                            <YAxis 
                                hide
                                type="number"
                            />
                            <Tooltip 
                                formatter={(value) => [`${Number(value).toFixed(1)} Tons`, 'Daily Waste']}
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    padding: '12px'
                                }}
                            />

                            <Bar
                                dataKey="value"
                                maxBarSize={38}
                                barSize={26}
                                name="Waste Cleared"
                                shape={(props) => {
                                    const { x, y, width, height, index, payload } = props;
                                    const colorObj = colors[index % colors.length] || colors[0];
                                    const { fill, stroke } = typeof colorObj === 'object' 
                                        ? colorObj 
                                        : { fill: colorObj, stroke: '#374151' };
                                    
                                    return (
                                        <g>
                                            <rect
                                                x={x + 4}
                                                y={y}
                                                width={Math.min(width - 8, 30)}
                                                height={height}
                                                fill={fill}
                                                rx={4}
                                                stroke="none"
                                            />
                                            <line
                                                x1={x + 4}
                                                x2={x + Math.min(width - 8, 30)}
                                                y1={y}
                                                y2={y}
                                                stroke={stroke}
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                            />
                                        </g>
                                    );
                                }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default ChartTitle;
