# Finance Dashboard

A web-based application that allows users to visualize their financial data using various charts. Users can upload their financial data by scanning a QR code generated by the application and view the visualized data in real-time.

## Features

- Upload financial data using a QR code scanner
- View visual representations of expenses, incomes, and investments
- Multiple chart types including bar charts, pie charts, line charts, and stacked bar charts
- Responsive and user-friendly UI

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript, Chart.js
- **Backend:** Django, Python
- **Database:** SQLite (or any Django-supported database)
- **Mobile:** Flutter for QR code scanning and data uploading

## Installation and Setup

### Clone the Repository

    git clone https://github.com/your-username/finance-dashboard.git
    cd finance-dashboard

### Set Up Python Environment

Ensure you have Python and pip installed. Create and activate a virtual environment:

    python3 -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`

### Install Django and Other Dependencies

    pip install -r requirements.txt

### Run Migrations

    python manage.py migrate

### Start the Django Development Server

    python manage.py runserver

### Start the Web Application

Open your browser and go to `http://127.0.0.1:8000` to view the Finance Dashboard.

### Scan the QR Code

Use the [Flutter mobile app](https://github.com/ManuelCLopes/finance_tracker) to scan the QR code displayed on the dashboard to upload financial data.
Flutter mobile app: https://github.com/ManuelCLopes/finance_tracker

### View Data

Once the data is uploaded, the dashboard will automatically refresh to display the updated charts.

## Folder Structure

- `finance_dashboard/` - Django project folder
- `qrscanner/` - Django app for handling QR code generation and data reception
- `static/` - Static files including JavaScript, CSS, and images
- `templates/` - HTML templates for rendering the web pages

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any features or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgements

- Chart.js for data visualization
- Django for the backend framework
