var rest = require('restler')
 , async = require('async')
 , cache = require('memory-cache')
 ,  i18n = require("i18n");

/**
 * @author Pirhoo
 * @description Home route binder
 *
 */
module.exports = function(app, db, controllers) {

	/*
	 * GET home page.
	 */
	app.get('/', function(req, res){

		module.exports.getPosts(function(posts) {

		  res.render('index.jade', 
				{ 
					title: 'Journalism++', 
					stylesheets: [
						 "/stylesheets/vendor/bootstrap-build/bootstrap.min.css"
						,"/stylesheets/vendor/bootstrap-build/bootstrap-responsive.min.css"
						,"/stylesheets/vendor/slabtext.css"
						,"http://fonts.googleapis.com/css?family=Share:400,700|Leckerli+One|Averia+Sans+Libre:400,700,300,300italic,400italic,700italic"
						,"/stylesheets/style.less"
					], 
					javascripts: [
						  "/javascripts/vendor/bootstrap/bootstrap.min.js"																
						, "/javascripts/vendor/iScroll.class.js"																
						, "/javascripts/vendor/jquery.scrollTo-min.js"																
						, "/javascripts/vendor/jquery.µSlide.js"																	
						, "/javascripts/vendor/jquery.lettering-0.6.1.min.js"											
						, "/javascripts/vendor/jquery.slabtext.min.js"																
						, "/javascripts/vendor/glfx.js"																	
						, "/javascripts/global.js"																	
					],
					posts: posts
				}
			);
		});

	});

};

/**
 * @author Pirhoo
 * @description Get the posts from the API or from the cache
 */
module.exports.getPosts = function(complete) {

  async.series([
    // Get data from cache first
    function getFromCache(fallback) {      
      // Get the course from the cache
      if( cache.get('posts-list') ) complete( cache.get('posts-list') );
      // Or get the colletion from the fallback function
      else fallback();
    },
    // Get data from the API 
    function getFromAPI() {

      // get_category_index request from the external "WordPress API"
      rest.get("http://jplusplus.oeildupirate.com/?count=100&json=1&custom_fields=siteurl").on("complete", function(data) {

      	// Filters custom fields
      	for(var index in data.posts) {
      		var post = data.posts[index];
      		post.siteurl = post.custom_fields.siteurl ? post.custom_fields.siteurl[0] : false;
      	}

        // Put the data in the cache 
        cache.put('posts-list', data.posts);

        // Call the complete function
        complete( data.posts );

      });
    }        
  ]);

};
