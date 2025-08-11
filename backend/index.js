import express from 'express';
import multer from 'multer';
import { execFile } from 'child_process';
import fs from 'fs';
import path from 'path';

const app = express();
const upload = multer({ dest: 'uploads/' });
const HISTORY_PATH = path.join(process.cwd(), 'data', 'history.json');

app.use(express.json());

function readHistory() {
  try {
    const content = fs.readFileSync(HISTORY_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    return [];
  }
}

function writeHistory(entries) {
  fs.writeFileSync(HISTORY_PATH, JSON.stringify(entries, null, 2));
}

app.post('/api/analysis', upload.single('image'), (req, res) => {
  const propertyId = req.body.propertyId || 'unknown';
  if (!req.file) {
    return res.status(400).json({ error: 'Image required' });
  }
  const python = execFile('python3', ['../ai/analyze_photo.py', req.file.path], (err, stdout) => {
    if (err) {
      return res.status(500).json({ error: 'AI error', details: err.message });
    }
    let result;
    try {
      result = JSON.parse(stdout);
    } catch (e) {
      return res.status(500).json({ error: 'Invalid AI response' });
    }
    const entries = readHistory();
    entries.push({ propertyId, date: new Date().toISOString(), tasks: result.tasks });
    writeHistory(entries);
    res.json(result);
  });
});

app.get('/api/history/:propertyId', (req, res) => {
  const entries = readHistory().filter(e => e.propertyId === req.params.propertyId);
  res.json(entries);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
