import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label, labelFormatter, valueFormatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        {label && (
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            {labelFormatter ? labelFormatter(label) : label}
          </p>
        )}
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            <span className="font-medium">{entry.name}:</span>{' '}
            {valueFormatter ? valueFormatter(entry.value) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Line Chart Component
export const LineChartComponent = ({ 
  data, 
  xKey, 
  yKey, 
  title,
  color = '#3b82f6',
  height = 300,
  showGrid = true,
  showLegend = false
}) => {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
          <XAxis 
            dataKey={xKey} 
            className="text-xs text-gray-600 dark:text-gray-400"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            className="text-xs text-gray-600 dark:text-gray-400"
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}
          <Line 
            type="monotone" 
            dataKey={yKey} 
            stroke={color} 
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Area Chart Component
export const AreaChartComponent = ({ 
  data, 
  xKey, 
  yKey, 
  title,
  color = '#3b82f6',
  height = 300,
  showGrid = true,
  showLegend = false
}) => {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
          <XAxis 
            dataKey={xKey} 
            className="text-xs text-gray-600 dark:text-gray-400"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            className="text-xs text-gray-600 dark:text-gray-400"
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}
          <Area 
            type="monotone" 
            dataKey={yKey} 
            stroke={color} 
            fill={color}
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Bar Chart Component
export const BarChartComponent = ({ 
  data, 
  xKey, 
  yKey, 
  title,
  color = '#3b82f6',
  height = 300,
  showGrid = true,
  showLegend = false
}) => {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
          <XAxis 
            dataKey={xKey} 
            className="text-xs text-gray-600 dark:text-gray-400"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            className="text-xs text-gray-600 dark:text-gray-400"
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}
          <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Pie Chart Component
export const PieChartComponent = ({ 
  data, 
  dataKey, 
  nameKey,
  title,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  height = 300,
  showLegend = true
}) => {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey={nameKey}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Multi-line Chart Component
export const MultiLineChart = ({ 
  data, 
  xKey, 
  lines = [], // [{ key: 'value1', color: '#3b82f6', name: 'Series 1' }]
  title,
  height = 300,
  showGrid = true,
  showLegend = true
}) => {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
          <XAxis 
            dataKey={xKey} 
            className="text-xs text-gray-600 dark:text-gray-400"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            className="text-xs text-gray-600 dark:text-gray-400"
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              stroke={line.color}
              strokeWidth={2}
              name={line.name}
              dot={{ fill: line.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: line.color, strokeWidth: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default {
  LineChartComponent,
  AreaChartComponent,
  BarChartComponent,
  PieChartComponent,
  MultiLineChart
};
