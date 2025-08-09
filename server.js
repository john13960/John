const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/keo', async (req, res) => {
  const url = 'https://www.goaloo23.com/1x2AsianOdds/AsianOdds.aspx';

  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Chờ phần bảng kèo load xong
    await page.waitForSelector('table#DataGrid2', { timeout: 10000 });

    // Lấy dữ liệu
    const matches = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table#DataGrid2 tr'));
      let results = [];

      rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 5) {
          const matchName = cells[1].innerText.trim();
          const asianOdds = cells[4].innerText.trim();

          if (asianOdds.includes('-0.25')) {
            results.push({ match: matchName, keo: asianOdds });
          }
        }
      });

      return results;
    });

    await browser.close();

    res.json(matches);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Không lấy được dữ liệu' });
  }
});

app.listen(PORT, () => console.log(`Server chạy trên cổng ${PORT}`));
