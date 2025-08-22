# Complaint & Ticketing Portal

A web-based platform for managing user complaints, support tickets, and their resolutions. It provides an easy way for users to raise issues and for admins/staff to track, prioritize, and resolve them.

## 🚀 Features

* User authentication and role-based access (User / Admin)
* Submit new complaints or support tickets
* Track ticket status (Open, In Progress, Resolved, Closed)
* Comment and update on tickets
* Admin dashboard for managing complaints
* Search, filter, and sort tickets

## 🛠️ Tech Stack

* **Frontend**: React / HTML, CSS, JavaScript
* **Backend**: Node.js + Express
* **Database**: MongoDB 
* **Authentication**: JWT / Firebase Auth 
* **Deployment**: Vercel + Render

## 📦 Installation

1. Clone the repo

   ```bash
   git clone https://github.com/your-username/complaint-ticketing-portal.git
   cd complaint-ticketing-portal
   ```

2. Install dependencies

   * For frontend

     ```bash
     npm install
     ```
   * For backend

     ```bash
     cd backend
     npm install
     ```

3. Setup environment variables

   * Create a `.env` file in the backend folder and add:

     ```env
     PORT=5000
     DB_URI=your_database_uri
     JWT_SECRET=your_secret_key
     ```

4. Run the project

   * Backend

     ```bash
     cd backend
     node server.js
     ```
   * Frontend

     ```bash
     npm start
     ```

5. Open in browser

   ```
   http://localhost:3000
   ```

## 📂 Project Structure

```
complaint-ticketing-portal/
│── backend/        # Frontend React app
│── public/        # Static assets
│── src/        # All pages 
│── README.md
```

## 🔑 User Roles

* **User**: Can raise complaints, check status, comment.
* **Admin/Staff**: Can view all tickets, update status, assign, close tickets.

## 📝 Future Enhancements

* File upload support for complaints
* SMS alerts

## 🤝 Contributing

Contributions are welcome! Fork the repo and submit a pull request.

## 📜 License

This project is licensed under the MIT License.

---

