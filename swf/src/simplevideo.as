package
{
	import flash.display.Sprite;
	import flash.external.ExternalInterface;
	
	import org.osmf.events.LoadEvent;
	import org.osmf.events.TimeEvent;
	import org.osmf.media.MediaPlayerSprite;
	import org.osmf.media.URLResource;
	import org.osmf.traits.LoadState;
	
	public class simplevideo extends Sprite
	{
		private var videoPlayer:MediaPlayerSprite;
		
		public function simplevideo()
		{
			initializeExternalInterface();
		}
		
		private function initializeExternalInterface():void
		{
			if (ExternalInterface.available)
			{
				ExternalInterface.addCallback("init", onInit);
				ExternalInterface.addCallback("play", onPlay);
				ExternalInterface.addCallback("pause", onPause);
				ExternalInterface.addCallback("getCurrentTime", getCurrentTime);
				ExternalInterface.addCallback("setCurrentTime", setCurrentTime);
				ExternalInterface.addCallback("getDuration", getDuration);
				ExternalInterface.addCallback("getVolume", getVolume);
				ExternalInterface.addCallback("setVolume", setVolume);
			}
		}
		
		private function onInit(src:String):void
		{
			videoPlayer = new MediaPlayerSprite();
			videoPlayer.mediaPlayer.autoPlay = true;
			videoPlayer.mediaPlayer.addEventListener(LoadEvent.LOAD_STATE_CHANGE, onLoadStateChange);
			videoPlayer.mediaPlayer.addEventListener(TimeEvent.COMPLETE, onVideoEnded);
			videoPlayer.media = videoPlayer.mediaFactory.createMediaElement(new URLResource(src));
		}
		
		private function onLoadStateChange(event:LoadEvent):void {
			if (event.loadState == LoadState.READY) {
				ExternalInterface.call("ready");
			}
		}
		
		private function onVideoEnded(evt:TimeEvent):void
		{
			ExternalInterface.call("ended");
		}
		
		private function onPause():void
		{
			videoPlayer.mediaPlayer.pause();
		}
		
		private function onPlay():void
		{
			videoPlayer.mediaPlayer.play();
		}
		
		private function getCurrentTime():Number
		{
			return videoPlayer.mediaPlayer.currentTime;
		}
		
		private function setCurrentTime(time:Number):void
		{
			videoPlayer.mediaPlayer.seek(time);
		}
		
		private function getDuration():Number
		{
			return videoPlayer.mediaPlayer.duration;
		}
		
		private function getVolume():Number
		{
			return videoPlayer.mediaPlayer.volume;
		}
		
		private function setVolume(volume:Number):void
		{
			videoPlayer.mediaPlayer.volume = volume;
		}
	}
}