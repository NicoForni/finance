
# FE Challenge

## Before starting
This challenge aims to tackle problems very similar to what Mean's team does on a day to day basis. There are some terms related to cryptocurrencies, but no prior knowledge is needed to attempt the challenge. If you'd like to attempt this challege, please:
1. Clone this repository (but **make it private**)
2. Perform the tasks described below
3. Give access to [our account](https://github.com/MeanFinance) on your repository
3. Contact us at [hiring@mean.finance](mailto:hiring@mean.finance) with your repository's link and we'll follow up from there 🫡

We encourage you to tackle this challenge as you would normally work on other projects. Feel free to look up any information or algorithms that might help you achieve the defined goals.

Also, we would be more than happy to hear your feedback (good or bad) about the exercise to learn and make it better. Feel free to send all comments, suggestions and ideas to [hiring@mean.finance](mailto:hiring@mean.finance).

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

## What is already there?

There is already a minimal implementation of a React SPA project, built in Typescript and using React Router DOM for SPA navigation.

[Material UI](https://mui.com/material-ui/getting-started/) is already provided and set up but you can change it to whichever component library that you feel comfortable with, this is just to save you time.

There are 3 routes defined:
 - `/`: The home page of the app
 - `/dashboard`: The dashboard displayed for searching for user positions
 - `/positions/:positionId`: The specific position page, using `useParams` from React Router DOM you can get the `positionId` param.

There are also 2 componentes provided:
 - `Layout`: Provides some layout to the application
 - `SinglePosition`: This component renders receives a `position` prop that already has the usd values for the tokens hydrated and displays it in a `Card`
You are free to modify each component to your liking

There is also a PositionService already provided that allows:
 - fetching a specific user positions through [The Graph](https://thegraph.com/), which is a GraphQl api,
 - fetching the current price of a token
 - getting the current status of an ongoing modification.

There is also a hook provided to use the `PositionService` so you can use its capabilities.

Finally there is a util provided to format numbers with decimals represented with BigInts into their decimal format.

### BigInt Parsing
Tokens often need to represent amounts less than 1, like 0.5 or 0.001. However, the systems they're built on, like Ethereum, can't handle these small, fractional numbers directly.

So, they use a trick: instead of trying to deal with tiny fractions, they just deal with very large whole numbers, in our case we use Javascripts BigInt.

Imagine it like dealing with pennies instead of dollars. Instead of saying you have $1.23, you could say you have 123 pennies. That way, you can just deal with whole numbers and not worry about fractions.

Each token uses a custom amount of decimals. For the previous example, a USD token would look like this
```
{
  address: '0xusdDollarAddress',
  decimals: 2,
  name: 'United States Dollar',
  symbol: 'USD'
}
```

The exported function `formatBigInt` allows passing a BigInt value and a decimals value and it will format the BigInt value to a decimal representation. Based on the previous example for USD you would call it like this `formatBigInt(123n, 2)` and it will return `1.23`.

As for a Mean Finance position example you could do `formatBigInt(position.toWithdraw, position.to.decimals)` to get the decimal representation of the `toWithdraw` of a position of a user

### Position Service

#### fetchCurrentPositions

This method will allow fetching any existing user Mean Finance positions, for the challenge you can use the `0xe48746D77c4c7fc42F35f565724eEE096eC9B16e` user/address to fetch some positions.

A Mean Finance position allows a user to swap `rate` amount of `from` tokens and buy the corresponding amount of `to` tokens in a set interval (every hour, every day, every week, etc) that the user chooses for an amount of time that the user wants.

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
