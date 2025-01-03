# exchange-app-be
## Description

`exchange-app-be` is the backend service for the Exchange App, providing APIs for currency exchange rates and transactions.

## Features

- Fetch real-time exchange rates
- Perform currency conversions
- Manage user transactions
- Authentication and authorization

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/exchange-app-be.git
    ```
2. Navigate to the project directory:
    ```sh
    cd exchange-app-be
    ```
3. Install dependencies:
    ```sh
    npm install
    ```

## Usage

1. Start the development server:
    ```sh
    npm run dev
    ```
2. Access the API at `http://localhost:3000`

## Environment Variables

Create a `.env` file in the root directory and add the following variables:
```
PORT=3000
DATABASE_URL=your_database_url
API_KEY=your_api_key
```

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a pull request

## License

This project is licensed under the MIT License.