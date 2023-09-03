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

$(document).ready(() => {
  document.getElementById("contact").classList.add("d-none");
  searchByName("").then(() => {
    $(".loading").fadeOut(500);
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
    $(".loading").fadeIn(500);
    closeNavbar();
    searchSection.classList.remove("d-none");
    categoriesSection.innerHTML = "";
    areaSection.innerHTML = "";
    ingredientsSection.innerHTML = "";
    contactSection.innerHTML = "";
    $(".loading").fadeOut(500);
  });
}

async function searchByName(value) {
  closeNavbar();
  $(".loading").fadeIn(500);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`
  );
  let data = await response.json();

  data.meals ? displayCategoriesMeals(data.meals) : displayCategoriesMeals([]);
  $(".loading").fadeOut(500);
}

if (searchName) {
  searchName.addEventListener("keyup", function () {
    const value = searchName.value;
    searchByName(value);
    console.log("hello");
  });
}
async function searchByFirstLetter(value) {
  closeNavbar();
  $(".loading").fadeIn(500);
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${value}`
  );
  let data = await res.json();
  console.log(data.meals);

  data.meals ? displayCategoriesMeals(data.meals) : displayCategoriesMeals([]);
  $(".loading").fadeOut(500);
}

if (searchFirstLetter) {
  searchFirstLetter.addEventListener("input", function () {
    const inputValue = searchFirstLetter.value;
    const regexPattern = /^[a-zA-Z]$/;

    if (regexPattern.test(inputValue)) {
      searchByFirstLetter(inputValue);
      console.log("hello");
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
    <p>${data[i].strCategoryDescription}</p>
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
  $(".loading").fadeIn(500);
  let cartona = ``;
  for (let i = 0; i < dataMeals.length; i++) {
    cartona += `<div class="col-md-3">
    <div class="items itemsBox" data-id="${dataMeals[i].idMeal}">
    <img class="w-100" src="${dataMeals[i].strMealThumb}" alt="">
    <div class="contentHover d-flex align-items-center justify-content-center">
    <h3>${dataMeals[i].strMeal}</h3>
    </div>
    </div>
    </div>`;
  }
  categoriesSection.innerHTML = cartona;
  $(".loading").fadeOut(500);
}

async function getCategoryDetails(mealId) {
  $(".loading").fadeIn(500);
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  );
  let data = await res.json();
  displayCategoryDetails(data.meals);
  $("#categories .contentBox .recipes li").addClass("alert alert-info m-2 p-1");
  $("#categories .contentBox .tags li").addClass("alert alert-danger m-2 p-1");
  $(".loading").fadeOut(500);
}

function displayCategoryDetails(categoryDetails) {
  $(".loading").fadeIn(500);
  let cartona = ``;
  for (let i = 0; i < categoryDetails.length; i++) {
    cartona += `<div class="col-md-4">
    <img class="w-100" src="${categoryDetails[i].strMealThumb}" alt="">
    <h2>${categoryDetails[i].strMeal}</h2>
  </div>
  <div class="col-md-8">
    <div class="contentBox">
      <h3 class="pt-3">Instructions :</h3>
      <p>${categoryDetails[i].strInstructions}</p>
      <h4>Area : ${categoryDetails[i].strArea}</h4>
      <h4>Category : ${categoryDetails[i].strCategory}</h4>
      <h4>Recipes : </h4>
      <ul class="list-unstyled d-flex g-3 flex-wrap recipes">
        <li>${categoryDetails[i].strMeasure1} ${
      categoryDetails[i].strIngredient1
    }</li>
        <li>${categoryDetails[i].strMeasure2} ${
      categoryDetails[i].strIngredient2
    }</li>
        <li>${categoryDetails[i].strMeasure3} ${
      categoryDetails[i].strIngredient3
    }</li>
        <li>${categoryDetails[i].strMeasure4} ${
      categoryDetails[i].strIngredient4
    }</li>
        <li>${categoryDetails[i].strMeasure5} ${
      categoryDetails[i].strIngredient5
    }</li>
        <li>${categoryDetails[i].strMeasure6} ${
      categoryDetails[i].strIngredient6
    }</li>
        <li>${categoryDetails[i].strMeasure7} ${
      categoryDetails[i].strIngredient7
    }</li>
        <li>${categoryDetails[i].strMeasure8} ${
      categoryDetails[i].strIngredient8
    }</li>
        <li>${categoryDetails[i].strMeasure9} ${
      categoryDetails[i].strIngredient9
    }</li>
        <li>${categoryDetails[i].strMeasure10} ${
      categoryDetails[i].strIngredient10
    }</li>
        <li>${categoryDetails[i].strMeasure11} ${
      categoryDetails[i].strIngredient11
    }</li>
        <li>${categoryDetails[i].strMeasure12} ${
      categoryDetails[i].strIngredient12
    }</li>
        <li>${categoryDetails[i].strMeasure13} ${
      categoryDetails[i].strIngredient13
    }</li>
        <li>${categoryDetails[i].strMeasure14} ${
      categoryDetails[i].strIngredient14
    }</li>
        <li>${categoryDetails[i].strMeasure15} ${
      categoryDetails[i].strIngredient15
    }</li>
        </ul>
      <h4>Tags : </h4>
      <ul class="list-unstyled d-flex g-3 flex-wrap tags">
        <li>${categoryDetails[i].strTags.substring(0, 4)}</li>
        <li>${categoryDetails[i].strTags.substring(5, 8)}</li>
        </ul>
        <a class="btn btn-success" href="${
          categoryDetails[i].strSource
        }">Source</a>
        <a class="btn btn-danger" href="${
          categoryDetails[i].strYoutube
        }">Youtube</a>
        </div>
        </div>`;
  }
  categoriesSection.innerHTML = cartona;
  $(".loading").fadeOut(500);
}

categoriesBtn.addEventListener("click", function () {
  $(".loading").fadeIn(500);
  searchSection.classList.add("d-none");
  areaSection.innerHTML = "";
  categoriesSection.innerHTML = "";
  ingredientsSection.innerHTML = "";
  getCategoriesData();
  closeNavbar();
  $(".loading").fadeOut(500);
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
  displayAreaDetails(data.meals);
  $("#area .contentBox .recipes li").addClass("alert alert-info m-2 p-1");
  $("#area .contentBox .tags li").addClass("alert alert-danger m-2 p-1");
  $(".loading").fadeOut(500);
}

function displayAreaDetails(areaDetails) {
  $(".loading").fadeIn(500);
  let cartona = ``;
  for (let i = 0; i < areaDetails.length; i++) {
    cartona += `<div class="col-md-4">
    <img class="w-100" src="${areaDetails[i].strMealThumb}" alt="">
    <h2>${areaDetails[i].strMeal}</h2>
  </div>
  <div class="col-md-8">
  <div class="contentBox">
      <h3 class="pt-3">Instructions :</h3>
      <p>${areaDetails[i].strInstructions}</p>
      <h4>Area : ${areaDetails[i].strArea}</h4>
      <h4>Category : ${areaDetails[i].strCategory}</h4>
      <h4>Recipes : </h4>
      <ul class="list-unstyled d-flex g-3 flex-wrap recipes">
        <li>${areaDetails[i].strMeasure1} ${areaDetails[i].strIngredient1}</li>
        <li>${areaDetails[i].strMeasure2} ${areaDetails[i].strIngredient2}</li>
        <li>${areaDetails[i].strMeasure3} ${areaDetails[i].strIngredient3}</li>
        <li>${areaDetails[i].strMeasure4} ${areaDetails[i].strIngredient4}</li>
        <li>${areaDetails[i].strMeasure5} ${areaDetails[i].strIngredient5}</li>
        <li>${areaDetails[i].strMeasure6} ${areaDetails[i].strIngredient6}</li>
        <li>${areaDetails[i].strMeasure7} ${areaDetails[i].strIngredient7}</li>
        <li>${areaDetails[i].strMeasure8} ${areaDetails[i].strIngredient8}</li>
        <li>${areaDetails[i].strMeasure9} ${areaDetails[i].strIngredient9}</li>
        <li>${areaDetails[i].strMeasure10} ${
      areaDetails[i].strIngredient10
    }</li>
        <li>${areaDetails[i].strMeasure11} ${
      areaDetails[i].strIngredient11
    }</li>
        <li>${areaDetails[i].strMeasure12} ${
      areaDetails[i].strIngredient12
    }</li>
        <li>${areaDetails[i].strMeasure13} ${
      areaDetails[i].strIngredient13
    }</li>
        <li>${areaDetails[i].strMeasure14} ${
      areaDetails[i].strIngredient14
    }</li>
        <li>${areaDetails[i].strMeasure15} ${
      areaDetails[i].strIngredient15
    }</li>
        </ul>
        <h4>Tags : </h4>
        <ul class="list-unstyled d-flex g-3 flex-wrap tags">
        <li>${areaDetails[i].strTags.substring(0, 4)}</li>
        <li>${areaDetails[i].strTags.substring(5, 8)}</li>
        </ul>
        <a class="btn btn-success" href="${areaDetails[i].strSource}">Source</a>
        <a class="btn btn-danger" href="${
          areaDetails[i].strYoutube
        }">Youtube</a>
        </div>`;
  }
  areaSection.innerHTML = cartona;

  $(".loading").fadeOut(500);
}

areaBtn.addEventListener("click", function () {
  $(".loading").fadeIn(500);
  searchSection.classList.add("d-none");
  areaSection.innerHTML = "";
  categoriesSection.innerHTML = "";
  ingredientsSection.innerHTML = "";
  getArea();
  closeNavbar();
  $(".loading").fadeOut(500);
});

// ==================== End Area ====================
// ==================== Start Ingredients ====================
async function getIngredients() {
  $(".loading").fadeIn(500);
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  let data = await res.json();
  displayIngredients(data.meals);
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
    <div class="rounded-2 text-center card pointer p-3" data-id="${ingredientsData[i].strIngredient}">
    <i class="fa-solid fa-house-laptop fa-4x"></i>
    <h3>${ingredientsData[i].strIngredient}</h3>
    <p>${ingredientsData[i].strDescription}</p>
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
  displayIngredientsDetails(data.meals);
  $("#ingredients .contentBox .recipes li").addClass(
    "alert alert-info m-2 p-1"
  );
  $("#ingredients .contentBox .tags li").addClass("alert alert-danger m-2 p-1");
  $(".loading").fadeOut(500);
}

function displayIngredientsDetails(ingredientsDetails) {
  $(".loading").fadeIn(500);
  let cartona = ``;
  for (let i = 0; i < ingredientsDetails.length; i++) {
    cartona += `<div class="col-md-4">
      <img class="w-100" src="${ingredientsDetails[i].strMealThumb}" alt="">
    <h2>${ingredientsDetails[i].strMeal}</h2>
    </div>
    <div class="col-md-8">
    <div class="contentBox">
    <h3 class="pt-3">Instructions :</h3>
    <p>${ingredientsDetails[i].strInstructions}</p>
    <h4>Area : ${ingredientsDetails[i].strArea}</h4>
    <h4>Category : ${ingredientsDetails[i].strCategory}</h4>
      <h4>Recipes : </h4>
      <ul class="list-unstyled d-flex g-3 flex-wrap recipes">
        <li>${ingredientsDetails[i].strMeasure1} ${
      ingredientsDetails[i].strIngredient1
    }</li>
        <li>${ingredientsDetails[i].strMeasure2} ${
      ingredientsDetails[i].strIngredient2
    }</li>
        <li>${ingredientsDetails[i].strMeasure3} ${
      ingredientsDetails[i].strIngredient3
    }</li>
        <li>${ingredientsDetails[i].strMeasure4} ${
      ingredientsDetails[i].strIngredient4
    }</li>
        <li>${ingredientsDetails[i].strMeasure5} ${
      ingredientsDetails[i].strIngredient5
    }</li>
        <li>${ingredientsDetails[i].strMeasure6} ${
      ingredientsDetails[i].strIngredient6
    }</li>
        <li>${ingredientsDetails[i].strMeasure7} ${
      ingredientsDetails[i].strIngredient7
    }</li>
        <li>${ingredientsDetails[i].strMeasure8} ${
      ingredientsDetails[i].strIngredient8
    }</li>
        <li>${ingredientsDetails[i].strMeasure9} ${
      ingredientsDetails[i].strIngredient9
    }</li>
        <li>${ingredientsDetails[i].strMeasure10} ${
      ingredientsDetails[i].strIngredient10
    }</li>
        <li>${ingredientsDetails[i].strMeasure11} ${
      ingredientsDetails[i].strIngredient11
    }</li>
        <li>${ingredientsDetails[i].strMeasure12} ${
      ingredientsDetails[i].strIngredient12
    }</li>
        <li>${ingredientsDetails[i].strMeasure13} ${
      ingredientsDetails[i].strIngredient13
    }</li>
        <li>${ingredientsDetails[i].strMeasure14} ${
      ingredientsDetails[i].strIngredient14
    }</li>
        <li>${ingredientsDetails[i].strMeasure15} ${
      ingredientsDetails[i].strIngredient15
    }</li>
      </ul>
      <h4>Tags : </h4>
      <ul class="list-unstyled d-flex g-3 flex-wrap tags">
      <li>${ingredientsDetails[i].strTags.substring(0, 4)}</li>
      <li>${ingredientsDetails[i].strTags.substring(5, 8)}</li>
      </ul>
      <a class="btn btn-success" href="${
        ingredientsDetails[i].strSource
      }">Source</a>
      <a class="btn btn-danger" href="${
        ingredientsDetails[i].strYoutube
      }">Youtube</a>
      </div>`;
  }
  ingredientsSection.innerHTML = cartona;
  $(".loading").fadeOut(500);
}

ingredientsBtn.addEventListener("click", function () {
  $(".loading").fadeIn(500);
  searchSection.classList.add("d-none");
  areaSection.innerHTML = "";
  categoriesSection.innerHTML = "";
  ingredientsSection.innerHTML = "";
  getIngredients();
  closeNavbar();

  $(".loading").fadeOut(500);
});
// ==================== End Ingredients ====================
// ==================== Start Contact ====================

contactBtn.addEventListener("click", () => {
  $(".loading").fadeIn(500);
  searchSection.classList.add("d-none");
  areaSection.innerHTML = "";
  categoriesSection.innerHTML = "";
  ingredientsSection.innerHTML = "";
  closeNavbar();
  $("#categories").addClass("d-none");
  document.getElementById("contact").classList.remove("d-none");
  $(".loading").fadeOut(500);
});

document.getElementById("nameInput").addEventListener("keyup", () => {
  if (nameValidation()) {
    $("#contact #nameAlert").addClass("d-none");
    submitBtn.removeAttribute("disabled");
  } else {
    $("#contact #nameAlert").removeClass("d-none");
    submitBtn.setAttribute("disabled", true);
  }
});

document.getElementById("emailInput").addEventListener("keyup", () => {
  if (emailValidation()) {
    $("#contact #emailAlert").addClass("d-none");
    submitBtn.removeAttribute("disabled");
  } else {
    $("#contact #emailAlert").removeClass("d-none");
    submitBtn.setAttribute("disabled", true);
  }
});

document.getElementById("phoneInput").addEventListener("keyup", () => {
  if (phoneValidation()) {
    $("#contact #phoneAlert").addClass("d-none");
    submitBtn.removeAttribute("disabled");
  } else {
    $("#contact #phoneAlert").removeClass("d-none");
    submitBtn.setAttribute("disabled", true);
  }
});

document.getElementById("ageInput").addEventListener("keyup", () => {
  if (ageValidation()) {
    $("#contact #ageAlert").addClass("d-none");
    submitBtn.removeAttribute("disabled");
  } else {
    $("#contact #ageAlert").removeClass("d-none");
    submitBtn.setAttribute("disabled", true);
  }
});

document.getElementById("passwordInput").addEventListener("keyup", () => {
  if (passwordValidation()) {
    $("#contact #passwordAlert").addClass("d-none");
    submitBtn.removeAttribute("disabled");
  } else {
    $("#contact #passwordAlert").removeClass("d-none");
    submitBtn.setAttribute("disabled", true);
  }
});

document.getElementById("repasswordInput").addEventListener("keyup", () => {
  if (repasswordValidation()) {
    $("#contact #repasswordAlert").addClass("d-none");
    submitBtn.removeAttribute("disabled");
  } else {
    $("#contact #repasswordAlert").removeClass("d-none");
    submitBtn.setAttribute("disabled", true);
  }
});

function nameValidation() {
  return /^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value);
}

function emailValidation() {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    document.getElementById("emailInput").value
  );
}

function phoneValidation() {
  return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
    document.getElementById("phoneInput").value
  );
}

function ageValidation() {
  return /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(
    document.getElementById("ageInput").value
  );
}

function passwordValidation() {
  return /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(
    document.getElementById("passwordInput").value
  );
}

function repasswordValidation() {
  return (
    document.getElementById("repasswordInput").value ==
    document.getElementById("passwordInput").value
  );
}
// ==================== End Contact ====================