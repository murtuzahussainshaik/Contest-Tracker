const {
  fetchCodeforcesContests,
  fetchLeetcodeContests,
  fetchCodechefContests,
  fetchCodeforcesYoutubePlaylist,
  fetchLeetcodeYoutubePlaylist,
  fetchCodechefYoutubePlaylist,
} = require("../services/fetchContests");

const getAllContests = async (req, res) => {
  try {
    const [
      codeforces,
      leetcode,
      codechef,
      codeforcesYoutube,
      leetcodeYoutube,
      codechefYoutube,
    ] = await Promise.all([
      fetchCodeforcesContests(),
      fetchLeetcodeContests(),
      fetchCodechefContests(),
      fetchCodeforcesYoutubePlaylist(),
      fetchLeetcodeYoutubePlaylist(),
      fetchCodechefYoutubePlaylist(),
    ]);

    res.json({
      codeforces,
      leetcode,
      codechef,
      codeforcesYoutube,
      leetcodeYoutube,
      codechefYoutube,
    });
  } catch (error) {
    console.error("Error fetching contests:", error);
    res.status(500).json({ error: "Failed to fetch contests" });
  }
};

module.exports = { getAllContests };
