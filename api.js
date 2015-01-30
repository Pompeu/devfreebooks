module.exports = function() {
  var harp = require("./harp.json")
    , fs = require("fs")
    , image_root_url = harp.globals.root_url[process.env.NODE_ENV] + "assets/images/"
    , output_path = process.env.NODE_ENV == "production" ? "www" : "public"
    , menu = {
        total_platforms: 0,
        total_free_books: 0,
        platforms: []
    }
  ;

  console.log("Generating static platforms json...");
  harp.globals.platforms.forEach(function(platform_name) {
    var platform = require("./public/"+ platform_name +"/_data.json")["index"];
    platform.image = image_root_url + platform.image;
    platform["books"] = platform.books.filter(function(book) {
      return book.publish;
    });
    platform.books.forEach(function(book, index) {
      book.name = book.title.toLowerCase().replace(/[\s.]+/g, "_");
      book.lang = book.lang.toUpperCase();
      book.featured = !!book.featured;
      book.url = book.url + (book.url.indexOf("?") >= 0 ? "&" : "?") + harp.globals.utm;  
      if (book.image) {
        book.image = image_root_url + book.image;
      } else {
        book.image = platform.image;
      }
    });

    var platform_total_books = platform.books.length;
    
    menu["platforms"].push({
      name: platform.name,
      title: platform.title,
      url: harp.globals.root_url[process.env.NODE_ENV] + platform.name,
      about: platform.about,
      category: platform.category,
      image: platform.image,
      total_books: platform_total_books
    });
    menu["total_free_books"] = menu.total_free_books + platform_total_books;

    var output = "./"+ output_path +"/api/"+ platform_name +".json";
    console.log(output);
    fs.writeFileSync(output, JSON.stringify(platform));
  });
  menu["total_platforms"] = menu.platforms.length;
  var output = "./"+ output_path +"/api/menu.json";
  console.log(output);
  fs.writeFileSync(output, JSON.stringify(menu));
  console.log("Platform json are done!");
};
