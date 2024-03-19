import bodyParser from "body-parser";
import express from "express";
import { URLShortener } from "./url/UrlShortener";
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Get all urls
app.get("/", (req, res) => {
  try {
    const urlService = new URLShortener();
    res.status(200).json({ result: true, data: urlService.getAllUrls() });
  } catch (err: unknown) {
    res.status(400).json({ result: false, message: (err as Error).message });
  }
});

app.get("/:mode/:id", (req, res) => {
  try {
    const { mode, id } = req.params;
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
    const longUrl = urlService.getLongUrl(params);
    res.status(200).json({ result: true, data: longUrl });
  } catch (err: unknown) {
    res.status(400).json({ result: false, message: (err as Error).message });
  }
});

app.post("/", (req, res) => {
  try {
    const longUrl = req.body.longUrl;
    const urlService = new URLShortener();
    const createdUrl = urlService.createURL(longUrl);
    res.status(201).json({ data: createdUrl, result: true });
  } catch (err: unknown) {
    res.status(400).json({ result: false, message: (err as Error).message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
