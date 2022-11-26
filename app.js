const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function fetchBingAutoPrompt(query) {
  const response = await fetch(
    `https://api.bing.com/qsonhs.aspx?type=cb&q=${query}`
  );
  const temp0 = await response.json();
  if (!temp0.AS.FullResults) {
    return [];
  }
  const temp1 = await temp0.AS.Results;
  let result = [];
  temp1.forEach((element1) => {
    let temp2 = element1.Suggests;
    temp2.forEach((element2) => {
      result.push({ type: "autoprompt", value: element2.Txt });
    });
  });
  return result;
}

const express = require("express");
const app = express();
const cors = require("cors");
// 端口号
const port = 30000;

app.listen(port, () =>
  console.log(`Express server listening at http://localhost:${port}`)
);

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  if (!req.query.q) {
    res.send({ code: 1001, data: { autopromptResult: [] } });
  }
  const result = await fetchBingAutoPrompt(req.query.q);
  res.send({ code: 0, data: { autopromptResult: result } });
});
