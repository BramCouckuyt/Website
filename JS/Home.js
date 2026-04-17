
document.querySelectorAll('.product-image').forEach(function (card) {
    card.addEventListener('click', function () {
        var hover = this.querySelector('.img-hover');
        if (hover.style.opacity === '1') {
            hover.style.opacity = '0';
        } else {
            hover.style.opacity = '1';
        }
    });
});

function checkReservedBadges() {
    document.querySelectorAll('.product-card').forEach(function(card) {
        const link = card.querySelector('.card-button');
        if (!link) return;
        const url = new URL(link.href);
        const id = url.searchParams.get('id');
        if (localStorage.getItem('reserved_product_' + id) === 'true') {
            card.classList.add('is-reserved');
            const badge = document.createElement('div');
            badge.className = 'shop-reserved-badge';
            badge.textContent = 'Reserved';
            card.querySelector('.product-image').appendChild(badge);
        }
    });
}

checkReservedBadges();