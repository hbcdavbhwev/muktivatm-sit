document.addEventListener('DOMContentLoaded', () => {
    // Initialize date picker for appointment booking
    const datePickerInput = document.querySelector('.flatpickr'); // Use class selector
    if (datePickerInput) {
        flatpickr(datePickerInput, {
            minDate: "today",
            dateFormat: "Y-m-d",
            disable: [function(date) {
                // Disable weekends (Saturday=6, Sunday=0)
                return (date.getDay() === 0 || date.getDay() === 6);
            }],
            locale: {
                firstDayOfWeek: 1 // Monday
            }
        });
    }
    
    // Function to update available time slots based on selected date
    function updateAvailableTimeSlots(selectedDate) {
        const timeSelect = document.getElementById('appointmentTime');
        if (!timeSelect) return;
        
        // Clear current options except the first one
        while (timeSelect.options.length > 1) {
            timeSelect.remove(1);
        }
        
        // In a real application, you would fetch available slots from server
        // For demo purposes, we'll simulate different availability for different days
        const day = new Date(selectedDate).getDay();
        
        // Default time slots
        const timeSlots = [
            {value: '9:00', text: '9:00 AM'},
            {value: '10:00', text: '10:00 AM'},
            {value: '11:00', text: '11:00 AM'},
            {value: '13:00', text: '1:00 PM'},
            {value: '14:00', text: '2:00 PM'},
            {value: '15:00', text: '3:00 PM'},
            {value: '16:00', text: '4:00 PM'}
        ];
        
        // Simulate some slots being unavailable on certain days
        let availableSlots = [];
        if (day === 1) { // Monday
            availableSlots = timeSlots.filter(slot => !['11:00', '14:00'].includes(slot.value));
        } else if (day === 2 || day === 4) { // Tuesday or Thursday
            availableSlots = timeSlots.filter(slot => !['9:00', '15:00'].includes(slot.value));
        } else {
            availableSlots = timeSlots;
        }
        
        // Add available time slots to select
        availableSlots.forEach(slot => {
            const option = document.createElement('option');
            option.value = slot.value;
            option.textContent = slot.text;
            timeSelect.appendChild(option);
        });
    }

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    const bookingForm = document.getElementById('bookingForm');

    const handleFormSubmit = async (form, event) => {
        event.preventDefault();
        const statusDiv = form.nextElementSibling; // Assuming status div is right after form
        statusDiv.innerHTML = ''; // Clear previous status
        statusDiv.className = 'form-status mt-4'; // Reset classes

        if (!validateForm(form)) {
            statusDiv.innerHTML = `<p class="error">Please fix the errors above.</p>`;
            statusDiv.classList.add('error');
            return; // Stop submission if validation fails
        }

        // Simulate sending data (replace with actual fetch/AJAX call)
        statusDiv.innerHTML = `<p class="loading">Sending...</p>`;
        statusDiv.classList.add('loading');

        try {
            // --- !!! Replace this setTimeout with your actual form submission logic !!! ---
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

            // Example: Use Fetch API to send data
            // const formData = new FormData(form);
            // const response = await fetch('YOUR_SERVER_ENDPOINT', {
            //     method: 'POST',
            //     body: formData
            // });
            // if (!response.ok) {
            //     throw new Error('Network response was not ok');
            // }
            // const result = await response.json(); // Or response.text()
            // console.log('Success:', result);
            // --- End of example submission logic ---

            const successMessage = form.id === 'bookingForm'
                ? 'Your booking request has been sent successfully! We will contact you shortly to confirm.'
                : 'Your message has been sent successfully! We will get back to you soon.';

            statusDiv.innerHTML = `<p class="success">${successMessage}</p>`;
            statusDiv.classList.remove('loading');
            statusDiv.classList.add('success');
            form.reset();
            // Reset Flatpickr if it exists on this form
            const dateInput = form.querySelector('.flatpickr');
            if (dateInput && dateInput._flatpickr) {
                dateInput._flatpickr.clear();
            }
            clearValidationErrors(form);

        } catch (error) {
            console.error('Form submission error:', error);
            statusDiv.innerHTML = `<p class="error">An error occurred. Please try again later.</p>`;
            statusDiv.classList.remove('loading');
            statusDiv.classList.add('error');
        }
    };

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => handleFormSubmit(contactForm, e));
    }
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => handleFormSubmit(bookingForm, e));
    }

    // Form validation function
    const validateForm = (form) => {
        let isValid = true;
        clearValidationErrors(form); // Clear previous errors
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            const value = field.value.trim();
            if (value === '') {
                showError(field, 'This field is required.');
                isValid = false;
            } else if (field.type === 'email' && !isValidEmail(value)) {
                showError(field, 'Please enter a valid email address.');
                isValid = false;
            } else if (field.type === 'tel' && !isValidPhone(value)) {
                // Optional: Add phone validation if needed, adjust logic
                // showError(field, 'Please enter a valid phone number.');
                // isValid = false;
            }
        });
        
        return isValid;
    };

    // Show error message for a field
    const showError = (field, message) => {
        field.classList.add('is-invalid');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        // Insert after the field or its wrapper
        field.parentNode.insertBefore(errorDiv, field.nextSibling);
    };

    const clearValidationErrors = (form) => {
        form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        form.querySelectorAll('.error-message').forEach(el => el.remove());
    };

    // Email validation
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Phone validation (basic)
    const isValidPhone = (phone) => {
        const phoneRegex = /^[\\d\\s\\-\\(\\)]+$/;
        return phoneRegex.test(phone.trim());
    };

    // Show form submission message
    function showFormMessage(form, type, message) {
        // Remove any existing messages
        const existingMessages = form.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}-message`;
        messageDiv.textContent = message;
        
        // Style based on message type
        if (type === 'success') {
            messageDiv.style.backgroundColor = 'rgba(39, 174, 96, 0.1)';
            messageDiv.style.color = 'var(--success-color)';
        } else {
            messageDiv.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
            messageDiv.style.color = '#e74c3c';
        }
        
        messageDiv.style.padding = '15px';
        messageDiv.style.borderRadius = '5px';
        messageDiv.style.marginBottom = '20px';
        
        // Insert at the top of the form
        form.insertBefore(messageDiv, form.firstChild);
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    // --- Add CSS for Validation States & Status --- //
    const validationStyles = document.createElement('style');
    validationStyles.textContent = `
        .form-group input.is-invalid,
        .form-group textarea.is-invalid,
        .form-group select.is-invalid {
            border-color: #dc3545; /* Red for errors */
            box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.15);
        }
        .error-message {
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }
        .form-status p {
            padding: 15px;
            border-radius: var(--border-radius);
            margin: 0;
        }
        .form-status.loading p {
            background-color: #e2e3e5;
            color: #383d41;
            border: 1px solid #d6d8db;
        }
        .form-status.success p {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .form-status.error p {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
    `;
    document.head.appendChild(validationStyles);
});
