/*!
 * Simple Video JavaScript Library v0.1
 * https://github.com/brimanning/simplevideo
 *
 * Uses jQuery.js
 * http://jquery.com/
 *
 * Copyright 2014 Brian Manning
 * Released under the MIT license
 *
 * Date: 8/13/2014
 */

(function (w, $) {
	var
    defaultOpts = {
			autoplay : false,
			src: null,
			poster: null,
      controls: false,
      loop: false,
			onPlay: null,
			onPause: null,
			onEnded: function() {
				video.setTime(0);
			},
			showDefaultControlsOnMobile : true,
      onPlaying: null,
      onPlayingInterval: 30
		},
		optsList = [
			'autoplay',
			'src',
			'poster',
      'controls',
      'loop',
			'onPlay',
			'onPause',
			'onEnded',
			'showDefaultControlsOnMobile',
      'onPlaying',
      'onPlayingInterval'
		],
    attrsList = [
      'autoplay',
      'src',
      'poster',
      'controls',
      'loop'
    ],
		utils = {};

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

	utils.checkSWFObject = function (cb) {
		if (typeof swfobject === 'undefined' || swfobject === null) {
			$.getScript(window.location.protocol + '//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js', function () {
				if (!!cb) {
					cb();
				}
			});
		} else {
			if (!!cb) {
				cb();
			}
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

	w.simplevideo.init = function(options) {
    var video = {},
      opt = {},
      timeInterval = null;

    video.paused = false;

		if (options.target instanceof jQuery) {
			video.target = options.target;
		} else if (typeof options.target === 'string') {
			video.target = $(options.target);
		}

    if (!video.target.is('video')) {
      video.target.append('<video class="simplevideo"></video>');
      video.target = video.target.find('video.simplevideo');
    }

    video.play = function() {
      video.target[0].play();
      video.paused = false;
      utils.ifFunctionExecute(opt.onPlay);

      if (timeInterval === null) {
        timeInterval = setInterval(function () {
          if (utils.checkExists(opt.onPlaying) && typeof opt.onPlaying === 'function') {
            opt.onPlaying(video.target[0].currentTime, video.target[0].duration);
          }
        }, opt.onPlayingInterval);
      }
    };

    video.pause = function() {
      clearInterval(timeInterval);
      video.target[0].pause();
      video.paused = true;
      utils.ifFunctionExecute(opt.onPause);
    };

    video.setTime = function(time) {
      if (typeof time === 'string') {
        if (time.indexOf('%') > 0 && parseInt(time) <= 100 && parseInt(time) >= 0) {
          time = (parseInt(time) / 100) * video.target[0].duration;
        }
      }

      video.target[0].currentTime = time;
    };

    video.ended = function() {
      video.paused = true;
      clearInterval(timeInterval);
      timeInterval = null;
      utils.ifFunctionExecute(opt.onEnded);

      if (utils.checkExists(opt.loop) && opt.loop) {
        video.setTime(0);
        video.play();
      }
    };

		if (utils.checkExists(video.target) && video.target.length > 0) {
			for (var i = 0, l = optsList.length; i < l; i++) {
				opt[optsList[i]] = utils.checkExists(options[optsList[i]]) ? options[optsList[i]] : defaultOpts[optsList[i]];
        if ((!utils.checkExists(opt[optsList[i]]) || !utils.checkExists(options[optsList[i]])) && attrsList.indexOf(optsList[i]) > -1) {
          opt[optsList[i]] = utils.checkExists(video.target.attr(attrsList[i])) ? video.target.attr(attrsList[i]) : defaultOpts[optsList[i]];
          //handle case where the attribute doesn't have a value (defaults true)
          console.log(attrsList[i]);
          if (opt[optsList[i]] === attrsList[i]) {
            opt[optsList[i]] = true;
          }
        }
      }

      if (!utils.checkExists(opt.src) && video.target.find('source').length > 0 && utils.checkExists(video.target.find('source').attr('src'))) {
        opt.src = video.target.find('source').attr('src');
      }

      video.target.html('<source src="' + opt.src + '" type="video/mp4" />');
      if (utils.checkExists(opt.poster)) {
        video.target.attr('poster', opt.poster);
      }
      if (utils.checkExists(opt.loop)) {
        video.target.prop('loop', opt.loop);
      }
      if (utils.checkExists(opt.autoplay)) {
        video.target.prop('autoplay', opt.autoplay);
      }
      if (utils.checkExists(opt.controls)) {
        video.target.prop('controls', opt.controls);
      }
      video.target[0].load();

			if (opt.autoplay) {
				video.play();
			}

			video.target.bind('ended', video.ended);
		}

    return video;
	};
}(window, jQuery));
