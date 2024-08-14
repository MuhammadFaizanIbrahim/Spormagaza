import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { fetchAllOrders } from '../utils/graphApis'; // Adjust the path as needed

const OrdersChart = () => {
  const [ordersData, setOrdersData] = useState([]);

  useEffect(() => {
    const getOrdersData = async () => {
      try {
        const orders = await fetchAllOrders();
        setOrdersData(orders);
      } catch (error) {
        console.error('Error fetching orders data:', error);
      }
    };

    getOrdersData();
  }, []);

  const data = {
    labels: ordersData.map(order => order._id), // Customize as needed
    datasets: [
      {
        label: 'Orders Amount',
        data: ordersData.map(order => order.totalPrice),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <Line data={data} />
    </div>
  );
};

export default OrdersChart;
