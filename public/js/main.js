const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

const filterButtons = document.querySelectorAll('.filters button');
const serviceCards = document.querySelectorAll('.service-cards .card');
const galleryItems = document.querySelectorAll('.gallery-grid .grid-item');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    if (serviceCards.length > 0) {
      serviceCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    }

    if (galleryItems.length > 0) {
      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    }
  });
});

const privacyPolicyLink = document.getElementById('privacy-policy-link');
const modal = document.getElementById('privacy-policy-modal');
const closeButton = document.querySelector('.close-button');

privacyPolicyLink.addEventListener('click', () => {
  modal.style.display = 'block';
});

closeButton.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
});

const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;

darkModeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  if (body.classList.contains('dark-mode')) {
    localStorage.setItem('darkMode', 'enabled');
  } else {
    localStorage.setItem('darkMode', 'disabled');
  }
});

if (localStorage.getItem('darkMode') === 'enabled') {
  body.classList.add('dark-mode');
}
