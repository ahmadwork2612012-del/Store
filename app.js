// DOM
const form = document.getElementById('form');

const Uname = document.getElementById('name');
const price = document.getElementById('price');
const Select = document.getElementById('select');
const image = document.getElementById('image');
const description = document.getElementById('description');

const submit = document.getElementById('btn');

const error = document.getElementById('error-message');
const complete = document.getElementById('complete-message');
const deleteMsg = document.getElementById('delete-message');
const editMsg = document.getElementById('edit-message');
const emptyMsg = document.getElementById('empty-message');

const products = document.getElementById('products');

let editIndex = -1;


// API 
async function getAPIProducts() {
    try {
        const res = await fetch("https://fakestoreapi.com/products");
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
        return [];
    }
}


// الرسائل 
function showMessage(msg) {
    msg.style.display = "block";

    setTimeout(() => {
        msg.style.display = "none";
    }, 3000);
}


// submit 
form.addEventListener("submit", function (e) {
    e.preventDefault();

    error.style.display = "none";
    complete.style.display = "none";
    deleteMsg.style.display = "none";
    editMsg.style.display = "none";
    emptyMsg.style.display = "none";

    // validation
    if (
        Uname.value.trim() === "" ||
        price.value.trim() === "" ||
        Select.value.trim() === "" ||
        image.value.trim() === "" ||
        description.value.trim() === ""
    ) {
        showMessage(emptyMsg);
        return;
    }

    if (Uname.value.trim().length < 3) {
        showMessage(error);
        return;
    }

    if (Number(price.value) <= 0) {
        showMessage(error);
        return;
    }

    let product = {
        name: Uname.value.trim(),
        price: price.value.trim(),
        select: Select.value,
        image: image.value.trim(),
        description: description.value.trim()
    };

    let productsList = JSON.parse(localStorage.getItem("products")) || [];

    if (editIndex === -1) {
        productsList.push(product);
        showMessage(complete);
    } else {
        productsList[editIndex] = product;
        showMessage(editMsg);

        editIndex = -1;
        submit.textContent = "اضافة المنتج";
    }

    localStorage.setItem("products", JSON.stringify(productsList));

    displayAllProducts();

    form.reset();
});


// localStorage 
function displayLocalProducts() {
    let productsList = JSON.parse(localStorage.getItem("products")) || [];

    productsList.forEach((product, index) => {
        const productE = document.createElement("div");
        productE.className = "productE";

        productE.innerHTML = `
            <h3 class="h3">${product.name}</h3>
            <p class="p">السعر: ${product.price}</p>
            <p class="p">التصنيف: ${product.select}</p>
            <img class="productE-img" src="${product.image}">
            <p class="p">${product.description}</p>

            <button class="delete" onclick="deleteProduct(${index})">حذف</button>
            <button class="edit" onclick="editProduct(${index})">تعديل</button>
        `;

        products.appendChild(productE);
    });
}


// API 
async function displayAPIProducts() {
    let apiProducts = await getAPIProducts();

    apiProducts.forEach(product => {
        const productE = document.createElement("div");
        productE.className = "productE";

        productE.innerHTML = `
            <span style="font-size:12px;background:#222;color:#fff;padding:3px 6px;border-radius:5px;">
                API
            </span>

            <h3 class="h3">${product.title}</h3>
            <p class="p">السعر: ${product.price}</p>
            <img class="productE-img" src="${product.image}">
            <p class="p">${product.description}</p>
        `;

        products.appendChild(productE);
    });
}


// عرض الكل 
async function displayAllProducts() {
    products.innerHTML = "";

    await displayAPIProducts();
    displayLocalProducts();
}


// حذف 
function deleteProduct(index) {
    let productsList = JSON.parse(localStorage.getItem("products")) || [];

    productsList.splice(index, 1);

    localStorage.setItem("products", JSON.stringify(productsList));

    showMessage(deleteMsg);

    displayAllProducts();
}


// تعديل 
function editProduct(index) {
    let productsList = JSON.parse(localStorage.getItem("products")) || [];

    const product = productsList[index];

    Uname.value = product.name;
    price.value = product.price;
    Select.value = product.select;
    image.value = product.image;
    description.value = product.description;

    editIndex = index;

    submit.textContent = "تحديث المنتج";

    showMessage(editMsg);
}

function toggleView() {
    const left = document.getElementById("left");
    const right = document.getElementById("right");

    if (left.style.display === "none") {
        left.style.display = "block";
        right.style.display = "none";
    } else {
        left.style.display = "none";
        right.style.display = "block";
    }
}


// أول تشغيل 
window.onload = displayAllProducts;
