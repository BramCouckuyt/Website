const activeFilters = { size: null, brand: null, condition: null };

const allPrices = Array.from(document.querySelectorAll('.product-card'))
    .map(c => parseInt(c.dataset.price));
const lowestPrice = Math.min(...allPrices);
const highestPrice = Math.max(...allPrices);

let minPrice = lowestPrice;
let maxPrice = highestPrice;

const priceMinSlider = document.getElementById('priceMin');
const priceMaxSlider = document.getElementById('priceMax');
const priceMinInput = document.getElementById('priceMinInput');
const priceMaxInput = document.getElementById('priceMaxInput');
const rangeFill = document.getElementById('rangeFill');

priceMinSlider.min = lowestPrice;
priceMinSlider.max = highestPrice;
priceMinSlider.value = lowestPrice;
priceMaxSlider.min = lowestPrice;
priceMaxSlider.max = highestPrice;
priceMaxSlider.value = highestPrice;
priceMinInput.min = lowestPrice;
priceMinInput.max = highestPrice;
priceMinInput.value = lowestPrice;
priceMaxInput.min = lowestPrice;
priceMaxInput.max = highestPrice;
priceMaxInput.value = highestPrice;

function updateRangeFill() {
    const min = parseInt(priceMinSlider.value);
    const max = parseInt(priceMaxSlider.value);
    const total = parseInt(priceMinSlider.max) - parseInt(priceMinSlider.min);
    const offset = parseInt(priceMinSlider.min);
    rangeFill.style.left = ((min - offset) / total * 100) + '%';
    rangeFill.style.width = ((max - min) / total * 100) + '%';
}

priceMinSlider.addEventListener('input', function() {
    if (parseInt(this.value) > parseInt(priceMaxSlider.value)) {
        this.value = priceMaxSlider.value;
    }
    minPrice = parseInt(this.value);
    priceMinInput.value = this.value;
    updateRangeFill();
});

priceMaxSlider.addEventListener('input', function() {
    if (parseInt(this.value) < parseInt(priceMinSlider.value)) {
        this.value = priceMinSlider.value;
    }
    maxPrice = parseInt(this.value);
    priceMaxInput.value = this.value;
    updateRangeFill();
});

priceMinSlider.addEventListener('change', function() {
    minPrice = parseInt(this.value);
    applyFilters();
});

priceMaxSlider.addEventListener('change', function() {
    maxPrice = parseInt(this.value);
    applyFilters();
});

priceMinInput.addEventListener('change', function() {
    let val = parseInt(this.value);
    if (val > maxPrice) val = maxPrice;
    if (val < lowestPrice) val = lowestPrice;
    this.value = val;
    minPrice = val;
    priceMinSlider.value = val;
    updateRangeFill();
    this.blur();
    applyFilters();
});

priceMaxInput.addEventListener('change', function() {
    let val = parseInt(this.value);
    if (val < minPrice) val = minPrice;
    if (val > highestPrice) val = highestPrice;
    this.value = val;
    maxPrice = val;
    priceMaxSlider.value = val;
    updateRangeFill();
    this.blur();
    applyFilters();
});

document.querySelectorAll('.filter-pill').forEach(function(pill) {
    pill.addEventListener('click', function() {
        const filter = this.dataset.filter;
        const value = this.dataset.value;
        if (activeFilters[filter] === value) {
            activeFilters[filter] = null;
            this.classList.remove('active');
        } else {
            document.querySelectorAll('.filter-pill[data-filter="' + filter + '"]').forEach(p => p.classList.remove('active'));
            activeFilters[filter] = value;
            this.classList.add('active');
        }
        applyFilters();
    });
});

document.getElementById('sortSelect').addEventListener('change', applyFilters);

document.getElementById('clearFilters').addEventListener('click', function() {
    activeFilters.size = null;
    activeFilters.brand = null;
    activeFilters.condition = null;
    minPrice = lowestPrice;
    maxPrice = highestPrice;
    priceMinSlider.value = lowestPrice;
    priceMaxSlider.value = highestPrice;
    priceMinInput.value = lowestPrice;
    priceMaxInput.value = highestPrice;
    updateRangeFill();
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    applyFilters();
});

document.querySelector('.filter-toggle').addEventListener('click', function() {
    const sidebar = document.getElementById('filterSidebar');
    sidebar.classList.toggle('open');
    this.textContent = sidebar.classList.contains('open') ? 'Hide filters' : 'Show filters';
});

function applyFilters() {
    const cards = document.querySelectorAll('.product-card');
    const sort = document.getElementById('sortSelect').value;
    let visible = 0;

    cards.forEach(function(card) {
        const size = card.dataset.size;
        const brand = card.dataset.brand;
        const price = parseInt(card.dataset.price);
        const condition = card.dataset.condition;

        const sizeMatch = !activeFilters.size || activeFilters.size === size;
        const brandMatch = !activeFilters.brand || activeFilters.brand === brand;
        const conditionMatch = !activeFilters.condition || activeFilters.condition === condition;
        const priceMatch = price >= minPrice && price <= maxPrice;

        if (sizeMatch && brandMatch && conditionMatch && priceMatch) {
            card.style.display = 'block';
            visible++;
        } else {
            card.style.display = 'none';
        }
    });

    document.getElementById('itemCount').textContent = visible + ' items';
    document.getElementById('noResults').style.display = visible === 0 ? 'block' : 'none';

    const grid = document.getElementById('shopGrid');
    const visibleCards = Array.from(cards).filter(c => c.style.display !== 'none');
    visibleCards.sort(function(a, b) {
        if (sort === 'price-asc') return parseInt(a.dataset.price) - parseInt(b.dataset.price);
        if (sort === 'price-desc') return parseInt(b.dataset.price) - parseInt(a.dataset.price);
        return 0;
    });
    visibleCards.forEach(c => grid.appendChild(c));
}

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

updateRangeFill();
checkReservedBadges();