const track = document.querySelector('.ad-track');
const slides = document.querySelectorAll('.ad-track img');

let index = 0;

function slideLeft() {
    if (!track || slides.length === 0) return;
    
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

if (track && slides.length > 0) {
    setInterval(slideLeft, 5000);
}

document.addEventListener("DOMContentLoaded", () => {
    // === MODALS ===
    const filterBtn = document.querySelector(".action-btn:not(.outline)");
    const personalizeBtn = document.querySelector(".action-btn.outline");
    const filterModal = document.getElementById("filterModal");
    const personalizeModal = document.getElementById("personalizeModal");
    const closeBtns = document.querySelectorAll(".close-btn");

    if (filterBtn) {
        filterBtn.addEventListener("click", () => { filterModal.style.display = "flex"; });
    }
    if (personalizeBtn) {
        personalizeBtn.addEventListener("click", () => { personalizeModal.style.display = "flex"; });
    }

    closeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterModal.style.display = "none";
            personalizeModal.style.display = "none";
            document.getElementById('productModal').style.display = 'none';
        });
    });

    window.addEventListener("click", (e) => {
        if (e.target === filterModal) filterModal.style.display = "none";
        if (e.target === personalizeModal) personalizeModal.style.display = "none";
        if (e.target === document.getElementById('productModal')) {
            document.getElementById('productModal').style.display = 'none';
        }
    });

    // === TABS ===
    const tabs = document.querySelectorAll('.tab');
    const perfumeTab = document.getElementById('perfumeProducts');
    const cologneTab = document.getElementById('cologneProducts');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            if(tab.textContent === "PERFUME" || tab.dataset.type === "perfume") {
                if (perfumeTab) perfumeTab.style.display = 'flex';
                if (cologneTab) cologneTab.style.display = 'none';
            } else if(tab.textContent === "COLOGNE" || tab.dataset.type === "cologne") {
                if (perfumeTab) perfumeTab.style.display = 'none';
                if (cologneTab) cologneTab.style.display = 'flex';
            }
            updateProductCount();
            applyFilters();
        });
    });

    // === CART ===
    const cartIcon = document.querySelector('.fa-shopping-cart');
    const cartModal = document.getElementById('cartModal');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.getElementById('closeCart');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Product descriptions database
    const productDescriptions = {
        1: "Miss Dior is a timeless floral fragrance that captures the essence of romance. With top notes of bergamot and mandarin, a heart of Grasse rose and peony, and a base of patchouli and musk, this scent evokes elegance and femininity.",
        2: "Chanel Gabrielle Essence is a luminous floral scent that radiates confidence. A blend of jasmine, orange blossom, and tuberose creates a sophisticated fragrance that lasts throughout the day.",
        3: "Prada Paradoxe is a modern fragrance that challenges conventions. With notes of neroli, jasmine, and amber, it creates a unique olfactory experience that's both fresh and warm.",
        4: "Versace Eros is an aromatic fougère fragrance for men that embodies passion and strength. Mint, green apple, and tonka bean create a vibrant and seductive scent.",
        5: "Miss Dior Blooming Bouquet is a fresh floral scent perfect for spring. With notes of peony, rose, and white musk, it's light, romantic, and effortlessly chic.",
        6: "Chanel Coco Noir is an oriental fragrance that exudes mystery. Amber, vanilla, and sandalwood create a deep, sensual scent for evening wear.",
        7: "Prada Luna Rossa is a woody aromatic fragrance inspired by sailing. Lavender, orange, and ambroxan create a fresh, sporty scent with elegance.",
        8: "Versace Pour Homme is a fresh citrus fragrance perfect for daily wear. Bergamot, lemon, and neroli create an energetic and clean scent.",
        9: "Dior Sauvage is a fresh spicy fragrance that captures the spirit of open spaces. Ambroxan, bergamot, and pepper create a bold, modern scent.",
        10: "Chanel Bleu de Chanel is a timeless woody aromatic fragrance. Citrus, vetiver, and cedar create a sophisticated and versatile scent for any occasion.",
        11: "Versace Dylan Blue is a fresh aquatic fragrance for the modern man. Calabrian bergamot, aquatic notes, and patchouli create a dynamic scent.",
        12: "Dior Fahrenheit is a woody leather fragrance that's bold and distinctive. Leather, violet, and sandalwood create a unique, memorable scent.",
        13: "Prada L'Homme is a fresh fragrance that balances elegance and masculinity. Iris, amber, and neroli create a clean, sophisticated scent.",
        14: "Chanel Allure Homme is an oriental fragrance with warm, sensual notes. Vanilla, tonka bean, and sandalwood create a luxurious scent.",
        15: "Versace Man Eau Fraiche is a fresh citrus aquatic fragrance. Lemon, rosewood, and cedar create a light, refreshing scent perfect for summer."
    };

    // === INITIALIZATION ===
    let currentFilters = {};
    let currentPersonalize = {};

    function init() {
        updateCartCount();
        bindEvents();
        updateProductCount();
    }

    function bindEvents() {
        // Filter functionality
        const applyFilterBtn = document.querySelector('#filterModal .apply-btn');
        const applyPersonalizeBtn = document.querySelector('#personalizeModal .apply-btn');
        
        if (applyFilterBtn) {
            applyFilterBtn.addEventListener('click', () => {
                const filters = {
                    brands: [...document.querySelectorAll('#filterModal input[name="brand"]:checked')].map(i => i.value),
                    scents: [...document.querySelectorAll('#filterModal input[name="scent"]:checked')].map(i => i.value),
                    sizes: [...document.querySelectorAll('#filterModal input[name="size"]:checked')].map(i => i.value),
                    prices: [...document.querySelectorAll('#filterModal input[name="price"]:checked')].map(i => i.value),
                };
                currentFilters = filters;
                applyFilters();
                filterModal.style.display = 'none';
            });
        }

        // Personalize functionality
        if (applyPersonalizeBtn) {
            applyPersonalizeBtn.addEventListener('click', () => {
                const filters = {
                    moods: [...document.querySelectorAll('#personalizeModal input[name="mood"]:checked')].map(i => i.value),
                    seasons: [...document.querySelectorAll('#personalizeModal input[name="season"]:checked')].map(i => i.value),
                    longevity: [...document.querySelectorAll('#personalizeModal input[name="longevity"]:checked')].map(i => i.value),
                    occasions: [...document.querySelectorAll('#personalizeModal input[name="occasion"]:checked')].map(i => i.value),
                };
                currentPersonalize = filters;
                applyFilters();
                personalizeModal.style.display = 'none';
            });
        }

        // Show all buttons
        document.querySelectorAll('.show-all-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                clearFilters();
                clearPersonalize();
                applyFilters();
            });
        });

        // Personalize buttons toggle
        document.querySelectorAll('.personalize-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                this.classList.toggle('active');
            });
        });

        // Product card clicks
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', function(e) {
                if (!e.target.classList.contains('add-to-cart')) {
                    showProductDetail(this);
                }
            });
        });

        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const card = this.closest('.card');
                addToCart(card);
            });
        });

        // Cart functionality
        if (cartIcon) {
            cartIcon.addEventListener('click', openCart);
        }
        if (closeCart) {
            closeCart.addEventListener('click', closeCartModal);
        }
        if (cartOverlay) {
            cartOverlay.addEventListener('click', closeCartModal);
        }

        // Product detail modal add to cart
        const addToCartDetail = document.getElementById('addToCartDetail');
        if (addToCartDetail) {
            addToCartDetail.addEventListener('click', addFromDetail);
        }

        // Clear all filters
        const clearAllBtn = document.querySelector('.clear-all');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => {
                clearFilters();
                clearPersonalize();
            });
        }
    }

    // === FILTER FUNCTIONS ===
    function applyFilters() {
        const activeTab = document.querySelector('.tab.active');
        if (!activeTab) return;
        
        const tabType = activeTab.textContent === "PERFUME" || activeTab.dataset.type === "perfume" ? "perfume" : "cologne";
        const container = tabType === "perfume" 
            ? document.getElementById('perfumeProducts') 
            : document.getElementById('cologneProducts');
        
        if (!container) return;
        
        const cards = container.querySelectorAll('.card');
        let visibleCount = 0;

        cards.forEach(card => {
            const brand = card.dataset.brand;
            const price = parseInt(card.dataset.price);
            const scent = card.dataset.scent;
            const size = card.dataset.size + 'ml';
            
            let show = true;

            // Apply regular filters
            if (currentFilters.brands && currentFilters.brands.length && !currentFilters.brands.includes(brand)) show = false;
            if (currentFilters.scents && currentFilters.scents.length && !currentFilters.scents.includes(scent)) show = false;
            if (currentFilters.sizes && currentFilters.sizes.length && !currentFilters.sizes.includes(size)) show = false;
            
            if (currentFilters.prices && currentFilters.prices.length) {
                const priceMatch = currentFilters.prices.some(range => {
                    if (range === "Under $50" || range === "under50") return price < 50;
                    if (range === "$50-$100" || range === "50-100") return price >= 50 && price <= 100;
                    if (range === "$100-$200" || range === "100-200") return price > 100 && price <= 200;
                    if (range === "Above $200" || range === "above200") return price > 200;
                    return false;
                });
                if (!priceMatch) show = false;
            }

            // Apply personalize filters
            if (currentPersonalize.moods && currentPersonalize.moods.length && !currentPersonalize.moods.includes(card.dataset.mood)) show = false;
            if (currentPersonalize.seasons && currentPersonalize.seasons.length && !currentPersonalize.seasons.includes(card.dataset.season)) show = false;
            if (currentPersonalize.longevity && currentPersonalize.longevity.length && !currentPersonalize.longevity.includes(card.dataset.longevity)) show = false;
            if (currentPersonalize.occasions && currentPersonalize.occasions.length && !currentPersonalize.occasions.includes(card.dataset.occasion)) show = false;

            card.style.display = show ? 'flex' : 'none';
            if (show) visibleCount++;
        });

        updateProductCount();
        updateActiveFilters();
    }

    function updateActiveFilters() {
        const activeFiltersContainer = document.getElementById('activeFilters');
        if (!activeFiltersContainer) return;
        
        activeFiltersContainer.innerHTML = '';
        
        const allFilters = {...currentFilters, ...currentPersonalize};
        let hasFilters = false;
        
        Object.keys(allFilters).forEach(key => {
            if (allFilters[key] && allFilters[key].length > 0) {
                hasFilters = true;
                allFilters[key].forEach(value => {
                    const filterTag = document.createElement('span');
                    filterTag.className = 'filter-tag';
                    filterTag.innerHTML = `${value} <i class="fas fa-times"></i>`;
                    
                    filterTag.querySelector('i').addEventListener('click', () => {
                        removeFilter(key, value);
                    });
                    
                    activeFiltersContainer.appendChild(filterTag);
                });
            }
        });
        
        if (hasFilters) {
            const clearAll = document.createElement('button');
            clearAll.className = 'clear-all';
            clearAll.textContent = 'Clear All';
            clearAll.addEventListener('click', () => {
                clearFilters();
                clearPersonalize();
            });
            activeFiltersContainer.appendChild(clearAll);
        }
    }

    function removeFilter(category, value) {
        if (currentFilters[category]) {
            currentFilters[category] = currentFilters[category].filter(v => v !== value);
        }
        if (currentPersonalize[category]) {
            currentPersonalize[category] = currentPersonalize[category].filter(v => v !== value);
        }
        
        // Update checkboxes
        const checkbox = document.querySelector(`input[value="${value}"]`);
        if (checkbox) checkbox.checked = false;
        
        // Update personalize buttons
        const personalizeBtn = document.querySelector(`[data-${category.toLowerCase()}="${value}"]`);
        if (personalizeBtn) personalizeBtn.classList.remove('active');
        
        applyFilters();
    }

    function clearFilters() {
        document.querySelectorAll('#filterModal input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        currentFilters = {};
    }

    function clearPersonalize() {
        document.querySelectorAll('#personalizeModal input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        document.querySelectorAll('.personalize-btn.active').forEach(btn => {
            btn.classList.remove('active');
        });
        currentPersonalize = {};
    }

    // === PRODUCT DETAIL FUNCTIONS ===
    function showProductDetail(card) {
        const modal = document.getElementById('productModal');
        if (!modal) return;
        
        const productId = card.dataset.id;
        
        document.getElementById('productDetailImg').src = card.querySelector('img').src;
        document.getElementById('productDetailName').textContent = card.querySelector('img').alt;
        document.getElementById('productDetailBrand').textContent = card.dataset.brand;
        document.getElementById('productDetailPrice').textContent = '$' + card.dataset.price;
        document.getElementById('productDetailSize').textContent = card.dataset.size + 'ml';
        document.getElementById('productDetailScent').textContent = card.dataset.scent;
        document.getElementById('productDetailLongevity').textContent = card.dataset.longevity;
        document.getElementById('productDetailSeason').textContent = card.dataset.season;
        document.getElementById('productDetailDesc').textContent = productDescriptions[productId] || 
            "A luxurious fragrance that captures the essence of elegance and sophistication.";
        
        modal.dataset.productId = productId;
        modal.style.display = 'flex';
    }

    // === CART FUNCTIONS ===
    function addToCart(card) {
        const product = {
            id: card.dataset.id,
            name: card.querySelector('img').alt,
            price: parseInt(card.dataset.price),
            image: card.querySelector('img').src,
            brand: card.dataset.brand,
            size: card.dataset.size
        };

        // Check if product already in cart
        const existingIndex = cart.findIndex(item => item.id === product.id);
        if (existingIndex > -1) {
            cart[existingIndex].quantity += 1;
        } else {
            product.quantity = 1;
            cart.push(product);
        }

        saveCart();
        showCartToast(`${product.name} added to cart`);
    }

    function addFromDetail() {
        const modal = document.getElementById('productModal');
        const productId = modal.dataset.productId;
        const card = document.querySelector(`.card[data-id="${productId}"]`);
        
        if (card) {
            addToCart(card);
        }
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        if (cartModal && cartModal.classList.contains('active')) {
            renderCart();
        }
    }

    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = count;
        }
    }

    function renderCart() {
        const cartItems = document.getElementById('cartItems');
        if (!cartItems) return;
        
        const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-bag"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <span>$${item.price}</span>
                        <div class="cart-item-controls">
                            <button class="quantity-btn minus">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus">+</button>
                            <button class="remove-item">&times;</button>
                        </div>
                    </div>
                </div>
            `).join('');
            
            // Add event listeners for cart controls
            document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
                btn.addEventListener('click', function() {
                    const itemId = this.closest('.cart-item').dataset.id;
                    updateCartItem(itemId, -1);
                });
            });
            
            document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
                btn.addEventListener('click', function() {
                    const itemId = this.closest('.cart-item').dataset.id;
                    updateCartItem(itemId, 1);
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', function() {
                    const itemId = this.closest('.cart-item').dataset.id;
                    removeCartItem(itemId);
                });
            });
        }
        
        const totalPriceEl = document.getElementById('totalPrice');
        const itemCountEl = document.getElementById('itemCount');
        
        if (totalPriceEl) totalPriceEl.textContent = '$' + totalPrice.toFixed(2);
        if (itemCountEl) itemCountEl.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }

    function updateCartItem(itemId, change) {
        const itemIndex = cart.findIndex(item => item.id === itemId);
        if (itemIndex > -1) {
            cart[itemIndex].quantity += change;
            
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
                showCartToast('Item removed from cart');
            } else {
                showCartToast('Cart updated');
            }
            
            saveCart();
        }
    }

    function removeCartItem(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        saveCart();
        showCartToast('Item removed from cart');
    }

    function openCart() {
        document.getElementById('cartModal').classList.add('active');
        document.getElementById('cartOverlay').classList.add('active');
        renderCart();
    }

    function closeCartModal() {
        document.getElementById('cartModal').classList.remove('active');
        document.getElementById('cartOverlay').classList.remove('active');
    }

    function showCartToast(message) {
        const toast = document.getElementById('cartToast');
        const text = document.getElementById('toastText');
        if (!toast || !text) return;
        
        text.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    function updateProductCount() {
        const activeTab = document.querySelector('.tab.active');
        if (!activeTab) return;
        
        const tabType = activeTab.textContent === "PERFUME" || activeTab.dataset.type === "perfume" ? "perfume" : "cologne";
        const container = tabType === "perfume" 
            ? document.getElementById('perfumeProducts') 
            : document.getElementById('cologneProducts');
        
        if (!container) return;
        
        const visibleCards = Array.from(container.querySelectorAll('.card'))
            .filter(card => card.style.display !== 'none');
        
        const productCountEl = document.getElementById('productCount');
        if (productCountEl) {
            productCountEl.textContent = `${visibleCards.length} products`;
        }
    }

    // Initialize
    init();
});