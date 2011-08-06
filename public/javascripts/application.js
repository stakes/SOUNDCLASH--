$.ajaxSetup({
  beforeSend: function(xhr) {
    xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
  }
});

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
            
        }
        
    },
    
    /* Do these within a controller */
    'home': {
        
        'landing': function() {
            
            data = {};
            init = new EJS({url: '/javascripts/views/initial_form.ejs'}).render(data)
            $('#start-form-container').append(init);
            $('#start-artist').live('submit', function() {
                $.post('/api/similar_with_tracks',
                    $('#start-artist').serialize(),
                    function(data) {
                        createBattleView(data);
                    }
                );
                return false;
            })
            
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
  
  createArtistBlock(artistList[0]);
  createArtistBlock(artistList[1]);
  
};


createArtistBlock = function(artist) {
    
    console.log('create block for '+artist.name);
    console.log('artist info: '+artist);
    block = new EJS({url: '/javascripts/views/artist_block.ejs'}).render(artist[0]);
    $('#battle-container').append(block);
    return false;
    
};


createPlaylistView = function() {

    
};


updatePlaylistView = function(artist) {
  
    
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