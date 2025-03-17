const express = require("express");
const cors = require("cors");
const contestRoutes = require("./routes/contestRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/contests", contestRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
