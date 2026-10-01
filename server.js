const express = require('express');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'site.json');

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const defaultSite = {
  siteName: 'NVER.AM',
  heroTitle: 'Վեբ դիզայն և զարգացում, որը աշխատում է',
  heroSubtitle: 'Մենք ստեղծում ենք գեղեցիկ, արդյունավետ և բիզնես-կենտրոնացված կայքեր, որոնք օգնում են ձեզ աճել և ամրապնդել ձեր առցանց ներկայությունը։',
  heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  siteTagline: 'Premium digital presence for modern brands',
  services: [
    {
      icon: '🎨',
      title: 'Վեբ դիզայն',
      text: 'Գեղեցիկ, ժամանակակից դիզայն, որը կարտացոլի ձեր բրենդը և կգրավի ձեր լսարանը:'
    },
    {
      icon: '💻',
      title: 'Վեբ զարգացում',
      text: 'Արագ, անվտանգ և մասշտաբируем կայքեր՝ օգտագործելով նորագույն տեխնոլոգիաներ:'
    },
    {
      icon: '🎯',
      title: 'Բրենդինգ',
      text: 'Բրենդի ամբողջական մշակում՝ լոգոտիպ, հաղորդակցություն և ոճ:'
    }
  ],
  aboutTitle: 'Ինչու ընտրել մեզ?',
  aboutText: 'Մենք ոչ միայն դիզայներներ և ծրագրավորողներ ենք, այլև ձեր բիզնեսի թվային գործընկերները։',
  portfolio: [
    {
      image: 'https://images.unsplash.com/photo-1460925895917-aeb19be489c7?auto=format&fit=crop&w=800&q=80',
      title: 'Առցանց խանութ',
      text: 'Ժամանակակից առևտրային հարթակ'
    },
    {
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
      title: 'Կորպորատիվ կայք',
      text: 'Պրոֆեսիոնալ առկայություն բիզնեսի համար'
    },
    {
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
      title: 'SaaS վահանակ',
      text: 'Հարմար օգտագործման ինտերֆեյս'
    }
  ],
  testimonials: [
    {
      name: 'Էնգին Մ.',
      role: 'TechStart',
      text: 'Nver.am-ը փոխակերպեց մեր առցանց ներկայությունը։ Դիզայնը հիասքանչ է, իսկ արդյունքները խոսում են ինքնուրույն։',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
    },
    {
      name: 'Միքայել Չ.',
      role: 'Digital Agency',
      text: 'Պրոֆեսիոնալիզմի բարձր մակարդակ։ Նրանք հասկացել են մեր տեսլականը և տվել են ավելին, քան սպասել էինք։',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    {
      name: 'Էմմա Դ.',
      role: 'Մարքեթինգային տնօրեն',
      text: 'Մանրամասների նկատմամբ ուշադրությունը հիանալի է։ Մեր նոր կայքը մեծացրել է փոխակերպումները 40%-ով։',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80'
    }
  ],
  contact: {
    email: 'hello@nver.am',
    phone: '+374 (0) 94 223 223',
    location: 'Երևան, Հայաստան',
    socials: 'Instagram | Twitter | LinkedIn'
  },
  footerText: '© 2024 Nver.am. Բոլոր իրավունքները պաշտպանված են։ | Ստեղծված ❤️-ով Հայաստանում'
};

function ensureDataFile() {
  if (!fs.existsSync(path.dirname(DATA_FILE))) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultSite, null, 2), 'utf8');
  }
}

function readSite() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    return { ...defaultSite };
  }
}

function writeSite(site) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(site, null, 2), 'utf8');
}

function isAuthenticated(req) {
  return req.cookies && req.cookies.nver_admin === 'authenticated';
}

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/api/site', (req, res) => {
  res.json(readSite());
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.cookie('nver_admin', 'authenticated', {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 8
    });
    return res.json({ success: true, message: 'Login successful' });
  }

  res.status(401).json({ success: false, message: 'Invalid username or password' });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('nver_admin');
  res.json({ success: true });
});

app.post('/api/site', (req, res) => {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const updated = { ...readSite(), ...req.body };
  writeSite(updated);
  res.json({ success: true, site: updated });
});

app.listen(PORT, () => {
  console.log(`Nver.am app running on http://localhost:${PORT}`);
});
