/*!
 * Simple Video JavaScript Library v0.1
 * https://github.com/brimanning/Simple-Video
 *
 * Uses jQuery.js
 * http://jquery.com/
 *
 * Copyright 2014 Brian Manning
 * Released under the MIT license
 *
 * Date: 1/22/2014
 */

(function (w, $) {
	var
    defaultOpts = {
			autoplay : false,
			src: null,
			poster: null,
      controls: false,
			onPlay: null,
			onPause: null,
			onEnded: function() {
				video.target.currentTime = 0;
			},
			showDefaultControlsOnMobile : true,
      onPlaying: null,
      onPlayingInterval: 30
		},
		optsList = [
			'autoplay',
			'src',
			'poster',
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
      'poster'
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

		if (utils.checkExists(options.target)) {
			if (options.target instanceof jQuery) {
				video.target = options.target;
			} else if (typeof options.target === 'string') {
				video.target = $(options.target);
			}
		}

    video.play = function() {
      video.target[0].play();
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
      clearInterval(timeInterval);
      timeInterval = null;
      utils.ifFunctionExecute(opt.onEnded);
    };

		if (utils.checkExists(video.target) && video.target.length > 0) {
			for (var i = 0, l = optsList.length; i < l; i++) {
				opt[optsList[i]] = utils.checkExists(options[optsList[i]]) ? options[optsList[i]] : defaultOpts[optsList[i]];
        if ((!utils.checkExists(opt[optsList[i]]) || !utils.checkExists(options[optsList[i]])) && attrsList.indexOf(optsList[i]) > -1) {
          console.log(optsList[i]);
          opt[optsList[i]] = utils.checkExists(video.target.attr(attrsList[i])) ? video.target.attr(attrsList[i]) : defaultOpts[optsList[i]];
          //handle case where the attribute doesn't have a value (defaults true)
          if (opt[optsList[i]] === video.target.attr(attrsList[i])) {
            opt[optsList[i]] = true;
          }
        }
      }

      if (!utils.checkExists(opt.src) && video.target.find('source').length > 0 && utils.checkExists(video.target.find('source').attr('src'))) {
        opt.src = video.target.find('source').attr('src');
      }

      video.target.html('<source src="' + opt.src + '" type="video/mp4" />');
      video.target[0].load();

			if (opt.autoplay) {
				video.play();
			}

			video.target.bind('ended', video.ended);


		}

    return video;
	};
}(window, jQuery));
