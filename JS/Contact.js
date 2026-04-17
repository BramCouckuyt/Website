document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const form = this;
    const data = new FormData(form);

    fetch(form.action, {
        method: 'POST',
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(function(response) {
        if (response.ok) {
            form.style.display = 'none';
            document.getElementById('contactConfirmation').style.display = 'block';
        } else {
            alert('Something went wrong. Please try again or email us directly.');
        }
    })
    .catch(function() {
        alert('Something went wrong. Please try again or email us directly.');
    });
});