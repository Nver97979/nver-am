# Nver.am Full Admin Website

This project includes:
- A modern premium landing page for Nver.am
- A simple admin panel for changing content and banner text
- A Node.js + Express backend with JSON persistence
- Login protection for the admin area

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the app:
   ```bash
   npm start
   ```
3. Open:
   - Main site: http://localhost:3000/
   - Admin panel: http://localhost:3000/admin

## Default admin login

- Username: `admin`
- Password: `admin123`

## Notes

- The admin data is stored in `data/site.json`
- You can change the hero text, contact info, services, portfolio, and page copy from the admin panel
- For a real production deployment, use a hosted Node environment such as Render, Railway, or Vercel + serverless version

## Custom domain

To use `https://Nver.am`, you still need a purchased domain and DNS configuration pointing to your hosting provider.
