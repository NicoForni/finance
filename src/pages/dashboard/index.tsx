import SinglePosition from 'components/single-position';
import useFetchPositions from 'hooks/useFetchPositions';
import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const { positions, loading } = useFetchPositions();

  return (
    <div>
      <h1>Tablero Principal</h1>
      <ul>
        {!loading ? positions.map((position) => (
          <li key={position.id}>
            <SinglePosition position={position} />
          </li>
        )) : <p>Loading...</p>}
      </ul>
    </div>
  );
}

export default Dashboard;
