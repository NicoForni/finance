import React from 'react';
import PositionServiceContext from 'contexts/positionServiceContext';

function usePositionService() {
  const context = React.useContext(PositionServiceContext);

  return context.positionService;
}

export default usePositionService;
