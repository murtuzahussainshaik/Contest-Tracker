# Contest Tracker Documentation

# Frontend

## Overview
The Contest Tracker frontend is a responsive web application that displays upcoming and past competitive programming contests from multiple platforms (Codeforces, LeetCode, and CodeChef). It offers features such as contest filtering by platform, bookmarking favorite contests, dark mode, and integration with YouTube tutorial videos.

## Tech Stack
- **HTML5** - Structure and content
- **CSS3** - Styling and responsive design
- **JavaScript** - Client-side functionality and DOM manipulation

## Core Features

### 1. Contest Display
- Segregates contests into "Upcoming" and "Past" sections
- Shows real-time countdown for upcoming contests
- Highlights ongoing contests with visual indicators
- Displays contest details including platform, date, time, and duration

### 2. Platform Filtering
- Allows users to filter contests by platform (Codeforces, LeetCode, CodeChef)
- Maintains filter preferences during the session
- Requires at least one platform to be selected

### 3. Bookmark System
- Enables users to bookmark favorite contests
- Stores bookmarks in browser's localStorage for persistence
- Provides a dedicated section to view bookmarked contests
- Implements toggle functionality to show/hide bookmarks

### 4. Theme Toggle
- Supports light and dark mode
- Persists theme preference using localStorage
- Provides intuitive UI for switching between themes

### 5. YouTube Integration
- Displays YouTube tutorial links for past contests when available
- Implements smart matching algorithms to associate contests with relevant tutorial videos
- Provides admin functionality to manually add YouTube solution links

## DOM Structure
The frontend relies on the following key DOM elements:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Contest Tracker</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header>
      <h1>Contest Tracker</h1>
      <div class="header-controls">
        <button id="bookmarks-toggle">My Bookmarks</button>
        <button id="theme-toggle">Toggle Theme</button>
      </div>
    </header>

    <div class="container">
      <div class="filter-container">
        <div class="filter-group">
          <label>Filter by Platform:</label>
          <div class="checkbox-filters">
            <label
              ><input
                type="checkbox"
                class="platform-filter"
                value="Codeforces"
                checked
              />
              Codeforces</label
            >
            <label
              ><input
                type="checkbox"
                class="platform-filter"
                value="LeetCode"
                checked
              />
              LeetCode</label
            >
            <label
              ><input
                type="checkbox"
                class="platform-filter"
                value="CodeChef"
                checked
              />
              CodeChef</label
            >
          </div>
        </div>
        <div class="filter-actions">
          <button id="apply-filters">Apply Filters</button>
          <button id="admin-panel">Admin Panel</button>
        </div>
      </div>

      <div id="loader" class="loader"></div>

      <!-- Bookmarked contests section (initially hidden) -->
      <section
        class="contests-section bookmarked-section"
        style="display: none"
      >
        <h2>Bookmarked Contests</h2>
        <div id="bookmarked-contests" class="contest-list"></div>
      </section>

      <!-- Upcoming contests section -->
      <section class="contests-section upcoming-section">
        <h2>Upcoming & Ongoing Contests</h2>
        <div id="upcoming-contests" class="contest-list"></div>
      </section>

      <!-- Past contests section -->
      <section class="contests-section past-section">
        <h2>Past Contests</h2>
        <div id="past-contests" class="contest-list"></div>
      </section>
    </div>

    <!-- Admin Panel Modal -->
    <div id="admin-modal" class="modal">
      <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Admin Panel - Add YouTube Solutions</h2>
        <form id="youtube-form">
          <div class="form-group">
            <label for="contest-select">Select Contest:</label>
            <select id="contest-select" required>
              <option value="">-- Select a Contest --</option>
            </select>
          </div>
          <div class="form-group">
            <label for="youtube-link">YouTube Solution Link:</label>
            <input
              type="url"
              id="youtube-link"
              placeholder="https://youtube.com/..."
              required
            />
          </div>
          <button type="submit">Save</button>
        </form>
      </div>
    </div>

    <script src="script.js"></script>
  </body>
</html>

```

## JavaScript Implementation

### Event Listeners
The application initializes various event listeners on document load:

- **Theme Toggle**: Switches between light and dark modes
- **Platform Filters**: Applies selected platform filters
- **Bookmarks Toggle**: Shows/hides bookmarked contests
- **Admin Panel**: Opens modal for admin functions
- **Modal Close**: Closes admin modal when clicked outside or on close button
- **YouTube Form**: Handles form submission for adding YouTube links

### Core Functions

#### Data Fetching and Processing
```javascript
// Fetches contest data from the backend API
async function fetchContests() {
  const response = await fetch("http://localhost:3000/api/contests");
  const data = await response.json();
  allContestsData = processContestsData(data);
  displayContests();
}

// Processes raw contest data and normalizes it
function processContestsData(data) {
  // Normalize data from different platforms
  // Match contests with YouTube videos
  // Return standardized contest objects
}
```

#### Contest Display
```javascript
// Displays contests based on filter settings
function displayContests() {
  // Filter contests by selected platforms
  // Separate upcoming and past contests
  // Sort contests by start time
  // Create and append contest cards
}
```

#### Time Calculation
```javascript
// Calculates time remaining for a contest
function calculateTimeRemaining(contestDate, contestTime, duration) {
  // Determine if contest is upcoming, ongoing, or past
  // Calculate days/hours/minutes remaining
  // Return status and formatted time string
}
```

#### Bookmark System
```javascript
// Toggles bookmark status for a contest
function toggleBookmark(contestId) {
  // Add or remove from bookmarked contests array
  // Save to localStorage
  // Update UI if necessary
}
```

#### Admin Functions
```javascript
// Populates contest select dropdown in admin panel
function populateContestSelect() {
  // Filter for past contests
  // Create option elements
  // Append to select dropdown
}
```

## Local Storage Management
The application uses **localStorage** for persistent storage of:

- **Bookmarked contests**: An array of contest IDs
- **YouTube solution links**: Contest ID to YouTube URL mappings
- **Theme preference**: Dark mode enabled/disabled

## Auto-updating Mechanism
The application implements a timer to periodically refresh contest data:

```javascript
// Updates time remaining every minute
function startTimeRemainingUpdater() {
  timerInterval = setInterval(async () => {
    await fetchContests();
  }, 60000); // 60000 ms = 1 minute
}
```

## Integration with Backend
The frontend communicates with the backend through a RESTful API:

- **Endpoint**: `http://localhost:3000/api/contests`
- **Method**: `GET`
- **Response Format**: JSON object containing contest data and YouTube videos

## Planned Enhancements
- **User Authentication**: Enable personalized experiences across devices
- **Contest Notifications**: Implement browser notifications for upcoming contests
- **Advanced Filtering**: Add filtering by difficulty, duration, and contest type
- **Contest Registration**: Direct links to contest registration pages
- **Contest Statistics**: Display participation statistics for past contests
- **Collaborative Bookmarks**: Share bookmarked contests with teammates




#  Backend 

## Overview
The Contest Tracker backend is a Node.js application that aggregates competitive programming contest information from multiple platforms (Codeforces, LeetCode, and CodeChef) and enriches it with related YouTube tutorials. This system provides a centralized API for tracking upcoming and ongoing coding contests along with educational resources.

## Tech Stack
- **Node.js** - JavaScript runtime environment  
- **Express** - Web application framework  
- **Axios** - Promise-based HTTP client for API requests  

## Project Structure
```
contesttracker/
├── config/
│   └── constants.js        # API endpoints and configuration
├── controllers/
│   └── contestController.js # Controllers for handling requests
├── routes/
│   └── contestRoutes.js    # API route definitions
├── services/
│   └── fetchContests.js    # Services for fetching contest data
├── .env                    # Environment variables
├── .gitignore             # Git ignore file
├── package-lock.json      # Dependencies lock file
├── package.json           # Project metadata and dependencies
└── server.js              # Main application entry point
```

## Core Components

### 1. API Integration
The application integrates with multiple external APIs:

#### Contest Data Sources:
- **Codeforces API**: Fetches contest information from Codeforces
- **LeetCode GraphQL API**: Retrieves contest schedules from LeetCode
- **CodeChef API**: Obtains contest details from CodeChef

#### Educational Content:
- **YouTube Data API**: Fetches related tutorial videos for each platform

### 2. Data Processing
The backend processes and standardizes data from different sources into a consistent format, handling:
- Different time formats and timezones
- Varying contest status terminologies
- Pagination for YouTube playlist data

### 3. API Endpoints

#### `GET /api/contests`
Returns aggregated contest data from all platforms along with related YouTube tutorials.

**Response format:**
```json
{
  "codeforces": [...],  // Codeforces contests
  "leetcode": [...],    // LeetCode contests
  "codechef": [...],    // CodeChef contests
  "codeforcesYoutube": [...],  // Codeforces tutorial videos
  "leetcodeYoutube": [...],    // LeetCode tutorial videos
  "codechefYoutube": [...]     // CodeChef tutorial videos
}
```

## Implementation Details

### Services (`fetchContests.js`)
This module handles data retrieval from external APIs:

1. **Contest Data Collection**
   - `fetchCodeforcesContests()`: Retrieves and filters contests from Codeforces
   - `fetchLeetcodeContests()`: Fetches contests via LeetCode's GraphQL API
   - `fetchCodechefContests()`: Gets both upcoming and past contests from CodeChef

2. **YouTube Integration**
   - `fetchCodeforcesYoutubePlaylist()`: Retrieves tutorial videos for Codeforces problems
   - `fetchLeetcodeYoutubePlaylist()`: Fetches tutorial videos for LeetCode problems
   - `fetchCodechefYoutubePlaylist()`: Gets tutorial videos for CodeChef problems

   These functions implement pagination to handle large playlists, retrieving all available videos.

### Controllers (`contestController.js`)
The controller orchestrates parallel API calls using `Promise.all` to efficiently fetch data from all sources simultaneously.

### Routes (`contestRoutes.js`)
Defines the API endpoint that triggers the data aggregation process.

### Configuration (`constants.js`)
Centralizes all external API endpoints and playlist IDs for easy maintenance.

### Server Setup (`server.js`)
Configures the Express application with necessary middleware and routes.

## Data Flow
1. Client sends request to `/api/contests`
2. The controller initiates parallel API calls to all data sources
3. Services fetch and process data from external APIs
4. The processed data is combined and returned as a single JSON response

## Error Handling
The application implements robust error handling:
- Each API call is wrapped in try/catch blocks
- Failed API requests return empty arrays instead of breaking the application
- Detailed error logging for debugging purposes
- Appropriate HTTP status codes for error responses

## Security Considerations
- CORS middleware enables cross-origin requests
- API keys are managed securely (should be moved to environment variables)
- Error messages are sanitized to prevent sensitive information exposure

## Planned Enhancements
- Add user authentication for personalized features
- Introduce database storage for contest bookmarking
- Enhance error handling with more detailed client messages



## Screenshots of Project


