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
    const filterBtn = document.getElementById("filterBtn");
    const personalizeBtn = document.getElementById("personalizeBtn");
    const filterModal = document.getElementById("filterModal");
    const personalizeModal = document.getElementById("personalizeModal");
    const closeBtns = document.querySelectorAll(".close-btn");
    const productModal = document.getElementById('productModal');

    if (filterBtn) {
        filterBtn.addEventListener("click", () => { 
            filterModal.style.display = "flex"; 
        });
    }
    if (personalizeBtn) {
        personalizeBtn.addEventListener("click", () => { 
            personalizeModal.style.display = "flex"; 
        });
    }

    closeBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (filterModal) filterModal.style.display = "none";
            if (personalizeModal) personalizeModal.style.display = "none";
            if (productModal) productModal.style.display = 'none';
        });
    });

    window.addEventListener("click", (e) => {
        if (e.target === filterModal) filterModal.style.display = "none";
        if (e.target === personalizeModal) personalizeModal.style.display = "none";
        if (e.target === productModal) {
            productModal.style.display = 'none';
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

            if(tab.textContent.trim() === "PERFUME" || tab.dataset.type === "perfume") {
                if (perfumeTab) perfumeTab.style.display = 'flex';
                if (cologneTab) cologneTab.style.display = 'none';
            } else if(tab.textContent.trim() === "COLOGNE" || tab.dataset.type === "cologne") {
                if (perfumeTab) perfumeTab.style.display = 'none';
                if (cologneTab) cologneTab.style.display = 'flex';
            }
            updateProductCount();
            applyFilters();
        });
    });

    // === CART ===
    const cartIcon = document.getElementById("cartIcon") || document.querySelector('.fa-shopping-cart');
    const cartModal = document.getElementById('cartModal');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.getElementById('closeCart');
    const continueShopping = document.querySelector('.continue-shopping');
    const checkoutBtn = document.querySelector('.checkout-btn');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Product descriptions database
    const productDescriptions = {
        1: "Miss Dior is a timeless floral fragrance that captures the essence of romance. With top notes of bergamot and mandarin, a heart of Grasse rose and peony, and a base of patchouli and musk, this scent evokes elegance and femininity.",
        2: "Byredo Gypsy Water is a unisex fragrance that captures the spirit of freedom. With notes of bergamot, lemon, pepper, juniper berries, incense, pine needles, orris, amber, and vanilla, it's a sophisticated and mysterious scent.",
        3: "Prada Paradoxe is a modern floral fragrance that challenges conventions. With notes of neroli, jasmine, and amber, it creates a unique olfactory experience that's both fresh and warm.",
        4: "Chanel No. 5 is the iconic fragrance that revolutionized perfumery. With aldehydic top notes, a floral heart of jasmine and rose, and a warm base of sandalwood and vanilla, it remains a timeless classic.",
        5: "Burberry Her is a fruity floral fragrance with a modern twist. Notes of red berries, jasmine, and violet create a youthful, vibrant scent that's perfect for daily wear.",
        6: "Victoria's Secret Bombshell is a playful, feminine fragrance. Passionfruit, peony, and vanilla orchid create a flirty, energetic scent that's perfect for summer.",
        7: "Maison Margiela By the Fireplace is a cozy, warm fragrance that evokes winter evenings by the fireplace. Notes of cloves, orange flower, chestnut, and vanilla create a comforting, gourmand scent.",
        8: "Jo Malone Lime Basil & Mandarin is a fresh, citrus fragrance. Zesty lime, aromatic basil, and white thyme create an energizing, sophisticated scent perfect for daytime.",
        9: "YSL Black Opium is an addictive gourmand fragrance. Coffee, white flowers, and vanilla create a mysterious, sensual scent perfect for evening wear.",
        10: "Dior Sauvage is a fresh, masculine fragrance that captures the spirit of open spaces. Ambroxan, bergamot, and pepper create a bold, modern scent.",
        11: "Byredo Mojave Ghost is a woody floral fragrance inspired by the Mojave desert. Notes of Jamaican nesberry, magnolia, sandalwood, and ambergris create a mysterious, ethereal scent.",
        12: "Prada L'Homme is a sophisticated masculine fragrance. Iris, amber, and neroli create a clean, elegant scent perfect for the modern man.",
        13: "Chanel Bleu de Chanel is a timeless woody aromatic fragrance. Citrus, vetiver, and cedar create a versatile scent for any occasion.",
        14: "Burberry Brit for Him is a fresh, spicy fragrance. Bergamot, ginger, and vetiver create a refined, masculine scent.",
        15: "Maison Margiela Sailing Day is a fresh aquatic fragrance. Sea salt, sage, and ambrette create a clean, marine scent perfect for summer.",
        16: "Versace Eros is an aromatic fougère fragrance for men. Mint, green apple, and tonka bean create a vibrant and seductive scent.",
        17: "Dior Fahrenheit is a woody leather fragrance. Leather, violet, and sandalwood create a unique, memorable masculine scent.",
        18: "Chanel Allure Homme is an oriental fragrance. Vanilla, tonka bean, and sandalwood create a warm, sensual scent."
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
        const applyFilterBtn = document.getElementById('applyFilters');
        const clearFiltersBtn = document.getElementById('clearFilters');
        const showAllProductsBtn = document.getElementById('showAllProducts');
        
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

        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                clearFilters();
                applyFilters();
                filterModal.style.display = 'none';
            });
        }

        if (showAllProductsBtn) {
            showAllProductsBtn.addEventListener('click', () => {
                clearFilters();
                applyFilters();
                filterModal.style.display = 'none';
            });
        }

        // Personalize functionality
        const applyPersonalizeBtn = document.getElementById('applyPersonalize');
        const clearPersonalizeBtn = document.getElementById('clearPersonalize');
        const showAllPersonalizeBtn = document.getElementById('showAllProductsPersonalize');
        
        if (applyPersonalizeBtn) {
            applyPersonalizeBtn.addEventListener('click', () => {
                const moods = [...document.querySelectorAll('#personalizeModal .personalize-btn[data-mood].active')].map(btn => btn.dataset.mood);
                const seasons = [...document.querySelectorAll('#personalizeModal .personalize-btn[data-season].active')].map(btn => btn.dataset.season);
                const longevity = [...document.querySelectorAll('#personalizeModal .personalize-btn[data-longevity].active')].map(btn => btn.dataset.longevity);
                const occasions = [...document.querySelectorAll('#personalizeModal .personalize-btn[data-occasion].active')].map(btn => btn.dataset.occasion);
                const notes = [...document.querySelectorAll('#personalizeModal .note-btn.active')].map(btn => btn.dataset.note);
                
                currentPersonalize = {
                    moods: moods,
                    seasons: seasons,
                    longevity: longevity,
                    occasions: occasions,
                    notes: notes
                };
                
                applyFilters();
                personalizeModal.style.display = 'none';
            });
        }

        if (clearPersonalizeBtn) {
            clearPersonalizeBtn.addEventListener('click', () => {
                clearPersonalize();
                applyFilters();
                personalizeModal.style.display = 'none';
            });
        }

        if (showAllPersonalizeBtn) {
            showAllPersonalizeBtn.addEventListener('click', () => {
                clearPersonalize();
                applyFilters();
                personalizeModal.style.display = 'none';
            });
        }

        // Personalize buttons toggle
        document.querySelectorAll('.personalize-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                this.classList.toggle('active');
            });
        });

        // Note buttons toggle
        document.querySelectorAll('.note-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                this.classList.toggle('active');
            });
        });

        // Product card clicks
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', function(e) {
                if (!e.target.classList.contains('add-to-cart') && !e.target.closest('.add-to-cart')) {
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
        if (continueShopping) {
            continueShopping.addEventListener('click', closeCartModal);
        }
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                alert('Proceeding to checkout. In a real application, this would redirect to a checkout page.');
                closeCartModal();
            });
        }

        // Product detail modal add to cart
        const addToCartDetail = document.getElementById('addToCartDetail');
        if (addToCartDetail) {
            addToCartDetail.addEventListener('click', addFromDetail);
        }

        // Wishlist button
        const wishlistBtn = document.querySelector('.wishlist-btn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', () => {
                alert('Added to wishlist!');
            });
        }
    }

    // === FILTER FUNCTIONS ===
    function applyFilters() {
        const activeTab = document.querySelector('.tab.active');
        if (!activeTab) return;
        
        const tabType = activeTab.dataset.type === "perfume" ? "perfume" : "cologne";
        const container = tabType === "perfume" 
            ? document.getElementById('perfumeProducts') 
            : document.getElementById('cologneProducts');
        
        if (!container) return;
        
        const cards = container.querySelectorAll('.product-card');
        let visibleCount = 0;

        cards.forEach(card => {
            const brand = card.dataset.brand;
            const price = parseInt(card.dataset.price);
            const scent = card.dataset.scent;
            const size = card.dataset.size;
            
            let show = true;

            // Apply regular filters
            if (currentFilters.brands && currentFilters.brands.length && !currentFilters.brands.includes(brand)) show = false;
            if (currentFilters.scents && currentFilters.scents.length && !currentFilters.scents.includes(scent)) show = false;
            if (currentFilters.sizes && currentFilters.sizes.length && !currentFilters.sizes.includes(size)) show = false;
            
            if (currentFilters.prices && currentFilters.prices.length) {
                const priceMatch = currentFilters.prices.some(range => {
                    if (range === "under50") return price < 50;
                    if (range === "50-100") return price >= 50 && price <= 100;
                    if (range === "100-200") return price > 100 && price <= 200;
                    if (range === "above200") return price > 200;
                    return false;
                });
                if (!priceMatch) show = false;
            }

            // Apply personalize filters
            if (currentPersonalize.moods && currentPersonalize.moods.length && !currentPersonalize.moods.includes(card.dataset.mood)) show = false;
            if (currentPersonalize.seasons && currentPersonalize.seasons.length && !currentPersonalize.seasons.includes(card.dataset.season)) show = false;
            if (currentPersonalize.longevity && currentPersonalize.longevity.length && !currentPersonalize.longevity.includes(card.dataset.longevity)) show = false;
            if (currentPersonalize.occasions && currentPersonalize.occasions.length && !currentPersonalize.occasions.includes(card.dataset.occasion)) show = false;
            
            // Apply note filters
            if (currentPersonalize.notes && currentPersonalize.notes.length) {
                const notes = card.dataset.notes || '';
                const hasMatchingNote = currentPersonalize.notes.some(note => notes.includes(note));
                if (!hasMatchingNote) show = false;
            }

            card.style.display = show ? 'block' : 'none';
            if (show) visibleCount++;
        });

        updateProductCount(visibleCount);
        updateActiveFilters();
    }

    function updateActiveFilters() {
        const activeFiltersContainer = document.getElementById('activeFilters');
        if (!activeFiltersContainer) return;
        
        activeFiltersContainer.innerHTML = '';
        
        const allFilters = {};
        
        // Add regular filters
        Object.keys(currentFilters).forEach(key => {
            if (currentFilters[key] && currentFilters[key].length > 0) {
                allFilters[key] = currentFilters[key];
            }
        });
        
        // Add personalize filters
        Object.keys(currentPersonalize).forEach(key => {
            if (currentPersonalize[key] && currentPersonalize[key].length > 0) {
                allFilters[key] = currentPersonalize[key];
            }
        });
        
        let hasFilters = false;
        
        Object.keys(allFilters).forEach(key => {
            allFilters[key].forEach(value => {
                hasFilters = true;
                const filterTag = document.createElement('span');
                filterTag.className = 'filter-tag';
                filterTag.innerHTML = `${value} <i class="fas fa-times"></i>`;
                
                filterTag.querySelector('i').addEventListener('click', () => {
                    removeFilter(key, value);
                });
                
                activeFiltersContainer.appendChild(filterTag);
            });
        });
        
        if (hasFilters) {
            const clearAll = document.createElement('button');
            clearAll.className = 'clear-all';
            clearAll.textContent = 'Clear All';
            clearAll.addEventListener('click', () => {
                clearFilters();
                clearPersonalize();
                applyFilters();
            });
            activeFiltersContainer.appendChild(clearAll);
        }
    }

    function removeFilter(category, value) {
        if (currentFilters[category]) {
            currentFilters[category] = currentFilters[category].filter(v => v !== value);
            // Update checkbox
            const checkbox = document.querySelector(`#filterModal input[name="${category}"][value="${value}"]`);
            if (checkbox) checkbox.checked = false;
        }
        if (currentPersonalize[category]) {
            currentPersonalize[category] = currentPersonalize[category].filter(v => v !== value);
            // Update button
            const button = document.querySelector(`#personalizeModal [data-${category.toLowerCase()}="${value}"]`);
            if (button) button.classList.remove('active');
        }
        
        applyFilters();
    }

    function clearFilters() {
        document.querySelectorAll('#filterModal input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        currentFilters = {};
    }

    function clearPersonalize() {
        document.querySelectorAll('#personalizeModal .personalize-btn.active').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('#personalizeModal .note-btn.active').forEach(btn => {
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
        document.getElementById('productDetailImg').alt = card.querySelector('img').alt;
        document.getElementById('productDetailName').textContent = card.querySelector('img').alt;
        document.getElementById('productDetailBrand').textContent = card.dataset.brand;
        document.getElementById('productDetailPrice').textContent = '$' + card.dataset.price;
        document.getElementById('productDetailSize').textContent = card.dataset.size;
        document.getElementById('productDetailScent').textContent = card.dataset.scent;
        document.getElementById('productDetailLongevity').textContent = card.dataset.longevity;
        document.getElementById('productDetailSeason').textContent = card.dataset.season;
        
        // Set product description
        const desc = productDescriptions[productId] || 
            `A luxurious ${card.dataset.scent.toLowerCase()} fragrance from ${card.dataset.brand}. Perfect for ${card.dataset.occasion.toLowerCase()} occasions. Features notes of ${card.dataset.notes}.`;
        document.getElementById('productDetailDesc').textContent = desc;
        
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
            modal.style.display = 'none';
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
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
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
                        <p>${item.brand} • ${item.size}</p>
                        <span>$${item.price}</span>
                        <div class="cart-item-controls">
                            <button class="quantity-btn minus">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus">+</button>
                            <button class="remove-item"><i class="fas fa-trash"></i></button>
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
        if (itemCountEl) itemCountEl.textContent = totalItems;
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
        cartModal.classList.add('active');
        cartOverlay.classList.add('active');
        renderCart();
    }

    function closeCartModal() {
        cartModal.classList.remove('active');
        cartOverlay.classList.remove('active');
    }

    function showCartToast(message) {
        const toast = document.getElementById('cartToast');
        const text = document.getElementById('toastText');
        if (!toast || !text) return;
        
        text.textContent = '✓ ' + message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    function updateProductCount(count = null) {
        const activeTab = document.querySelector('.tab.active');
        if (!activeTab) return;
        
        const tabType = activeTab.dataset.type === "perfume" ? "perfume" : "cologne";
        const container = tabType === "perfume" 
            ? document.getElementById('perfumeProducts') 
            : document.getElementById('cologneProducts');
        
        if (!container) return;
        
        if (count === null) {
            const visibleCards = Array.from(container.querySelectorAll('.product-card'))
                .filter(card => card.style.display !== 'none');
            count = visibleCards.length;
        }
        
        const productCountEl = document.getElementById('productCount');
        if (productCountEl) {
            productCountEl.textContent = `${count} products`;
        }
    }

        // Initialize if on catalog page, otherwise just bind product card events
    if (document.getElementById('filterBtn') || document.querySelector('.catalog-products')) {
        init();
    } else {
        // For homepage, initialize cart and bind product cards
        updateCartCount();
        bindProductCardEvents();
        bindCartEvents();
    }

    function bindProductCardEvents() {
        // Product card clicks
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', function(e) {
                if (!e.target.classList.contains('add-to-cart') && !e.target.closest('.add-to-cart')) {
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
    }

    function bindCartEvents() {
        const cartIcon = document.getElementById("cartIcon") || document.querySelector('.fa-shopping-cart');
        if (cartIcon && cartModal) {
            cartIcon.addEventListener('click', openCart);
        }
        if (closeCart) {
            closeCart.addEventListener('click', closeCartModal);
        }
        if (cartOverlay) {
            cartOverlay.addEventListener('click', closeCartModal);
        }
        if (continueShopping) {
            continueShopping.addEventListener('click', closeCartModal);
        }
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                alert('Proceeding to checkout. In a real application, this would redirect to a checkout page.');
                closeCartModal();
            });
        }
    }
});

    // Initialize based on page type
    const isHomepage = !document.getElementById('filterBtn') && 
                      !document.querySelector('.catalog-products');
    
    if (!isHomepage) {
        init(); // Catalog page
    } else {
        // Homepage - just bind product cards and cart
        updateCartCount();
        
        // Product card clicks
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', function(e) {
                if (!e.target.classList.contains('add-to-cart') && !e.target.closest('.add-to-cart')) {
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
        if (cartIcon && cartModal) {
            cartIcon.addEventListener('click', openCart);
        }
        if (closeCart) {
            closeCart.addEventListener('click', closeCartModal);
        }
        if (cartOverlay) {
            cartOverlay.addEventListener('click', closeCartModal);
        }
        if (continueShopping) {
            continueShopping.addEventListener('click', closeCartModal);
        }
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                alert('Proceeding to checkout. In a real application, this would redirect to a checkout page.');
                closeCartModal();
            });
        }
    }