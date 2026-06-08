const fs = require('fs');
const path = require('path');

// On Vercel, /tmp is the only writable directory.
// Progress is ephemeral per-instance; localStorage is the real persistence.
const TMP_FILE = '/tmp/sl-progress.json';

function readProgress() {
  try {
    if (fs.existsSync(TMP_FILE)) {
      return JSON.parse(fs.readFileSync(TMP_FILE, 'utf8'));
    }
  } catch {}
  return { completedLessons: [], lastVisited: null, startedAt: null, notes: {} };
}

function writeProgress(data) {
  try { fs.writeFileSync(TMP_FILE, JSON.stringify(data, null, 2)); } catch {}
}

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.json(readProgress());
  }

  if (req.method === 'POST') {
    const current = readProgress();
    const update  = req.body || {};

    if (update.reset) {
      writeProgress({ completedLessons: [], lastVisited: null, startedAt: null, notes: {} });
      return res.json({ ok: true, progress: readProgress() });
    }

    if (update.completedLesson !== undefined) {
      if (!current.completedLessons.includes(update.completedLesson)) {
        current.completedLessons.push(update.completedLesson);
      }
      if (!current.startedAt) current.startedAt = new Date().toISOString();
    }
    if (update.removeLesson !== undefined) {
      current.completedLessons = current.completedLessons.filter(l => l !== update.removeLesson);
    }
    if (update.lastVisited !== undefined) current.lastVisited = update.lastVisited;
    if (update.note) current.notes[update.note.lessonId] = update.note.text;

    writeProgress(current);
    return res.json({ ok: true, progress: current });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
