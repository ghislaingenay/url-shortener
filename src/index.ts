import bodyParser from "body-parser";
import express from "express";
import { URLShortener } from "./url/UrlShortener";
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Get all urls
app.get("/", (req, res) => {
  const urlService = new URLShortener();
  res.json({ result: true, data: urlService.getAllUrls() });
});

app.get("/:mode/:id", (req, res) => {
  const { mode, id } = req.params;
  console.log({ mode, id });
  const urlService = new URLShortener();
  if (mode !== "id" && mode !== "url") throw new Error("Invalid mode");

  const setLongUrlParams = ({
    mode,
    id,
  }: {
    mode: "url" | "id";
    id: string;
  }) => {
    if (mode === "id") return { id: Number(id), mode, shortUrl: undefined };
    return { shortUrl: id, mode, id: undefined };
  };
  const params = setLongUrlParams({ mode, id });
  console.log({ params });
  const longUrl = urlService.getLongUrl(params);
  res.json({ result: true, data: longUrl });
});

app.post("/", (req, res) => {
  const longUrl = req.body.longUrl;
  const urlService = new URLShortener();
  const createdUrl = urlService.createURL(longUrl);
  res.json({ result: createdUrl });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
