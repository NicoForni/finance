import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Typography from '@mui/material/Typography';
import { UIPosition } from 'types/positions';
import { formatBigInt } from 'utils/bigIntParsing';
import styled from '@emotion/styled';
import PositionService from 'services/position-service';
import Alert from '@mui/material/Alert';

interface SinglePositionProps {
  position: UIPosition
}

const StyledTitle = styled.div`
  display: flex;
  align-items: center;
`;

const SinglePosition: React.FC<SinglePositionProps> = ({ position }) => {
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [positionState, setPositionState] = useState<UIPosition>(position);
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);

  function timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const handleModifyPosition = async () => {
    try {
      const positionService = new PositionService();
      const newTransactionId = await positionService.modifyPosition();
      setTransactionId(newTransactionId);
      // Llama a fetchTransaction después de haber obtenido el newTransactionId
    const transactionStatus = await positionService.getPositionTransactionStatus(newTransactionId);
    // Actualiza el estado con el estado de la transacción
    setTransactionStatus(transactionStatus);
      setSuccessAlert(true);
      setErrorAlert(false);
    } catch (error) {
      console.error('Error modifying position:', error);
      setTransactionId(null);
      setTransactionStatus(null);
      setSuccessAlert(false);
      setErrorAlert(true);
    }
  };
  useEffect(() => {
    if (transactionId) {
      const fetchTransactionStatus = async () => {
        try {
          const positionService = new PositionService();
          // Simula el tiempo que tomaría encontrar la transacción real
          await timeout(500);
          const status = await positionService.getPositionTransactionStatus(transactionId);
          setTransactionStatus(status);
        } catch (error) {
          console.error('Error fetching transaction status:', error);
        }
      };

      fetchTransactionStatus();
    }
  }, [transactionId]);

  const handleClosePosition = () => {
    // Modificar el objeto de posición con rate y remainingLiquidity en 0
    const updatedPosition = {
      ...position,
      rate: BigInt(0),
      remainingLiquidity: BigInt(0),
    };

    // Actualizar el estado de la posición con los nuevos valores
    setPositionState(updatedPosition);
    setSuccessAlert(true);
    setErrorAlert(false);
  };
  const handleWithdrawFromPosition = () => {
    // Modificar el objeto de posición con toWithdraw en 0
    const updatedPosition = {
      ...position,
      toWithdraw: BigInt(0),
    };
    setPositionState(updatedPosition);
    setSuccessAlert(true);
    setErrorAlert(false);
  };
  useEffect(() => {
    if (successAlert || errorAlert) {
      const timeoutId = setTimeout(() => {
        setSuccessAlert(false);
        setErrorAlert(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }

    if (transactionStatus) {
      const timeoutId = setTimeout(() => {
        setTransactionStatus(null);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [successAlert, errorAlert]);

  const handleAddFunds = () => {
  const addedFunds = positionState.rate * BigInt(positionState.remainingSwaps);

  // Convertir el bigint a number (solo si no hay riesgo de pérdida de precisión)
  const remainingLiquidityUsdNumber = Number(addedFunds);

  // Actualizar el objeto de posición con los nuevos valores
  const updatedPosition = {
    ...positionState,
    remainingLiquidity: addedFunds,
    remainingLiquidityUsd: remainingLiquidityUsdNumber,
  };

  setPositionState(updatedPosition);
  setSuccessAlert(true);
  setErrorAlert(false);
};

return(
  <Card>
    <CardContent>
      <Typography variant='h6' gutterBottom component={StyledTitle}>
        {positionState.from.symbol}
        <ArrowForwardIcon />
        {positionState.to.symbol}
      </Typography>
      <Typography variant="body1">
        {positionState.from.symbol} remaining: {formatBigInt(positionState.remainingLiquidity, positionState.from.decimals)} (${positionState.remainingLiquidityUsd} USD)
      </Typography>
      <Typography variant="body1">
        {positionState.to.symbol} to withdraw: {formatBigInt(positionState.toWithdraw, positionState.to.decimals)} (${positionState.toWithdrawUsd} USD)
      </Typography>
      <Typography variant="body1">
        Rate: {formatBigInt(positionState.rate, positionState.from.decimals)} {positionState.from.symbol} (${positionState.rateUsd} USD)
      </Typography>
      <Typography variant="body1">
        Remaining Liquidity: {formatBigInt(positionState.remainingLiquidity, positionState.from.decimals)} {positionState.from.symbol} (${positionState.remainingLiquidityUsd} USD)
      </Typography>
      <Typography variant="body1">
        Executed swaps: {positionState.totalSwaps - positionState.remainingSwaps};
      </Typography>
      <Typography variant="body1">
        Remaining swaps: {positionState.remainingSwaps};
      </Typography>
      <Typography variant="body1">
        Swapping {formatBigInt(positionState.rate, positionState.from.decimals)} {positionState.from.symbol} (${positionState.rateUsd} USD) every {positionState.swapInterval.toString()} seconds
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small" onClick={handleModifyPosition}>Modify position</Button>
      {transactionId && (
          <Typography variant="body2">
            Transaction ID: {transactionId}
          </Typography>
        )}
      <Button size="small" onClick={handleWithdrawFromPosition}>Withdraw from position</Button>
      <Button size="small" onClick={handleClosePosition}>Close position</Button>
      <Button size="small" onClick={handleAddFunds}>Add Funds</Button>
    </CardActions>
    {successAlert && (
        <Alert severity="success">Action was successful!!</Alert>
      )}
      {errorAlert && (
        <Alert severity="error">An error occurred while performing the action, try again.</Alert>
      )}
      {transactionStatus && (
        <Alert severity={transactionStatus === 'SUCCESS' ? 'success' : 'error'}>
          Transaction Status: {transactionStatus}
        </Alert>
      )}
  </Card>
)
};

export default React.memo(SinglePosition);
