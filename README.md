<h1 align="center" id="title">Map Store</h1>

<p id="description">Map Store is a full-stack MERN application that allows users to choose a location on a map, capture the visible region and apply it as a texture to a 3D cuboid using BabylonJS. The application demonstrates proficiency in frontend development with ReactJS backend development with Node.js, Express.js and database management with MongoDB. Additionally the app incorporates advanced features like caching user authentication and annotation functionality.</p>

<h2>🚀 Demo</h2>

[https://map-store.netlify.app/](https://map-store.netlify.app/)

<h2>🧐 Features</h2>

Here're some of the project's best features:

### Frontend:

- **Map Integration**: Users can choose a location on the map using Google Maps.
- **Region Display**: The app displays the visible region on the map.
- **Capture Map Image**: A button allows users to capture the visible map region as an image.
- **3D Rendering**: The captured image is applied as a material (texture) to a 3D cuboid using BabylonJS.
- **Map Annotations**: Map Capturing comes with saving of Title and notes to it along with Edit option in future.
- **Maps Log**: Option to view previously saved views.
- **Maps Download**: Option to Download the saved map in png format.
- **Users Dashboarding**: Dashboard to create & view of Users along with password change page.
- **Responsive UI**: The app is designed to be responsive and user-friendly.
  <br />

### Backend:

- **Save Map Data**: Captured images and map data are saved to a MongoDB database via a Node.js server.
- **Retrieve Map Data**: Endpoints are provided to retrieve and display saved map data and images.
- **State Management**: Users can save and reload the state of the map captures.
- **Top Regions Identification**: An algorithm identifies and returns the top three most frequently captured regions.
- **Caching**: Implemented a caching mechanism to improve the performance of frequently accessed map data.
- **User Management**: Users can be created with password setting & password changing features.
- **JWT Authentication**: JWT Authentication with Redis storage of tokens & 30 minutes Idle token removal management.

<br />
<br />
<h2>🛠️ Installation Steps:</h2>
<br />
<p>1. Node.js (v18+)</p>

```
npm run start:dev //(if nodemon is available with you then use "npm run start:dev-nodemon")
```

<p>2. MongoDB</p>

<p>3. Redis (for caching)</p>

<p>4. A VPS or server with HTTPS enabled for backend deployment</p>

<p>5. Netlify or any other platform for frontend deployment</p>

<p>6. React NPM</p>

```
npm start
```

  <br />
<br />
<h2>💻 Built with</h2>

Technologies used in the project:

- Frontend:- ReactJS Google Maps API BabylonJS SASS & Material-UI
- Backend:- Node.js Express.js & Mongoose
- Database:- MongoDB
- Caching:- Redis
- Authentication:- JSON Web Tokens (JWT)
- Deployment:- Netlify (Frontend) & VPS/Server with HTTPS (Backend MongoDB & Redis via Docker Containerizations)

<br />
<br />

## API Endpoints

The API wise break up has been provided with Swagger API documentation in the link of http://92.205.63.217:40000/api-docs/#/
<br />
<br />

## Advanced Redis Integration for Enhanced Performance and Security

<br />

## Overview

In this application, Redis is strategically integrated to optimize both security and performance. By leveraging Redis's in-memory data structure capabilities, the application efficiently manages user authentication tokens and optimizes map data retrieval. This approach not only enhances user experience by reducing latency but also ensures robust session management.
<br />

## Redis Use Cases

<br />

### 1. Token Management and Session Security

**Purpose**: To enhance security and manage user sessions effectively.

**Mechanism**:

- **Token Storage**: Upon user authentication, a unique token is generated and stored in Redis as a key-value pair with the `userEmail` as the key and the token as the value.
- **Session Timeout Handling**: Alongside the token, a timestamp is stored to track the last activity time of the user.
- **Request Validation**: For every incoming request, the application checks the timestamp stored in Redis. If the time difference between the current request and the stored timestamp exceeds 30 minutes, the token is invalidated, effectively logging the user out.
- **Continuous Time Update**: With each valid request, the timestamp is updated to the current time, ensuring active sessions remain valid.
  <br />

**Benefits**:

- **Enhanced Security**: Automatically logs users out after a period of inactivity, reducing the risk of unauthorized access.
- **Efficient Resource Utilization**: Tokens are only stored for active sessions, reducing memory usage.

<br />

### 2. Optimized Map Data Caching

**Purpose**: To improve performance by caching frequently accessed map data.

**Mechanism**:

- **Frequency Tracking**: Each time a user accesses a map view, a counter in MongoDB is incremented to track the frequency of access.
- **Data Caching**: The most frequently accessed map views (based on the MongoDB counter) are stored in Redis. The cached data includes the base64 image and the corresponding map metadata.
- **Quick Retrieval**: When a user accesses a frequently viewed map, the data is served from Redis instead of querying MongoDB, significantly reducing latency.
  <br />

**Benefits**:

- **Reduced Latency**: Serving data from Redis is faster than querying from MongoDB, providing a smoother user experience.
- **Load Balancing**: The combined use of Redis and MongoDB ensures that both databases share the load, preventing any single point from becoming a bottleneck.

<br />
<br />
<br />

## Identifying Top Three Most Frequently Captured Regions

<br />
<b>Objective</b>: To provide insights into the most popular areas captured by users, an endpoint was created to process map data and return the top three most frequently captured regions. This was accomplished using an efficient aggregation algorithm designed to handle large datasets.

<br />
<br />

**Implementation**:

To achieve this, we utilized MongoDB's powerful aggregation framework. The key steps involved in the aggregation pipeline are:

1. **Grouping**:

   - The map data is grouped based on the latitude (`lat`), longitude (`lng`), and zoom level (`zoom`).
   - For each unique combination of these fields, a `count` field is calculated by summing the occurrences.

<br />

**Sorting**:

The results from the grouping stage are then sorted in descending order based on the count field, ensuring that the most frequently captured regions appear first.
<br />

**Limiting**:

Finally, the aggregation pipeline is limited to return only the top three results, providing the most frequently captured regions.

**Benefits**:

- **Efficient Data Processing**: This aggregation method is designed to efficiently process large datasets, making it scalable as the volume of map data increases.
- **Actionable Insights**: By identifying the top three most captured regions, this endpoint can offer valuable insights into user behavior and preferences.



## Repo Cloning & Production Access
- **Cloning**: To Clone the repo, hit the URL in bash with command as git clone https://github.com/Nehemiah27/map-store.git
- **Production**: To Access production Database, hit the URL "mongodb://map_store_db_owner:i5u3h1PHb61@92.205.63.217:40001/map_store" in the Mongoose Compass
