const form = document.getElementById("form");

const Uname = document.getElementById("name");
const price = document.getElementById("price");
const color = document.getElementById("color");
const quantity = document.getElementById("quantity");
const Select = document.getElementById("select");
const image = document.getElementById("image");
const description = document.getElementById("description");

const submit = document.getElementById("btn");

const error = document.getElementById("error-message");
const complete = document.getElementById("complete-message");
const deleteMsg = document.getElementById("delete-message");
const editMsg = document.getElementById("edit-message");
const emptyMsg = document.getElementById("empty-message");

const productsBox = document.getElementById("products");

let editIndex = -1;


/* API */
async function getAPIProducts() {
    try {
        const res = await fetch("https://fakestoreapi.com/products");
        return await res.json();
    } catch {
        return [];
    }
}


/* Messages */
function showMessage(msg) {
    if (!msg) return;

    msg.style.display = "block";

    setTimeout(() => {
        msg.style.display = "none";
    }, 3000);
}


/* زر عرض المنتجات */
function toggleView() {
    window.location.href = "products.html";
}


/* Submit Form */
if (form) {
    form.addEventListener("submit", function (e) {

        e.preventDefault();

        if (
            !Uname.value.trim() ||
            !price.value.trim() ||
            !image.value.trim() ||
            !description.value.trim()
        ) {
            showMessage(emptyMsg);
            return;
        }

        let product = {
            name: Uname.value.trim(),
            price: price.value.trim(),
            color: color.value.trim(),
            quantity: quantity.value.trim(),
            select: Select.value,
            image: image.value.trim(),
            description: description.value.trim()
        };

        let list = JSON.parse(localStorage.getItem("products")) || [];

        if (editIndex === -1) {
            list.push(product);
            showMessage(complete);
        } else {
            list[editIndex] = product;
            showMessage(editMsg);
            editIndex = -1;
            submit.textContent = "اضافة المنتج";
        }

        localStorage.setItem("products", JSON.stringify(list));

        form.reset();
    });
}


/* عرض المنتجات */
async function displayAllProducts() {

    if (!productsBox) return;

    productsBox.innerHTML = "Loading...";

    let api = await getAPIProducts();
    let local = JSON.parse(localStorage.getItem("products")) || [];

    productsBox.innerHTML = "";


    /* API */
    api.forEach(p => {

        let div = document.createElement("div");

        div.className = "productE";
        div.dataset.category = p.category;

        div.innerHTML = `
            <div class="product-info">
                <h3 class="h3">${p.title}</h3>
                <p class="p">السعر: ${p.price}</p>
            </div>

            <img class="productE-img" src="${p.image}">
        `;

        div.onclick = () => {
            showDetails({
                name: p.title,
                price: p.price,
                color: "غير متوفر",
                quantity: "غير متوفر",
                select: p.category,
                image: p.image,
                description: p.description
            });
        };

        productsBox.appendChild(div);
    });


    /* Local */
    local.forEach((p, i) => {

        let div = document.createElement("div");

        div.className = "productE";
        div.dataset.category = p.select;

        div.innerHTML = `
            <div class="product-info">
                <h3 class="h3">${p.name}</h3>
                <p class="p">السعر: ${p.price}</p>
            </div>

            <img class="productE-img" src="${p.image}">

            <div style="display:flex; flex-direction:column; gap:6px;">
                <button class="edit" onclick="editProduct(${i}); event.stopPropagation();">تعديل</button>
                <button class="delete" onclick="deleteProduct(${i}); event.stopPropagation();">حذف</button>
            </div>
        `;

        div.onclick = () => showDetails(p);

        productsBox.appendChild(div);
    });
}


/* Delete */
function deleteProduct(i) {

    let list = JSON.parse(localStorage.getItem("products")) || [];

    list.splice(i, 1);

    localStorage.setItem("products", JSON.stringify(list));

    showMessage(deleteMsg);

    displayAllProducts();
}


/* Edit */
function editProduct(i) {

    let list = JSON.parse(localStorage.getItem("products")) || [];

    localStorage.setItem("editProduct", JSON.stringify({
        index: i,
        product: list[i]
    }));

    window.location.href = "index.html";
}


/* تحميل بيانات التعديل */
if (form) {
    window.addEventListener("load", function () {

        let data = JSON.parse(localStorage.getItem("editProduct"));

        if (!data) return;

        Uname.value = data.product.name;
        price.value = data.product.price;
        color.value = data.product.color;
        quantity.value = data.product.quantity;
        Select.value = data.product.select;
        image.value = data.product.image;
        description.value = data.product.description;

        editIndex = data.index;

        submit.textContent = "تحديث المنتج";

        localStorage.removeItem("editProduct");
    });
}


/* التفاصيل */
function showDetails(p) {

    const details = document.getElementById("product-details");

    if (!details || !productsBox) return;

    productsBox.style.display = "none";
    details.style.display = "flex";

    document.getElementById("detail-image").src = p.image;
    document.getElementById("detail-name").innerText = "الاسم: " + p.name;
    document.getElementById("detail-price").innerText = "السعر: " + p.price;
    document.getElementById("detail-type").innerText = "النوع: " + p.select;
    document.getElementById("detail-description").innerText =
        "اللون: " + (p.color || "غير محدد") +
        " | الكمية: " + (p.quantity || "غير محدد") +
        "\nالوصف: " + p.description;
}


/* رجوع */
const backBtn = document.getElementById("back-btn");

if (backBtn) {
    backBtn.addEventListener("click", goBack);
}

function goBack() {
    const details = document.getElementById("product-details");
    const products = document.getElementById("products");

    if (!details || !products) return;

    details.style.display = "none";
    products.style.display = "flex";
}

/* فلترة */
document.addEventListener("click", function (e) {

    if (e.target.parentElement?.id !== "filters") return;

    const type = e.target.innerText.trim();

    const map = {
        "ملابس": "clothes",
        "الكترونيات": "electronics",
        "كتب": "books",
        "طعام": "food",
        "العاب": "games",
        "أحذية": "shoes",
        "إكسسوارات": "accessories",
        "أثاث": "furniture"
    };

    document.querySelectorAll(".productE").forEach(card => {

        const category = card.dataset.category;

        if (type === "الكل") {
            card.style.display = "flex";
            return;
        }

        if (
            category === map[type] ||
            category === type ||
            (category === "men's clothing" && type === "ملابس") ||
            (category === "women's clothing" && type === "ملابس") ||
            (category === "jewelery" && type === "إكسسوارات")
        ) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }

    });

});


/* Init */
window.addEventListener("load", function () {
    displayAllProducts();
});