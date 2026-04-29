'use strict';

const { Router } = require('express');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const router = Router();

const SCRIPTS_DIR = path.resolve(process.env.SCRIPTS_DIR || path.join(__dirname, '..', '..', 'scripts'));
const MAX_EXEC_TIME = parseInt(process.env.MAX_EXEC_TIME || '30', 10) * 1000;

const ALLOWED_EXTENSIONS = new Set(['.sh', '.py', '.js']);

/** Read metadata comment from the first line of a script: # Description: ... */
function readMeta(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').slice(0, 5);
    const meta = { description: '', language: '' };
    for (const line of lines) {
      const descMatch = line.match(/^#\s*[Dd]escription:\s*(.+)/);
      if (descMatch) meta.description = descMatch[1].trim();
      const langMatch = line.match(/^#\s*[Ll]anguage:\s*(.+)/);
      if (langMatch) meta.language = langMatch[1].trim();
    }
    return meta;
  } catch {
    return { description: '', language: '' };
  }
}

/** Resolve the interpreter for a script extension */
function resolveInterpreter(ext) {
  const map = { '.sh': 'bash', '.py': 'python3', '.js': 'node' };
  return map[ext] || null;
}

/** GET /api/scripts — list all scripts */
router.get('/', (req, res) => {
  try {
    if (!fs.existsSync(SCRIPTS_DIR)) {
      return res.json([]);
    }
    const files = fs.readdirSync(SCRIPTS_DIR).filter((f) => {
      const ext = path.extname(f);
      return ALLOWED_EXTENSIONS.has(ext);
    });

    const scripts = files.map((file) => {
      const filePath = path.join(SCRIPTS_DIR, file);
      const ext = path.extname(file);
      const meta = readMeta(filePath);
      const stat = fs.statSync(filePath);
      return {
        name: file,
        extension: ext,
        language: meta.language || ext.replace('.', ''),
        description: meta.description || 'No description provided.',
        size: stat.size,
        modified: stat.mtime.toISOString(),
      };
    });

    res.json(scripts);
  } catch (err) {
    console.error('[scripts] list error:', err.message);
    res.status(500).json({ error: 'Failed to list scripts.' });
  }
});

/** GET /api/scripts/:name — get single script info */
router.get('/:name', (req, res) => {
  try {
    const name = path.basename(req.params.name); // prevent path traversal
    const ext = path.extname(name);
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return res.status(400).json({ error: 'Script type not allowed.' });
    }
    const filePath = path.join(SCRIPTS_DIR, name);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Script not found.' });
    }
    const meta = readMeta(filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    const stat = fs.statSync(filePath);
    res.json({
      name,
      language: meta.language || ext.replace('.', ''),
      description: meta.description || 'No description provided.',
      size: stat.size,
      modified: stat.mtime.toISOString(),
      content,
    });
  } catch (err) {
    console.error('[scripts] detail error:', err.message);
    res.status(500).json({ error: 'Failed to read script.' });
  }
});

/** POST /api/scripts/:name/run — execute a script */
router.post('/:name/run', (req, res) => {
  const name = path.basename(req.params.name);
  const ext = path.extname(name);

  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return res.status(400).json({ error: 'Script type not allowed.' });
  }

  const filePath = path.join(SCRIPTS_DIR, name);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Script not found.' });
  }

  const interpreter = resolveInterpreter(ext);
  if (!interpreter) {
    return res.status(400).json({ error: 'No interpreter available for this script type.' });
  }

  const startedAt = Date.now();

  execFile(interpreter, [filePath], { timeout: MAX_EXEC_TIME }, (error, stdout, stderr) => {
    const duration = Date.now() - startedAt;
    if (error && error.killed) {
      return res.status(408).json({ error: 'Script execution timed out.', duration });
    }
    res.json({
      name,
      exitCode: error ? error.code : 0,
      stdout: stdout || '',
      stderr: stderr || '',
      duration,
    });
  });
});

module.exports = router;
