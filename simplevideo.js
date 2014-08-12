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
	var opt = {},
		defaultOpts = {
			autoplay : false,
			source: null,
			poster: null,
			onplay: null,
			onpause: null,
			onended: function() {
				video.target.currentTime = 0;
			},
			showDefaultControlsOnMobile : true
		},
		optsList = [
			'autoplay',
			'source',
			'poster',
			'onplay',
			'onpause',
			'onended',
			'showDefaultControlsOnMobile'
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
    var video = {};

		if (utils.checkExists(options.target)) {
			if (options.target instanceof jQuery) {
				video.target = options.target;
			} else if (typeof options.target === 'string') {
				video.target = $(options.target);
			}
		}

    video.play = function() {
      video.target[0].play();
      utils.ifFunctionExecute(opt.onplay);
    };

    video.pause = function() {
      video.target[0].pause();
      utils.ifFunctionExecute(opt.onpause);
    };

    video.setTime = function(time) {
      //TODO: detect if format is percentage or time format
      video.target[0].currentTime = time;
    };

    video.ended = function() {
      utils.ifFunctionExecute(opt.onended);
    };

		if (utils.checkExists(video.target) && video.target.length > 0) {
			for (var i = 0, l = optsList.length; i < l; i++) {
				opt[optsList[i]] = utils.checkExists(options[optsList[i]]) ? options[optsList[i]] : defaultOpts[optsList[i]];
			}

      if (!utils.checkExists(opt.source)) {
  			if (utils.checkExists(video.target.attr('src'))) {
          opt.source = video.target.attr('src');
        } else if (video.target.find('source').length > 0 && utils.checkExists(video.target.find('source').attr('src')) {
          opt.source = video.target.find('source').attr('src');
        }
      }

      video.target.html('<source src="' + opt.source + '" type="video/mp4" />');
      video.target[0].load();

			if (opt.autoplay) {
				video.play();
			}

			video.target.bind('ended', video.ended);
		}

    return video;
	};
}(window, jQuery));
