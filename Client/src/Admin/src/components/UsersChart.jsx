import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { fetchUsersCount } from '../utils/graphApis'; // Adjust the path as needed

const UsersChart = () => {
  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    const getUsersCount = async () => {
      try {
        const count = await fetchUsersCount();
        setUsersCount(count);
      } catch (error) {
        console.error('Error fetching users count:', error);
      }
    };

    getUsersCount();
  }, []);

  const data = {
    labels: ['Users'],
    datasets: [
      {
        data: [usersCount],
        backgroundColor: ['rgba(255, 206, 86, 0.6)'],
        borderColor: ['rgba(255, 206, 86, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <Doughnut data={data} />
    </div>
  );
};

export default UsersChart;
