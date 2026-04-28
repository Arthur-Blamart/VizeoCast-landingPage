const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, etablissement, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Champs requis manquants.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: 'Email invalide.' });
  }

  const entry = {
    date: new Date().toISOString(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    etablissement: etablissement ? etablissement.trim() : '',
    message: message.trim(),
  };

  // Persist to JSON file (replace with Nodemailer / CRM later)
  const dataPath = path.join(__dirname, 'data');
  if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath);
  const filePath = path.join(dataPath, 'contacts.json');

  let contacts = [];
  if (fs.existsSync(filePath)) {
    try {
      contacts = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
      contacts = [];
    }
  }
  contacts.push(entry);
  fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2));

  console.log(`[Contact] ${entry.date} — ${entry.name} <${entry.email}> (${entry.etablissement})`);

  res.json({ success: true, message: 'Demande reçue, nous vous contactons rapidement.' });
});

// Fallback to index.html for any unmatched route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`VizeoCast site running → http://localhost:${PORT}`);
});
