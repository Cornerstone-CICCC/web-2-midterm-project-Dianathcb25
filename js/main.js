/// Autentification
const TMDBtoken = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNWZjMmY4MzllZWMwYjVjMzA2NDFiMzg3MzYyMzYyZCIsIm5iZiI6MTc2NDYzOTAyMi44OTkwMDAyLCJzdWIiOiI2OTJlNDEyZWM4M2MxYjExMzU1MTI0NTciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.jqsak2upcdhdd7-4xsTIdzXLBl88rA5rK28eos8zIO8'
const baseURL = 'https://api.themoviedb.org/3'
const imgURL = 'https://image.tmdb.org/t/p/w500'

function requestTMDB(endpoint, params = {}) {
  const queryParams = new URLSearchParams(params).toString()
  const URL = `${baseURL}${endpoint}?${queryParams ? `?${queryParams}` : ""}`
  
  const settings = {
    async: true,
    crossDomain: true,
    url: URL,
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: TMDBtoken
    }
  };

  return $.ajax(settings)
}


///CARDS
function createCards(item) {
  const title = item.title || item.name || "Untitled"
  const date = item.realse_date || item.first_air_date || ""
  const year = date ? date.slice(0, 4): "N/A"
  const rating = typeof item.vote_avarage === "number" ? item.vote_avarage.toFixed(1) : "-"
  const posterUrl = item.poster_path
  ? `${imgURL}${item.poster_path}`
  : "./assets/images/placeholder-no-background.png"

  const mediaType = item.media_type
  ? item.media_type.toUpperCase()
  : (item.title ? "MOVIE" : "TV")

  return `
  <article class="movie-card">
    <img src="${posterUrl}" alt="${title}" />
    <div class="card-body">
      <h2>${title}</h2>
      <p>${mediaType} ${year}</p>
      <p id="rating">❤️${rating}</p>
    </div>
  </article>
  `
}

/////  TRENDING MOVIES
function loadMoviesDisplay(limit = 8) {
  requestTMDB("/trending/movie/day", {language: "en-US"})
    .done(res => {
      const results = res.results || []
      const $grid = $("#movie-display")
      $grid.empty()

      results.slice(0, limit).forEach((movie) => {
        $grid.append(createCards(movie))
      })
  })
  .fail((err) => {
    console.error("Error loading trending movies", err)
  })
}

/////  TRENDING TV SHOWS
function loadTVDisplay(limit = 8) {
  requestTMDB("/trending/tv/day", {language: "en-US"})
    .done(res => {
      const results = res.results || []
      const $grid = $("#tv-display")
      $grid.empty()

      results.slice(0, limit).forEach((tv) => {
        $grid.append(createCards(tv))
      })
  })
  .fail((err) => {
    console.error("Error loading trending movies", err)
  })
}

//////  SEARCHING
function searching(query) {
  const term = query.trim()

  if(term === "") {
    $("#search-display").empty()
    $(".search-results").hide()
    $(".movie-template, .tv-template").show()
    return
  }
  $(".movie-template, .tv-template").hide()

  requestTMDB("/search/multi", {
    query: term,
    include_adult: "false",
    language: "en-US",
    page: '1'
  })
  .done(res => {
   console.log("Search response:", res)
    const results = res.results || []
    const $grid = $("#search-display")
    $grid.empty()

    if (results.length > 0) {
      results.forEach(item => {
          $grid.append(createCards(item))
        })
      }else {
        $grid.html("<p>No results found</p>")
      }
        $(".search-results").show()
    })
      .fail((err) => {
        console.error("Error searching:", err);
        $("#search-display").html("<p>Error loading results</p>")
        $(".search-results").show()
      });
  }



$(function() {
  loadMoviesDisplay(8)
  loadTVDisplay(8)

  $(".search-results").hide()

  $("#search").on("submit", function (e) {
    e.preventDefault()
    const searchTerm = $("#search-input").val() || ""
    searching(searchTerm)
  })

  $("#btn-clear").on("click", function() {
    $("#search-input").val("")
    $("#search-display").empty()
    $(".search-results").hide()
    $(".movies-template, .tv-template").show()
  })

  const $body = $("body")
  const $themeBtn = $("#btn-theme")

  $themeBtn.on("click", function () {
    $body.toggleClass("dark")
    
    const isDark = $body.hasClass("dark")
    $themeBtn.html(isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>')
  })
  $themeBtn.html('<i class="fa-solid fa-moon"></i>')
  
// /////HAMBURGER MENU

//   const $mobileNavbar = $(".mobile-navbar")
//   const $hamburgerBtn = $(".hamburger-menu")

//   $hamburgerBtn.on("click", function() {
//     $mobileNavbar.toggleClass("open")
//   })

//   $(".mobile-nav-links a").on("click", function() {
//     $mobileNavbar.removeClass("open")
//   })
})

