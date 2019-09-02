import Search from './models/Search'
import Recipe from './models/Recipe'
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'

import {
  elements,
  renderLoader,
  clearLoader
} from './views/base'

// Global State of the app
// all sreach data
// the current recipes object
// shoppinglist object
// liked recipes object
const state = {}

// SEARCH CONTROLLEr
// Get search input and get search results
const controlSearch = async () => {
  // 1) Get query from view
  const query = searchView.getInput();
  if (query) {
    // 2) New search object and add to state
    state.search = new Search(query);
    // Prepare UI (clearing previous results)
    // searchView.clearInput()
    searchView.clearInput();
    searchView.clearResults()
    renderLoader(elements.searchRes)
    try {
      // Search for recipe
      await state.search.getResults();
      // Show UI recipies 
      clearLoader()
      searchView.renderResults(state.search.result)
    } catch (err) {
      alert(err)
      clearLoader()
    }
  }
}

// Search button is pressed
elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline')
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10)
    searchView.clearResults()
    searchView.renderResults(state.search.result, goToPage);
  }
})

// RECIPE CONTROLLER
const controlRecipe = async () => {
  // Get id from URL
  const id = window.location.hash.replace('#', '')
  if (id) {
    // prepare UI for changes
    recipeView.clearRecipe()
    renderLoader(elements.recipe)
    if (state.search) searchView.highlightSelected(id)
    // create new recipe object
    state.recipe = new Recipe(id)
    // get recipe data
    try {
      await state.recipe.getRecipe()
      console.log(state.recipe.ingredients)
      state.recipe.parseIngredients()
      // calc time and servings
      state.recipe.calcTime()
      state.recipe.calcServings()
      // render recipe
      clearLoader()
      recipeView.renderRecipe(state.recipe)

    } catch (err) {
      console.log(err, 'CONTROLRECEIPT')
    }
  }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe))