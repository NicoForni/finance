import React, { useEffect, useState } from 'react';
import PositionService from 'services/position-service';
import { UIPosition } from 'types/positions';

const useFetchPositions = () => {
    const [positions, setPositions] = useState<UIPosition[]>([]);
    const [loading, setLoading] = useState(false);
  console.log('positions:', positions);

  const fetchPositions = async () => {
    try {
        setLoading(true);
      const positionService = new PositionService();
      const fetchedPositions = await positionService.fetchCurrentPositions('0xe48746D77c4c7fc42F35f565724eEE096eC9B16e');
      setPositions(fetchedPositions);
    } catch (error) {
      console.error('Error fetching positions:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPositions();
  }, []);

    return {positions, fetchPositions, loading}
}

export default useFetchPositions;