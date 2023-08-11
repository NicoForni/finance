import React from "react";
import PositionService from "services/position-service";

const PositionServiceContext = React.createContext<{
  positionService: PositionService;
}>({
  positionService: new PositionService(),
});

export default PositionServiceContext
