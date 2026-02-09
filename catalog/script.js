let cart = {};
let goods = {};

document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    loadGoods();
    showCart();
    updateCartCount();
});

function loadCart() {
    const savedCart = localStorage.getItem('auto82_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    } else {
        saveCart();
    }
}

// Функция загрузки товаров (можно расширять)
function loadGoods() {
    goods = {
        "1": {
            "id": "1",
            "title": "Масло моторное ЛУКОЙЛ",
            "price": 900,
            "image": "img/lukoil.png",
            "description": "ЛУКОЙЛ Luxe Synthetic 5W30 SL/CF, 1л"
        },
        "2": {
            "id": "2",
            "title": "Лампа фар",
            "price": 1500,
            "image": "img/lampa.png",
            "description": "OSRAM H7 Night Breaker Laser 150%"
        },
        "3": {
            "id": "3",
            "title": "Тормозной диск",
            "price": 2500,
            "image": "img/disk.png",
            "description": "6R0615301 VAG Диск тормозной вентилируемый"
        },
        "4": {
            "id": "4",
            "title": "Свеча накаливания",
            "price": 5000,
            "image": "img/svech.png",
            "description": "059963319J VAG Свечa накаливания"
        },
        "5": {
            "id": "5",
            "title": "Шины",
            "price": 3000,
            "image": "img/cashland.jpg",
            "description": "6970005590568 CACHLAND CH-268 155/65R13 73"
        },
        "6": {
            "id": "6",
            "title": "Моторное масло Country",
            "price": 1000,
            "image": "img/country.jpg",
            "description": "Масло моторное полусинтетическое Country 4 STROKE 10W-40"
        },
        "7": {
            "id": "7",
            "title": "4411505RUEY DEPO УКАЗАТЕЛЬ ПОВОРОТА ПРАВЫЙ желтый",
            "price": 2000,
            "image": "img/povorotnik.png",
            "description": "Кузовные запчасти и детали"
        },
        "8": {
            "id": "8",
            "title": "Аккумулятор",
            "price": 15000,
            "image": "img/akb.png",
            "description": "VARTA Blue Dynamic 74 Ah, 680A"
        },
        "9": {
            "id": "9",
            "title": "Фильтр",
            "price": 1000,
            "image": "img/filter.png",
            "description": "MANN-FILTER C 25 118/2 для Audi"
        },
    };
}

function saveCart() {
    localStorage.setItem('auto82_cart', JSON.stringify(cart));
    updateCartCount();
}

// Функция отображения корзины (ваш код с улучшениями)
function showCart() {
    const cartField = document.querySelector('.cart-field');
    if (!cartField) return;
    
    let out = '<div class="cart-table">';
    let total = 0;
    let totalItems = 0;

    out += `
        <div class="cart-header">
            <div class="cart-col-product">Товар</div>
            <div class="cart-col-price">Цена</div>
            <div class="cart-col-quantity">Количество</div>
            <div class="cart-col-total">Сумма</div>
            <div class="cart-col-remove"></div>
        </div>
    `;

    for (const id in cart) {
        if (cart[id] > 0 && goods[id]) {
            const itemTotal = goods[id].price * cart[id];
            total += itemTotal;
            totalItems += cart[id];
            
            out += `
                <div class="cart-item" data-id="${id}">
                    <div class="cart-col-product">
                        <div class="cart-product-image">
                            <img src="${goods[id].image}" alt="${goods[id].title}">
                        </div>
                        <div class="cart-product-info">
                            <h4>${goods[id].title}</h4>
                            <p class="cart-product-desc">${goods[id].description || ''}</p>
                        </div>
                    </div>
                    <div class="cart-col-price">${formatPrice(goods[id].price)} ₽</div>
                    <div class="cart-col-quantity">
                        <div class="quantity-controls">
                            <button class="cart-minus" data-id="${id}">−</button>
                            <span class="cart-quantity">${cart[id]}</span>
                            <button class="cart-plus" data-id="${id}">+</button>
                        </div>
                    </div>
                    <div class="cart-col-total">${formatPrice(itemTotal)} ₽</div>
                    <div class="cart-col-remove">
                        <button class="cart-remove" data-id="${id}" title="Удалить">x
                        </button>
                    </div>
                </div>
            `;
        }
    }

    // Если корзина пуста
    if (totalItems === 0) {
        out = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <h3>Корзина пуста</h3>
                <p>Добавьте товары из каталога</p>
                <a href="catalog.html" class="btn">Перейти в каталог</a>
            </div>
        `;
    } else {
        out += `
            <div class="cart-footer">
                <div class="cart-summary">
                    <div class="summary-row">
                        <span>Товаров:</span>
                        <span>${totalItems} шт.</span>
                    </div>
                    <div class="summary-row">
                        <span>Итого:</span>
                        <span class="cart-total">${formatPrice(total)} ₽</span>
                    </div>
                    <button class="checkout-btn" onclick="checkout()">Оформить заказ</button>
                    <button class="clear-cart-btn" onclick="clearCart()">Очистить корзину</button>
                </div>
            </div>
        `;
    }

    out += '</div>';
    cartField.innerHTML = out;
    
    // Добавляем обработчики событий для новых элементов
    addCartEventListeners();
}

// Форматирование цены
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Обновление счетчика в шапке
function updateCartCount() {
    let totalItems = 0;
    for (const id in cart) {
        totalItems += cart[id];
    }
    
    // Создаем или находим элемент счетчика
    let cartCountElement = document.querySelector('.cart-count');
    const cartLink = document.querySelector('a[href="cart.html"]');
    
    if (cartLink && !cartCountElement) {
        cartCountElement = document.createElement('span');
        cartCountElement.className = 'cart-count';
        cartLink.appendChild(cartCountElement);
    }
    
    if (cartCountElement) {
        if (totalItems > 0) {
            cartCountElement.textContent = totalItems;
            cartCountElement.style.display = 'inline-block';
        } else {
            cartCountElement.style.display = 'none';
        }
    }
}

function cartRemove(id) {
    if (cart[id]) {
        cart[id] = 0;
        saveCart();
        showCart();
    }
}

function cartPlus(id) {
    cart[id] = (cart[id] || 0) + 1;
    saveCart();
    showCart();
}

function cartMinus(id) {
    if (cart[id] > 1) {
        cart[id]--;
        saveCart();
        showCart();
    } else {
        cartRemove(id);
    }
}

function clearCart() {
    if (confirm('Вы уверены, что хотите очистить корзину?')) {
        for (const id in cart) {
            cart[id] = 0;
        }
        saveCart();
        showCart();
    }
}

function clearCart1() {
    {
        for (const id in cart) {
            cart[id] = 0;
        }
        saveCart();
        showCart();
    }
}

function checkout() {
    const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
    if (totalItems === 0) {
        alert('Корзина пуста!');
        return;
    }
    
    // Здесь будет логика оформления заказа
    alert(`Заказ оформлен! Товаров: ${totalItems} шт.`);
    
    // Можно очистить корзину после оформления
    clearCart1()
}

// Добавление товара в корзину со страниц товаров
function addToCart(id, quantity = 1) {
    if (!goods[id]) {
        console.error('Товар не найден:', id);
        return;
    }
    
    cart[id] = (cart[id] || 0) + quantity;
    saveCart();
    showNotification(`Товар "${goods[id].title}" добавлен в корзину!`);
    showCart();
}

// Уведомление
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
        <a href="cart.html">Перейти в корзину</a>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Добавление обработчиков событий
function addCartEventListeners() {
    document.querySelector('.cart-field').addEventListener('click', (event) => {
        const item = event.target;
        const id = item.dataset.id || item.closest('[data-id]')?.dataset.id;
        
        if (!id) return;
        
        if (item.classList.contains('cart-remove') || item.closest('.cart-remove')) {
            cartRemove(id);
        } else if (item.classList.contains('cart-plus') || item.closest('.cart-plus')) {
            cartPlus(id);
        } else if (item.classList.contains('cart-minus') || item.closest('.cart-minus')) {
            cartMinus(id);
        }
    });
}

// Инициализация при загрузке
if (document.querySelector('.cart-field')) {
    showCart();
}

// Для использования на других страницах
window.cartManager = {
    addToCart,
    getCart: () => cart,
    getTotalItems: () => Object.values(cart).reduce((a, b) => a + b, 0),
    clearCart
};