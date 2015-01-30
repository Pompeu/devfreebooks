(function() {
  var toggle = document.querySelector(".navbar-toggle")
    , collapse = document.querySelector(".navbar-collapse")
    , dfbURL = document.querySelector("[data-dfb-url]")
    , dfbTemplate = document.querySelector("[data-dfb-template]")
    , filterCategory = document.querySelectorAll("[data-dfb-category]")
  ;

  toggle.addEventListener("click", function() {
    if (collapse.classList.contains("hidden-xs")) {
      collapse.classList.remove("hidden-xs");
    } else {
      collapse.classList.add("hidden-xs");
    }
  });
  
  for (var i = 0, len = filterCategory.length || 0; i < len; i++) {
    filterCategory[i].addEventListener("click", function(e) {
      var data = JSON.parse(localStorage.getItem('devfreebooks'))
        , category = e.target.getAttribute("data-dfb-category")
        , template = dfbTemplate.getAttribute("data-dfb-template")
        , dfbType = e.target.getAttribute("data-dfb")
        , hasItems = true
      ;
      if (dfbType === "platform") {
        if (category) {
          data.platforms = data.platforms.filter(function(platform) {
            return platform.category == category;
          });
          hasItems = data.platforms.length > 0;
        }
      }
      if (hasItems) {
        dfbTemplate.innerHTML = DFB[template](data);
      } else {
        dfbTemplate.innerHTML = "<div class='result-status'><h3>Nothing was found here :(</h3></div>";
      }
    });
  }

  var shuffle = function(collection) {
    collection && collection.sort(function() { return Math.random() - 0.5; });
  };

  var renderTemplate = function() {
    if (dfbURL && dfbTemplate) {
      var url = dfbURL.getAttribute("data-dfb-url")
        , template = dfbTemplate.getAttribute("data-dfb-template")
      ;
      request = new XMLHttpRequest();
      request.open('GET', url, true);

      request.onload = function() {
        var data = JSON.parse(request.responseText);
        data.platforms && shuffle(data.platforms);
        dfbTemplate.innerHTML = DFB[template](data);
        localStorage.setItem('devfreebooks', request.responseText);
      };
      request.send();
    }
  };

  renderTemplate();

})();
