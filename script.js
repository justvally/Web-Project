const track = document.querySelector('.ad-track');
const slides = document.querySelectorAll('.ad-track img');

let index = 0;

function slideLeft() {
    index++;
    track.style.transition = 'transform 0.8s ease-in-out';
    track.style.transform = `translateX(-${index * 100}vw)`;

    if (index === slides.length - 1) {
        setTimeout(() => {
            track.style.transition = 'none';
            index = 0;
            track.style.transform = 'translateX(0)';
        }, 800);
    }
}

setInterval(slideLeft, 5000);

document.addEventListener("DOMContentLoaded", () => {
    // === MODALS ===
    const filterBtn = document.querySelector(".action-btn:not(.outline)");
    const personalizeBtn = document.querySelector(".action-btn.outline");
    const filterModal = document.getElementById("filterModal");
    const personalizeModal = document.getElementById("personalizeModal");
    const closeBtns = document.querySelectorAll(".close-btn");

    filterBtn.addEventListener("click", () => { filterModal.style.display = "flex"; });
    personalizeBtn.addEventListener("click", () => { personalizeModal.style.display = "flex"; });

    closeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterModal.style.display = "none";
            personalizeModal.style.display = "none";
        });
    });

    window.addEventListener("click", (e) => {
        if (e.target === filterModal) filterModal.style.display = "none";
        if (e.target === personalizeModal) personalizeModal.style.display = "none";
    });

    // === TABS ===
    const tabs = document.querySelectorAll('.tab');
    const allProducts = document.querySelectorAll('.catalog-products');

    const perfumeTab = allProducts[0];
    const cologneTab = allProducts[1];

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            if(tab.textContent === "PERFUME") {
                perfumeTab.style.display = 'flex';
                cologneTab.style.display = 'none';
            } else if(tab.textContent === "COLOGNE") {
                perfumeTab.style.display = 'none';
                cologneTab.style.display = 'flex';
            }
        });
    });

    // === CART ===
    const cartItemsContainer = document.getElementById('cartItems');
    const itemCount = document.getElementById('itemCount');
    const totalPrice = document.getElementById('totalPrice');
    const cartIcon = document.querySelector('.fa-shopping-cart');
    const cartModal = document.getElementById('cartModal');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.getElementById('closeCart');
    let cart = [];

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            total += item.price;
            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <span>$${item.price}</span>
                    </div>
                </div>
            `;
        });
        itemCount.innerText = cart.length;
        totalPrice.innerText = `$${total.toFixed(2)}`;
    }

    function showCartToast(message) {
        const toast = document.getElementById('cartToast');
        const text = document.getElementById('toastText');
        text.innerText = message;
        toast.classList.add('show');
        setTimeout(() => { toast.classList.remove('show'); }, 2000);
    }

    document.body.addEventListener('click', (e) => {
        // Add to cart
        if (e.target.classList.contains('add-to-cart')) {
            const card = e.target.closest('.card');
            if (!card) return;
            const img = card.querySelector('img').src;
            const name = card.querySelector('img').alt;
            const price = parseFloat(card.querySelector('.price-tag').innerText.replace('$',''));

            cart.push({ img, name, price });
            renderCart();
            showCartToast(`${name} added to cart`);
        }
    });

    cartIcon.addEventListener('click', () => {
        cartModal.classList.add('active');
        cartOverlay.classList.add('active');
    });
    function closeCartModal() {
        cartModal.classList.remove('active');
        cartOverlay.classList.remove('active');
    }
    closeCart.addEventListener('click', closeCartModal);
    cartOverlay.addEventListener('click', closeCartModal);

    // === FILTER LOGIC ===
    const applyFilterBtn = document.querySelector('#filterModal .apply-btn');
    const applyPersonalizeBtn = document.querySelector('#personalizeModal .apply-btn');
    const cards = document.querySelectorAll('.catalog-products .card');

    // Utility function to filter cards
    function filterCards(filters) {
        cards.forEach(card => {
            let show = true;
            if (filters.brands.length && !filters.brands.includes(card.dataset.brand)) show = false;
            if (filters.scents.length && !filters.scents.includes(card.dataset.scent)) show = false;
            if (filters.sizes.length && !filters.sizes.includes(card.dataset.size)) show = false;
            if (filters.prices.length) {
                const p = parseFloat(card.dataset.price);
                const match = filters.prices.some(r => {
                    if (r === "Under $50") return p < 50;
                    if (r === "$50-$100") return p >= 50 && p <= 100;
                    if (r === "$100-$200") return p > 100 && p <= 200;
                    if (r === "Above $200") return p > 200;
                });
                if (!match) show = false;
            }
            card.style.display = show ? "flex" : "none";
        });
    }

    // Filter modal apply
    applyFilterBtn.addEventListener('click', () => {
        const filters = {
            brands: [...document.querySelectorAll('#filterModal input[name="brand"]:checked')].map(i => i.value),
            scents: [...document.querySelectorAll('#filterModal input[name="scent"]:checked')].map(i => i.value),
            sizes:  [...document.querySelectorAll('#filterModal input[name="size"]:checked')].map(i => i.value),
            prices: [...document.querySelectorAll('#filterModal input[name="price"]:checked')].map(i => i.value),
        };
        filterCards(filters);
        filterModal.style.display = 'none';
    });

    // Personalize modal apply
    applyPersonalizeBtn.addEventListener('click', () => {
        const filters = {
            moods: [...document.querySelectorAll('#personalizeModal input[name="mood"]:checked')].map(i => i.value),
            seasons: [...document.querySelectorAll('#personalizeModal input[name="season"]:checked')].map(i => i.value),
            longevity: [...document.querySelectorAll('#personalizeModal input[name="longevity"]:checked')].map(i => i.value),
            notes: [...document.querySelectorAll('#personalizeModal input[name="notes"]:checked')].map(i => i.value),
        };
        // TODO: add personalize filter logic if needed
        personalizeModal.style.display = 'none';
        console.log('Personalize selected:', filters);
    });

    // Show all button
    document.querySelectorAll('.show-all-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            cards.forEach(c => c.style.display = 'flex');
        });
    });

});
