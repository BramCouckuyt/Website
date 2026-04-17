const products = [
    {
        id: 1,
        name: 'Wool coat',
        brand: 'Bonpoint',
        size: '62',
        condition: 'Excellent',
        price: '€ 45',
        description: 'A beautifully crafted wool coat from Bonpoint, gently worn and in excellent condition. Perfect for cooler days. All buttons intact, no stains or damage.',
        images: [
            'Images/Product/product1_1.jpg',
            'Images/Product/product1_2.jpg',
            'Images/Product/product2_1.jpg'
        ]
    },
    {
        id: 2,
        name: 'Floral dress',
        brand: 'Jacadi',
        size: '74',
        condition: 'Like new',
        price: '€ 32',
        description: 'A delightful floral dress from Jacadi in like new condition. Bright and cheerful pattern, perfect for spring and summer. No signs of wear.',
        images: [
            'Images/Product/product2_1.jpg',
            'Images/Product/product2_2.jpg'
        ]
    },
    {
        id: 3,
        name: 'Two-piece set',
        brand: 'Petit Bateau',
        size: '56',
        condition: 'Very good',
        price: '€ 28',
        description: 'A classic two-piece set from Petit Bateau in very good condition. Soft cotton fabric, easy to wash and very comfortable for everyday wear.',
        images: [
            'Images/Product/product3_1.jpg',
            'Images/Product/product3_2.jpg',
            'Images/Product/product1_1.jpg',
            'Images/Product/product1_2.jpg',
            'Images/Product/product2_1.jpg'
        ]
    },
    {
        id: 4,
        name: 'Summer dress',
        brand: 'Ralph Lauren',
        size: '80',
        condition: 'Like new',
        price: '€ 55',
        description: 'A gorgeous summer dress from Ralph Lauren in like new condition. Classic preppy style with delicate embroidery details.',
        images: [
            'Images/Product/product1_1.jpg',
            'Images/Product/product2_1.jpg'
        ]
    },
    {
        id: 5,
        name: 'Knit cardigan',
        brand: 'Marco Polo',
        size: '86',
        condition: 'Excellent',
        price: '€ 38',
        description: 'A soft knit cardigan from Marco Polo in excellent condition. Warm and cozy, perfect for layering in autumn and winter.',
        images: [
            'Images/Product/product2_1.jpg',
            'Images/Product/product2_2.jpg',
            'Images/Product/product3_1.jpg'
        ]
    },
    {
        id: 6,
        name: 'Striped romper',
        brand: 'Jacadi',
        size: '68',
        condition: 'Very good',
        price: '€ 42',
        description: 'A charming striped romper from Jacadi in very good condition. Easy snap buttons for quick changes, soft and breathable fabric.',
        images: [
            'Images/Product/product3_1.jpg',
            'Images/Product/product3_2.jpg'
        ]
    }
];

function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}

function loadProduct() {
    const id = getProductIdFromUrl();
    const product = products.find(p => p.id === id);

    if (!product) {
        document.querySelector('.product-detail-wrapper').innerHTML = '<p style="text-align:center; padding: 60px 20px; color: #888;">Product not found. <a href="Shop.html">Back to shop</a></p>';
        return;
    }

    document.title = 'Little Luxe — ' + product.name;
    document.querySelector('.product-brand').textContent = product.brand;
    document.querySelector('.product-name').textContent = product.name;
    document.querySelector('.meta-value.product-price').textContent = product.price;
    document.querySelector('.product-description p').textContent = product.description;

    document.querySelectorAll('.meta-row')[0].querySelector('.meta-value').textContent = product.size;
    document.querySelectorAll('.meta-row')[1].querySelector('.meta-value').textContent = product.condition;

    document.querySelector('input[name="Product"]').value = product.brand + ' ' + product.name + ' — Size ' + product.size + ' — ' + product.price;

    const mainImage = document.getElementById('mainImage');
    mainImage.src = product.images[0];

    const thumbnailStrip = document.getElementById('thumbnailStrip');
    thumbnailStrip.innerHTML = '';

    product.images.forEach(function (src, index) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Thumbnail ' + (index + 1);
        img.classList.add('thumbnail');
        if (index === 0) img.classList.add('active');
        img.addEventListener('click', function () { setMain(this); });
        thumbnailStrip.appendChild(img);
    });

    checkReserved();
}

function setMain(thumbnail) {
    document.getElementById('mainImage').src = thumbnail.src;
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    thumbnail.classList.add('active');
}

const productId = 'product_' + getProductIdFromUrl();

function checkReserved() {
    if (localStorage.getItem('reserved_' + productId) === 'true') {
        showReservedState();
    }
}

function showReservedState() {
    document.getElementById('reserveButton').style.display = 'none';
    document.getElementById('reserveForm').style.display = 'none';
    document.getElementById('reserveConfirmation').style.display = 'none';
    document.getElementById('reservedBadge').style.display = 'block';
}

document.getElementById('reserveButton').addEventListener('click', function () {
    document.getElementById('reserveForm').style.display = 'block';
    document.getElementById('reserveButton').style.display = 'none';
    document.getElementById('reserveForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.getElementById('cancelButton').addEventListener('click', function () {
    document.getElementById('reserveForm').style.display = 'none';
    document.getElementById('reserveButton').style.display = 'block';
});

document.querySelector('.reserve-form form').addEventListener('submit', function (e) {
    e.preventDefault();

    const form = this;
    const data = new FormData(form);

    fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
    })
        .then(function (response) {
            if (response.ok) {
                localStorage.setItem('reserved_' + productId, 'true');
                document.getElementById('reserveForm').style.display = 'none';
                document.getElementById('reserveConfirmation').style.display = 'block';
            } else {
                alert('Something went wrong. Please try again.');
            }
        })
        .catch(function () {
            alert('Something went wrong. Please try again.');
        });
});

document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'U') {
        localStorage.removeItem('reserved_' + productId);
        location.reload();
    }
});

loadProduct();