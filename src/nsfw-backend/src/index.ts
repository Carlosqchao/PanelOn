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

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
