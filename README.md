# iReport

iReport is a web application that enables citizens to report local issues and track their resolution through an interactive map. The platform provides dedicated functionality for citizens, municipal officers, and administrators.

## Live Demo

[Live Demo](http://130.61.226.91:8000/)

---

## MVP Features

### Interactive Map

* Interactive map displaying reported issues as markers
* Report details panel
* Filtering by:

  * Category
  * Status

### Reports

Users can create and manage reports containing:

* Category selection
* Description
* Location:

  * Select location by clicking on the map
  * Use current device location
* Status tracking:

  * New
  * In Progress
  * Resolved
  * Rejected

### User Features

* Registration using email and password
* Login and authentication
* "My Reports" page displaying submitted reports

### Officials Features

* View all submitted reports
* Update report status

## Technology Stack

### Frontend

* React
* TypeScript
* Vite

### Backend

* ASP.NET Core
* Entity Framework Core

### Database

* PostgreSQL

---

## User Roles

### Citizen


* Register and log in
* Submit reports
* View own reports
* Track report status

### Officer
* View all reports
* Change report status

### Administrator
* Manage user roles

