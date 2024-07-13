# Web3 Wingman

Web3 Wingman is the ultimate safeguard and digital insurance for critical
situations. Users can designate funds from their wallet, choose a receiver, and
set a future transfer date. If unforeseen circumstances arise, Web3 Wingman
will automatically transfer the funds.

## How It Works:

1. Connect your Safe Wallet or create a new one.
2. Create a Backup: name it, enter the receiver's wallet, set the amount and
   transfer date.
3. Edit or cancel your backup before the transfer date.
4. Web3 Wingman sends the funds automatically on the specified date.

# Project Structure

Web3 Wingman consists of three main parts:

- `contracts`: ERC-7579 Module smart contract that handles the secure transfer
  of funds based on user conditions.
- `frontend`: The user interface for interacting with the project. Users can
  connect their wallet, create and manage backups, and set transfer conditions
  through a simple and intuitive interface.
- `backend`: Responsible for executing transfers for backups when their
  scheduled time arrives.
