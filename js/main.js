// Global Variable
const navTab = document.querySelector(".navTab");
const openIcon = document.querySelector(".openIcon");
const navTabWidth = $(".leftNavMenu .navTab").outerWidth();
const categoriesBtn = document.getElementById("categoriesBtn");
const categoriesSection = document.querySelector("#categories .row");
const areaBtn = document.getElementById("areaBtn");
const areaSection = document.querySelector("#area .row");
const ingredientsBtn = document.getElementById("ingredientsBtn");
const ingredientsSection = document.querySelector("#ingredients .row");
const contactSection = document.querySelector("#contact .container");
const contactBtn = document.getElementById("contactBtn");
const submitBtn = document.getElementById("submitBtn");
const iconClose = document.querySelector(".iconClose");

$(document).ready(() => {
  searchByName("").then(() => {
    $(".loading").fadeOut(500);
    document.getElementById("contact").classList.add("d-none")
    $("body").css("overflow", "visible");
  });
});
// ==================== Start Navbar ====================
function openNavbar() {
  $(".leftNavMenu").animate({ left: 0 }, 500);
  $(".closeIcon").removeClass("d-none");
  $(".openIcon").addClass("d-none");
  $(".navTab .links ul li").removeClass("animate__fadeOut");
  $(".navTab .links ul li").addClass("animate__fadeInUp");
}
$(".openIcon").click(function () {
  openNavbar();
});
function closeNavbar() {
  $(".leftNavMenu").animate({ left: -navTabWidth }, 500);
  $(".openIcon").removeClass("d-none");
  $(".closeIcon").addClass("d-none");
  $(".navTab .links ul li").removeClass("animate__fadeInUp");
  $(".navTab .links ul li").addClass("animate__fadeOut");
}
$(".closeIcon").click(function () {
  closeNavbar();
});
closeNavbar();

// ==================== End Navbar ====================

// ==================== Start Search ====================
const searchSection = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");
const searchName = document.getElementById("searchName");
const searchFirstLetter = document.getElementById("searchFirstLetter");

if (searchBtn) {
  searchBtn.addEventListener("click", function () {
    closeNavbar();
    searchSection.classList.remove("d-none");
    categoriesSection.innerHTML = "";
    areaSection.innerHTML = "";
    ingredientsSection.innerHTML = "";
    document.getElementById("contact").classList.add("d-none")
  });
}

async function searchByName(value) {
  closeNavbar();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`
  );
  let data = await response.json();

  data.meals ? displayCategoriesMeals(data.meals) : displayCategoriesMeals([]);
  document.querySelectorAll(".itemsBox").forEach((item) => {
    item.addEventListener("click", function () {
      getCategoryDetails(item.dataset.id);
    });
  });
}

if (searchName) {
  searchName.addEventListener("keyup", function () {
    const value = searchName.value;
    searchByName(value);
  });
}
async function searchByFirstLetter(value) {
  closeNavbar();
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${value}`
  );
  let data = await res.json();

  data.meals ? displayCategoriesMeals(data.meals) : displayCategoriesMeals([]);
  document.querySelectorAll(".itemsBox").forEach((item) => {
    item.addEventListener("click", function () {
      getCategoryDetails(item.dataset.id);
    });
  });
}

if (searchFirstLetter) {
  searchFirstLetter.addEventListener("keyup", function () {
    const inputValue = searchFirstLetter.value;
    const regexPattern = /^[a-zA-Z]$/;
    if (regexPattern.test(inputValue)) {
      searchByFirstLetter(inputValue);
    } else {
      searchFirstLetter.value = "";
    }
  });
}

// ==================== End Search ====================
// ==================== Start categories ====================

async function getCategoriesData() {
  $(".loading").fadeIn(500);
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  let data = await res.json();
  displayCategories(data.categories);
  $(".loading").fadeOut(500);

  document.querySelectorAll(".items").forEach((items) => {
    items.addEventListener("click", () => {
      getCategoriesMeals(items.dataset.id);
    });
  });
}

function displayCategories(data) {
  $(".loading").fadeIn(500);
  let cartona = ``;
  for (let i = 0; i < data.length; i++) {
    cartona += `<div class="col-md-3">
    <div class="items" data-id="${data[i].strCategory}">
    <img class="w-100" src="${data[i].strCategoryThumb}" alt="">
    <div class="contentHover">
    <h2>${data[i].strCategory}</h2>
    <p>${data[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
    </div>
    </div>
    </div>`;
  }
  categoriesSection.innerHTML = cartona;
  $(".loading").fadeOut(500);
}

async function getCategoriesMeals(meal) {
  $(".loading").fadeIn(500);
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${meal}`
  );
  let data = await res.json();
  displayCategoriesMeals(data.meals);

  $(".loading").fadeOut(500);
  document.querySelectorAll(".itemsBox").forEach((itemsBox) => {
    itemsBox.addEventListener("click", () => {
      getCategoryDetails(itemsBox.dataset.id);
    });
  });
}

function displayCategoriesMeals(dataMeals) {
  let cartona = ``;
  for (let i = 0; i < dataMeals.length; i++) {
    cartona += `<div class="col-md-6 col-lg-3">
    <div class="items itemsBox" data-id="${dataMeals[i].idMeal}">
    <img class="w-100" src="${dataMeals[i].strMealThumb}" alt="">
    <div class="contentHover d-flex align-items-center justify-content-center">
    <h3>${dataMeals[i].strMeal}</h3>
    </div>
    </div>
    </div>`;
  }
  categoriesSection.innerHTML = cartona;
}

async function getCategoryDetails(mealId) {
  $(".loading").fadeIn(500);
  searchSection.classList.add("d-none");
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  );
  let data = await res.json();
  displayCategoryDetails(data.meals[0]);
  document.querySelectorAll(".iconClose").forEach((icon) => {
    icon.addEventListener("click", function () {
      getCategoriesData();
    });
  });
  $(".loading").fadeOut(500);
}

function displayCategoryDetails(categoryDetails) {
  $(".loading").fadeIn(500);
  let ingredients = ``;

  for (let i = 1; i <= 20; i++) {
    if (categoryDetails[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1">${
        categoryDetails[`strMeasure${i}`]
      } ${categoryDetails[`strIngredient${i}`]}</li>`;
    }
  }
  let tags = categoryDetails.strTags ? categoryDetails.strTags.split(",") : [];
  let tagsStr = "";
  for (let i = 0; i < tags.length; i++) {
    tagsStr += `
    <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
  }

  let cartona = `
  <div class="iconClose text-white position-relative text-end pb-2">
  <i class="fa-solid fa-xmark fa-lg"></i>
</div>
  <div class="col-md-4">
    <img class="w-100" src="${categoryDetails.strMealThumb}" alt="">
    <h2>${categoryDetails.strMeal}</h2>
  </div>
  <div class="col-md-8">
    <div class="contentBox">
      <h3 class="pt-3">Instructions :</h3>
      <p>${categoryDetails.strInstructions}</p>
      <h4>Area : ${categoryDetails.strArea}</h4>
      <h4>Category : ${categoryDetails.strCategory}</h4>
      <h4>Recipes : </h4>
      <ul class="list-unstyled d-flex g-3 flex-wrap recipes">
      ${ingredients}
        </ul>
      <h4>Tags : </h4>
      <ul class="list-unstyled d-flex g-3 flex-wrap tags">
      ${tagsStr}
        </ul>
        <a class="btn btn-success" href="${categoryDetails.strSource}">Source</a>
        <a class="btn btn-danger" href="${categoryDetails.strYoutube}">Youtube</a>
        </div>
        </div>`;

  categoriesSection.innerHTML = cartona;
  $(".loading").fadeOut(500);
}

categoriesBtn.addEventListener("click", function () {
  closeNavbar();
  getCategoriesData();
  searchSection.classList.add("d-none");
  areaSection.innerHTML = "";
  document.getElementById("contact").classList.add("d-none")
  ingredientsSection.innerHTML = "";
});

// ==================== End categories ====================
// ==================== Start Area ====================

async function getArea() {
  $(".loading").fadeIn(500);
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  let data = await res.json();
  displayArea(data.meals);

  $(".loading").fadeOut(500);

  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => {
      getAreaMeals(card.dataset.id);
    });
  });
}

function displayArea(areaData) {
  $(".loading").fadeIn(500);
  let cartona = ``;
  for (let i = 0; i < areaData.length; i++) {
    cartona += `<div class="col-md-3">
    <div class="rounded-2 text-center card pointer p-3" data-id="${areaData[i].strArea}">
    <i class="fa-solid fa-house-laptop fa-4x"></i>
    <h2>${areaData[i].strArea}</h2>
    </div>
    </div>`;
  }
  areaSection.innerHTML = cartona;
  $(".loading").fadeOut(500);
}

async function getAreaMeals(mealsId) {
  $(".loading").fadeIn(500);
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${mealsId}`
  );
  let data = await res.json();
  displayAreaMeals(data.meals);
  $(".loading").fadeOut(500);
  document.querySelectorAll(".items").forEach((cardId) => {
    cardId.addEventListener("click", () => {
      getAreaDetails(cardId.dataset.id);
    });
  });
}

function displayAreaMeals(areaMeals) {
  $(".loading").fadeIn(500);
  let cartona = ``;

  for (let i = 0; i < areaMeals.length; i++) {
    cartona += `<div class="col-md-3">
    <div class="items" data-id="${areaMeals[i].idMeal}">
      <img class="w-100" src="${areaMeals[i].strMealThumb}" alt="">
      <div class="contentHover d-flex justify-content-center align-items-center">
      <h2>${areaMeals[i].strMeal}</h2>
      </div>
      </div>
      </div>`;
  }
  areaSection.innerHTML = cartona;
  $(".loading").fadeOut(500);
}

async function getAreaDetails(mealId) {
  $(".loading").fadeIn(500);
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  );
  let data = await res.json();
  displayCategoryDetails(data.meals[0]);
  areaSection.innerHTML = ``;
  document.querySelectorAll(".iconClose").forEach((icon) => {
    icon.addEventListener("click", function () {
      getArea();
      categoriesSection.innerHTML = ``;
    });
  });
  $(".loading").fadeOut(500);
}

areaBtn.addEventListener("click", function () {
  searchSection.classList.add("d-none");
  document.getElementById("contact").classList.add("d-none")
  categoriesSection.innerHTML = "";
  ingredientsSection.innerHTML = "";
  getArea();
  closeNavbar();
});

// ==================== End Area ====================
// ==================== Start Ingredients ====================
async function getIngredients() {
  $(".loading").fadeIn(500);
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  let data = await res.json();
  displayIngredients(data.meals.slice(0, 20));
  $(".loading").fadeOut(500);

  document.querySelectorAll("#ingredients .card").forEach((card) => {
    card.addEventListener("click", () => {
      getIngredientsMeals(card.dataset.id);
    });
  });
}

function displayIngredients(ingredientsData) {
  $(".loading").fadeIn(500);
  let cartona = ``;
  for (let i = 0; i < ingredientsData.length; i++) {
    cartona += `<div class="col-md-3">
    <div class="rounded-2 text-center card pointer p-3" data-id="${
      ingredientsData[i].strIngredient
    }">
    <i class="fa-solid fa-house-laptop fa-4x"></i>
    <h3>${ingredientsData[i].strIngredient}</h3>
    <p>${ingredientsData[i].strDescription
      .split(" ")
      .slice(0, 20)
      .join(" ")}</p>
    </div>
    </div>`;
  }
  ingredientsSection.innerHTML = cartona;
  $(".loading").fadeOut(500);
}

async function getIngredientsMeals(mealsId) {
  $(".loading").fadeIn(500);
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${mealsId}`
  );
  let data = await res.json();
  displayIngredientsMeals(data.meals);
  document.querySelectorAll(".items").forEach((cardId) => {
    cardId.addEventListener("click", () => {
      getIngredientsDetails(cardId.dataset.id);
    });
  });

  $(".loading").fadeOut(500);
}

function displayIngredientsMeals(ingredientsMeals) {
  $(".loading").fadeIn(500);
  let cartona = ``;

  for (let i = 0; i < ingredientsMeals.length; i++) {
    cartona += `<div class="col-md-3">
    <div class="items" data-id="${ingredientsMeals[i].idMeal}">
    <img class="w-100" src="${ingredientsMeals[i].strMealThumb}" alt="">
    <div class="contentHover d-flex justify-content-center align-items-center">
    <h2>${ingredientsMeals[i].strMeal}</h2>
    </div>
    </div>
    </div>`;
  }
  ingredientsSection.innerHTML = cartona;
  $(".loading").fadeOut(500);
}

async function getIngredientsDetails(mealId) {
  $(".loading").fadeIn(500);
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  );
  let data = await res.json();
  displayCategoryDetails(data.meals[0]);
  ingredientsSection.innerHTML = ``;
  document.querySelectorAll(".iconClose").forEach((icon) => {
    icon.addEventListener("click", function () {
      getIngredients();
      categoriesSection.innerHTML = ``;
    });
  });
  $(".loading").fadeOut(500);
}

ingredientsBtn.addEventListener("click", function () {
  searchSection.classList.add("d-none");
  areaSection.innerHTML = "";
  categoriesSection.innerHTML = "";
  document.getElementById("contact").classList.add("d-none")
  getIngredients();
  closeNavbar();
});
// ==================== End Ingredients ====================
// ==================== Start Contact ====================

contactBtn.addEventListener("click", () => {
  searchSection.classList.add("d-none");
  areaSection.innerHTML = "";
  categoriesSection.innerHTML = "";
  ingredientsSection.innerHTML = "";
  closeNavbar();
  document.getElementById("contact").classList.remove("d-none");
});

const validationRegex = {
  name: /^[a-zA-Z ]+$/,
  email:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  phone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  age: /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/,
  password: /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/,
  repassword: (repasswordInputValue, passwordInputValue) =>
    repasswordInputValue === passwordInputValue,
};
const nameInputValue = document.getElementById("nameInput");
const emailInputValue = document.getElementById("emailInput");
const phoneInputValue = document.getElementById("phoneInput");
const ageInputValue = document.getElementById("ageInput");
const passwordInputValue = document.getElementById("passwordInput");
const repasswordInputValue = document.getElementById("repasswordInput");

nameInputValue.addEventListener("focus", () => {
  nameInputTouched = true;
});

emailInputValue.addEventListener("focus", () => {
  emailInputTouched = true;
});

phoneInputValue.addEventListener("focus", () => {
  phoneInputTouched = true;
});

ageInputValue.addEventListener("focus", () => {
  ageInputTouched = true;
});

passwordInputValue.addEventListener("focus", () => {
  passwordInputTouched = true;
});

repasswordInputValue.addEventListener("focus", () => {
  repasswordInputTouched = true;
});

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;

function updateSubmitButtonState() {
  let inputValue = {
    name: nameInputValue.value,
    email: emailInputValue.value,
    phone: phoneInputValue.value,
    age: ageInputValue.value,
    password: passwordInputValue.value,
    repassword: repasswordInputValue.value,
  };
  const isNameValid = validationRegex.name.test(inputValue.name);
  const isEmailValid = validationRegex.email.test(inputValue.email);
  const isPhoneValid = validationRegex.phone.test(inputValue.phone);
  const isAgeValid = validationRegex.age.test(inputValue.age);
  const isPasswordValid = validationRegex.password.test(inputValue.password);
  const isRepasswordValid = validationRegex.repassword(
    inputValue.repassword,
    inputValue.password
  );

  if (nameInputTouched) {
    if (isNameValid) {
      document
        .getElementById("nameAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("nameAlert")
        .classList.replace("d-none", "d-block");
    }
  }
  if (emailInputTouched) {
    if (isEmailValid) {
      document
        .getElementById("emailAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("emailAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (phoneInputTouched) {
    if (isPhoneValid) {
      document
        .getElementById("phoneAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("phoneAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (ageInputTouched) {
    if (isAgeValid) {
      document
        .getElementById("ageAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("ageAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (passwordInputTouched) {
    if (isPasswordValid) {
      document
        .getElementById("passwordAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("passwordAlert")
        .classList.replace("d-none", "d-block");
    }
  }
  if (repasswordInputTouched) {
    if (isRepasswordValid) {
      document
        .getElementById("repasswordAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("repasswordAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (
    isNameValid &&
    isEmailValid &&
    isPhoneValid &&
    isAgeValid &&
    isPasswordValid &&
    isRepasswordValid
  ) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", true);
  }
}

document.querySelectorAll("#contact input").forEach((validation) => {
  validation.addEventListener("input", () => {
    updateSubmitButtonState();
  });
});

// ==================== End Contact ====================
