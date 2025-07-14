const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

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
  res.render('downloads', { title: 'Twoem | Downloads' });
});

app.get('/download', (req, res) => {
  const file = req.query.file;
  res.render('loading', { title: 'Twoem | Loading...', file: file });
});

app.get('/download-file', (req, res) => {
  const file = req.query.file;
  res.download(`public/downloads/${file}`, (err) => {
    if (err) {
      console.log(err);
      req.flash('error_msg', 'Could not download the file.');
      res.redirect('/downloads');
    } else {
      req.flash('success_msg', 'Your download will start shortly.');
      res.redirect('/downloads');
    }
  });
});

app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Twoem | Contact' });
});

app.post('/contact/send', (req, res) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Twoem Contact Form" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_RECEIVER,
    subject: `Contact Form Submission: ${req.body.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <div style="text-align: center; padding: 1rem; background-color: #f4f4f4;">
          <img src="https://twoemcyberkagwe.onrender.com/logo.jpg" alt="Twoem Online Productions" style="width: 100px; height: 100px; border-radius: 50%;">
          <h2>New Contact Form Submission</h2>
        </div>
        <div style="padding: 1rem;">
          <h3>Contact Details</h3>
          <ul>
            <li><strong>Name:</strong> ${req.body.name}</li>
            <li><strong>Email:</strong> ${req.body.email}</li>
            <li><strong>Phone:</strong> ${req.body.phone || 'Not provided'}</li>
          </ul>
          <h3>Message</h3>
          <p>${req.body.message}</p>
        </div>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.render('contact', { title: 'Twoem | Contact', status: 'error' });
    } else {
      console.log('Email sent: ' + info.response);
      res.render('contact', { title: 'Twoem | Contact', status: 'success' });
    }
  });
});

app.post('/newsletter-signup', (req, res) => {
  // In a real application, you would add the user's email to a mailing list here.
  res.redirect('/?newsletter=success');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
