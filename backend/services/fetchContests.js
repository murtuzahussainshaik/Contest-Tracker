const axios = require("axios");
const {
  CODEFORCES_API,
  LEETCODE_API,
  CODECHEF_API,
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
    // const finalResponse = [
    //   ...response.data.future_contests,
    //   ...response.data.past_contests,
    // ];
    // console.log(finalResponse);
    // return finalResponse.data;
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

module.exports = {
  fetchCodeforcesContests,
  fetchLeetcodeContests,
  fetchCodechefContests,
};
