/*!
 * Simple Video JavaScript Library v0.1
 * https://github.com/brimanning/simplevideo
 *
 * Uses jQuery.js
 * http://jquery.com/
 *
 * Uses swfobject.js
 * https://code.google.com/p/swfobject
 *
 * Copyright 2014 Brian Manning
 * Released under the MIT license
 *
 * Date: 8/14/2014
 */

(function (w, $) {
  var
    defaultOpts = {
      src: null,
      autoplay : false,
      poster: null,
      controls: false,
      loop: false,
      onPlay: null,
      onPause: null,
      onEnded: function() {
        if (utils.checkExists(video) && utils.checkExists(video.setTime)) {
          video.setTime(0);
        }
      },
      showDefaultControlsOnMobile : true,
      onPlaying: null,
      onPlayingInterval: 30,
      swfobjectUrl: 'swfobject.js',
      swfUrl: 'simplevideo.swf',
      playerProductInstallSwfUrl: 'playerProductInstall.swf'
    },
    optsList = [
      'src',
      'autoplay',
      'poster',
      'controls',
      'loop',
      'onPlay',
      'onPause',
      'onEnded',
      'showDefaultControlsOnMobile',
      'onPlaying',
      'onPlayingInterval',
      'swfobjectUrl',
      'swfUrl',
      'playerProductInstallSwfUrl'
    ],
    attrsList = [
      'src',
      'autoplay',
      'poster',
      'controls',
      'loop'
    ],
    utils = {},
    setUpVideoElement = function(options, opt) {
      var video = {};
      video.paused = true;
      video.needsFlash = false;

      if (options.target instanceof jQuery) {
        video.target = options.target;
      } else if (typeof options.target === 'string') {
        video.target = $(options.target);
      }

      if (!video.target.is('video')) {
        video.target.append('<video class="simplevideo"></video>');
        video.target = video.target.find('video.simplevideo');
      } else {
        video.target.addClass('simplevideo');
      }

      if (video.target[0].canPlayType('video/mp4') === '') {
        video.needsFlash = true;
      }

      video.getCurrentTime = function() {
        var currentTime;
        if (video.needsFlash) {
          currentTime = video.swf.getCurrentTime();
        } else {
          currentTime = video.target[0].currentTime;
        }
        return currentTime;
      };

      video.getDuration = function() {
        var duration;
        if (video.needsFlash) {
          duration = video.swf.getDuration();
        } else {
          duration = video.target[0].duration;
        }
        return duration;
      };

      video.setCurrentTime = function(time) {
        if (typeof time === 'string' && time.indexOf('%') > 0) {
          time = utils.sanitizePercent(time) * video.getDuration();
        }

        if (video.needsFlash) {
          video.swf.setCurrentTime(time);
        } else {
          video.target[0].currentTime = time;
        }

        return video.getCurrentTime();
      };

      video.getVolume = function() {
        var volume;
        if (video.needsFlash) {
          volume = video.swf.getVolume();
        } else {
          volume = video.target[0].volume;
        }
        return volume;
      };

      video.setVolume = function(volume) {
        if (video.needsFlash) {
          video.swf.setVolume(utils.sanitizePercent(volume));
        } else {
          video.target[0].volume = utils.sanitizePercent(volume);
        }

        return video.getVolume();
      };

      video.play = function() {
        if (video.needsFlash) {
          video.swf.play();
          video.paused = false;
          utils.ifFunctionExecute(opt.onPlay);
        } else {
          video.target[0].play();
          video.paused = video.target[0].paused;
        }

        if (timeInterval === null) {
          timeInterval = setInterval(function () {
            if (utils.checkExists(opt.onPlaying) && typeof opt.onPlaying === 'function') {
              opt.onPlaying(video.getCurrentTime(), video.getDuration());
            }
          }, opt.onPlayingInterval);
        }
      };

      video.pause = function() {
        clearInterval(timeInterval);
        if (video.needsFlash) {
          video.swf.pause();
          video.paused = true;
          utils.ifFunctionExecute(opt.onPause);
        } else {
          video.target[0].pause();
          video.paused = video.target[0].paused;
        }
      };

      return video;
    },
    timeInterval = null,
    ended = function(video, opt) {
      video.paused = true;
      clearInterval(timeInterval);
      timeInterval = null;
      utils.ifFunctionExecute(opt.onEnded);

      if (utils.checkExists(opt.loop) && opt.loop) {
        video.setTime(0);
        video.play();
      }
    },
    processOptions = function(video, options, opt) {
      for (var i = 0, l = optsList.length; i < l; i++) {
        opt[optsList[i]] = utils.checkExists(options[optsList[i]]) ? options[optsList[i]] : defaultOpts[optsList[i]];
        if ((!utils.checkExists(opt[optsList[i]]) || !utils.checkExists(options[optsList[i]])) && attrsList.indexOf(optsList[i]) > -1) {
          opt[optsList[i]] = utils.checkExists(video.target.attr(attrsList[i])) ? video.target.attr(attrsList[i]) : defaultOpts[optsList[i]];
          //handle case where the attribute doesn't have a value (defaults true)
          if (opt[optsList[i]] === attrsList[i]) {
            opt[optsList[i]] = true;
          }
        }
      }

      if (!utils.checkExists(opt.src) && video.target.find('source').length > 0 && utils.checkExists(video.target.find('source').attr('src'))) {
        opt.src = video.target.find('source').attr('src');
      }

    },
    setUpFlashPlayer = function(video, opt) {
      utils.checkSWFObject(opt, function() {
        video.swfId = utils.generateGuid();
        video.target.replaceWith('<div class="simplevideo"><div id="' + video.swfId + '"></div></div>');
        var flashVars = {},
          params = {
            quality: 'high',
            bgcolor: '#ffffff',
            allowscriptaccess: 'always',
            allowfullscreen: 'true',
            wmode: 'transparent'
          },
          attributes = {
            id: video.swfId,
            name: video.swfId,
            align: 'middle'
          };
        w.swfobject.embedSWF(
          opt.swfUrl,
          video.swfId,
          '100%',
          '100%',
          //TODO: determine minimum version
          '11.4.0',
          opt.playerProductInstallSwfUrl,
          flashVars,
          params,
          attributes,
          function(e) {
            video.swf = e.ref;
            console.log(e.ref);

            w.simpleVideoSwfReady = function () {
              if (opt.autoplay) {
                video.play();
              }
            };

            w.simpleVideoSwfEnded = function () {
              //swf has the habit of calling this twice
              if (!video.paused) {
                ended(video, opt);
              }
            };

            //even though the swf should be ready, it isn't always
            var inter = setInterval(function () {
              if (utils.checkExists(video.swf.init)) {
                clearInterval(inter);
                video.swf.init(opt.src);
              }
            }, 10);
          }
        );
      });

    },
    setUpHTML5Player = function(video, opt) {
      video.target.html('<source src="' + opt.src + '" type="video/mp4" />');
      if (utils.checkExists(opt.poster)) {
        video.target.attr('poster', opt.poster);
      }
      video.target.prop('loop', opt.loop);
      video.target.prop('autoplay', opt.autoplay);
      video.target.prop('controls', opt.controls);
      video.target[0].load();

      if (opt.autoplay) {
        video.play();
      }

      video.target.bind('ended', function() {
        ended(video, opt);
      });

      video.target.bind('pause', function() {
        utils.ifFunctionExecute(opt.onPause);
      });

      video.target.bind('play', function() {
        utils.ifFunctionExecute(opt.onPlay);
      });
    };

  w.simplevideo = {};

  utils.resizeFunctions = [];
  utils.addEventOnWindowResize = function (f) {
    $(w).bind('resize', f);
    utils.resizeFunctions.push(f);
    f();
  };

  utils.runWindowResizeEvents = function () {
    for (var i = 0, l = utils.resizeFunctions.length; i < l; i++) {
      utils.resizeFunctions[i]();
    }
  };

  utils.checkSWFObject = function (opts, cb) {
    if (typeof w.swfobject === 'undefined' || w.swfobject === null) {
      $.getScript(opts.swfobjectUrl, function () {
        utils.ifFunctionExecute(cb);
      });
    } else {
      utils.ifFunctionExecute(cb);
    }
  };

  utils.checkExists = function(obj) {
    return typeof obj !== 'undefined' && obj !== null;
  };

  utils.ifFunctionExecute = function(obj) {
    if (utils.checkExists(obj) && typeof obj === 'function') {
      obj();
    }
  };

  utils.sanitizePercent = function(p) {
    if (typeof p === 'string') {
      if (p.indexOf('%') > 0 && parseInt(p, 10) <= 100 && parseInt(p, 10) >= 0) {
        p = parseInt(p, 10) / 100;
      } else if (parseInt(p, 10) > 100) {
        p = 1;
      } else if (parseInt(p, 10) < 0) {
        p = 0;
      }
    }

    return p;
  };

  utils.generateGuid = function() {
    function fourString() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    return fourString() + fourString() + '-' + fourString() + '-' + fourString() + '-' + fourString() + '-' + fourString() + fourString() + fourString();
  };

  w.simplevideo.init = function(options) {
    var opt = {},
      video = setUpVideoElement(options, opt);

    if (utils.checkExists(video.target) && video.target.length > 0) {
      processOptions(video, options, opt);

      if (video.needsFlash) {
        setUpFlashPlayer(video, opt);
      } else {
        setUpHTML5Player(video, opt);
      }
    }

    return video;
  };
}(window, jQuery));
