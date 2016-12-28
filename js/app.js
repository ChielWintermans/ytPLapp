// global variables
var ytResults=[];
var pageToken;
var clipsDone=0; 
var ytPlaylistID='PLpmQJ2D10iJx_GEYNZwAON38cluj0dNj4';

// function to create clip objects
var clip=function(data){
	this.clipTitle=ko.observable(data.title);
};

function Model(){
	var self=this;
	//Create an observable array to store a list of clip objects
	self.clipList=ko.observableArray([]);
	self.clipCount=ko.observable('');
}
var model =new Model();

function ViewModel(){
	var self = this;
	self.errorMessage=ko.observable('');
	self.loadPlaylist=ko.observable('');
	errorHandling=function(){
		self.errorMessage("Can't load the list and app");
	};

	fillList=function(){
	    for(i=0;i<ytResults.length;i++){
	    	var clipData={
	    		title: ytResults[i]
	    	};
	    	model.clipList.push(new clip(clipData));
	    };
	};

	var ytConnector=(function(){
	    var searchYtRequest=function(requestPayload, callback){
		  	$.ajax({
		  		url: requestPayload.url,
		   		type: requestPayload.method,
		   	}).done(function(data){
		   		model.clipCount(data.pageInfo.totalResults);
		   		ytResults.length=0;
		   		for(i=0;i<data.items.length;i++){
		   			ytResults=ytResults.concat(data.items[i].snippet.title);
		   		};
		   		fillList();
		   		pageToken=data.nextPageToken;
		   		clipsDone=clipsDone+50;
	   		  	if(clipsDone<model.clipCount){
  					ytConnector.fetchDataFromYt();
				};
		    }).fail(function(jqxhr, textStatus, error) {
		      	// Let empty results set indicate problem with load.
		      	// If there is no callback - there are no UI dependencies
		      	self.errorMessage("Failed to load: " + textStatus + ", " + error);
		   	}).always(function() {
		   		typeof callback === 'function' && callback(ytResults);
		   	});
	    };
	    // get playlist data from youtube
 	    function fetchDataFromYt(){
 	    	if(pageToken!=null){
 	    		thisUrl='https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId='+ytPlaylistID+'&key=AIzaSyBFrCeUpPitoT6eOk_mq6Uza6etWtAH0oQ&pageToken='+pageToken;
 	    	}else{
 	    		thisUrl='https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId='+ytPlaylistID+'&key=AIzaSyBFrCeUpPitoT6eOk_mq6Uza6etWtAH0oQ';
 	    	};
		    var requestData = {
		    	url: thisUrl,
		    	method: 'GET',
		   	};
		    searchYtRequest(requestData);
		}return{
		   	fetchDataFromYt: fetchDataFromYt,
	  	};
  	})();
	ytConnector.fetchDataFromYt();

	thisPlaylist=function(){
		model.clipList().length=0;
		pageToken=null;
		ytPlaylistID=self.loadPlaylist();
		ytConnector.fetchDataFromYt();
	};
}
ko.applyBindings(new ViewModel());

// PLpmQJ2D10iJzd1SPy7FlaaBFt07fhLSL3