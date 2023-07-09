
function shakeElements(obj) {
    obj.addClass('shake');
        setTimeout(function(){
            obj.removeClass('shake');
    },400);
}

function fadeToHide(obj) {
    obj.addClass('fade');
        setTimeout(function(){
            obj.hide();
            checkCardEnergy();
    },400);
}

function bounceElements(obj) {
    obj.addClass('bounce');
        setTimeout(function(){
            obj.removeClass('bounce');
    },800);
}

function callToast(content, direction) {
    // Create a toast element with the given content
    let toast;

    if (direction == 'top') {
        toast = $('<div class="toast-banner top"></div>').html(content);
    }
    if (direction == 'bottom') {
        toast = $('<div class="toast-banner bottom"></div>').html(content);
    }

    $('body').append(toast);
    toast.css('display', 'none');
    
    toast.fadeIn(400, function() {
      setTimeout(function() {
        toast.fadeOut(400, function() {
          toast.remove();
        });
      }, 3000);
    });
  }


  var audioButton = $('#audioButton');
  var audio = new Audio('soundtrack.mp3');
  audio.loop = true;
  
  var playIcon = $('#playIcon');
  var pauseIcon = $('#pauseIcon');
  
  audioButton.on('click', function () {
    if (audio.paused) {
      playIcon.hide();
      pauseIcon.show();
      audio.play();
    } else {
      pauseIcon.hide();
      playIcon.show();
      audio.pause();
    }
  });
  

  function showOverlay() {
    // clearInterval(timerInterval);
    $('.overlay-cont').css('height','100%');
    $('.overlay-cont').css('top','0%');
    $('.overlay-cont').css('box-shadow','0 0 50px -10px rgba(0,0,0,0.9)')
    $('.overlay-cont').show();
  }
  