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
		target = null,
		defaultOpts = {
			autoplay : false,
			source: null,
			poster: null,
			onplay: null,
			onpause: null,
			onended: function() {
				target.currentTime = 0;
			},
			showDefaultControlsOnMobile : true
		},
		optsList = ['autoplay', 'source', 'poster', 'onplay', 'onpause', 'onended', 'showDefaultControlsOnMobile'],
		utils = {},
		vidInterface = {
			play: function() {
				target[0].play();
				utils.ifFunctionExecute(opt.onplay);
			},
			pause: function() {
				target[0].pause();
				utils.ifFunctionExecute(opt.onpause);
			},
			ended: function() {
				utils.ifFunctionExecute(opt.onended);
			}
		};
	w.simplevid = {};
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
	w.simplevid.init = function(options) {
		if (utils.checkExists(options.target)) {
			if (options.target instanceof jQuery) {
				target = options.target;
			} else if (typeof options.target === 'string') {
				target = $(options.target);
			}
		}
		if (utils.checkExists(target) && target.length > 0) {
			for (var i = 0, l = optsList.length; i < l; i++) {
				opt[optsList[i]] = utils.checkExists(options[optsList[i]]) ? options[optsList[i]] : defaultOpts[optsList[i]];
			}

			if (utils.checkExists(opt.source)) {
				target.html('<source src="' + opt.source + '" type="video/mp4" />');
				target[0].load();
			}

			if (opt.autoplay) {
				vidInterface.play();
			}

			target.bind('ended', vidInterface.ended);
		}
	};
	w.simplevid.play = function() {
		vidInterface.play();
	};
	w.simplevid.pause = function() {
		vidInterface.pause();
	};
}(window, jQuery));