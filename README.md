About simplevideo
===

__Note: This library is still very much in an alpha state. I haven't tested older versions of browsers, much mobile support, nor I have tested many versions of Flash. The latest versions of Firefox, Chrome, and Safari on Mac OSX 10.9. I'm hoping to test other cases in the near future.__

The aim of simplevideo is to create a very light-weight interface for video on the web. videojs and JW Player are great on their own merits, but some developers need a simpler solution that's much closer to the video element itself. simplevideo aims to be that lower-level solution.

Quick Start
===
+ Download from above
+ Clone: `git clone https://github.com/brimanning/simplevideo.git`
+ Coming: Bower

Dependencies
===
+ [jQuery](http://jquery.com)
+ [swfobject](https://code.google.com/p/swfobject)

Usage
===
simplevideo takes a target element to turn into an HTML5 video tag or falls back to a Flash embed if the user's browser does not support the video's mimetype. Note: simplevideo only currently supports mp4 videos, but more support is coming.

You'll need to reference jQuery and simplevideo on your page.

	<head>
		<script src="jquery.js"></script>
		<script src="simplevideo.js"></script>
	</head>

From there, you'll be able to create video elements on the page normally and simplevideo will replace them when it is invoked.

	<div id="mySimpleVideo"></div>
	<script>
		simplevideo.init({
			target: '#mySimpleVideo',
			src: 'myVideoFilePath.mp4
		});
	</script>

Similarly, you can use an existing video element and simplevideo will handle the existing attributes to play the video.

	<video class="my-video-class" loop autoplay>
		<source src="myVideoFilePath.mp4" type="video/mp4" />
	</video>
	<script>
		var myVideoAsAJQueryObject = $('.my-video-class');
		simplevideo.init({
			target: myVideoAsAJQueryObject
		});
	</script>

When you initialize a simplevideo object, it returns an object that allows you to interact with the video.

	<video class="my-video-class" loop autoplay>
		<source src="myVideoFilePath.mp4" type="video/mp4" />
	</video>
	<script>
		var myVideo = simplevideo.init({
			target: '.my-video-class'
		});
			
		myVideo.pause();
		myVideo.setVolume('30%');
	</script>
	
There are also hooks to listen to events that happen to the video.

	<video class="my-video-class" loop autoplay>
		<source src="myVideoFilePath.mp4" type="video/mp4" />
	</video>
	<script>
		var myVideo = simplevideo.init({
				target: '.my-video-class',
				onPause: function() {
					alert('playing!');
				},
				onPlay: function() {
					alert('paused...');
				},
				onPlaying: function(currentTime, videoDuration) {
					console.log('current time: ' + currentTime + ', video duration: ' + videoDuration);
				},
				onEnded: function() {
					alert('video complete');
				}
			});
	</script>
	
In total, the properties of a simplevideo instance is:

+ `target` - __required__, the jQuery object or string for jQuery to find your object (note: this must identify a single object, not an array of objects)
+ `src` - _default: none_, the video element url (will use a source specified in the HTML if omitted, otherwise simplevideo will use this value)
+ `autoplay` - _default: false_, if the video should start playing once it's loaded (will use the value specified in the HTML if omitted, otherwise simplevideo will use this value)
+ `poster` - _default: none_, what image the video should show before it's started playing (note: no poster is available if the browser falls back to Flash) (will use the value specified in the HTML if omitted, otherwise simplevideo will use this value)
+ `controls` - _default: false_, if the browser's default controls should be displayed (note: no controls are available if the browser falls back to Flash) (will use the value specified in the HTML if omitted, otherwise simplevideo will use this value)
+ `loop` - _default: false_, if the video should restart playing once it's finished (will use the value specified in the HTML if omitted, otherwise simplevideo will use this value)
+ `onPlay` - _default: none_, a function executed when the video starts playing
+ `onPause` - _default: none_, a function executed when the video is paused
+ `onEnded` - _default: reset current time to 0_, a function executed when the video ends
+ `onPlaying` - _default: none_, a function executed while the video is playing
+ `onPlayingInterval` - _default: 30_, how many milliseconds between each execution of `onPlaying`
+ `swfobjecturl` - _default: 'swfobject.js'_, where the swfobject library should be loaded from (only loaded when necessary)
+ `swfUrl` - _default: 'simplevideo.swf'_, where the simplevideo Flash fallback should be loaded from
+ `playerProductInstallSwfUrl` - _default: 'playerProductInstall.swf'_, where the update Flash swf should be loaded from

In addition, there are a few methods and properties returned in the simplevideo object:

+ `getCurrentTime()` - returns the current time of the video in seconds
+ `setCurrentTime(secondsOrPercentage)` - sets the current time of the video in seconds or a percent in the form of a string `'50%'` to go halfway through a video
+ `getDuration()` - returns the duration of the video in seconds
+ `getVolume()` - returns the volume of the video element
+ `setVolume(zeroToOneOrPercentage)` - sets the volume of the video element from 0 to 1 or a percent in the form of a string `'50%'` to put the volume halfway up
+ `play()` - play the video from it's current location (triggers the `onPlay` callback)
+ `pause()` - pause the video (triggers the `onPause` callback)
+ `target` - the jQuery element of the video itself or the container of the swf
+ `swf` - the swf element created (if Flash is required)
+ `swfId` - a randomly generated uuid to differentiate the swf element (if Flash is required)

Creator
===
Brian Manning

+ [http://github.com/brimanning](http://github.com/brimanning)
+ [http://brimanning.com](http://brimanning.com)
+ [http://twitter.com/brimanning](http://twitter.com/brimanning)

License
===
Code and documentation copyright 2014 Brian Manning. Code released under the [MIT license](https://github.com/brimanning/simplevideo/blob/master/LICENSE.md).
