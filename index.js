import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

// 📁 Dossier uploads
const uploadFolder = "./uploads";
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}

// 📄 Configuration multer (enregistrement des fichiers PDF)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, unique + ".pdf"); // 🔥 toujours PDF
    },
});

const upload = multer({ storage });

// -----------------------------------------------------
// 🔥 ROUTE D’UPLOAD DES PDF
// -----------------------------------------------------
app.post("/upload", upload.single("pdf"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "Aucun fichier reçu" });
    }

    // URL publique générée automatiquement par Railway
    const publicUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    console.log("📄 Nouveau PDF reçu :", publicUrl);

    res.json({
        success: true,
        url: publicUrl,
        filename: req.file.filename,
    });
});

// -----------------------------------------------------
// 🔥 Rendre les fichiers PDF accessibles publiquement
// -----------------------------------------------------
app.use("/uploads", express.static(path.resolve("uploads")));

// -----------------------------------------------------
// 🔥 Port Railway
// -----------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("🚀 Serveur backend PDF opérationnel sur port", PORT);
});
