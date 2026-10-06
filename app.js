const sampleRecipes = [
  {id:1,name:"Chicken Teriyaki",cuisine:"Japanese",category:"Dinner",time:30,difficulty:"Easy",emoji:"🍗",
   ingredients:[["500 g","chicken"],["3 tbsp","soy sauce"],["2 tbsp","mirin"],["1 tbsp","sugar"],["2 cloves","garlic"]],
   instructions:["Cut the chicken into bite-sized pieces.","Mix the sauce ingredients.","Cook the chicken until golden.","Add the sauce and simmer until glossy."]},
  {id:2,name:"Tikka Masala",cuisine:"Indian",category:"Dinner",time:50,difficulty:"Medium",emoji:"🍛",
   ingredients:[["500 g","chicken"],["1","onion"],["3 cloves","garlic"],["1 tbsp","garam masala"],["400 ml","tomato"],["200 ml","cream"]],
   instructions:["Marinate the chicken.","Cook the onion and spices.","Add tomato and simmer.","Add chicken and cream."]},
  {id:3,name:"Carbonara",cuisine:"Italian",category:"Dinner",time:25,difficulty:"Easy",emoji:"🍝",
   ingredients:[["250 g","spaghetti"],["150 g","bacon"],["2","eggs"],["50 g","parmesan"],["2 cloves","garlic"]],
   instructions:["Cook pasta.","Fry bacon and garlic.","Mix eggs and parmesan.","Toss everything together off the heat."]},
  {id:4,name:"Gyoza",cuisine:"Japanese",category:"Lunch",time:45,difficulty:"Medium",emoji:"🥟",
   ingredients:[["300 g","pork"],["2 cups","cabbage"],["2 cloves","garlic"],["1 tbsp","soy sauce"],["20","gyoza wrappers"]],
   instructions:["Mix the filling.","Fill and fold the wrappers.","Pan-fry and steam until cooked."]},
  {id:5,name:"Pancakes",cuisine:"Other",category:"Breakfast",time:20,difficulty:"Easy",emoji:"🥞",
   ingredients:[["1 cup","flour"],["1","egg"],["1 cup","milk"],["1 tbsp","sugar"],["1 tsp","baking powder"]],
   instructions:["Mix dry ingredients.","Whisk wet ingredients in.","Combine gently.","Cook pancakes in a hot pan."]}
];

let recipes = [...sampleRecipes];
let selectedCuisine = "All", selectedCategory = "All";

const $ = id => document.getElementById(id);
const cuisines = [...new Set(recipes.map(r=>r.cuisine))].sort();
const categories = [...new Set(recipes.map(r=>r.category))].sort();

function openDrawer(id){
  document.querySelectorAll(".drawer").forEach(d=>d.classList.remove("open"));
  $(id).classList.add("open"); $("overlay").classList.add("open");
}
function closeDrawers(){
  document.querySelectorAll(".drawer").forEach(d=>d.classList.remove("open"));
  $("overlay").classList.remove("open");
}
$("browseBtn").onclick=()=>openDrawer("browseDrawer");
$("makeBtn").onclick=()=>{buildIngredients();openDrawer("makeDrawer")};
$("addBtn").onclick=()=>{populateForm();openDrawer("addDrawer")};
$("overlay").onclick=closeDrawers;
document.querySelectorAll(".close").forEach(b=>b.onclick=closeDrawers);

function filterButtons(target, items, current, setter){
  $(target).innerHTML=["All",...items].map(x=>`<button class="filter ${x===current?"active":""}" data-value="${x}">${x}</button>`).join("");
  $(target).querySelectorAll(".filter").forEach(b=>b.onclick=()=>{setter(b.dataset.value);render();});
}
function buildBrowse(){
  filterButtons("cuisineFilters",cuisines,selectedCuisine,x=>selectedCuisine=x);
  filterButtons("categoryFilters",categories,selectedCategory,x=>selectedCategory=x);
}
function render(){
  buildBrowse();
  const q=$("search").value.trim().toLowerCase();
  const shown=recipes.filter(r=>{
    const text=[r.name,r.cuisine,r.category,...r.ingredients.map(x=>x[1])].join(" ").toLowerCase();
    return (selectedCuisine==="All"||r.cuisine===selectedCuisine) &&
           (selectedCategory==="All"||r.category===selectedCategory) && text.includes(q);
  });
  $("recipeCount").textContent=`${shown.length} recipe${shown.length===1?"":"s"}`;
  $("recipes").innerHTML=shown.length?shown.map(r=>`
    <article class="recipe-card">
      <div class="recipe-photo">${r.emoji||"🍽️"}</div>
      <div class="recipe-body">
        <h3>${escapeHtml(r.name)}</h3>
        <div class="meta">${r.cuisine} · ${r.time} min · ${r.difficulty}</div>
        <div class="tags"><span class="tag">${r.category}</span><span class="tag">${r.ingredients.length} ingredients</span></div>
      </div>
    </article>`).join(""):`<div class="empty">No recipes found. Try another search or filter.</div>`;
}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}

$("search").addEventListener("input",render);

function buildIngredients(){
  const all=[...new Set(recipes.flatMap(r=>r.ingredients.map(x=>x[1])))].sort();
  $("ingredientList").innerHTML=all.map(i=>`<label class="ingredient"><input type="checkbox" value="${escapeHtml(i)}"> ${escapeHtml(i)}</label>`).join("");
}
$("findBtn").onclick=()=>{
  const have=new Set([...document.querySelectorAll("#ingredientList input:checked")].map(x=>x.value.toLowerCase()));
  const ranked=recipes.map(r=>{
    const missing=r.ingredients.map(x=>x[1]).filter(i=>!have.has(i.toLowerCase()));
    return {...r,missing,score:Math.round((r.ingredients.length-missing.length)/r.ingredients.length*100)};
  }).sort((a,b)=>b.score-a.score);
  $("matches").innerHTML=ranked.map(r=>`<div class="match"><strong>${escapeHtml(r.name)} — ${r.score}% match</strong><small>${r.missing.length?`Missing: ${r.missing.join(", ")}`:"You have everything!"}</small></div>`).join("");
};

function populateForm(){
  $("cuisine").innerHTML=[...new Set(["Japanese","Indian","Italian","Mexican","Thai","Chinese","French","Other",...cuisines])].map(x=>`<option>${x}</option>`).join("");
  $("category").innerHTML=[...new Set(["Breakfast","Lunch","Dinner","Dessert","Baking","Snack","Other",...categories])].map(x=>`<option>${x}</option>`).join("");
}
$("recipeForm").onsubmit=e=>{
  e.preventDefault();
  const ingredients=$("ingredients").value.split("\n").map(x=>{
    const [amount,...rest]=x.split("|"); return [amount.trim(),rest.join("|").trim()];
  }).filter(x=>x[1]);
  const instructions=$("instructions").value.split("\n").map(x=>x.trim()).filter(Boolean);
  recipes.unshift({id:Date.now(),name:$("name").value.trim(),cuisine:$("cuisine").value,category:$("category").value,
    time:Number($("time").value),difficulty:$("difficulty").value,emoji:"🍽️",ingredients,instructions});
  e.target.reset(); closeDrawers(); render();
};
render();
