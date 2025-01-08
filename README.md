# Financial Data Filtering App

This is a web application built using React that allows users to filter and view financial data based on various criteria such as date range, revenue, and net income. The app fetches financial data from an external API and provides an interactive UI for filtering and sorting the results in a table format.

## Live Demo

You can access the live demo of the app here:  
[Live Demo on Netlify](https://comforting-malasada-7caa3b.netlify.app/)

## GitHub Repository

You can find the source code of this project here:  
[GitHub Repository](https://github.com/DummuMounika/financial-data-filtering-app)

## Features

- **Data Fetching**: The app fetches data from the [Financial Modeling Prep API](https://financialmodelingprep.com/api/v3/income-statement/AAPL) for the company "Apple Inc." (AAPL).
- **Filters**: 
  - Date Range (Start and End Date)
  - Revenue (Min and Max)
  - Net Income (Min and Max)
- **Sorting**: The data can be sorted by columns like Date, Revenue, and Net Income, with toggling between ascending and descending order.
- **Pagination**: The data is paginated, showing 5 items per page with navigation controls for previous and next pages.
- **Error Handling**: Includes an error boundary to catch unexpected issues and display a fallback UI.

## Technologies Used

- **React**: JavaScript library for building user interfaces.
- **DatePicker**: For selecting date ranges.
- **Helmet**: For managing changes to the document head, such as setting the page title.
- **Tailwind CSS**: For responsive and styled UI components.
- **FinancialModelingPrep API**: For fetching real-time financial data.

## How to Run the Project Locally

1. Clone this repository:
   ```bash
   git clone https://github.com/DummuMounika/financial-data-filtering-app.git
2. Install dependencies:
    ```bash
    npm install
3.  Start the development server:
     ```bash
    npm start
This will launch the app in your browser at http://localhost:3000.

## How to Deploy

The app is deployed on Netlify. Here’s a summary of the deployment steps:

1. Push your code to GitHub.
2. Go to Netlify.
3. Sign up or log in.
4. Create a new site from GitHub.
5. Select the repository for this project.
6. Netlify will automatically build and deploy the app.
7. You will receive a live URL for your deployed app.

## Contributing

Feel free to fork this repository and submit pull requests. If you have any suggestions, issues, or improvements, please create an issue on the GitHub repository.