import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { fetchAllSales } from '../utils/graphApis'; // Adjust the path as needed

const SalesChart = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const getSalesData = async () => {
      try {
        const sales = await fetchAllSales();
        setSalesData(sales);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    getSalesData();
  }, []);

  const data = {
    labels: salesData.map(sale => sale._id), // Customize as needed
    datasets: [
      {
        label: 'Sales Amount',
        data: salesData.map(sale => sale.totalAmount),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <Bar data={data} />
    </div>
  );
};

export default SalesChart;
