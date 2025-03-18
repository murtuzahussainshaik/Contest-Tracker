// document.addEventListener("DOMContentLoaded", async () => {
//   const themeToggle = document.getElementById("theme-toggle");
//   const body = document.body;
//   const upcomingContestsList = document.getElementById("upcoming-contests");
//   const pastContestsList = document.getElementById("past-contests");
//   const filterDropdown = document.getElementById("filter");
//   const loader = document.getElementById("loader")

//   // Check if dark mode is enabled in localStorage
//   if (localStorage.getItem("darkMode") === "enabled") {
//     body.classList.add("dark-mode");
//   }

//   // Toggle dark mode on button click
//   themeToggle.addEventListener("click", () => {
//     body.classList.toggle("dark-mode");
//     localStorage.setItem(
//       "darkMode",
//       body.classList.contains("dark-mode") ? "enabled" : "disabled"
//     );
//   });

//   async function fetchContests() {
//     try {
//       if (loader) loader.style.display = "block";

//       const response = await fetch("http://localhost:3000/api/contests");
//       const data = await response.json();

//       if (loader) loader.style.display = "none";

//       displayContests(data);
//     } catch (error) {
//       console.error("Error fetching contest data:", error);
//       if (upcomingContestsList && pastContestsList) {
//         upcomingContestsList.innerHTML = `<div class="error-message">Failed to load contests. Please try again later.</div>`;
//         pastContestsList.innerHTML = "";
//       }
//       if (loader) loader.style.display = "none";
//     }
//   }

//   // Function to calculate time remaining until contest
//   function calculateTimeRemaining(contestDate, contestTime, duration) {
//     const now = new Date();
//     const contestDateTime = new Date(`${contestDate} ${contestTime}`);

//     // Calculate end time by adding duration in minutes
//     let durationInMs = 0;
//     if (duration && duration !== "N/A") {
//       const durationMinutes = parseInt(duration.replace(/[^0-9]/g, ""));
//       if (!isNaN(durationMinutes)) {
//         durationInMs = durationMinutes * 60 * 1000;
//       }
//     }

//     const contestEndTime = new Date(contestDateTime.getTime() + durationInMs);

//     // Check if contest has not started yet
//     if (now < contestDateTime) {
//       const diff = contestDateTime - now;
//       const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//       const hours = Math.floor(
//         (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
//       );
//       const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

//       return {
//         status: "upcoming",
//         timeString: `${days}d ${hours}h ${minutes}m until start`,
//       };
//     }
//     // Check if contest is ongoing
//     else if (now >= contestDateTime && now <= contestEndTime) {
//       const diff = contestEndTime - now;
//       const hours = Math.floor(
//         (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
//       );
//       const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

//       return {
//         status: "ongoing",
//         timeString: `Ongoing: ${hours}h ${minutes}m remaining`,
//       };
//     }
//     // Contest has ended
//     else {
//       return {
//         status: "past",
//         timeString: "Contest ended",
//       };
//     }
//   }

//   // Function to display contests
//   function displayContests(data, filter = "All") {
//     if (!upcomingContestsList || !pastContestsList) return;

//     upcomingContestsList.innerHTML = "";
//     pastContestsList.innerHTML = "";

//     // Initialize contests array
//     let contests = [];

//     // Process Codeforces data if available
//     if (data.codeforces && Array.isArray(data.codeforces)) {
//       const codeforcesContests = data.codeforces.map((c) => ({
//         name: c.name || "Unnamed Contest",
//         platform: "Codeforces",
//         date: new Date(c.startTimeSeconds * 1000).toLocaleDateString(),
//         time: new Date(c.startTimeSeconds * 1000).toLocaleTimeString(),
//         duration: `${Math.floor(c.durationSeconds / 60)} min`,
//         startTimeMs: c.startTimeSeconds * 1000,
//       }));
//       contests = [...contests, ...codeforcesContests];
//     }

//     // Process LeetCode data if available
//     if (data.leetcode && Array.isArray(data.leetcode)) {
//       const leetcodeContests = data.leetcode.map((c) => {
//         // Format the date with proper timezone handling
//         let contestDate;
//         try {
//           contestDate = new Date(`${c.date}T${c.time}`);
//         } catch (e) {
//           contestDate = new Date();
//         }

//         return {
//           name: c.name || "Unnamed Contest",
//           platform: "LeetCode",
//           date: contestDate.toLocaleDateString(),
//           time: c.time || "TBA",
//           duration: c.duration || "N/A",
//           startTimeMs: contestDate.getTime(),
//         };
//       });
//       contests = [...contests, ...leetcodeContests];
//     }

//     // Process CodeChef data if available
//     if (data.codechef && Array.isArray(data.codechef) && data.codechef[0]) {
//       const codechefContests = data.codechef.map((c) => {
//         let startDate;
//         try {
//           // Use ISO date if available, otherwise fall back to regular date
//           startDate = c.contest_start_date_iso
//             ? new Date(c.contest_start_date_iso)
//             : new Date(c.contest_start_date);
//         } catch (e) {
//           startDate = new Date();
//         }

//         return {
//           name: c.contest_name || "Unnamed Contest",
//           platform: "CodeChef",
//           date: startDate.toLocaleDateString(),
//           time: startDate.toLocaleTimeString(),
//           duration: c.contest_duration ? `${c.contest_duration} min` : "N/A",
//           startTimeMs: startDate.getTime(),
//         };
//       });
//       contests = [...contests, ...codechefContests];
//     }

//     // Sort contests by date (most recent first)
//     contests.sort((a, b) => {
//       const dateA = new Date(`${a.date} ${a.time}`);
//       const dateB = new Date(`${b.date} ${b.time}`);
//       return dateA - dateB;
//     });

//     // Filter contests by platform if needed
//     const filteredContests =
//       filter === "All"
//         ? contests
//         : contests.filter((contest) => contest.platform === filter);

//     if (filteredContests.length === 0) {
//       upcomingContestsList.innerHTML = `<div class="no-contests">No ${
//         filter === "All" ? "" : filter
//       } contests found.</div>`;
//       pastContestsList.innerHTML = "";
//       return;
//     }

//     // Separate upcoming and past contests
//     const now = new Date();
//     const upcomingContests = [];
//     const pastContests = [];

//     // Display filtered contests
//     filteredContests.forEach((contest) => {
//       // Calculate if contest is upcoming or past
//       const timeInfo = calculateTimeRemaining(
//         contest.date,
//         contest.time,
//         contest.duration
//       );

//       const card = document.createElement("div");
//       card.classList.add("contest-card");

//       // Add additional class based on status
//       if (timeInfo.status === "ongoing") {
//         card.classList.add("ongoing-contest");
//       }

//       card.innerHTML = `
//           <h3>${contest.name}</h3>
//           <p><strong>Platform:</strong> ${contest.platform}</p>
//           <p><strong>Date:</strong> ${contest.date}</p>
//           <p><strong>Time:</strong> ${contest.time}</p>
//           ${
//             contest.duration
//               ? `<p><strong>Duration:</strong> ${contest.duration}</p>`
//               : ""
//           }
//           <p class="time-remaining ${timeInfo.status}">${
//         timeInfo.timeString
//       }</p>
//         `;

//       if (timeInfo.status === "upcoming" || timeInfo.status === "ongoing") {
//         upcomingContests.push({
//           element: card,
//           startTime: contest.startTimeMs,
//         });
//       } else {
//         pastContests.push({ element: card, startTime: contest.startTimeMs });
//       }
//     });

//     // Sort upcoming contests by start time (earliest first)
//     upcomingContests.sort((a, b) => a.startTime - b.startTime);

//     // Sort past contests by start time (most recent first)
//     pastContests.sort((a, b) => b.startTime - a.startTime);

//     // Display upcoming contests
//     if (upcomingContests.length > 0) {
//       upcomingContests.forEach((item) =>
//         upcomingContestsList.appendChild(item.element)
//       );
//     } else {
//       upcomingContestsList.innerHTML = `<div class="no-contests">No upcoming ${
//         filter === "All" ? "" : filter
//       } contests found.</div>`;
//     }

//     // Display past contests
//     if (pastContests.length > 0) {
//       pastContests.forEach((item) =>
//         pastContestsList.appendChild(item.element)
//       );
//     } else {
//       pastContestsList.innerHTML = `<div class="no-contests">No past ${
//         filter === "All" ? "" : filter
//       } contests found.</div>`;
//     }

//     // Start the timer to update time remaining
//     startTimeRemainingUpdater();
//   }

//   // Update time remaining every minute
//   let timerInterval;
//   function startTimeRemainingUpdater() {
//     // Clear any existing interval
//     if (timerInterval) {
//       clearInterval(timerInterval);
//     }

//     // Update every minute
//     timerInterval = setInterval(async () => {
//       // Refetch contests to keep everything updated
//       await fetchContests();
//     }, 60000); // 60000 ms = 1 minute
//   }

//   // Display all contests initially
//   await fetchContests();

//   // Filter contests
//   filterDropdown?.addEventListener("change", async (e) => {
//     try {
//       if (loader) loader.style.display = "block";

//       const response = await fetch("http://localhost:3000/api/contests");
//       const data = await response.json();

//       if (loader) loader.style.display = "none";

//       displayContests(data, e.target.value);
//     } catch (error) {
//       console.error("Error fetching contest data for filter:", error);
//       if (loader) loader.style.display = "none";
//     }
//   });
// });

document.addEventListener("DOMContentLoaded", async () => {
  // DOM Elements
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const upcomingContestsList = document.getElementById("upcoming-contests");
  const pastContestsList = document.getElementById("past-contests");
  const loader = document.getElementById("loader");
  const bookmarksToggle = document.getElementById("bookmarks-toggle");
  const bookmarkedContestsList = document.getElementById("bookmarked-contests");
  const bookmarkedSection = document.querySelector(".bookmarked-section");
  const platformFilters = document.querySelectorAll(".platform-filter");
  const applyFiltersBtn = document.getElementById("apply-filters");
  const adminPanelBtn = document.getElementById("admin-panel");
  const adminModal = document.getElementById("admin-modal");
  const modalClose = document.querySelector(".close");
  const youtubeForm = document.getElementById("youtube-form");
  const contestSelect = document.getElementById("contest-select");

  // Initialize bookmarks from localStorage
  let bookmarkedContests =
    JSON.parse(localStorage.getItem("bookmarkedContests")) || [];

  // Initialize YouTube solution links from localStorage
  let youtubeSolutions =
    JSON.parse(localStorage.getItem("youtubeSolutions")) || {};

  // Store all contests data globally
  let allContestsData = [];

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

  // Toggle bookmarks section
  bookmarksToggle.addEventListener("click", () => {
    const isVisible = bookmarkedSection.style.display !== "none";
    bookmarkedSection.style.display = isVisible ? "none" : "block";
    bookmarksToggle.textContent = isVisible ? "My Bookmarks" : "Hide Bookmarks";

    if (!isVisible) {
      displayBookmarkedContests();
    }
  });

  // Open admin panel modal
  adminPanelBtn.addEventListener("click", () => {
    populateContestSelect();
    adminModal.style.display = "block";
  });

  // Close modal when clicking X
  modalClose.addEventListener("click", () => {
    adminModal.style.display = "none";
  });

  // Close modal when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target === adminModal) {
      adminModal.style.display = "none";
    }
  });

  // Handle YouTube solution submission
  youtubeForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const contestId = contestSelect.value;
    const youtubeLink = document.getElementById("youtube-link").value;

    // Save to storage
    youtubeSolutions[contestId] = youtubeLink;
    localStorage.setItem("youtubeSolutions", JSON.stringify(youtubeSolutions));

    // Update display
    displayContests();

    // Reset form and close modal
    youtubeForm.reset();
    adminModal.style.display = "none";

    alert("YouTube solution link saved successfully!");
  });

  // Apply platform filters
  applyFiltersBtn.addEventListener("click", () => {
    const selectedPlatforms = Array.from(platformFilters)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);

    if (selectedPlatforms.length === 0) {
      alert("Please select at least one platform.");
      return;
    }

    displayContests();
  });

  // Function to populate the contest select dropdown in admin panel
  function populateContestSelect() {
    // Clear existing options (except the placeholder)
    while (contestSelect.options.length > 1) {
      contestSelect.remove(1);
    }

    // Add past contests to the dropdown
    const pastContests = allContestsData.filter((contest) => {
      const contestDate = new Date(`${contest.date} ${contest.time}`);
      return contestDate < new Date();
    });

    pastContests.forEach((contest) => {
      const option = document.createElement("option");
      option.value = `${contest.platform}-${contest.name}-${contest.date}`;
      option.textContent = `${contest.platform} - ${contest.name} (${contest.date})`;
      contestSelect.appendChild(option);
    });
  }

  // Function to toggle bookmark status for a contest
  function toggleBookmark(contestId) {
    const index = bookmarkedContests.indexOf(contestId);

    if (index === -1) {
      // Add to bookmarks
      bookmarkedContests.push(contestId);
    } else {
      // Remove from bookmarks
      bookmarkedContests.splice(index, 1);
    }

    // Save to localStorage
    localStorage.setItem(
      "bookmarkedContests",
      JSON.stringify(bookmarkedContests)
    );

    // If bookmarks section is visible, refresh it
    if (bookmarkedSection.style.display !== "none") {
      displayBookmarkedContests();
    }
  }

  // Function to display bookmarked contests
  function displayBookmarkedContests() {
    if (!bookmarkedContestsList) return;

    bookmarkedContestsList.innerHTML = "";

    const bookmarkedItems = allContestsData.filter((contest) =>
      bookmarkedContests.includes(
        `${contest.platform}-${contest.name}-${contest.date}`
      )
    );

    if (bookmarkedItems.length === 0) {
      bookmarkedContestsList.innerHTML = `<div class="no-contests">No bookmarked contests. Add some by clicking the star icon on contests.</div>`;
      return;
    }

    // Sort by date
    bookmarkedItems.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA - dateB;
    });

    // Create and append contest cards
    bookmarkedItems.forEach((contest) => {
      const timeInfo = calculateTimeRemaining(
        contest.date,
        contest.time,
        contest.duration
      );
      const card = createContestCard(contest, timeInfo);
      bookmarkedContestsList.appendChild(card);
    });
  }

  // Create contest card with bookmark button and YouTube link
  function createContestCard(contest, timeInfo) {
    const card = document.createElement("div");
    card.classList.add("contest-card");

    // Add ongoing class if contest is ongoing
    if (timeInfo.status === "ongoing") {
      card.classList.add("ongoing-contest");
    }

    // Create unique contest ID for bookmarking
    const contestId = `${contest.platform}-${contest.name}-${contest.date}`;

    // Check if contest has a YouTube solution
    const youtubeLink = youtubeSolutions[contestId] || null;

    card.innerHTML = `
      <h3>${contest.name}</h3>
      <button class="bookmark-btn ${
        bookmarkedContests.includes(contestId) ? "active" : ""
      }" 
              data-contest-id="${contestId}">
        ${bookmarkedContests.includes(contestId) ? "★" : "☆"}
      </button>
      <p class="platform"><strong>Platform:</strong> ${contest.platform}</p>
      <p class="date"><strong>Date:</strong> ${contest.date}</p>
      <p class="time"><strong>Time:</strong> ${contest.time}</p>
      ${
        contest.duration
          ? `<p class="duration"><strong>Duration:</strong> ${contest.duration}</p>`
          : ""
      }
      <p class="time-remaining ${timeInfo.status}">${timeInfo.timeString}</p>
      ${
        youtubeLink
          ? `<a href="${youtubeLink}" target="_blank" class="youtube-link">Watch Solution ▶</a>`
          : ""
      }
    `;

    // Add event listener to bookmark button
    const bookmarkBtn = card.querySelector(".bookmark-btn");
    bookmarkBtn.addEventListener("click", () => {
      toggleBookmark(contestId);
      bookmarkBtn.textContent = bookmarkedContests.includes(contestId)
        ? "★"
        : "☆";
      bookmarkBtn.classList.toggle("active");
    });

    return card;
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

  // Function to process all contests data
  function processContestsData(data) {
    let contests = [];

    // Process Codeforces data
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

    // Process LeetCode data
    if (data.leetcode && Array.isArray(data.leetcode)) {
      const leetcodeContests = data.leetcode.map((c) => {
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

    // Process CodeChef data
    if (data.codechef && Array.isArray(data.codechef) && data.codechef[0]) {
      const codechefContests = data.codechef.map((c) => {
        let startDate;
        try {
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

    return contests;
  }

  // Function to fetch contests data
  async function fetchContests() {
    try {
      if (loader) loader.style.display = "block";

      const response = await fetch("http://localhost:3000/api/contests");
      const data = await response.json();

      if (loader) loader.style.display = "none";

      allContestsData = processContestsData(data);
      displayContests();
    } catch (error) {
      console.error("Error fetching contest data:", error);
      if (upcomingContestsList && pastContestsList) {
        upcomingContestsList.innerHTML = `<div class="error-message">Failed to load contests. Please try again later.</div>`;
        pastContestsList.innerHTML = "";
        if (bookmarkedContestsList) {
          bookmarkedContestsList.innerHTML = "";
        }
      }
      if (loader) loader.style.display = "none";
    }
  }

  // Function to display contests
  function displayContests() {
    if (!upcomingContestsList || !pastContestsList) return;

    upcomingContestsList.innerHTML = "";
    pastContestsList.innerHTML = "";

    // Get selected platforms
    const selectedPlatforms = Array.from(platformFilters)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);

    // If no platforms are selected, show a message
    if (selectedPlatforms.length === 0) {
      upcomingContestsList.innerHTML = `<div class="no-contests">Please select at least one platform.</div>`;
      pastContestsList.innerHTML = "";
      return;
    }

    // Filter contests by selected platforms
    const filteredContests = allContestsData.filter((contest) =>
      selectedPlatforms.includes(contest.platform)
    );

    if (filteredContests.length === 0) {
      upcomingContestsList.innerHTML = `<div class="no-contests">No contests found for selected platforms.</div>`;
      pastContestsList.innerHTML = "";
      return;
    }

    // Separate upcoming and past contests
    const now = new Date();
    const upcomingContests = [];
    const pastContests = [];

    // Process each contest
    filteredContests.forEach((contest) => {
      // Calculate time remaining info
      const timeInfo = calculateTimeRemaining(
        contest.date,
        contest.time,
        contest.duration
      );

      // Create contest card
      const card = createContestCard(contest, timeInfo);

      if (timeInfo.status === "upcoming" || timeInfo.status === "ongoing") {
        upcomingContests.push({
          element: card,
          startTime: new Date(`${contest.date} ${contest.time}`).getTime(),
        });
      } else {
        pastContests.push({
          element: card,
          startTime: new Date(`${contest.date} ${contest.time}`).getTime(),
        });
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
      upcomingContestsList.innerHTML = `<div class="no-contests">No upcoming contests found for selected platforms.</div>`;
    }

    // Display past contests
    if (pastContests.length > 0) {
      pastContests.forEach((item) =>
        pastContestsList.appendChild(item.element)
      );
    } else {
      pastContestsList.innerHTML = `<div class="no-contests">No past contests found for selected platforms.</div>`;
    }
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

  // Start the timer to update time remaining
  startTimeRemainingUpdater();
});
