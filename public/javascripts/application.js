$.ajaxSetup({
  beforeSend: function(xhr) {
    xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
  }
});

GLOBAL = window.GLOBAL || {};
if (typeof GLOBAL.playlist == 'undefined') {
	GLOBAL.playlist = [];
};
if (typeof GLOBAL.similar_str == 'undefined') {
    GLOBAL.similar_str = '';
}
if (typeof GLOBAL.apiswf == 'undefined') {
    GLOBAL.apiswf = null;
}


/* FUNCTIONS
 * This object contains global and view-specific js
*/

APPDISPATCHER = {
    
    /* Do these everywhere! */
    'common': {
    
        'init': function() {
        
            APPOBJ = window.APPOBJ || {};
            if (typeof APPOBJ == 'undefined') {
            	APPOBJ = {};
            };
            
            // on page load use SWFObject to load the API swf into div#apiswf
            var flashvars = {
              'playbackToken': playback_token, // from token.js
              'domain': domain,                // from token.js
              'listener': 'callback_object'    // the global name of the object that will receive callbacks from the SWF
              };
            var params = {
              'allowScriptAccess': 'always'
            };
            var attributes = {};
            swfobject.embedSWF('http://www.rdio.com/api/swf/', // the location of the Rdio Playback API SWF
                'apiswf', // the ID of the element that will be replaced with the SWF
                1, 1, '9.0.0', 'expressInstall.swf', flashvars, params, attributes);

            // set up the controls
            $('.play').live('click', function(evt) {
                track_id = $(this).parent().parent().data('tid');
                GLOBAL.apiswf.rdio_play(track_id);
                evt.preventDefault();
            });
            $('.pause').live('click', function(evt) {
                evt.preventDefault(); 
                GLOBAL.apiswf.rdio_pause(); 
            });
            
        }
        
    },
    
    /* Do these within a controller */
    'home': {
        
        'landing': function() {
            
            data = {};
            init = new EJS({url: '/javascripts/views/initial_form.ejs'}).render(data)
            $('#start-form-container').append(init);
            $('#start-artist').live('submit', function() {
                $('#search-artist').fadeOut(500);
                $('#start-artist').fadeOut(500);
                $('#text-container').fadeOut(500);
                $("#loader-container").fadeIn(500);
                
                $.post('/api/similar_with_tracks',
                    $('#start-artist').serialize(),
                    function(data) {
                        if (data.error) {
                            $('#search-artist').fadeIn(1000);
                            $('#start-artist').fadeIn(1000);
                        } else {
                            createBattleView(data);
                        }
                    }
                );
                return false;
            });
            $('#search-artist').live('submit', function() {
                $('#search-artist').fadeOut(500);
                $('#start-artist').fadeOut(500);
                $('#text-container').fadeOut(500);
                $("#loader-container").fadeIn(500);
                
                $.post('/api/search',
                    $('#search-artist').serialize(),
                    function(data) {
                        console.log(data.error);
                        if (data.error) {
                            $('#search-artist').fadeIn(1000);
                            $('#start-artist').fadeIn(1000);
                        } else {
                            createBattleView(data);
                        }
                    }
                );
                return false;
            });
            
            $('.artist-block a.like-this').live('click', function(evt) {
                selectArtist($(this));
                evt.preventDefault();
            })
            
            $('#playlist-link').live('click', function(evt) {
                if ($(this).html() == 'Share my playlist') {
                    $('#playlist-preview').fadeOut();
                    $('#playlist-container').animate({
                        height: '100%'
                    }, 1000, function() {
                        revealFullPlaylist();                        
                    });
                    $(this).html('Hide my playlist');
                } else {
                    hideFullPlaylist();
                    $('#playlist-container').animate({
                        height: 140
                    }, 1000, function() {
                        $('#playlist-preview').fadeIn();                        
                    }); 
                    $(this).html('Share my playlist');             
                }
                $.post('/api/save',
                    {tracks: GLOBAL.playlist},
                    function(data) {
                        $('#playlist-share').fadeIn(1000);
                        $('#playlist-url').html('http://soundclash.herokuapp.com/playlist/'+data.url);
                    }
                )
                evt.preventDefault(); 
            });
            
        },
        
        'new' : function() {
            
            
        },
        
        'create': function() {

            
        },        
        
        'edit': function() {
       
            
        },
        
        'update': function() {
            
            
        }
        
    },
    
    /* Do these on login view */
    'devise/sessions': {
        
        'init': function() {
         
            
        }
    
    },
    
    /* Do these on signup view */
    'devise/registrations': {
        
        'new': function() {
         
            
        },
        
        'edit': function() {
            
            
        },
        
        'update': function() {
            
            
        }
    
    },
    
    /* Do these on password reminder view */
    'devise/passwords': {
        
        'init': function() {
         
            
        }
    
    },
    
};



artistIdsToArray = function(response) {
    
    array = [];
    $.each(response.artists, function(index, value) {
        astr = value.foreign_ids[0].foreign_id;
        aid = astr.slice(astr.lastIndexOf(':')+1);
        array.push(aid)
    });
    return array;
   
}


createBattleView = function(artistList) {
  
  // $('#battle-container').fadeOut(1000, function() {
      $("#loader-container").fadeOut(500);
      $('#battle-container').html('');
      createArtistBlock(artistList[0]);
      $('#battle-container').append('<span class="vs">VS.</span>')
      createArtistBlock(artistList[1]);
      $('#vs-container').fadeIn(500);
  // })
  
};


createArtistBlock = function(artist) {
    
    block = new EJS({url: '/javascripts/views/artist_block.ejs'}).render(artist[0]);
    $('#battle-container').append(block);
    return false;
    
};

selectArtist = function(el) {

    $('#vs-container').fadeIn(500);
    if ($("#playlist-container").length > 0) {
      createPlaylistView();
    };
    $('#playlist-container').animate({
        height: 140
    });
    tgt = el.parent().parent();
    obj = {};
    obj.aid = tgt.data('aid');
    obj.tid = tgt.data('tid');
    obj.artist = tgt.data('artist');
    obj.track = tgt.data('track');
    obj.image = tgt.find('img').attr('src');
    GLOBAL.playlist.push(obj);
    GLOBAL.apiswf.rdio_stop();
    updatePlaylistView(obj);
    $('#battle-container').html('');
    $("#loader-container").fadeIn(500);
    refineNextSelection();
    
};

refineNextSelection = function() {
  
    arr = []
    $.each(GLOBAL.playlist, function(index, value) {
        arr.push(value.artist);
    });
    if (arr.length > 5) {
        arr = arr.splice(arr.length-5);
    }
    console.log('array: '+arr)
    $.post('/api/similar_with_tracks',
        {artists_array: arr, type: 'artist_string'},
        function(data) {
            createBattleView(data);
        }
    );  
    
};


createPlaylistView = function() {

    data = {}
    block = new EJS({url: '/javascripts/views/playlist.ejs'}).render(data);
    $('#playlist-preview').append(block);
    
};


updatePlaylistView = function(artist) {
  
    block = new EJS({url: '/javascripts/views/playlist_item.ejs'}).render(artist);
    $('#playlist').append(block);
    
};

showLoader = function() {
    el = '<img src="/images/facebox/loader.gif" />'
    
}

hideFullPlaylist = function() {
    
    $('#playlist-main').html('');
    
    
};

revealFullPlaylist = function() {
    
    $.each(GLOBAL.playlist, function(index, value) {
      
      createPlaylistLine(value);  
        
    });
    
};

createPlaylistLine = function(artist) {
    
    console.log('line item')
    block = new EJS({url: '/javascripts/views/list_item.ejs'}).render(artist);
    $('#playlist-main').append(block);
    
};






/* FUNCTIONS */

displayFlashMessage = function() {
 
    $('#flash-message-container').hide();
 
    if ($('#flash-message-container').html() != '') {
    
        /* Show/hide ye olde Flash message */
        var flash_div = $('#flash-message-container');

        flash_div.show(); 
        setTimeout(function() { 
               flash_div.slideUp(1000, 
               function() { 
                       flash_div.html(""); 
                       flash_div.hide();
               });
        }, 
        3000);
        
    }
    
}



/* VALIDATORS */


validateSigninForm = function(evt) {
  
    var validator = $("#user_new").validate({
        rules: { 
            'user[email]': {
                required: true,
                email: true
            },
            'user[password]': "required"
        }
    })
  
};


validateSignupForm = function(evt) {
  
    var validator = $("#user_new").validate({
        rules: { 
            'user[email]': {
                required: true,
                email: true
            },
            'user[password]': {
                required: true,
                minlength: 6
            },
            'user[password_confirmation]': {
                required: true,
                minlength: 6,
                equalTo: '#user_password'
            }
        }
    })
  
};

simulateValidationError = function(tgt, msg) {
  
    tgt.addClass('error');
    tgt.after('<label for="'+tgt.attr('id')+'" generated="true" class="error simulated">'+msg+'</label>');

};

clearSimulatedError = function(tgt) {

    tgt.removeClass('error');
    tgt.next('.error.simulated').remove();
    
};



/* RDIO shit */

// the global callback object
var callback_object = {};

callback_object.ready = function ready() {
  // Called once the API SWF has loaded and is ready to accept method calls.

  // find the embed/object element
  GLOBAL.apiswf = $('#apiswf').get(0);

}




/* UTILS
 * This looks for body data-controller= and data-action= attributes and 
 * calls corresponding methods of the APPDISPATCHER object
*/

UTIL = {
  exec: function( controller, action ) {
    var ns = APPDISPATCHER,
        action = ( action === undefined ) ? "init" : action;

    if ( controller !== "" && ns[controller] && typeof ns[controller][action] == "function" ) {
      ns[controller][action]();
    }
  },

  init: function() {
    var body = document.body,
        controller = body.getAttribute( "data-controller" ),
        action = body.getAttribute( "data-action" );

    UTIL.exec( "common" );
    UTIL.exec( controller );
    UTIL.exec( controller, action );
  }
};

$(document).ready(UTIL.init());