const axios = require("axios");
const {
  CODEFORCES_API,
  LEETCODE_API,
  CODECHEF_API,
  YOUTUBE_API,
  LEETCODE_PLAYLIST,
  CODECHEF_PLAYLIST,
  CODEFORCES_PLAYLIST,
} = require("../config/constants");

// Fetch Codeforces Contests
const fetchCodeforcesContests = async () => {
  try {
    const response = await axios.get(CODEFORCES_API);
    return response.data.result.filter(
      (contest) =>
        contest.phase === "BEFORE" ||
        contest.phase === "FINISHED" ||
        contest.phase === "CODING"
    );
    // return response.data;
  } catch (error) {
    console.error("Error fetching Codeforces contests:", error);
    return [];
  }
};

// Fetch Leetcode Contests
const fetchLeetcodeContests = async () => {
  try {
    const response = await axios.post(
      LEETCODE_API,
      {
        query: `
            query {
              allContests {
                title
                startTime
                duration
              }
            }
          `,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const contests = response.data.data.allContests || [];

    return contests.map((contest) => ({
      name: contest.title,
      platform: "Leetcode",
      date: new Date(contest.startTime * 1000).toISOString().split("T")[0], // Convert UNIX timestamp to date
      time: new Date(contest.startTime * 1000)
        .toISOString()
        .split("T")[1]
        .slice(0, 5), // Convert to HH:MM format
      duration: contest.duration / 60 + " min", // Convert seconds to minutes
    }));
  } catch (error) {
    console.error(
      "Error fetching Leetcode contests:",
      error.response?.data || error.message
    );
    return [];
  }
};

// Fetch CodeChef Contests
const fetchCodechefContests = async () => {
  try {
    const response = await axios.get(CODECHEF_API);

    const obj = {
      codechef: [
        ...response.data.future_contests,
        ...response.data.past_contests,
      ],
    };
    return obj.codechef;
  } catch (error) {
    console.error("Error fetching CodeChef contests:", error);
    return [];
  }
};

//Fetch youtube api for codeforces playlist
const fetchCodeforcesYoutubePlaylist = async () => {
  try {
    let allItems = [];
    let nextPageToken = null;

    do {
      const response = await axios.get(YOUTUBE_API, {
        params: {
          part: "snippet",
          maxResults: 50,
          playlistId: CODEFORCES_PLAYLIST,
          key: "AIzaSyCGKYP0vI7bBGe4YXUUDAMn-4SNYabnWaI",
          pageToken: nextPageToken,
        },
      });

      if (response.data && Array.isArray(response.data.items)) {
        // Add current page of items to our collection
        allItems = [...allItems, ...response.data.items];

        // Get token for next page if available
        nextPageToken = response.data.nextPageToken;
      } else {
        // Break the loop if we don't get expected data
        nextPageToken = null;
      }
    } while (nextPageToken);

    // Process and return all items
    return allItems.map((item) => ({
      title: item.snippet.title,
      videoId: item.snippet.resourceId.videoId,
      videoUrl: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
    }));
  } catch (error) {
    console.error("Error fetching codeforces playlist from youtube", error);
    return [];
  }
};

//Fetch youtube api for leetcode playlist
const fetchLeetcodeYoutubePlaylist = async () => {
  try {
    let allItems = [];
    let nextPageToken = null;

    do {
      const response = await axios.get(YOUTUBE_API, {
        params: {
          part: "snippet",
          maxResults: 50,
          playlistId: LEETCODE_PLAYLIST,
          key: "AIzaSyCGKYP0vI7bBGe4YXUUDAMn-4SNYabnWaI",
          pageToken: nextPageToken,
        },
      });

      if (response.data && Array.isArray(response.data.items)) {
        // Add current page of items to our collection
        allItems = [...allItems, ...response.data.items];

        // Get token for next page if available
        nextPageToken = response.data.nextPageToken;
      } else {
        // Break the loop if we don't get expected data
        nextPageToken = null;
      }
    } while (nextPageToken);

    // Process and return all items
    return allItems.map((item) => ({
      title: item.snippet.title,
      videoId: item.snippet.resourceId.videoId,
      videoUrl: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
    }));
  } catch (error) {
    console.error("Error fetching leetcode playlist from youtube", error);
    return [];
  }
};

//Fetch youtube api for codechef playlist
const fetchCodechefYoutubePlaylist = async () => {
  try {
    let allItems = [];
    let nextPageToken = null;

    do {
      const response = await axios.get(YOUTUBE_API, {
        params: {
          part: "snippet",
          maxResults: 50,
          playlistId: CODECHEF_PLAYLIST,
          key: "AIzaSyCGKYP0vI7bBGe4YXUUDAMn-4SNYabnWaI",
          pageToken: nextPageToken,
        },
      });

      if (response.data && Array.isArray(response.data.items)) {
        // Add current page of items to our collection
        allItems = [...allItems, ...response.data.items];

        // Get token for next page if available
        nextPageToken = response.data.nextPageToken;
      } else {
        // Break the loop if we don't get expected data
        nextPageToken = null;
      }
    } while (nextPageToken);

    // Process and return all items
    return allItems.map((item) => ({
      title: item.snippet.title,
      videoId: item.snippet.resourceId.videoId,
      videoUrl: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
    }));
  } catch (error) {
    console.error("Error fetching codechef playlist from youtube", error);
    return [];
  }
};

module.exports = {
  fetchCodeforcesContests,
  fetchLeetcodeContests,
  fetchCodechefContests,
  fetchCodeforcesYoutubePlaylist,
  fetchLeetcodeYoutubePlaylist,
  fetchCodechefYoutubePlaylist,
};
