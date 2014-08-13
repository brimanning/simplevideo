package
{
	import flash.display.Sprite;
	import flash.external.ExternalInterface;
	
	import org.osmf.media.MediaPlayerSprite;
	
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
			}
		}
		
		private function onInit(src:String):void
		{
			videoPlayer = new MediaPlayerSprite();
		}
	}
}