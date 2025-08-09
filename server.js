const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/keo", async (req, res) => {
  try {
    const url = "https://www.goaloo23.com/1x2AsianOdds/AsianOdds.aspx";
    const { data } = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });

    const $ = cheerio.load(data);
    let matches = [];

    $("tr").each((i, el) => {
      const matchName = $(el).find(".name").text().trim();
      const odds = $(el).find(".odds").text().trim();
      if (odds.includes("-0.25")) {
        matches.push({ match: matchName, keo: odds });
      }
    });

    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: "Không lấy được dữ liệu" });
  }
});

app.listen(PORT, () => console.log(`Server đang chạy trên cổng ${PORT}`));
