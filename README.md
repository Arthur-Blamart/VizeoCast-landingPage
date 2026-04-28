# VizeoCast — Site Vitrine

Landing page pour VizeoCast, le boitier intelligent de captation vidéo pour l'enseignement hybride.

## Démarrage rapide

```bash
npm install
npm start
# → http://localhost:3000
```

Mode développement (rechargement automatique) :
```bash
npm run dev
```

## Structure

```
vizeocast-site/
├── server.js           # Serveur Express (port 3000)
├── package.json
├── data/
│   └── contacts.json   # Formulaires reçus (créé automatiquement)
└── public/
    ├── index.html      # Landing page complète
    ├── css/style.css   # Styles (vanilla CSS)
    └── js/main.js      # Interactions (vanilla JS)
```

## Fonctionnalités

- 10 sections : Hero, Problème, Solution, Comment ça marche, Expériences, Tarifs, Comparatif, Partenaires, Contact, Footer
- Animations au scroll via IntersectionObserver (sans bibliothèque)
- Formulaire de contact → stockage JSON (`data/contacts.json`)
- Nav fixe avec effet scroll, menu burger mobile
- Responsive mobile-first
- SEO basique (meta, Open Graph)

## Prochaines étapes

- Remplacer les placeholders logo par les vraies images
- Configurer Nodemailer pour l'envoi email (`/api/contact`)
- Ajouter un domaine et déployer sur OVH (Node.js + PM2)
- Intégrer Google Analytics ou Plausible

## Déploiement OVH

```bash
# Sur le serveur OVH
npm install --omit=dev
PORT=8080 node server.js

# Ou avec PM2
pm2 start server.js --name vizeocast
pm2 save
```
