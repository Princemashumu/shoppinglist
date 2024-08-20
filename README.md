# Shopping List Application

## Overview

The Shopping List Application is a React-based app that allows users to manage their shopping items. The app provides functionality to add, edit, delete, and categorize items into different sections like Fruit & Veg, Meat, Beverages, and Bathing. Users can also share their shopping lists and see the total cost for each category. 

Key features include:
- Adding, editing, and deleting items in different categories.
- Viewing the total cost for each category.
- Sharing the grocery list through the browser's share functionality.
- Responsive design with a modern UI.

### Usage
- Add Items: Use the "Add Item" button to add new items to each category.
- Edit Items: Click the edit button to modify existing items.
- Delete Items: Use the delete button to remove items from the list.
- Share List: Click the share button to share your grocery list using the browser's share functionality.
### License
This project is licensed under the MIT License.

### Contributing
If you would like to contribute to this project, please fork the repository and submit a pull request with your changes.

### Contact
For any questions or issues, please contact princengwakomashumu@gmail.com.
## Installation

To get started with the Grocery List Application, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/princemashumu/shoppinglist.git
cd shoppinglist
2. Install Dependencies
Make sure you have Node.js installed. Then, run the following command to install the required dependencies:

bash
Copy code
npm install
3. Set Up the JSON Server
If you are using JSON Server for local development, set up the JSON Server as follows:

Create a db.json file in the root directory with the required structure.

Install JSON Server globally if not already installed:

bash
Copy code
npm install -g json-server
Start the JSON Server:

bash
Copy code
json-server --watch db.json --port 5000
4. Run the Application
Start the React application with:

bash
Copy code
npm start
This will open the application in your default web browser at http://localhost:3000.

5. Build the Application
To create a production build of the application, use:

bash
Copy code
npm run build
This will generate a build directory with optimized files for deployment.

