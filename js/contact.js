document.addEventListener('DOMContentLoaded', function() {
    // Initialize date picker for appointment booking
    if (document.getElementById('appointmentDate')) {
        flatpickr("#appointmentDate", {
            minDate: "today",
            dateFormat: "Y-m-d",
            disable: [function(date) {
                // Disable weekends (Saturday and Sunday)
                return (date.getDay() === 0 || date.getDay() === 6);
            }],
            locale: {
                firstDayOfWeek: 1 // Start week on Monday
            },
            onChange: function(selectedDates, dateStr) {
                // Update available time slots based on selected date
                updateAvailableTimeSlots(dateStr);
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
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validateForm(contactForm)) {
                // Show success message (in a real application, you would send data to server)
                showFormMessage(contactForm, 'success', 'Your message has been sent successfully! We will contact you soon.');
                contactForm.reset();
            }
        });
    }

    // Booking form submission
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validateForm(bookingForm)) {
                // Get form data for confirmation
                const bookingData = {
                    name: document.getElementById('bookingName').value,
                    email: document.getElementById('bookingEmail').value,
                    phone: document.getElementById('bookingPhone').value,
                    service: document.getElementById('serviceType').options[document.getElementById('serviceType').selectedIndex].text,
                    date: document.getElementById('appointmentDate').value,
                    time: document.getElementById('appointmentTime').options[document.getElementById('appointmentTime').selectedIndex].text,
                    time: document.getElementById('appointmentTime').options[document.getElementById('appointmentTime').selectedIndex].text
                };
                
                // Show booking confirmation
                showBookingConfirmation(bookingData);
                
                // Show success message
                showFormMessage(bookingForm, 'success', 'Your consultation has been booked successfully! We will confirm your appointment shortly.');
                bookingForm.reset();
                
                // Reset flatpickr
                if (document.getElementById('appointmentDate')._flatpickr) {
                    document.getElementById('appointmentDate')._flatpickr.clear();
                }
            }
        });
    }
    
    // Function to display booking confirmation
    function showBookingConfirmation(bookingData) {
        // Create confirmation modal if it doesn't exist
        let confirmationModal = document.getElementById('bookingConfirmationModal');
        
        if (!confirmationModal) {
            confirmationModal = document.createElement('div');
            confirmationModal.id = 'bookingConfirmationModal';
            confirmationModal.className = 'booking-confirmation-modal';
            document.body.appendChild(confirmationModal);
            
            // Add styles if not already in CSS
            const modalStyles = document.createElement('style');
            modalStyles.textContent = `
                .booking-confirmation-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1001;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }
                .booking-confirmation-modal.active {
                    opacity: 1;
                    visibility: visible;
                }
                .confirmation-content {
                    background-color: white;
                    border-radius: 10px;
                    padding: 30px;
                    max-width: 500px;
                    width: 90%;
                    box-shadow: var(--shadow);
                    position: relative;
                }
                .confirmation-close {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: var(--light-text);
                }
                .confirmation-details {
                    margin-top: 20px;
                }
                .confirmation-details p {
                    margin-bottom: 10px;
                    display: flex;
                }
                .confirmation-details strong {
                    width: 120px;
                    display: inline-block;
                    color: var(--primary-color);
                }
                .confirmation-actions {
                    margin-top: 25px;
                    text-align: center;
                }
            `;
            document.head.appendChild(modalStyles);
        }
        
        // Create confirmation content
        confirmationModal.innerHTML = `
            <div class="confirmation-content">
                <div class="confirmation-close">&times;</div>
                <h3>Booking Confirmation</h3>
                <p>Thank you for booking a consultation with us. Here are your booking details:</p>
                <div class="confirmation-details">
                    <p><strong>Name:</strong> ${bookingData.name}</p>
                    <p><strong>Email:</strong> ${bookingData.email}</p>
                    <p><strong>Phone:</strong> ${bookingData.phone}</p>
                    <p><strong>Service:</strong> ${bookingData.service}</p>
                    <p><strong>Date:</strong> ${bookingData.date}</p>
                    <p><strong>Time:</strong> ${bookingData.time}</p>
                    ${bookingData.notes ? `<p><strong>Notes:</strong> ${bookingData.notes}</p>` : ''}
                </div>
                <div class="confirmation-actions">
                    <button class="btn btn-primary confirmation-close-btn">Close</button>
                    <a href="#" class="btn btn-secondary add-to-calendar-btn">Add to Calendar</a>
                </div>
            </div>
        `;
        
        // Show modal
        setTimeout(() => {
            confirmationModal.classList.add('active');
        }, 100);
        
        // Close modal functionality
        const closeButtons = confirmationModal.querySelectorAll('.confirmation-close, .confirmation-close-btn');
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                confirmationModal.classList.remove('active');
                setTimeout(() => {
                    confirmationModal.style.display = 'none';
                }, 300);
            });
        });
        
        // Add to calendar functionality (simplified - would link to actual calendar service in production)
        const addToCalendarBtn = confirmationModal.querySelector('.add-to-calendar-btn');
        if (addToCalendarBtn) {
            addToCalendarBtn.addEventListener('click', function(e) {
                e.preventDefault();
                alert('Calendar integration would be implemented here with Google Calendar, Outlook, etc.');
            });
        }
    }

    // Form validation function
    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        // Remove any existing error messages
        const existingErrors = form.querySelectorAll('.error-message');
        existingErrors.forEach(error => error.remove());
        
        // Check each required field
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showError(field, 'This field is required');
                isValid = false;
            } else if (field.type === 'email' && !isValidEmail(field.value)) {
                showError(field, 'Please enter a valid email address');
                isValid = false;
            } else if (field.id === 'phone' || field.id === 'bookingPhone') {
                if (!isValidPhone(field.value)) {
                    showError(field, 'Please enter a valid phone number');
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }

    // Show error message for a field
    function showError(field, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = 'red';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '5px';
        
        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = 'red';
        
        // Remove error styling when user starts typing
        field.addEventListener('input', function() {
            field.style.borderColor = '';
            const error = field.parentNode.querySelector('.error-message');
            if (error) {
                error.remove();
            }
        });
    }

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

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Phone validation (basic)
    function isValidPhone(phone) {
        const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
        return phoneRegex.test(phone) || phone.length >= 10;
    }
});