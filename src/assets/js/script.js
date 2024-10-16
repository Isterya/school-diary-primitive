document.addEventListener('DOMContentLoaded', () => {
   // Menu
   const hamburgerMenu = document.getElementById('hamburger-menu');
   const closeMenuIcon = document.getElementById('close-menu-icon');
   const menuWrapper = document.getElementById('menu-wrapper');

   hamburgerMenu.addEventListener('click', function () {
      menuWrapper.classList.toggle('open');
      document.body.classList.toggle('no-scroll');
      closeMenuIcon.style.display = 'block';
   });

   closeMenuIcon.addEventListener('click', function () {
      menuWrapper.classList.toggle('open');
      document.body.classList.toggle('no-scroll');
      closeMenuIcon.style.display = 'none';
   });

   // Date
   const currentDate = new Date();
   const options = { year: 'numeric', month: 'long', day: 'numeric' };
   const formattedDate = currentDate.toLocaleDateString('en-US', options);

   document.getElementById('promo-date').textContent = formattedDate;

   // Form
   const form = document.getElementById('newsletter-form');
   const emailInput = document.getElementById('email');
   const statusMessage = document.getElementById('status-message');

   form.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = emailInput.value.trim();

      if (email === '') {
         statusMessage.textContent = 'Пожалуйста, введите ваш email.';
         statusMessage.style.color = 'red';
         return;
      }

      statusMessage.textContent = 'Отправка...';
      statusMessage.style.color = 'black';

      const templateParams = {
         email: email,
         from_name: 'Dziennik Team',
      };

      emailjs.send('service_vm3ywcp', 'template_1k8zhqo', templateParams).then(
         function (response) {
            console.log('SUCCESS!', response.status, response.text);
            statusMessage.textContent =
               'Dziękujemy za subskrypcję! Sprawdź swoją skrzynkę e-mail.';
            statusMessage.style.color = 'green';
            emailInput.value = '';

            setTimeout(() => {
               statusMessage.textContent = '';
            }, 7000);
         },
         function (error) {
            console.log('FAILED...', error);
            statusMessage.textContent = 'Błąd wysyłania!';
            statusMessage.style.color = 'red';

            setTimeout(() => {
               statusMessage.textContent = '';
            }, 7000);
         }
      );
   });
});
