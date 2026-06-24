// api/feedback.js — Discord Webhook feedback handler
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).end();

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return res.status(500).json({ error: 'DISCORD_WEBHOOK_URL is not set in environment variables.' });
  }

  const { rating, comment, lessonTitle, lessonId, skillMode, model } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
  }

  const stars     = '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  const moodLabel = ['', 'Poor 😕', 'Fair 😐', 'Good 🙂', 'Great 😊', 'Excellent! 🤩'][rating];

  // Colour: blue = 5, orange = 3-4, red = 1-2
  const colour = rating >= 5 ? 0x4361EE : rating >= 3 ? 0xf97316 : 0xef4444;

  const fields = [
    { name: '📖 Lesson',     value: lessonTitle || '_No lesson selected_', inline: true },
    { name: '🎯 Skill Mode', value: skillMode
        ? skillMode.charAt(0).toUpperCase() + skillMode.slice(1) + ' Mode'
        : 'Default',
      inline: true },
    { name: '🤖 Model',      value: model || 'Unknown', inline: true },
  ];

  if (comment && comment.trim()) {
    fields.push({ name: '💬 Comment', value: comment.slice(0, 1000) });
  }

  const payload = {
    username:   'Automation AI Lab',
    embeds: [{
      title:       `${stars}  ${moodLabel} — ${rating}/5 stars`,
      color:        colour,
      fields,
      footer: { text: `Automation AI Lab Feedback • ${new Date().toUTCString()}` },
      timestamp:    new Date().toISOString()
    }]
  };

  try {
    const r = await fetch(webhookUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
      signal:  AbortSignal.timeout(8000)
    });
    if (!r.ok) {
      const txt = await r.text().catch(() => '');
      return res.status(500).json({ error: `Discord error ${r.status}: ${txt.slice(0, 200)}` });
    }
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
