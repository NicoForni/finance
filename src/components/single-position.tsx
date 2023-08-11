import React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Typography from '@mui/material/Typography';
import { UIPosition } from 'types/positions';
import { formatBigInt } from 'utils/bigIntParsing';
import styled from '@emotion/styled';

interface SinglePositionProps {
  position: UIPosition
}

const StyledTitle = styled.div`
  display: flex;
  align-items: center;
`;

const SinglePosition: React.FC<SinglePositionProps> = ({ position }) => (
  <Card>
    <CardContent>
      <Typography variant='h6' gutterBottom component={StyledTitle}>
        {position.from.symbol}
        <ArrowForwardIcon />
        {position.to.symbol}
      </Typography>
      <Typography variant="body1">
        {position.from.symbol} remaining: {formatBigInt(position.remainingLiquidity, position.from.decimals)} (${position.remainingLiquidityUsd} USD)
      </Typography>
      <Typography variant="body1">
        {position.to.symbol} to withdraw: {formatBigInt(position.toWithdraw, position.to.decimals)} (${position.toWithdrawUsd} USD)
      </Typography>
      <Typography variant="body1">
        Executed swaps: {position.totalSwaps - position.remainingSwaps};
      </Typography>
      <Typography variant="body1">
        Remaining swaps: {position.remainingSwaps};
      </Typography>
      <Typography variant="body1">
        Swapping {formatBigInt(position.rate, position.from.decimals)} {position.from.symbol} (${position.rateUsd} USD) every {position.swapInterval.toString()} seconds
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small">Modify position</Button>
      <Button size="small">Withdraw from position</Button>
      <Button size="small">Close position</Button>
    </CardActions>
  </Card>
)

export default React.memo(SinglePosition);
