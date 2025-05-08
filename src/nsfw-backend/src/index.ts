import express, { Request, Response } from 'express';
import multer from 'multer';
import { exec } from 'child_process';
import path from 'path';
import * as fs from 'fs';
import { spawn } from 'child_process';
import cors from 'cors';

const app = express();
const port = 3000;

const upload = multer({ dest: '../uploads' });

app.use(cors());

var admin = require("firebase-admin");

const serviceAccount = require('../../environments/panelon-fb7af-firebase-adminsdk-fbsvc-a401247357.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://panelon-fb7af.firebasestorage.app',
});


const bucket = admin.storage().bucket();

// @ts-ignore
app.post('/check-nsfw', upload.single('file'), async (req: Request, res: Response) => {
  const pdfPath = req.file?.path;
  const pegi = req.body.pegi;
  const outputDir = path.join(__dirname, '../output');
  const outputPrefix = path.join(outputDir, 'page');

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  if (!pdfPath) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const cmd = `pdftoppm -jpeg -scale-to 1024 "${pdfPath}" "${outputPrefix}"`;

  // @ts-ignore
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error('Error al convertir PDF:', err);
      console.error('stderr:', stderr);
      return res.status(500).json({ error: 'PDF conversion failed' });
    }

    const python = spawn('C:\\Users\\Carlos Ruano\\WebstormProjects\\PanelOn\\.venv\\Scripts\\python.exe', ['src/nsfw-backend/src/nsfw_check.py', outputDir]);


    let output = '';
    python.stdout.on('data', (data) => output += data.toString());
    python.stderr.on('data', (data) => console.error('stderr:', data.toString()));

    python.on('close', (code) => {
      try {
        const result = JSON.parse(output);
        res.json(result);
      } catch (e) {
        console.error('Error parseando la salida de Python:', output);
        res.status(500).json({ error: 'Error analizando resultados NSFW' });
      }
    });
  });
});

const uploadFile = multer({ dest: '../uploads' });

// @ts-ignore
app.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  const pdfPath = req.file?.path;
  const {
    title,
    author,
    synopsis,
    state,
    pegi,
    ['genre[]']: genresRaw,
  } = req.body;

  const rawGenres = req.body.genre;
  const genre = Array.isArray(rawGenres) ? rawGenres : [rawGenres];

  if (!pdfPath || !title || !author || !state || !genre.length) {
    return res.status(400).json({ error: 'Campos obligatorios faltantes.' });
  }

  const destination = `uploads/${title}.pdf`;
  await bucket.upload(pdfPath, {
    destination
  });

  const coverPath = path.join(__dirname, '../preview/preview.jpg');
  if (fs.existsSync(coverPath)) {
    await bucket.upload(coverPath, {
      destination: `covers/${title}.jpg`
    });
    if (fs.existsSync(coverPath)) {
      fs.unlinkSync(coverPath);
    } else {
      console.warn(`⚠️ El archivo ${coverPath} no existe al intentar borrarlo.`);
    }
  }

  await bucket.file(`covers/${title}.jpg`).makePublic();
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/covers/${title}.jpg`;
  const comicUrl = `https://storage.googleapis.com/${bucket.name}/uploads/${title}.pdf`;
  const comicId = await addComic({
    title,
    author,
    synopsis,
    state,
    pegi,
    genre,
    cover: publicUrl,
    published: new Date().toISOString().split('T')[0],
    uploadUrl: publicUrl,
    comicUrl: comicUrl,
  });
  res.json({
    message: 'Contenido subido correctamente.',
    comicId: comicId
  });
});

app.use('/uploads', express.static(path.resolve('src/nsfw-backend/uploads')));

app.get('/get-images', (req: Request, res: Response) => {
  const dirPath = path.resolve('src/nsfw-backend/uploads'); // ruta absoluta

  // @ts-ignore
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error('❌ Error leyendo uploads:', err);
      return res.status(500).json({ error: 'No se pudieron obtener las imágenes' });
    }

    const imageUrls = files
      .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
      .map(file => `http://localhost:${port}/uploads/${file}`);

    res.json(imageUrls);
  });
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});

export async function addComic(comic: any): Promise<string> {
  const db = admin.firestore();
  const docRef = await db.collection('comics').add(comic);
  return docRef.id;
}

