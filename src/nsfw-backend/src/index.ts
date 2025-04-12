import express, { Request, Response } from 'express';
import multer from 'multer';
import { exec } from 'child_process';
import path from 'path';
import * as fs from 'fs';
import { spawn } from 'child_process';
import cors from 'cors';

const app = express();
const port = 3000;

// Configuración de Multer para subir archivos
const upload = multer({ dest: '../uploads' });

// Usar CORS para permitir solicitudes desde cualquier origen
app.use(cors());

// Ruta para comprobar el archivo PDF y verificar si contiene contenido NSFW
// @ts-ignore
app.post('/check-nsfw', upload.single('file'), async (req: Request, res: Response) => {
  const pdfPath = req.file?.path;
  const outputDir = path.join(__dirname, '../output');
  const outputPrefix = path.join(outputDir, 'page');

  // Crear el directorio de salida si no existe
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  if (!pdfPath) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Comando para convertir PDF a imágenes JPG
  const cmd = `pdftoppm -jpeg -scale-to 1024 "${pdfPath}" "${outputPrefix}"`;

  // @ts-ignore
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error('Error al convertir PDF:', err);
      console.error('stderr:', stderr);
      return res.status(500).json({ error: 'PDF conversion failed' });
    }
    console.log('stdout:', stdout);

    // Llamar al script Python de detección NSFW
    const python = spawn('python', ['src/nsfw-backend/src/nsfw_check.py', outputDir]);

    let output = '';
    python.stdout.on('data', (data) => output += data.toString());
    python.stderr.on('data', (data) => console.error('stderr:', data.toString()));

    python.on('close', (code) => {
      const result = output.includes('NSFW');
      res.json({ nsfw: result });
    });
  });
});

// Iniciar el servidor en el puerto 3000
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
