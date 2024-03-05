class ContactForm {
  constructor() {
    this.form = document.getElementById("contact-form");
    this.nameInput = document.getElementById("name");
    this.emailInput = document.getElementById("email");
    this.phoneInput = document.getElementById("phone");
    this.messageInput = document.getElementById("message");

    this.errorName = document.getElementById("error-name");
    this.errorEmail = document.getElementById("error-email");
    this.errorPhone = document.getElementById("error-phone");
    this.errorMessage = document.getElementById("error-message");

    this.form.addEventListener("submit", this.handleSubmit.bind(this));
  }

  handleSubmit(event) {
    event.preventDefault();

    const name = this.nameInput.value;
    const email = this.emailInput.value;
    const phone = this.phoneInput.value;
    const message = this.messageInput.value;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{3} \d{3} \d{4}$/;

    this.clearErrors();

    if (!name) {
      this.showError(this.errorName, "Name is required");
    }
    if (!email) {
      this.showError(this.errorEmail, "Email is required");
    } else if (!emailPattern.test(email)) {
      this.showError(this.errorEmail, "Invalid email format");
    }
    if (!phone) {
      this.showError(this.errorPhone, "Phone is required");
    } else if (!phonePattern.test(phone)) {
      this.showError(this.errorPhone, "Invalid phone format (XXX XXX XXXX)");
    }
    if (!message) {
      this.showError(this.errorMessage, "Message is required");
    }

    if (name && email && phone && message) {
      this.submitForm(name, email, phone, message);
    }
  }

  showError(errorElement, message) {
    errorElement.textContent = message;
  }

  clearErrors() {
    this.errorName.textContent = "";
    this.errorEmail.textContent = "";
    this.errorPhone.textContent = "";
    this.errorMessage.textContent = "";
  }

  submitForm(name, email, phone, message) {
    // Replace with your form submission logic
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Phone:", phone);
    console.log("Message:", message);

    // Clear form fields after successful submission
    this.form.reset();
    this.clearErrors();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = new ContactForm();

  /* animation for navigation*/
  $("nav").hover(
    function () {
      $(this).stop().animate({ width: "240px" }, 100);
    },
    function () {
      $(this).stop().animate({ width: "80px" }, 100);
    }
  );
});
