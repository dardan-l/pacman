const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TABLE_NAME = 'leaderboard_scores';
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 25;

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

function getSupabaseHeaders(prefer = '') {
  const headers = {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
  };
  if (prefer) headers.Prefer = prefer;
  return headers;
}

async function readJsonBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return req.body ? JSON.parse(req.body) : {};

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function normalizeName(value) {
  const normalized = String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 16);

  if (!normalized) return '';
  if (!/^[A-Za-z0-9 ._-]+$/.test(normalized)) return '';
  return normalized;
}

function normalizeScore(value) {
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 9999999) return null;
  return parsed;
}

function normalizeLevel(value) {
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isFinite(parsed) || parsed < 1 || parsed > 999) return 1;
  return parsed;
}

async function fetchLeaderboard(limit) {
  const safeLimit = Math.min(Math.max(limit, 1), MAX_LIMIT);
  const url =
    `${SUPABASE_URL}/rest/v1/${TABLE_NAME}` +
    `?select=name,score,level,created_at` +
    `&order=score.desc,created_at.asc` +
    `&limit=${safeLimit}`;

  const response = await fetch(url, {
    headers: getSupabaseHeaders(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase fetch failed: ${response.status} ${text}`);
  }

  return response.json();
}

async function insertScore(entry) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE_NAME}`, {
    method: 'POST',
    headers: getSupabaseHeaders('return=representation'),
    body: JSON.stringify([entry]),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase insert failed: ${response.status} ${text}`);
  }

  const payload = await response.json();
  return payload[0];
}

export default async function handler(req, res) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return sendJson(res, 500, { error: 'Missing Supabase environment variables.' });
  }

  if (req.method === 'GET') {
    try {
      const limit = Number.parseInt(String(req.query?.limit || DEFAULT_LIMIT), 10) || DEFAULT_LIMIT;
      const scores = await fetchLeaderboard(limit);
      return sendJson(res, 200, { scores });
    } catch (error) {
      return sendJson(res, 502, { error: 'Failed to load leaderboard.' });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const name = normalizeName(body.name);
      const score = normalizeScore(body.score);
      const level = normalizeLevel(body.level);

      if (!name) {
        return sendJson(res, 400, { error: 'Name must be 1-16 valid characters.' });
      }
      if (score === null) {
        return sendJson(res, 400, { error: 'Score must be a valid non-negative integer.' });
      }

      const inserted = await insertScore({ name, score, level });
      const scores = await fetchLeaderboard(DEFAULT_LIMIT);
      return sendJson(res, 201, { entry: inserted, scores });
    } catch (error) {
      return sendJson(res, 502, { error: 'Failed to submit score.' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return sendJson(res, 405, { error: 'Method not allowed.' });
}
