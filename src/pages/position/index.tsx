import React from 'react';
import { useParams } from 'react-router-dom';

const PositionPage = () => {
  let { positionId } = useParams();

  return (
    <div>
      Specific position page for position {positionId} goes here
    </div>
  )
}

export default PositionPage;
