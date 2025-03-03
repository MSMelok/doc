// Theme handling
function initTheme() {
    // Always set dark theme by default
    document.documentElement.className = 'dark';
}

function toggleTheme() {
    const html = document.documentElement;
    html.className = html.className === 'dark' ? 'light' : 'dark';
}

// Initialize theme
initTheme();
document.getElementById('themeToggle').addEventListener('click', toggleTheme);

// Form validation state
let formState = {
    otherUserName: true,
    callbackNumber: true,
    agentNotes: true
};

// Show notification
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Validate phone number
function isValidPhoneNumber(phone) {
    const phoneRegex = /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
}

// Character count for notes
document.getElementById('agentNotes').addEventListener('input', function() {
    const maxLength = this.getAttribute('maxlength');
    const currentLength = this.value.length;
    document.getElementById('currentCount').textContent = currentLength;
    document.getElementById('maxCount').textContent = maxLength;
});

// Handle caller type changes
document.getElementById('callerType').addEventListener('change', function() {
    const otherUserFields = document.getElementById('otherUserFields');

    if (this.value === 'Other User') {
        otherUserFields.classList.remove('hidden');
    } else {
        otherUserFields.classList.add('hidden');
        document.getElementById('otherUserName').value = '';
    }

    validateForm();
});

// Validate form fields
function validateForm() {
    const callerType = document.getElementById('callerType').value;
    const callbackNumber = document.getElementById('callbackNumber').value;
    const agentNotes = document.getElementById('agentNotes').value;

    // Reset validation state
    formState = {
        otherUserName: true,
        callbackNumber: true,
        agentNotes: true
    };

    // Validate based on caller type
    if (callerType === 'Other User') {
        const otherUserName = document.getElementById('otherUserName').value;
        formState.otherUserName = otherUserName.trim() !== '';
        document.getElementById('otherUserFields').classList.toggle('error', !formState.otherUserName);
    }

    // Validate callback number
    formState.callbackNumber = isValidPhoneNumber(callbackNumber);
    document.getElementById('callbackNumber').parentElement.classList.toggle('error', !formState.callbackNumber);

    // Validate agent notes
    formState.agentNotes = agentNotes.trim() !== '';
    document.getElementById('agentNotes').parentElement.classList.toggle('error', !formState.agentNotes);

    return Object.values(formState).every(value => value === true);
}

// Generate template
function generateTemplate() {
    if (!validateForm()) {
        showNotification('Please fill in all required fields correctly', 'error');
        return;
    }

    const callerType = document.getElementById('callerType').value;
    const callbackNumber = document.getElementById('callbackNumber').value;
    const callReason = document.getElementById('callReason').value;
    const agentNotes = document.getElementById('agentNotes').value;

    let template = `__TECHNICAL_SUPPORT__`;

    if (callerType === 'Other User') {
        const otherUserName = document.getElementById('otherUserName').value;
        template += `\n#CALLER_NAME: ${otherUserName}`;
    }

    template += `\n#CALLER_TYPE: ${callerType}
#BEST_CB#: ${callbackNumber}
#CALL_REASON: ${callReason}
#AGENT_NOTES:- ${agentNotes}`;

    document.getElementById('outputTemplate').textContent = template;
    document.getElementById('copyButton').disabled = false;
    showNotification('Template generated successfully', 'success');
}

// Copy to clipboard
function copyToClipboard() {
    const outputText = document.getElementById('outputTemplate').textContent;
    if (!outputText) {
        showNotification('Please generate the template first', 'error');
        return;
    }

    navigator.clipboard.writeText(outputText)
        .then(() => {
            showNotification('Template copied to clipboard', 'success');
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
            showNotification('Failed to copy to clipboard', 'error');
        });
}

// Show reset confirmation modal
function showResetConfirmation() {
    const modal = document.getElementById('resetConfirmationModal');
    modal.classList.add('show');
}

// Handle reset confirmation
function handleResetConfirmation(confirmed) {
    const modal = document.getElementById('resetConfirmationModal');
    modal.classList.remove('show');

    if (confirmed) {
        resetForm();
    }
}


// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('resetConfirmationModal');
    if (event.target === modal) {
        modal.classList.remove('show');
    }
});

// Add escape key handler for modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('resetConfirmationModal');
        modal.classList.remove('show');
    }
});

// Confirm reset
function confirmReset() {
    showResetConfirmation();
}

// Reset form
function resetForm() {
    // Reset form fields
    document.getElementById('callerType').selectedIndex = 0;
    document.getElementById('otherUserName').value = '';
    document.getElementById('callbackNumber').value = '';
    document.getElementById('callReason').selectedIndex = 0;
    document.getElementById('agentNotes').value = '';
    document.getElementById('currentCount').textContent = '0';

    // Hide other user fields
    document.getElementById('otherUserFields').classList.add('hidden');

    // Clear output template
    document.getElementById('outputTemplate').textContent = '';

    // Disable copy button
    document.getElementById('copyButton').disabled = true;

    // Remove error classes
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
    });

    // Reset validation state
    formState = {
        otherUserName: true,
        callbackNumber: true,
        agentNotes: true
    };

    showNotification('Form has been reset', 'success');
}

// Add input event listeners for real-time validation
['otherUserName', 'callbackNumber', 'agentNotes'].forEach(id => {
    document.getElementById(id).addEventListener('input', validateForm);
});

// Assuming a reset button with id 'resetButton' exists
document.getElementById('resetButton').addEventListener('click', confirmReset);

// Initialize spellcheck when the page loads
document.addEventListener('DOMContentLoaded', initSpellcheck);

// Initialize spellcheck
function initSpellcheck() {
    const agentNotes = document.getElementById('agentNotes');
    agentNotes.spellcheck = true;
    agentNotes.lang = 'en';
}