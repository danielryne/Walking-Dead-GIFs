
//Global variable for handling the main query 
var query; 

// Array to hold the buttons we are creating 
var buttons = ["Daryl", "Rick", "Glenn", "Negan", "Carl", "Maggie", "Rosita", "Michonne", "Carol", "Eugene", "Tyreese", "Abraham"];

// Function to create buttons from values in the array 
function createbuttons() {
        
        // Empties button area 
        $("#buttons").empty();

        // Loops through array to create buttons 
        for (var i = 0; i < buttons.length; i++) {
            var button = $("<button>"); //creates button element
            button.text(buttons[i]); //adds text to the button 
            button.addClass("btn spacing"); //smooth buttons edges
            button.addClass("creategifs"); //appends a class "creategifs" to help us call a function
            button.data("subject", buttons[i]); //creates a data element for the button
            $("#buttons").append(button); //prints 
        }
    }

createbuttons(); //Creates the buttons before the javascript is loaded 

$(document).ready(function() { //loads html and css before start of program 
	
	$("#addsearch").on("click", function() {

        //Prevents page from going back to default setting
        event.preventDefault();

        //Grabs the input from the user and assigns it to a variable 
        var input= $("#searchinput").val();

        //Checks to see if there's input and if the button has already been created (indexof)
        if (input!="" && buttons.indexOf(input)=== -1)
        {
          buttons.unshift(input); //pushed input to top of array
          createbuttons(); //reprints the buttons
        }
    });

    $(document).on("click", ".creategifs", function() {

        //checks to see if the new subject was last search, if so does nothing
    	if(query === $(this).data("subject")){
    		return;
        }
        else { //runs the search for gifs 

        	query = $(this).data("subject"); //pulls data from the button
        	gifplaying = undefined;
            
        	$("#searchID").html(query);  //Prints the search sujbect at top of results section

            //replaces spaces with + symbol for query syntax 
        	while (query.indexOf(" ")!=-1)
        	{
        		query = query.replace(" ","+");
        	}	

            //creates the queryURL, adds "walking+dead" to query," replaces some characters with relevant UTF-8 encoding
        	var queryURL = "https://api.giphy.com/v1/gifs/search?q="+ encodeURI(query) + "+walking+dead" + "&limit=10&api_key=06c276e97c50477f8d06b3a5e345c11c";
        	
            //runs the query using Ajax, prints the images to #results area
            $.ajax({
          		url: queryURL,
         		 method: 'GET'
        	}).done(function(response) {

                //loop to print the results 
        		for (var i = 0; i < response.data.length; i++) {

                    //creates an image 
                    var img = $("<img>");
                    $(img).attr("src", response.data[i].images.fixed_width_still.url); //just the image
                    $(img).data("giphyData", response.data[i]); //guides image behavior
                    $(img).data("playing", false); //will act as a variable to indicate whether gif is playing 
                    $(img).addClass("play"); //allows us to select the gif to play 

                    //creates the div that will house the image, adds rating  
        			var result = $("<div>");
                    $(result).addClass("result");
                    $(result).append(img);
                    $(result).append('<br>rating: '+ response.data[i].rating);

                    //Prints results to page 
        			$("#results").append(result); 
        		}	
        	});
        }
    });

    //logic governing the playing of GIFs
    $(document).on("click", ".play", function() {
    	
        if ($(this).data("playing") == true) {
            $(this).attr("src", $(this).data("giphyData").images.fixed_width_still.url); 
            $(this).data("playing", false); //flags that gif is no longer playing 
        }
        else {
            $(this).attr("src", $(this).data("giphyData").images.fixed_width.url);
            $(this).data("playing", true); //flags that gif is playing 
        }

    });

});