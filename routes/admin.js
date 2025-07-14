const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const fs = require('fs');

const ensureAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    return next();
  }
  req.flash('error_msg', 'Please log in to view this resource.');
  res.redirect('/admin/login');
};

router.get('/login', (req, res) => {
  res.render('admin/login', { title: 'Admin Login' });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (username === adminUsername && bcrypt.compareSync(password, adminPasswordHash)) {
    req.session.isAuthenticated = true;
    res.redirect('/admin/dashboard');
  } else {
    req.flash('error_msg', 'Invalid username or password.');
    res.redirect('/admin/login');
  }
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  const publicFiles = fs.readdirSync('public/downloads/public').map(file => ({ name: file, path: `public/${file}` }));
  const eulogyFiles = fs.readdirSync('public/downloads/eulogies').map(file => ({ name: file, path: `eulogies/${file}` }));
  const files = [...publicFiles, ...eulogyFiles];
  res.render('admin/dashboard', { title: 'Admin Dashboard', username: process.env.ADMIN_USERNAME, files: files });
});

router.post('/upload', ensureAuthenticated, (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    req.flash('error_msg', 'No file was uploaded.');
    return res.redirect('/admin/dashboard');
  }

  const { file } = req.files;
  const { type, title, expiry } = req.body;
  const uploadPath = `public/downloads/${type}/${file.name}`;

  file.mv(uploadPath, (err) => {
    if (err) {
      console.error(err);
      req.flash('error_msg', 'Error uploading file.');
      return res.redirect('/admin/dashboard');
    }

    const downloadsEjs = fs.readFileSync('views/downloads.ejs', 'utf-8');
    const newLink = `<li><a href="/download?file=${type}/${file.name}">${title}</a>${type === 'eulogy' ? `<span>${expiry}</span>` : ''}</li>`;
    const sectionClass = type === 'public' ? 'public-documents' : 'eulogy-documents';
    const updatedEjs = downloadsEjs.replace(`</section>\n\n  <section class="${sectionClass}">`, `${newLink}\n      </section>\n\n      <section class="${sectionClass}">`);
    fs.writeFileSync('views/downloads.ejs', updatedEjs);

    req.flash('success_msg', 'File uploaded and downloads page updated.');
    res.redirect('/admin/dashboard');
  });
});

router.post('/delete', ensureAuthenticated, (req, res) => {
  const { fileToDelete } = req.body;
  const filePath = `public/downloads/${fileToDelete}`;

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      req.flash('error_msg', 'Error deleting file.');
      return res.redirect('/admin/dashboard');
    }

    const downloadsEjs = fs.readFileSync('views/downloads.ejs', 'utf-8');
    const linkRegex = new RegExp(`<li><a href="/download\\?file=${fileToDelete.replace(/\//g, '\\/')}">.*?</a>.*?</li>`);
    const updatedEjs = downloadsEjs.replace(linkRegex, '');
    fs.writeFileSync('views/downloads.ejs', updatedEjs);

    req.flash('success_msg', 'File deleted and downloads page updated.');
    res.redirect('/admin/dashboard');
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
