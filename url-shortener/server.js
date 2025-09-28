// server.js

import express from "express";
import { nanoid } from "nanoid";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);
// Dùng để đọc dữ liệu JSON từ client
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/urlshortener", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Kết nối MongoDB thành công!"))
.catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));

// ================== SCHEMA ==================
const urlSchema = new mongoose.Schema({
  shortId: { type: String, required: true, unique: true },
  originalUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Url = mongoose.model("Url", urlSchema);

// Lưu link rút gọn tạm thời trong RAM

// API rút gọn link
app.post("/shorten", async (req, res) => {
  try {
    const { originalUrl , customId} = req.body;

    let shortId;
    if (!originalUrl) {
        return res.status(400).json({error: "Thiếu originalURL"});
    }

    if (customId) {
        const existing = await Url.findOne({shortId: customId});
        if (existing) {
            return res.status(400).json({error: "Trùng customId"});
        }

        shortId = customId;
    } else {
        shortId = nanoid(6);
    }

    const newUrl = new Url({shortId, originalUrl});
    await newUrl.save();

    res.json({shortUrl: `http://localhost:${PORT}/${shortId}`});
  } catch (err) {
    res.status(500).json({error: "Lỗi server", details: err.message});
  }
});

// API redirect từ link rút gọn sang link gốc
app.get("/:shortId", async (req, res) => {
    try {
        const {shortId} = req.params;
        const urlDoc = await Url.findOne({shortId});

        if (urlDoc) {
            res.redirect(urlDoc.originalUrl);
        } else {
            res.status(404).send("Không tìm thấy link này!");
        }
    } catch(err) {
        res.status(500).json({error: "Lỗi server", details: err.message})
    }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html")); // index.html nằm cùng thư mục với server.js
});
// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});