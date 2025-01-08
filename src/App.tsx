import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Helmet } from "react-helmet";

const API_URL =
  "https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey=4xsw1pz8tN1kCN8V3cen9zKCV764Ghqi";

// Custom Hook for Fetching Data
const useFetchData = (url: string) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const json = await response.json();
        if (Array.isArray(json)) {
          setData(json);
        } else {
          throw new Error("Unexpected API response format");
        }
      } catch (error: any) {
        setError(error.message || "An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

// Error Boundary for Fallback UI
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong. Please try again later.</h2>;
    }
    return this.props.children;
  }
}

// Reusable Table Component
const Table: React.FC<{
  data: any[];
  onSort: (field: string) => void;
  sortField: string;
  sortDirection: "asc" | "desc";
}> = ({ data, onSort, sortField, sortDirection }) => (
  <div className="overflow-x-auto">
    <table className="w-full mt-4 border-collapse border border-gray-300">
      <thead>
        <tr>
          <th
            onClick={() => onSort("date")}
            className="cursor-pointer border border-gray-300 px-4 py-2"
          >
            Date {sortField === "date" && (sortDirection === "asc" ? "↑" : "↓")}
          </th>
          <th
            onClick={() => onSort("revenue")}
            className="cursor-pointer border border-gray-300 px-4 py-2"
          >
            Revenue {sortField === "revenue" && (sortDirection === "asc" ? "↑" : "↓")}
          </th>
          <th
            onClick={() => onSort("netIncome")}
            className="cursor-pointer border border-gray-300 px-4 py-2"
          >
            Net Income {sortField === "netIncome" && (sortDirection === "asc" ? "↑" : "↓")}
          </th>
          <th className="border border-gray-300 px-4 py-2">Gross Profit</th>
          <th className="border border-gray-300 px-4 py-2">EPS</th>
          <th className="border border-gray-300 px-4 py-2">Operating Income</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td className="border border-gray-300 px-4 py-2">{item.date}</td>
            <td className="border border-gray-300 px-4 py-2">{item.revenue}</td>
            <td className="border border-gray-300 px-4 py-2">{item.netIncome}</td>
            <td className="border border-gray-300 px-4 py-2">{item.grossProfit}</td>
            <td className="border border-gray-300 px-4 py-2">{item.eps}</td>
            <td className="border border-gray-300 px-4 py-2">{item.operatingIncome}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const App: React.FC = () => {
  const { data, loading, error } = useFetchData(API_URL);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    startDate: null as Date | null,
    endDate: null as Date | null,
    minRevenue: null as number | null,
    maxRevenue: null as number | null,
    minNetIncome: null as number | null,
    maxNetIncome: null as number | null,
  });
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const applyFilters = () => {
    let tempData = [...data];

    const { startDate, endDate, minRevenue, maxRevenue, minNetIncome, maxNetIncome } = filters;

    if (startDate || endDate) {
      tempData = tempData.filter((item) => {
        const itemDate = new Date(item.date);
        if (startDate && itemDate < startDate) return false;
        if (endDate && itemDate > endDate) return false;
        return true;
      });
    }

    if (minRevenue !== null || maxRevenue !== null) {
      tempData = tempData.filter((item) => {
        if (minRevenue !== null && item.revenue < minRevenue) return false;
        if (maxRevenue !== null && item.revenue > maxRevenue) return false;
        return true;
      });
    }

    if (minNetIncome !== null || maxNetIncome !== null) {
      tempData = tempData.filter((item) => {
        if (minNetIncome !== null && item.netIncome < minNetIncome) return false;
        if (maxNetIncome !== null && item.netIncome > maxNetIncome) return false;
        return true;
      });
    }

    setFilteredData(tempData);
    setCurrentPage(1);
  };

  const handleSort = (field: string) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    const sortedData = [...filteredData].sort((a, b) => {
      if (a[field] < b[field]) return direction === "asc" ? -1 : 1;
      if (a[field] > b[field]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setSortField(field);
    setSortDirection(direction);
    setFilteredData(sortedData);
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <ErrorBoundary>
      <Helmet>
        <title>Financial Data Filtering App</title>
      </Helmet>
      <div className="p-4 dark:bg-gray-800 dark:text-white">
        <h1 className="text-2xl font-bold mb-4">Financial Data Filtering App</h1>
        {loading && <div>Loading data...</div>}
        {error && <div className="text-red-500">{error}</div>}

        {/* Filters */}
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col space-y-2">
          <label>Date Range:</label>
          <DatePicker
            selected={filters.startDate}
            onChange={(date) => setFilters((prev) => ({ ...prev, startDate: date }))}
            placeholderText="Start Date"
            className="border p-2 w-full"
          />
          <DatePicker
            selected={filters.endDate}
            onChange={(date) => setFilters((prev) => ({ ...prev, endDate: date }))}
            placeholderText="End Date"
            className="border p-2 w-full"
          />
        </div>
          <div>
            <label>Revenue (Min - Max):</label>
            <input
              type="number"
              placeholder="Min Revenue"
              className="border p-2 w-full"
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, minRevenue: Number(e.target.value) || null }))
              }
            />
            <input
              type="number"
              placeholder="Max Revenue"
              className="border p-2 w-full mt-2"
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, maxRevenue: Number(e.target.value) || null }))
              }
            />
          </div>
          <div>
            <label>Net Income (Min - Max):</label>
            <input
              type="number"
              placeholder="Min Net Income"
              className="border p-2 w-full"
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, minNetIncome: Number(e.target.value) || null }))
              }
            />
            <input
              type="number"
              placeholder="Max Net Income"
              className="border p-2 w-full mt-2"
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, maxNetIncome: Number(e.target.value) || null }))
              }
            />
          </div>
        </div>
        <button
          onClick={applyFilters}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Apply Filters
        </button>

        {/* Data Table */}
        <Table
          data={paginatedData}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />

        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"}`}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {Math.ceil(filteredData.length / itemsPerPage)}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredData.length / itemsPerPage)))
            }
            disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
            className={`px-4 py-2 rounded ${
              currentPage === Math.ceil(filteredData.length / itemsPerPage)
                ? "bg-gray-300"
                : "bg-blue-500 text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;
