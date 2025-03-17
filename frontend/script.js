document.addEventListener("DOMContentLoaded", async () => {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const upcomingContestsList = document.getElementById("upcoming-contests");
  const pastContestsList = document.getElementById("past-contests");
  const filterDropdown = document.getElementById("filter");
  const loader = document.getElementById("loader");

  // Check if dark mode is enabled in localStorage
  if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark-mode");
  }

  // Toggle dark mode on button click
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    localStorage.setItem(
      "darkMode",
      body.classList.contains("dark-mode") ? "enabled" : "disabled"
    );
  });

  async function fetchContests() {
    try {
      if (loader) loader.style.display = "block";

      const response = await fetch("http://localhost:3000/api/contests");
      const data = await response.json();

      if (loader) loader.style.display = "none";

      displayContests(data);
    } catch (error) {
      console.error("Error fetching contest data:", error);
      if (upcomingContestsList && pastContestsList) {
        upcomingContestsList.innerHTML = `<div class="error-message">Failed to load contests. Please try again later.</div>`;
        pastContestsList.innerHTML = "";
      }
      if (loader) loader.style.display = "none";
    }
  }

  // Function to calculate time remaining until contest
  function calculateTimeRemaining(contestDate, contestTime, duration) {
    const now = new Date();
    const contestDateTime = new Date(`${contestDate} ${contestTime}`);

    // Calculate end time by adding duration in minutes
    let durationInMs = 0;
    if (duration && duration !== "N/A") {
      const durationMinutes = parseInt(duration.replace(/[^0-9]/g, ""));
      if (!isNaN(durationMinutes)) {
        durationInMs = durationMinutes * 60 * 1000;
      }
    }

    const contestEndTime = new Date(contestDateTime.getTime() + durationInMs);

    // Check if contest has not started yet
    if (now < contestDateTime) {
      const diff = contestDateTime - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      return {
        status: "upcoming",
        timeString: `${days}d ${hours}h ${minutes}m until start`,
      };
    }
    // Check if contest is ongoing
    else if (now >= contestDateTime && now <= contestEndTime) {
      const diff = contestEndTime - now;
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      return {
        status: "ongoing",
        timeString: `Ongoing: ${hours}h ${minutes}m remaining`,
      };
    }
    // Contest has ended
    else {
      return {
        status: "past",
        timeString: "Contest ended",
      };
    }
  }

  // Function to display contests
  function displayContests(data, filter = "All") {
    if (!upcomingContestsList || !pastContestsList) return;

    upcomingContestsList.innerHTML = "";
    pastContestsList.innerHTML = "";

    // Initialize contests array
    let contests = [];

    // Process Codeforces data if available
    if (data.codeforces && Array.isArray(data.codeforces)) {
      const codeforcesContests = data.codeforces.map((c) => ({
        name: c.name || "Unnamed Contest",
        platform: "Codeforces",
        date: new Date(c.startTimeSeconds * 1000).toLocaleDateString(),
        time: new Date(c.startTimeSeconds * 1000).toLocaleTimeString(),
        duration: `${Math.floor(c.durationSeconds / 60)} min`,
        startTimeMs: c.startTimeSeconds * 1000,
      }));
      contests = [...contests, ...codeforcesContests];
    }

    // Process LeetCode data if available
    if (data.leetcode && Array.isArray(data.leetcode)) {
      const leetcodeContests = data.leetcode.map((c) => {
        // Format the date with proper timezone handling
        let contestDate;
        try {
          contestDate = new Date(`${c.date}T${c.time}`);
        } catch (e) {
          contestDate = new Date();
        }

        return {
          name: c.name || "Unnamed Contest",
          platform: "LeetCode",
          date: contestDate.toLocaleDateString(),
          time: c.time || "TBA",
          duration: c.duration || "N/A",
          startTimeMs: contestDate.getTime(),
        };
      });
      contests = [...contests, ...leetcodeContests];
    }

    // Process CodeChef data if available
    if (data.codechef && Array.isArray(data.codechef) && data.codechef[0]) {
      const codechefContests = data.codechef.map((c) => {
        let startDate;
        try {
          // Use ISO date if available, otherwise fall back to regular date
          startDate = c.contest_start_date_iso
            ? new Date(c.contest_start_date_iso)
            : new Date(c.contest_start_date);
        } catch (e) {
          startDate = new Date();
        }

        return {
          name: c.contest_name || "Unnamed Contest",
          platform: "CodeChef",
          date: startDate.toLocaleDateString(),
          time: startDate.toLocaleTimeString(),
          duration: c.contest_duration ? `${c.contest_duration} min` : "N/A",
          startTimeMs: startDate.getTime(),
        };
      });
      contests = [...contests, ...codechefContests];
    }

    // Sort contests by date (most recent first)
    contests.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA - dateB;
    });

    // Filter contests by platform if needed
    const filteredContests =
      filter === "All"
        ? contests
        : contests.filter((contest) => contest.platform === filter);

    if (filteredContests.length === 0) {
      upcomingContestsList.innerHTML = `<div class="no-contests">No ${
        filter === "All" ? "" : filter
      } contests found.</div>`;
      pastContestsList.innerHTML = "";
      return;
    }

    // Separate upcoming and past contests
    const now = new Date();
    const upcomingContests = [];
    const pastContests = [];

    // Display filtered contests
    filteredContests.forEach((contest) => {
      // Calculate if contest is upcoming or past
      const timeInfo = calculateTimeRemaining(
        contest.date,
        contest.time,
        contest.duration
      );

      const card = document.createElement("div");
      card.classList.add("contest-card");

      // Add additional class based on status
      if (timeInfo.status === "ongoing") {
        card.classList.add("ongoing-contest");
      }

      card.innerHTML = `
          <h3>${contest.name}</h3>
          <p><strong>Platform:</strong> ${contest.platform}</p>
          <p><strong>Date:</strong> ${contest.date}</p>
          <p><strong>Time:</strong> ${contest.time}</p>
          ${
            contest.duration
              ? `<p><strong>Duration:</strong> ${contest.duration}</p>`
              : ""
          }
          <p class="time-remaining ${timeInfo.status}">${
        timeInfo.timeString
      }</p>
        `;

      if (timeInfo.status === "upcoming" || timeInfo.status === "ongoing") {
        upcomingContests.push({
          element: card,
          startTime: contest.startTimeMs,
        });
      } else {
        pastContests.push({ element: card, startTime: contest.startTimeMs });
      }
    });

    // Sort upcoming contests by start time (earliest first)
    upcomingContests.sort((a, b) => a.startTime - b.startTime);

    // Sort past contests by start time (most recent first)
    pastContests.sort((a, b) => b.startTime - a.startTime);

    // Display upcoming contests
    if (upcomingContests.length > 0) {
      upcomingContests.forEach((item) =>
        upcomingContestsList.appendChild(item.element)
      );
    } else {
      upcomingContestsList.innerHTML = `<div class="no-contests">No upcoming ${
        filter === "All" ? "" : filter
      } contests found.</div>`;
    }

    // Display past contests
    if (pastContests.length > 0) {
      pastContests.forEach((item) =>
        pastContestsList.appendChild(item.element)
      );
    } else {
      pastContestsList.innerHTML = `<div class="no-contests">No past ${
        filter === "All" ? "" : filter
      } contests found.</div>`;
    }

    // Start the timer to update time remaining
    startTimeRemainingUpdater();
  }

  // Update time remaining every minute
  let timerInterval;
  function startTimeRemainingUpdater() {
    // Clear any existing interval
    if (timerInterval) {
      clearInterval(timerInterval);
    }

    // Update every minute
    timerInterval = setInterval(async () => {
      // Refetch contests to keep everything updated
      await fetchContests();
    }, 60000); // 60000 ms = 1 minute
  }

  // Display all contests initially
  await fetchContests();

  // Filter contests
  filterDropdown?.addEventListener("change", async (e) => {
    try {
      if (loader) loader.style.display = "block";

      const response = await fetch("http://localhost:3000/api/contests");
      const data = await response.json();

      if (loader) loader.style.display = "none";

      displayContests(data, e.target.value);
    } catch (error) {
      console.error("Error fetching contest data for filter:", error);
      if (loader) loader.style.display = "none";
    }
  });
});
