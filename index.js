import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Correction pour __dirname avec ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// Config de stockage pour les PDF dans /uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Route d'upload : /upload
app.post("/upload", upload.single("pdf"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucun fichier reçu" });
  }

  // URL publique du fichier
  const fileUrl = `/uploads/${req.file.filename}`;

  res.json({
    success: true,
    message: "PDF uploadé avec succès",
    fileUrl
  });
});

// Rendre les fichiers accessibles publiquement
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur en ligne sur le port ${PORT}`);
});
