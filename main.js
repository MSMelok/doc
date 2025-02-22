// Theme handling
function initTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.className = prefersDark ? 'dark' : 'light';
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

// Add input event listeners for real-time validation
['otherUserName', 'callbackNumber', 'agentNotes'].forEach(id => {
    document.getElementById(id).addEventListener('input', validateForm);
});