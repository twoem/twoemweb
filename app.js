const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
require('dotenv').config();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('home', { title: 'Twoem | Home' });
});

app.get('/services', (req, res) => {
  res.render('services', { title: 'Twoem | Services' });
});

app.get('/gallery', (req, res) => {
  res.render('gallery', { title: 'Twoem | Gallery' });
});

app.get('/downloads', (req, res) => {
  res.render('downloads', { title: 'Twoem | Downloads', status: req.query.status });
});

app.get('/download', (req, res) => {
  const file = req.query.file;
  res.render('loading', { title: 'Twoem | Loading...', file: file });
});

app.get('/download-file', (req, res) => {
  const file = req.query.file;
  setTimeout(() => {
    res.download(`public/downloads/${file}`, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }, 3000);
});

app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Twoem | Contact' });
});

app.post('/contact/send', (req, res) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: req.body.email,
    to: process.env.EMAIL_RECEIVER,
    subject: `Contact Form Submission: ${req.body.subject}`,
    text: `Name: ${req.body.name}\nEmail: ${req.body.email}\nPhone: ${req.body.phone}\n\nMessage: ${req.body.message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.redirect('/contact?status=error');
    } else {
      console.log('Email sent: ' + info.response);
      res.redirect('/contact?status=success');
    }
  });
});

app.post('/newsletter-signup', (req, res) => {
  // In a real application, you would add the user's email to a mailing list here.
  res.redirect('/?newsletter=success');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
