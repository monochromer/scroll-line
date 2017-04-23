(function(){
  // helpers
  var $ = document.querySelector.bind(document);
  Node.prototype.on = window.on = function(event, fn) {
      this.addEventListener(event, fn, false);
  };

  var scrollLine = new ScrollLine();

  var $sceneIntro = $('.js-scene--intro'),
      $sceneOutro = $('.js-scene--outro'),
      $sceneAlice = $('.js-scene--alice'),
      $elContent  = $('.js-content'),
      $elTitle    = $('.js-title'),
      $elTrack    = $('.js-timeline-track');

  var introBox   = $sceneIntro.getBoundingClientRect(),
      outroBox   = $sceneOutro.getBoundingClientRect(),
      aliceBox   = $sceneAlice.getBoundingClientRect(),
      contentBox = $elContent.getBoundingClientRect(),
      titleBox   = $elTitle.getBoundingClientRect();

  var scenes = scrollLine._scenes;

  // Add intro scene animation to timeline
  scrollLine.addScene({
    min: introBox.top,
    max: introBox.height / 4,
    freeze: false,
    fn: function(progress) {
      if (this.freeze) return;
      var opacity = 100 - progress * 100;
      $sceneIntro.style['-webkit-filter'] = 'opacity(' + opacity + '%)';
      $sceneIntro.style['visibility'] = (opacity === 0) ? 'hidden' : 'visible';
      // remove this scene after the fade-out
      if (progress === 1) scenes.splice(0, 1);
      // window.requestAnimationFrame(function() {
      // });
    }
  });

  // Add Alice scene offset animation to timeline
  scrollLine.addScene({
    // chain after prev animation
    min: scenes[scenes.length - 1].max + aliceBox.top,
    max: scenes[scenes.length - 1].max + aliceBox.top + aliceBox.height,
    freeze: false,
    fn: function(progress) {
      if (this.freeze) return;
      var maxOffset = aliceBox.height - window.innerHeight;
      // var offset = -1 * Math.ceil((maxOffset * progress) / 100);
      var offset = -1 * Math.ceil((maxOffset * progress));
      $sceneAlice.style['transform'] = 'translate3d(0, ' + offset + 'px, 0)';
      // window.requestAnimationFrame(function() {
      // })
    }
  });

  // Add text offset animation to timeline
  scrollLine.addScene({
    min: scenes[scenes.length - 1].min * 1.4  + contentBox.top,
    max: scenes[scenes.length - 1].min * 1.4 + contentBox.top + contentBox.height,
    freeze: false,
    fn: function(progress) {
      if (this.freeze)  return;
      var maxOffset = aliceBox.height - contentBox.top;
      // var offset = Math.ceil((maxOffset * progress) / 100);
      var offset = Math.ceil((maxOffset * progress));
      $elContent.style['margin-top'] = offset + 'px';
      // window.requestAnimationFrame(function() {
      // })
    }
  });

  // Add fade-to-black animation to timeline
  scrollLine.addScene({
    min: scenes[scenes.length - 1].max * 0.85, // early start
    max: scenes[scenes.length - 1].max, // quick transition
    freeze: false,
    fn: function(progress) {
      if (this.freeze) return;
      var opacity = progress * 100;
      $sceneOutro.style['-webkit-filter'] = 'opacity(' + opacity + '%)';
      $sceneOutro.style['visibility'] = (opacity === 0) ? 'hidden' : 'visible';

      if (progress === 1) {
        $sceneOutro.classList.add('complete')
      } else {
        $sceneOutro.classList.remove('complete')
      }
      // window.requestAnimationFrame(function() {
      // })
    }
  });

  function setup() {
    /*
      All scenes are `position: fixed`. The .timeline-track el is a placeholder
      to create artificial height so the page can be scrolled.

      Set .timeline-track height to the maximum extent that needs to be reched
      by the scroll.
    */
    var max = 0;

    scenes.forEach(function(t) {
      max = (max < t.max) ? t.max : max;
    });

    $elTrack.style.height = window.innerHeight + Math.round(max) + "px";
  }

  // feature detection
  ['shape-outside'].forEach(function(property) {
    // check if any variant exists, prefixed or not
    var isCapable = ['', '-webkit-', '-moz-', '-ms-'].some(function(prefix){
      return (prefix + property) in document.body.style;
    })

    if (isCapable) {
      document.documentElement.classList.add('shapes');
      setup();
    }
  });

})();
