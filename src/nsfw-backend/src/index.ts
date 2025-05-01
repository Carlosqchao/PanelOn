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

const serviceAccount = require('../../environments/panelon-fb7af-firebase-adminsdk-fbsvc-a401247357.json'); // Tu JSON de credenciales

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://panelon-fb7af.firebasestorage.app', // Sustituye por el nombre de tu bucket
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
    console.log('stdout:', stdout);

    const python = spawn('C:\\Users\\Carlos Ruano\\WebstormProjects\\PanelOn\\.venv\\Scripts\\python.EXE', ['src/nsfw-backend/src/nsfw_check.py', outputDir]);


    let output = '';
    python.stdout.on('data', (data) => output += data.toString());
    python.stderr.on('data', (data) => console.error('stderr:', data.toString()));

    python.on('close', (code) => {
      try {
        const result = JSON.parse(output);
        res.json(result);
        console.log('Resultado del análisis NSFW:', result);
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

  console.log('✅ Recibido para subida final:');
  console.log({ title, author, synopsis, state, pegi, genre, file: pdfPath });
  const destination = `uploads/${title}.pdf`;
  await bucket.upload(pdfPath, {
    destination
  });

  const coverPath = path.join(__dirname, '../output/preview.jpg');

  if (fs.existsSync(coverPath)) {
    await bucket.upload(coverPath, {
      destination: `covers/${title}.jpg`
    });

    // Eliminar localmente tras subir
    fs.unlinkSync(coverPath);
  }

  await bucket.file(`covers/${title}.jpg`).makePublic();
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/covers/${title}.jpg`;

  const comicId = await addComic({
    title,
    author,
    synopsis,
    state,
    pegi,
    genre,
    cover: publicUrl,
    published: new Date().toISOString().split('T')[0]
  });
  res.json({
    message: 'Contenido subido correctamente.',
    comicId: comicId
  });

});



app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});

export async function addComic(comic: any): Promise<string> {
  const db = admin.firestore();
  const docRef = await db.collection('comics').add(comic);
  console.log('📚 Comic añadido a Firestore con ID:', docRef.id);
  return docRef.id;
}

