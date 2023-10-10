## Introduction

The idea of this exercise is to set up an SPA that gives information and allows to view and modify Mean Finance positions for a user and present a dashboard of the current status of a user investments.

Mean Finance is a decentralized platform that enables users to automate their DeFi (Decentralized Finance) strategies in a permissionless and flexible manner. It allows users to automatically execute recurring buy or sell orders on any Ethereum-based token in a decentralized way.

The key concept of Mean Finance is the "position". A position represents a series of recurring sell orders (DCA orders) for a particular asset. Once a position is created, the platform's smart contracts autonomously execute the specified orders at the defined intervals, requiring no further user intervention.

For example, a user might create a position to buy $50 worth of ETH every day, or sell 10 DAI every week, etc. This "set and forget" strategy automates the dollar-cost averaging (DCA) investment approach, which aims to reduce the impact of volatility on large purchases of financial assets.

Dollar Cost Averaging (DCA) is a strategy where you invest a fixed amount into an asset at regular intervals, aiming to reduce the impact of price volatility and potentially lowering the average cost per unit over time.

## What you need to do
Mean Finance current main product is one that allows to do DCA (Dollar Cost Average) between different tokens. Simply, it allows a user to set an order (or a `Position`) to sell an specified amount of tokens to buy another token in a set interval (every day, every week, etc) for a specific amount of time.

Let's go over an example to try to make things clearer. Let's say John has some DAI and he wants to buy WETH. If he wanted to buy 5 DAI worth of WETH daily, for a year, his position would look like this:
- **From**: DAI
- **To**: WETH
- **Rate**: 5 DAI
- **Amount of swaps**: 365
- **Swap interval**: daily

For the goal of this challenge we need you to create a React SPA that displays a dashboard/summary of a user's Mean Finance positions and a specific page for each position.

### Main Dashboard:
- **Display a List**: Showcase all positions owned by the user.
- **USD Summary**: Provide a summary of the amount of USD a user holds on Mean Finance.
- **Position Links**: Each position should be clickable, redirecting the user to a detailed view of that specific position.

### Position Detail Page:
- **Include Details**:
  - **Rate**: The rate of the position.
  - **Remaining Liquidity**: The remaining liquidity of `from` token for the position.
  - **To Withdraw**: How much the user can withdraw of `to` token.
  - **Swap Interval**: How frequently the position will swap.
  - **Swap Progress**: Show the count of remaining swaps for the position.
- **Actions**:
  - **Withdraw**: Allows users to withdraw all tokens marked "toWithdraw". This sets the `toWithdraw` of the position to `0`.
  - **Add Funds**: Modifies only the rate of the position and the remainingLiquidity (which can be calculated as `rate * remainingSwaps`), without changing its remainingSwaps count.
  - **Close Position**: This action sets the `rate` and `remainingLiquidity` to 0 and sets the `toWithdraw` of the position to `0`.
- **State Synchronization**: Any change made on this page should be reflected in real-time on the main dashboard. The state of the positions should be shared between screens, this means that if a modification for a position was made on the Position detail page, the change should be reflected on the dashboard/summary

### Technical Details:
- **Position Modification**:
  - Utilize the `modifyPosition` method from the Position Service for any position changes.
  - This method currently contains a timeout function to mimic an API call duration - you can adjust its functionality but don't remove the timeout call.
  - Ensure position modifications persist throughout the user session. However, it's acceptable if these changes are lost upon browser refresh.
- **Modification Status**:
  - The `modifyPosition` method returns a unique identifier.
  - Use this identifier with `getPositionTransactionStatus` to fetch the status of the modification to determine if it's in a pending state, successful, or if it failed.
  - For example, when you modify a status you might get the id `2`. If you ask for the current status immediately, then it will most probably be `PENDING`. However, after a few seconds or minutes, it should return either `SUCCESS` or `FAILURE`. You should programatically poll for the status of a position modification.z
- **Optimistic UI**:
  - Apply user-triggered updates to the UI immediately.
  - In case the underlying postion modification ends up with `FAILURE`, roll back the specific position modification to its previous state.


A Mean Finance position consist of the following data:

 - *From*: The token that the user wants **to sell**, it is represented by 4 attributes
    - `address`: A hexadecimal unique identifier for the specific token
    - `decimals`: The amount of decimals that this token uses for its amounts
    - `name`: The full name of the token
    - `symbol`: A shortened name for the token
 - *To*: The token that the user wants **to buy**, represented by the same 4 attributes as the `From` token
 - *User*: The user for which the Mean Finance position **belongs to**
 - *Swap Interval*: The set interval expressed **in seconds** that the user selected that the swaps for their position wanted to be executed in (for example, 3600 = 'Every hour')
 - *Remaining Swaps*: The amount of swaps **left** for the position to be completed
 - *Total Swaps*: The **total** amount of swaps that the user set this position to swap
 - *Rate*: The amount of `from` tokens that the position **will swap** every time
 - *Remaining Liquidity*: The amount of `from` tokens that have **not been swapped** yet
 - *To Withdraw*: The amount of `to` tokens that the positions **has already been swapped** and the user **can withdraw**
 - *Swaps*: A collection of all the swaps that Mean Finance has executed on the position, each item contains
    - `swapped`: The amount of `to` tokens that the user got on the swap,
    - `rate`: The amount of `from` tokens that were used on the swap
    - `timestamp`: The timestamp of when the swap was executed, in seconds
 - *Status*: The status of the position it can be either one of two options
    - `ACTIVE`: The position still has pending swaps
    - `COMPLETED`: The position has no pending swaps

### modifyPosition
This method will submit the position modification to the API and return a unique identifier to poll for the modification status

### getPositionTransactionStatus
This method will return either 'PENDING', 'SUCCESS' or 'FAILURE' based on the transaction status of a specific position modification id (returned by `modifyPosition`)

### getUsdPrice
This method receives an array of Token addresses and returns the USD price for each one as a `Record<tokenAddress, usdPrice>`. It optionally accepts a `date` as a UNIX timestamp to fetch the price for a specific point in time.
