const {
  fetchCodeforcesContests,
  fetchLeetcodeContests,
  fetchCodechefContests,
} = require("../services/fetchContests");

const getAllContests = async (req, res) => {
  try {
    const [codeforces, leetcode, codechef] = await Promise.all([
      fetchCodeforcesContests(),
      fetchLeetcodeContests(),
      fetchCodechefContests(),
    ]);

    res.json({ codeforces, leetcode, codechef });
  } catch (error) {
    console.error("Error fetching contests:", error);
    res.status(500).json({ error: "Failed to fetch contests" });
  }
};

module.exports = { getAllContests };
