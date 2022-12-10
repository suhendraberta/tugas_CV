(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"tugas individu_atlas_1", frames: [[1839,919,197,119],[1770,1711,250,119],[1703,159,197,119],[1660,532,256,82],[1596,280,284,82],[1397,364,272,82],[1397,0,314,157],[910,1821,394,157],[1713,0,306,157],[1666,1042,236,119],[1306,1942,290,96],[1671,364,171,119],[1397,243,197,119],[1769,1832,242,96],[1397,448,272,82],[1551,1445,316,82],[1397,159,304,82],[1397,532,261,82],[1220,1445,329,82],[1598,1942,305,82],[910,1980,390,60],[910,1530,1115,179],[962,1042,702,148],[1220,1322,702,121],[0,0,1395,619],[910,1711,858,108],[0,1262,1218,266],[1306,1821,461,119],[962,621,1034,296],[1220,1192,757,128],[962,919,875,121],[0,621,960,639],[0,1530,512,512],[514,1530,394,512]]},
		{name:"tugas individu_atlas_2", frames: [[792,123,92,121],[282,207,88,121],[642,311,85,121],[372,207,88,121],[330,84,110,121],[886,123,92,121],[982,294,36,121],[468,330,36,121],[506,330,36,121],[666,188,92,121],[0,202,92,121],[442,84,110,121],[554,84,110,121],[462,207,88,121],[552,207,88,121],[0,325,85,121],[87,325,85,121],[760,246,88,121],[850,246,88,121],[94,202,92,121],[188,207,92,121],[876,0,116,121],[212,84,116,121],[0,0,210,96],[672,0,202,82],[212,0,238,82],[452,0,218,82],[122,98,88,102],[0,98,120,102],[174,330,100,102],[378,330,88,102],[666,84,124,102],[276,330,100,102],[994,0,20,117],[980,123,40,169],[940,294,40,169]]}
];


(lib.AnMovieClip = function(){
	this.actionFrames = [];
	this.ignorePause = false;
	this.currentSoundStreamInMovieclip;
	this.soundStreamDuration = new Map();
	this.streamSoundSymbolsList = [];

	this.gotoAndPlayForStreamSoundSync = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.gotoAndPlay = function(positionOrLabel){
		this.clearAllSoundStreams();
		var pos = this.timeline.resolve(positionOrLabel);
		if (pos != null) { this.startStreamSoundsForTargetedFrame(pos); }
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(this.currentFrame);
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
		this.clearAllSoundStreams();
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
		this.clearAllSoundStreams();
	}
	this.startStreamSoundsForTargetedFrame = function(targetFrame){
		for(var index=0; index<this.streamSoundSymbolsList.length; index++){
			if(index <= targetFrame && this.streamSoundSymbolsList[index] != undefined){
				for(var i=0; i<this.streamSoundSymbolsList[index].length; i++){
					var sound = this.streamSoundSymbolsList[index][i];
					if(sound.endFrame > targetFrame){
						var targetPosition = Math.abs((((targetFrame - sound.startFrame)/lib.properties.fps) * 1000));
						var instance = playSound(sound.id);
						var remainingLoop = 0;
						if(sound.offset){
							targetPosition = targetPosition + sound.offset;
						}
						else if(sound.loop > 1){
							var loop = targetPosition /instance.duration;
							remainingLoop = Math.floor(sound.loop - loop);
							if(targetPosition == 0){ remainingLoop -= 1; }
							targetPosition = targetPosition % instance.duration;
						}
						instance.loop = remainingLoop;
						instance.position = Math.round(targetPosition);
						this.InsertIntoSoundStreamData(instance, sound.startFrame, sound.endFrame, sound.loop , sound.offset);
					}
				}
			}
		}
	}
	this.InsertIntoSoundStreamData = function(soundInstance, startIndex, endIndex, loopValue, offsetValue){ 
 		this.soundStreamDuration.set({instance:soundInstance}, {start: startIndex, end:endIndex, loop:loopValue, offset:offsetValue});
	}
	this.clearAllSoundStreams = function(){
		this.soundStreamDuration.forEach(function(value,key){
			key.instance.stop();
		});
 		this.soundStreamDuration.clear();
		this.currentSoundStreamInMovieclip = undefined;
	}
	this.stopSoundStreams = function(currentFrame){
		if(this.soundStreamDuration.size > 0){
			var _this = this;
			this.soundStreamDuration.forEach(function(value,key,arr){
				if((value.end) == currentFrame){
					key.instance.stop();
					if(_this.currentSoundStreamInMovieclip == key) { _this.currentSoundStreamInMovieclip = undefined; }
					arr.delete(key);
				}
			});
		}
	}

	this.computeCurrentSoundStreamInstance = function(currentFrame){
		if(this.currentSoundStreamInMovieclip == undefined){
			var _this = this;
			if(this.soundStreamDuration.size > 0){
				var maxDuration = 0;
				this.soundStreamDuration.forEach(function(value,key){
					if(value.end > maxDuration){
						maxDuration = value.end;
						_this.currentSoundStreamInMovieclip = key;
					}
				});
			}
		}
	}
	this.getDesiredFrame = function(currentFrame, calculatedDesiredFrame){
		for(var frameIndex in this.actionFrames){
			if((frameIndex > currentFrame) && (frameIndex < calculatedDesiredFrame)){
				return frameIndex;
			}
		}
		return calculatedDesiredFrame;
	}

	this.syncStreamSounds = function(){
		this.stopSoundStreams(this.currentFrame);
		this.computeCurrentSoundStreamInstance(this.currentFrame);
		if(this.currentSoundStreamInMovieclip != undefined){
			var soundInstance = this.currentSoundStreamInMovieclip.instance;
			if(soundInstance.position != 0){
				var soundValue = this.soundStreamDuration.get(this.currentSoundStreamInMovieclip);
				var soundPosition = (soundValue.offset?(soundInstance.position - soundValue.offset): soundInstance.position);
				var calculatedDesiredFrame = (soundValue.start)+((soundPosition/1000) * lib.properties.fps);
				if(soundValue.loop > 1){
					calculatedDesiredFrame +=(((((soundValue.loop - soundInstance.loop -1)*soundInstance.duration)) / 1000) * lib.properties.fps);
				}
				calculatedDesiredFrame = Math.floor(calculatedDesiredFrame);
				var deltaFrame = calculatedDesiredFrame - this.currentFrame;
				if((deltaFrame >= 0) && this.ignorePause){
					cjs.MovieClip.prototype.play.call(this);
					this.ignorePause = false;
				}
				else if(deltaFrame >= 2){
					this.gotoAndPlayForStreamSoundSync(this.getDesiredFrame(this.currentFrame,calculatedDesiredFrame));
				}
				else if(deltaFrame <= -2){
					cjs.MovieClip.prototype.stop.call(this);
					this.ignorePause = true;
				}
			}
		}
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.CachedBmp_71 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_70 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_69 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_68 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_67 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_66 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_65 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_64 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_63 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_62 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_61 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_60 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_59 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_58 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_57 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_56 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_55 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_54 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_53 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_52 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_51 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_50 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_49 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_48 = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_47 = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_46 = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_45 = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_44 = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_43 = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_42 = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_41 = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_40 = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_39 = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_38 = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_37 = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_36 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_35 = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_34 = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_33 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_32 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_31 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_30 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_29 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_28 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_27 = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_26 = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_25 = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_24 = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_23 = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_22 = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_21 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(30);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_20 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(31);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_19 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(32);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_18 = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_17 = function() {
	this.initialize(img.CachedBmp_17);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,1444,2512);


(lib.CachedBmp_16 = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_15 = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_14 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(33);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_13 = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_12 = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_11 = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_10 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(34);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_9 = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_8 = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_7 = function() {
	this.initialize(img.CachedBmp_7);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,1440,2560);


(lib.CachedBmp_6 = function() {
	this.initialize(ss["tugas individu_atlas_2"]);
	this.gotoAndStop(35);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_5 = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_4 = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_3 = function() {
	this.initialize(img.CachedBmp_3);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,1452,2572);


(lib.CachedBmp_2 = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(30);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1 = function() {
	this.initialize(img.CachedBmp_1);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,1446,2566);


(lib._1187120_409050025866907_1746489663_n = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(31);
}).prototype = p = new cjs.Sprite();



(lib.itunes = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(32);
}).prototype = p = new cjs.Sprite();



(lib.samurairemovebgpreview = function() {
	this.initialize(ss["tugas individu_atlas_1"]);
	this.gotoAndStop(33);
}).prototype = p = new cjs.Sprite();



(lib.Tween20 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_64();
	this.instance.setTransform(-8.85,-30.3,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-8.8,-30.3,18,60.5);


(lib.Tween19 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_63();
	this.instance.setTransform(-8.85,-30.3,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-8.8,-30.3,18,60.5);


(lib.Tween14 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_62();
	this.instance.setTransform(-23.1,-30.3,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-23.1,-30.3,46,60.5);


(lib.Tween13 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_61();
	this.instance.setTransform(-23.1,-30.3,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-23.1,-30.3,46,60.5);


(lib.Tween12 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_60();
	this.instance.setTransform(-27.55,-30.3,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-27.5,-30.3,55,60.5);


(lib.Tween11 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_59();
	this.instance.setTransform(-27.55,-30.3,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-27.5,-30.3,55,60.5);


(lib.Tween10 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_58();
	this.instance.setTransform(-22.05,-30.3,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-22,-30.3,44,60.5);


(lib.Tween9 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_57();
	this.instance.setTransform(-22.05,-30.3,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-22,-30.3,44,60.5);


(lib.Tween8 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_56();
	this.instance.setTransform(-21.25,-30.3,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-21.2,-30.3,42.5,60.5);


(lib.Tween7 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_55();
	this.instance.setTransform(-21.25,-30.3,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-21.2,-30.3,42.5,60.5);


(lib.Tween6 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_54();
	this.instance.setTransform(-21.9,-30.3,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-21.9,-30.3,44,60.5);


(lib.Tween5 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_53();
	this.instance.setTransform(-21.9,-30.3,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-21.9,-30.3,44,60.5);


(lib.Tween4 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_52();
	this.instance.setTransform(-23.1,-30.3,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-23.1,-30.3,46,60.5);


(lib.Tween3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_51();
	this.instance.setTransform(-23.1,-30.3,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-23.1,-30.3,46,60.5);


(lib.Tween2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_50();
	this.instance.setTransform(-28.95,-30.3,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-28.9,-30.3,58,60.5);


(lib.Tween1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_49();
	this.instance.setTransform(-28.95,-30.3,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-28.9,-30.3,58,60.5);


(lib.tmb_home = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_46();
	this.instance.setTransform(0,0,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_47();
	this.instance_1.setTransform(-13.35,0,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_48();
	this.instance_2.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-13.3,0,125,59.5);


(lib.Symbol4 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_43();
	this.instance.setTransform(0,0,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_44();
	this.instance_1.setTransform(-3,0,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_45();
	this.instance_2.setTransform(4,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3,0,142,41);


(lib.Symbol2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	var mask_graphics_0 = new cjs.Graphics().p("AkPQ+QlTlTAAngQAAneFTlUQFTlTHfAAQHgAAFTFTQFTFUAAHeQAAHglTFTQlTFTngAAQnfAAlTlTgA1zT1QiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgA4iBIQiGiFAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCFQiGCHi9AAQi+AAiGiHgAsLrmQiKh1AAimQAAilCKh1QCKh1DEAAQDEAACKB1QCKB1AAClQAACmiKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_1 = new cjs.Graphics().p("AkPQ+QlTlTAAngQAAneFTlUQFTlTHfAAQHgAAFTFTQFTFUAAHeQAAHglTFTQlTFTngAAQnfAAlTlTgA1zT1QiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgA4iBIQiGiFAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCFQiGCHi9AAQi+AAiGiHgAsLrmQiKh1AAimQAAilCKh1QCKh1DEAAQDEAACKB1QCKB1AAClQAACmiKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_2 = new cjs.Graphics().p("AkPQ+QlTlTAAngQAAneFTlUQFTlTHfAAQHgAAFTFTQFTFUAAHeQAAHglTFTQlTFTngAAQnfAAlTlTgA1zT1QiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgA4iBIQiGiFAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCFQiGCHi9AAQi+AAiGiHgAsLrmQiKh1AAimQAAilCKh1QCKh1DEAAQDEAACKB1QCKB1AAClQAACmiKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_3 = new cjs.Graphics().p("AkPQ+QlTlTAAngQAAneFTlUQFTlTHfAAQHgAAFTFTQFTFUAAHeQAAHglTFTQlTFTngAAQnfAAlTlTgA1zT1QiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgA4iBIQiGiFAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCFQiGCHi9AAQi+AAiGiHgAsLrmQiKh1AAimQAAilCKh1QCKh1DEAAQDEAACKB1QCKB1AAClQAACmiKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_4 = new cjs.Graphics().p("AkPQ+QlTlTAAngQAAneFTlUQFTlTHfAAQHgAAFTFTQFTFUAAHeQAAHglTFTQlTFTngAAQnfAAlTlTgA1zT1QiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgA4iBIQiGiFAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCFQiGCHi9AAQi+AAiGiHgAsLrmQiKh1AAimQAAilCKh1QCKh1DEAAQDEAACKB1QCKB1AAClQAACmiKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_5 = new cjs.Graphics().p("AkPRnQlTlTAAngQAAneFTlUQFTlTHfAAQHgAAFTFTQFTFUAAHeQAAHglTFTQlTFTngAAQnfAAlTlTgA1zUeQiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgA4iBxQiGiFAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCFQiGCHi9AAQi+AAiGiHgAsLq9QiKh1AAimQAAilCKh1QCKh1DEAAQDEAACKB1QCKB1AAClQAACmiKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_6 = new cjs.Graphics().p("AkPSzQlTlTAAngQAAneFTlUQFTlTHfAAQHgAAFTFTQFTFUAAHeQAAHglTFTQlTFTngAAQnfAAlTlTgA1zVqQiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgA4iC9QiGiGAAi8QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC8iHCGQiGCHi9AAQi+AAiGiHgAsLpxQiKh1AAimQAAilCKh1QCKh1DEAAQDEAACKB1QCKB1AAClQAACmiKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_7 = new cjs.Graphics().p("AkPT/QlTlTAAnfQAAnfFTlTQFTlTHfAAQHgAAFTFTQFTFTAAHfQAAHflTFTQlTFUngAAQnfAAlTlUgA1zW2QiGiGAAi9QAAi+CGiGQCHiGC9AAQC+AACGCGQCGCGAAC+QAAC9iGCGQiGCHi+AAQi9AAiHiHgA4iEKQiGiGAAi9QAAi9CGiHQCGiGC+AAQC9AACGCGQCHCHAAC9QAAC9iHCGQiGCGi9AAQi+AAiGiGgAsLolQiKh1AAilQAAimCKh1QCKh1DEAAQDEAACKB1QCKB1AACmQAACliKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_8 = new cjs.Graphics().p("AjUVMQlTlTAAngQAAnfFTlTQFTlTHfAAQHgAAFTFTQFTFTAAHfQAAHglTFTQlTFTngAAQnfAAlTlTgA04YDQiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgA3nFWQiGiGAAi9QAAi9CGiGQCGiGC+AAQC9AACGCGQCHCGAAC9QAAC9iHCGQiGCHi9AAQi+AAiGiHgArQnYQiKh1AAimQAAilCKh1QCKh1DEAAQDEAACKB1QCKB1AAClQAACmiKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_9 = new cjs.Graphics().p("AiRWYQlTlTAAngQAAnfFTlTQFTlTHfAAQHgAAFTFTQFTFTAAHfQAAHglTFTQlTFTngAAQnfAAlTlTgAz1ZPQiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgA2kGiQiGiGAAi9QAAi9CGiGQCGiGC+AAQC9AACGCGQCHCGAAC9QAAC9iHCGQiGCHi9AAQi+AAiGiHgAqNmMQiKh1AAimQAAilCKh1QCKh1DEAAQDEAACJB1QCLB1AAClQAACmiLB1QiJB1jEAAQjEAAiKh1g");
	var mask_graphics_10 = new cjs.Graphics().p("AhOXkQlTlTAAnfQAAngFTlSQFTlTHfAAQHgAAFTFTQFTFSAAHgQAAHflTFTQlTFUngAAQnfAAlTlUgAyyabQiGiGAAi9QAAi+CGiGQCHiGC9AAQC+AACGCGQCGCGAAC+QAAC9iGCGQiGCHi+AAQi9AAiHiHgA1hHvQiGiGAAi+QAAi8CGiHQCGiGC+AAQC9AACGCGQCHCHAAC8QAAC+iHCGQiGCGi9AAQi+AAiGiGgApKlAQiKh1AAilQAAimCKh1QCKh1DEAAQDEAACJB1QCLB1AACmQAACliLB1QiJB1jEAAQjEAAiKh1g");
	var mask_graphics_11 = new cjs.Graphics().p("AgKYxQlTlTAAngQAAnfFTlTQFSlTHgAAQHfAAFTFTQFUFTAAHfQAAHglUFTQlTFTnfAAQngAAlSlTgAxuboQiGiGAAi+QAAi9CGiHQCGiGC+AAQC9AACGCGQCHCHAAC9QAAC+iHCGQiGCGi9AAQi+AAiGiGgA0eI7QiGiGAAi9QAAi+CGiFQCHiGC9AAQC+AACGCGQCGCFAAC+QAAC9iGCGQiGCHi+AAQi9AAiHiHgAoGjzQiLh1AAimQAAilCLh1QCKh1DEAAQDCAACLB1QCKB1AAClQAACmiKB1QiLB1jCAAQjEAAiKh1g");
	var mask_graphics_12 = new cjs.Graphics().p("AA4Z9QlSlTAAngQAAnfFSlUQFTlSHgAAQHfAAFTFSQFUFUAAHfQAAHglUFTQlTFTnfAAQngAAlTlTgAwrc0QiGiGAAi+QAAi9CGiHQCGiGC+AAQC9AACGCGQCHCHAAC9QAAC+iHCGQiGCGi9AAQi+AAiGiGgAzbKHQiGiGAAi9QAAi+CGiGQCHiFC9AAQC+AACGCFQCGCGAAC+QAAC9iGCGQiGCHi+AAQi9AAiHiHgAnDinQiLh1AAimQAAilCLh1QCKh1DEAAQDCAACLB1QCKB1AAClQAACmiKB1QiLB1jCAAQjEAAiKh1g");
	var mask_graphics_13 = new cjs.Graphics().p("AB7bJQlSlTAAnfQAAngFSlTQFTlSHgAAQHfAAFTFSQFUFTAAHgQAAHflUFTQlTFUnfAAQngAAlTlUgAvoeAQiGiGAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCGQiGCHi9AAQi+AAiGiHgAyYLUQiGiGAAi+QAAi9CGiHQCHiFC9AAQC+AACGCFQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgAmAhbQiLh1AAilQAAimCLh1QCKh1DEAAQDCAACLB1QCKB1AACmQAACliKB1QiLB0jCAAQjEAAiKh0g");
	var mask_graphics_14 = new cjs.Graphics().p("AC+cWQlSlTAAngQAAnfFSlUQFUlSHfAAQHgAAFTFSQFTFUAAHfQAAHglTFTQlTFTngAAQnfAAlUlTgAulfNQiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgAxUMgQiGiGAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCGQiGCHi9AAQi+AAiGiHgAk9gOQiKh1AAimQAAilCKh1QCKh1DDAAQDEAACKB1QCLB1AAClQAACmiLB1QiKB0jEAAQjDAAiKh0g");
	var mask_graphics_15 = new cjs.Graphics().p("AEBdiQlSlTAAngQAAnfFSlUQFUlSHfAAQHgAAFTFSQFTFUAAHfQAAHglTFTQlTFTngAAQnfAAlUlTgEgNiAgZQiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgAwRNsQiGiGAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCGQiGCHi9AAQi+AAiGiHgAj6A9QiKh0AAimQAAilCKh1QCKh1DDAAQDEAACKB1QCLB1AAClQAACmiLB0QiKB1jEAAQjDAAiKh1g");
	var mask_graphics_16 = new cjs.Graphics().p("AFEeuQlSlTAAnfQAAngFSlTQFUlSHfAAQHgAAFTFSQFTFTAAHgQAAHflTFTQlTFUngAAQnfAAlUlUgEgMfAhlQiGiGAAi9QAAi+CGiGQCHiGC9AAQC+AACGCGQCGCGAAC+QAAC9iGCGQiGCHi+AAQi9AAiHiHgAvOO5QiGiGAAi+QAAi9CGiHQCGiGC+AAQC9AACGCGQCHCHAAC9QAAC+iHCGQiGCGi9AAQi+AAiGiGgAi3CJQiKh1AAikQAAimCKh1QCKh1DDAAQDEAACKB1QCLB1AACmQAACkiLB1QiKB1jEAAQjDAAiKh1g");
	var mask_graphics_17 = new cjs.Graphics().p("AGIf6QlTlTAAnfQAAngFTlTQFTlTHgAAQHfAAFTFTQFUFTAAHgQAAHflUFTQlTFUnfAAQngAAlTlUgEgLbAixQiGiGAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCGCGAAC+QAAC9iGCGQiGCHi9AAQi+AAiGiHgAuLQFQiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgAhzDVQiLh1AAikQAAimCLh1QCJh1DEAAQDDAACLB1QCKB1AACmQAACkiKB1QiLB1jDAAQjEAAiJh1g");
	var mask_graphics_18 = new cjs.Graphics().p("EAHLAhHQlTlTAAngQAAnfFTlUQFTlTHgAAQHfAAFTFTQFUFUAAHfQAAHglUFTQlTFTnfAAQngAAlTlTgEgKYAj+QiGiGAAi+QAAi9CGiHQCGiGC+AAQC9AACGCGQCGCHAAC9QAAC+iGCGQiGCGi9AAQi+AAiGiGgAtIRRQiGiGAAi9QAAi+CGiGQCHiGC9AAQC+AACGCGQCGCGAAC+QAAC9iGCGQiGCHi+AAQi9AAiHiHgAgwEiQiLh1AAimQAAikCLh1QCJh1DEAAQDDAACLB1QCKB1AACkQAACmiKB1QiLB1jDAAQjEAAiJh1g");
	var mask_graphics_19 = new cjs.Graphics().p("EAIOAiTQlTlTAAnfQAAngFTlTQFTlTHgAAQHfAAFTFTQFUFTAAHgQAAHflUFTQlTFUnfAAQngAAlTlUgEgJVAlKQiGiGAAi9QAAi+CGiGQCGiGC+AAQC9AACFCGQCHCGAAC+QAAC9iHCGQiFCHi9AAQi+AAiGiHgAsFSeQiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCFCHAAC9QAAC+iFCGQiGCGi+AAQi9AAiHiGgAASFuQiKh1AAilQAAilCKh1QCKh1DEAAQDDAACLB1QCKB1AAClQAACliKB1QiLB1jDAAQjEAAiKh1g");
	var mask_graphics_20 = new cjs.Graphics().p("EAJRAjfQlTlTAAnfQAAngFTlTQFUlTHfAAQHgAAFTFTQFTFTAAHgQAAHflTFTQlTFUngAAQnfAAlUlUgEgISAmWQiGiGAAi9QAAi+CGiGQCHiGC9AAQC+AACFCGQCGCGAAC+QAAC9iGCGQiFCHi+AAQi9AAiHiHgArBTqQiGiGAAi+QAAi9CGiHQCGiGC+AAQC9AACGCGQCGCHAAC9QAAC+iGCGQiGCGi9AAQi+AAiGiGgABVG6QiJh1AAilQAAilCJh1QCKh1DEAAQDEAACKB1QCLB1AAClQAACliLB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_21 = new cjs.Graphics().p("EAKUAksQlTlTAAngQAAnfFTlUQFUlTHfAAQHgAAFTFTQFTFUAAHfQAAHglTFTQlTFTngAAQnfAAlUlTgEgHPAnjQiGiGAAi+QAAi9CGiHQCHiGC9AAQC9AACGCGQCGCHAAC9QAAC+iGCGQiGCGi9AAQi9AAiHiGgAp+U2QiGiGAAi9QAAi+CGiGQCGiGC+AAQC9AACFCGQCHCGAAC+QAAC9iHCGQiFCHi9AAQi+AAiGiHgACYIHQiKh1AAimQAAilCKh0QCKh1DEAAQDEAACKB1QCLB0AAClQAACmiLB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_22 = new cjs.Graphics().p("EALXAl4QlTlTAAnfQAAngFTlTQFUlTHfAAQHgAAFTFTQFTFTAAHgQAAHflTFTQlTFUngAAQnfAAlUlUgEgGMAovQiGiGAAi9QAAi+CGiGQCHiGC9AAQC9AACGCGQCGCGAAC+QAAC9iGCGQiGCHi9AAQi9AAiHiHgAo7WDQiGiGAAi+QAAi9CGiHQCGiGC+AAQC9AACFCGQCHCHAAC9QAAC+iHCGQiFCGi9AAQi+AAiGiGgADbJTQiKh1AAilQAAimCKh1QCKh0DEAAQDEAACKB0QCLB1AACmQAACliLB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_23 = new cjs.Graphics().p("EAMbAnEQlTlTAAnfQAAngFTlTQFTlTHgAAQHfAAFTFTQFUFTAAHgQAAHflUFTQlTFUnfAAQngAAlTlUgEgFIAp7QiGiGAAi9QAAi+CGiGQCGiGC+AAQC8AACGCGQCHCGAAC+QAAC9iHCGQiGCHi8AAQi+AAiGiHgAn4XPQiGiGAAi+QAAi9CGiHQCHiGC9AAQC9AACGCGQCGCHAAC9QAAC+iGCGQiGCGi9AAQi9AAiHiGgAEfKfQiLh1AAilQAAimCLh1QCKh0DEAAQDDAACLB0QCKB1AACmQAACliKB1QiLB1jDAAQjEAAiKh1g");
	var mask_graphics_24 = new cjs.Graphics().p("EANeAoRQlTlTAAngQAAnfFTlUQFTlTHgAAQHfAAFTFTQFUFUAAHfQAAHglUFTQlTFTnfAAQngAAlTlTgEgEFArIQiGiGAAi+QAAi9CGiHQCGiGC9AAQC9AACGCGQCHCHAAC9QAAC+iHCGQiGCGi9AAQi9AAiGiGgAm1YbQiGiGAAi9QAAi+CGiGQCHiGC9AAQC9AACGCGQCGCGAAC+QAAC9iGCGQiGCHi9AAQi9AAiHiHgAFiLsQiLh1AAimQAAilCLh1QCKh1DEAAQDDAACLB1QCKB1AAClQAACmiKB1QiLB1jDAAQjEAAiKh1g");
	var mask_graphics_25 = new cjs.Graphics().p("EAMZAoNQlTlTAAngQAAnfFTlUQFTlTHgAAQHfAAFTFTQFUFUAAHfQAAHglUFTQlTFTnfAAQngAAlTlTgEgFKArEQiGiGAAi+QAAi9CGiHQCGiGC+AAQC8AACGCGQCHCHAAC9QAAC+iHCGQiGCGi8AAQi+AAiGiGgAn6YXQiGiGAAi9QAAi+CGiGQCHiGC9AAQC9AACGCGQCGCGAAC+QAAC9iGCGQiGCHi9AAQi9AAiHiHgAEdLoQiLh1AAimQAAilCLh1QCKh1DEAAQDDAACLB1QCKB1AAClQAACmiKB1QiLB1jDAAQjEAAiKh1g");
	var mask_graphics_26 = new cjs.Graphics().p("EALTAoJQlTlTAAngQAAnfFTlUQFUlTHfAAQHgAAFTFTQFTFUAAHfQAAHglTFTQlTFTngAAQnfAAlUlTgEgGQArAQiGiGAAi+QAAi9CGiHQCHiGC9AAQC9AACGCGQCGCHAAC9QAAC+iGCGQiGCGi9AAQi9AAiHiGgAo/YTQiGiGAAi9QAAi+CGiGQCGiGC+AAQC9AACFCGQCHCGAAC+QAAC9iHCGQiFCHi9AAQi+AAiGiHgADXLkQiKh1AAimQAAilCKh1QCKh1DEAAQDEAACKB1QCLB1AAClQAACmiLB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_27 = new cjs.Graphics().p("EAKOAoEQlTlTAAnfQAAngFTlTQFUlTHfAAQHgAAFTFTQFTFTAAHgQAAHflTFTQlTFUngAAQnfAAlUlUgEgHVAq7QiGiGAAi9QAAi+CGiGQCHiGC9AAQC9AACGCGQCGCGAAC+QAAC9iGCGQiGCHi9AAQi9AAiHiHgAqEYPQiGiGAAi+QAAi9CGiHQCGiGC+AAQC9AACFCGQCHCHAAC9QAAC+iHCGQiFCGi9AAQi+AAiGiGgACSLfQiKh1AAilQAAimCKh1QCKh1DEAAQDEAACKB1QCLB1AACmQAACliLB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_28 = new cjs.Graphics().p("EAJJAoAQlTlTAAnfQAAngFTlTQFUlTHfAAQHgAAFTFTQFTFTAAHgQAAHflTFTQlTFUngAAQnfAAlUlUgEgIaAq3QiGiGAAi9QAAi+CGiGQCHiGC9AAQC+AACFCGQCGCGAAC+QAAC9iGCGQiFCHi+AAQi9AAiHiHgArJYLQiGiGAAi+QAAi9CGiHQCGiGC+AAQC9AACGCGQCGCHAAC9QAAC+iGCGQiGCGi9AAQi+AAiGiGgABNLbQiJh1AAilQAAimCJh1QCKh1DEAAQDEAACKB1QCLB1AACmQAACliLB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_29 = new cjs.Graphics().p("EAIEAn8QlTlTAAnfQAAngFTlTQFUlTHfAAQHgAAFTFTQFTFTAAHgQAAHflTFTQlTFUngAAQnfAAlUlUgEgJfAqzQiGiGAAi9QAAi+CGiGQCHiGC9AAQC+AACFCGQCGCGAAC+QAAC9iGCGQiFCHi+AAQi9AAiHiHgAsOYHQiGiGAAi+QAAi9CGiHQCGiGC+AAQC9AACGCGQCHCHAAC9QAAC+iHCGQiGCGi9AAQi+AAiGiGgAAILXQiJh1AAilQAAimCJh1QCKh1DEAAQDEAACKB1QCLB1AACmQAACliLB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_30 = new cjs.Graphics().p("EAG/An4QlTlTAAnfQAAngFTlTQFTlTHgAAQHfAAFTFTQFUFTAAHgQAAHflUFTQlTFUnfAAQngAAlTlUgEgKkAqvQiGiGAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCGCGAAC+QAAC9iGCGQiGCHi9AAQi+AAiGiHgAtUYDQiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgAg8LTQiLh1AAilQAAimCLh1QCJh1DEAAQDDAACLB1QCKB1AACmQAACliKB1QiLB1jDAAQjEAAiJh1g");
	var mask_graphics_31 = new cjs.Graphics().p("EAF6An0QlTlTAAnfQAAngFTlTQFTlTHgAAQHfAAFTFTQFUFTAAHgQAAHflUFTQlTFUnfAAQngAAlTlUgEgLpAqrQiGiGAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCGCGAAC+QAAC9iGCGQiGCHi9AAQi+AAiGiHgAuZX/QiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgAiBLPQiLh1AAilQAAimCLh1QCJh1DEAAQDDAACLB1QCKB1AACmQAACliKB1QiLB1jDAAQjEAAiJh1g");
	var mask_graphics_32 = new cjs.Graphics().p("EAE1AnwQlSlTAAngQAAnfFSlUQFTlTHgAAQHfAAFTFTQFUFUAAHfQAAHglUFTQlTFTnfAAQngAAlTlTgEgMuAqnQiGiGAAi+QAAi9CGiHQCGiGC+AAQC9AACGCGQCHCHAAC9QAAC+iHCGQiGCGi9AAQi+AAiGiGgAveX6QiGiGAAi9QAAi+CGiGQCHiGC9AAQC+AACGCGQCGCGAAC+QAAC9iGCGQiGCHi+AAQi9AAiHiHgAjGLLQiLh1AAimQAAilCLh1QCKh1DDAAQDDAACLB1QCKB1AAClQAACmiKB1QiLB1jDAAQjDAAiKh1g");
	var mask_graphics_33 = new cjs.Graphics().p("EADvAnsQlSlTAAngQAAnfFSlUQFUlTHfAAQHgAAFTFTQFTFUAAHfQAAHglTFTQlTFTngAAQnfAAlUlTgEgN0AqjQiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgAwjX2QiGiGAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCGQiGCHi9AAQi+AAiGiHgAkMLHQiKh1AAimQAAilCKh1QCKh1DDAAQDEAACKB1QCLB1AAClQAACmiLB1QiKB1jEAAQjDAAiKh1g");
	var mask_graphics_34 = new cjs.Graphics().p("EACqAnoQlSlTAAngQAAnfFSlUQFUlTHfAAQHgAAFTFTQFTFUAAHfQAAHglTFTQlTFTngAAQnfAAlUlTgEgO5AqfQiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgAxoXyQiGiGAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCGQiGCHi9AAQi+AAiGiHgAlRLDQiKh1AAimQAAilCKh1QCKh1DEAAQDDAACKB1QCLB1AAClQAACmiLB1QiKB1jDAAQjEAAiKh1g");
	var mask_graphics_35 = new cjs.Graphics().p("EABlAnkQlSlTAAngQAAnfFSlUQFUlTHfAAQHgAAFTFTQFTFUAAHfQAAHglTFTQlTFTngAAQnfAAlUlTgEgP+AqbQiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgAytXuQiGiGAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCGQiGCHi9AAQi+AAiGiHgAmWK/QiKh1AAimQAAilCKh1QCKh1DEAAQDDAACKB1QCLB1AAClQAACmiLB1QiKB1jDAAQjEAAiKh1g");
	var mask_graphics_36 = new cjs.Graphics().p("EAAgAngQlSlTAAngQAAnfFSlUQFUlTHfAAQHgAAFTFTQFTFUAAHfQAAHglTFTQlTFTngAAQnfAAlUlTgEgRDAqXQiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgAzyXqQiGiGAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCGQiGCHi9AAQi+AAiGiHgAnbK7QiKh1AAimQAAilCKh1QCKh1DEAAQDDAACKB1QCLB1AAClQAACmiLB1QiKB1jDAAQjEAAiKh1g");
	var mask_graphics_37 = new cjs.Graphics().p("EgAkAnbQlTlTAAnfQAAngFTlTQFSlTHgAAQHfAAFTFTQFUFTAAHgQAAHflUFTQlTFUnfAAQngAAlSlUgEgSIAqSQiGiGAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCGQiGCHi9AAQi+AAiGiHgA04XmQiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgAogK2QiLh1AAilQAAimCLh1QCKh1DEAAQDDAACKB1QCKB1AACmQAACliKB1QiKB1jDAAQjEAAiKh1g");
	var mask_graphics_38 = new cjs.Graphics().p("EgBpAnXQlTlTAAnfQAAngFTlTQFSlTHgAAQHfAAFTFTQFUFTAAHgQAAHflUFTQlTFUnfAAQngAAlSlUgEgTNAqOQiGiGAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCGQiGCHi9AAQi+AAiGiHgA19XiQiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgAplKyQiLh1AAilQAAimCLh1QCKh1DEAAQDDAACKB1QCKB1AACmQAACliKB1QiKB1jDAAQjEAAiKh1g");
	var mask_graphics_39 = new cjs.Graphics().p("EgCuAnTQlTlTAAnfQAAngFTlTQFSlTHgAAQHfAAFTFTQFUFTAAHgQAAHflUFTQlTFUnfAAQngAAlSlUgEgUSAqKQiGiGAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCGQiGCHi9AAQi+AAiGiHgA3CXeQiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgAqqKuQiLh1AAilQAAimCLh1QCKh1DEAAQDDAACLB1QCJB1AACmQAACliJB1QiLB1jDAAQjEAAiKh1g");
	var mask_graphics_40 = new cjs.Graphics().p("EgDzAnPQlTlTAAnfQAAngFTlTQFSlTHgAAQHfAAFTFTQFUFTAAHgQAAHflUFTQlTFUnfAAQngAAlSlUgEgVXAqGQiGiGAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCGQiGCHi9AAQi+AAiGiHgA4HXaQiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgArvKqQiLh1AAilQAAimCLh1QCKh1DEAAQDDAACLB1QCJB1AACmQAACliJB1QiLB1jDAAQjEAAiKh1g");
	var mask_graphics_41 = new cjs.Graphics().p("EgEPAnLQlTlTAAnfQAAngFTlTQFTlTHfAAQHgAAFTFTQFTFTAAHgQAAHflTFTQlTFUngAAQnfAAlTlUgEgVzAqCQiGiGAAi9QAAi+CGiGQCHiGC9AAQC+AACGCGQCGCGAAC+QAAC9iGCGQiGCHi+AAQi9AAiHiHgA4iXWQiGiGAAi+QAAi9CGiHQCGiGC+AAQC9AACGCGQCHCHAAC9QAAC+iHCGQiGCGi9AAQi+AAiGiGgAsLKmQiKh1AAilQAAimCKh1QCKh0DEAAQDEAACKB0QCKB1AACmQAACliKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_42 = new cjs.Graphics().p("EgEPAnHQlTlTAAngQAAnfFTlUQFTlTHfAAQHgAAFTFTQFTFUAAHfQAAHglTFTQlTFTngAAQnfAAlTlTgEgVzAp+QiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgA4iXRQiGiGAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCGQiGCHi9AAQi+AAiGiHgAsLKiQiKh1AAimQAAilCKh1QCKh0DEAAQDEAACKB0QCKB1AAClQAACmiKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_43 = new cjs.Graphics().p("EgEPAnDQlTlTAAngQAAnfFTlUQFTlTHfAAQHgAAFTFTQFTFUAAHfQAAHglTFTQlTFTngAAQnfAAlTlTgEgVzAp6QiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgA4iXNQiGiGAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCGQiGCHi9AAQi+AAiGiHgAsLKeQiKh1AAimQAAilCKh1QCKh0DEAAQDEAACKB0QCKB1AAClQAACmiKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_44 = new cjs.Graphics().p("EgEPAm/QlTlTAAngQAAnfFTlUQFTlTHfAAQHgAAFTFTQFTFUAAHfQAAHglTFTQlTFTngAAQnfAAlTlTgEgVzAp2QiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgA4iXJQiGiGAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCGQiGCHi9AAQi+AAiGiHgAsLKaQiKh1AAimQAAilCKh1QCKh0DEAAQDEAACKB0QCKB1AAClQAACmiKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_45 = new cjs.Graphics().p("EgEPAm7QlTlTAAngQAAnfFTlUQFTlTHfAAQHgAAFTFTQFTFUAAHfQAAHglTFTQlTFTngAAQnfAAlTlTgEgVzApyQiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgA4iXFQiGiGAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCGQiGCHi9AAQi+AAiGiHgAsLKWQiKh1AAimQAAilCKh1QCKh0DEAAQDEAACKB0QCKB1AAClQAACmiKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_46 = new cjs.Graphics().p("EgEPAm3QlTlTAAngQAAnfFTlUQFTlTHfAAQHgAAFTFTQFTFUAAHfQAAHglTFTQlTFTngAAQnfAAlTlTgEgVzApuQiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgA4iXBQiGiGAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCGQiGCHi9AAQi+AAiGiHgAsLKSQiKh1AAimQAAilCKh1QCKh0DEAAQDEAACKB0QCKB1AAClQAACmiKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_47 = new cjs.Graphics().p("EgEPAmyQlTlTAAnfQAAngFTlTQFTlTHfAAQHgAAFTFTQFTFTAAHgQAAHflTFTQlTFUngAAQnfAAlTlUgEgVzAppQiGiGAAi9QAAi+CGiGQCHiGC9AAQC+AACGCGQCGCGAAC+QAAC9iGCGQiGCHi+AAQi9AAiHiHgA4iW9QiGiGAAi+QAAi9CGiHQCGiGC+AAQC9AACGCGQCHCHAAC9QAAC+iHCGQiGCGi9AAQi+AAiGiGgAsLKNQiKh1AAilQAAimCKh1QCKh0DEAAQDEAACKB0QCKB1AACmQAACliKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_48 = new cjs.Graphics().p("EgEPAmuQlTlTAAnfQAAngFTlTQFTlTHfAAQHgAAFTFTQFTFTAAHgQAAHflTFTQlTFUngAAQnfAAlTlUgEgVzAplQiGiGAAi9QAAi+CGiGQCHiGC9AAQC+AACGCGQCGCGAAC+QAAC9iGCGQiGCHi+AAQi9AAiHiHgA4iW5QiGiGAAi+QAAi9CGiHQCGiGC+AAQC9AACGCGQCHCHAAC9QAAC+iHCGQiGCGi9AAQi+AAiGiGgAsLKJQiKh1AAilQAAimCKh1QCKh0DEAAQDEAACKB0QCKB1AACmQAACliKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_49 = new cjs.Graphics().p("EgEPAmqQlTlTAAnfQAAngFTlTQFTlTHfAAQHgAAFTFTQFTFTAAHgQAAHflTFTQlTFUngAAQnfAAlTlUgEgVzAphQiGiGAAi9QAAi+CGiGQCHiGC9AAQC+AACGCGQCGCGAAC+QAAC9iGCGQiGCHi+AAQi9AAiHiHgA4iW1QiGiGAAi+QAAi9CGiHQCGiGC+AAQC9AACGCGQCHCHAAC9QAAC+iHCGQiGCGi9AAQi+AAiGiGgAsLKFQiKh1AAilQAAimCKh1QCKh0DEAAQDEAACKB0QCKB1AACmQAACliKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_50 = new cjs.Graphics().p("EgEPAlxQlTlTAAnfQAAngFTlTQFTlTHfAAQHgAAFTFTQFTFTAAHgQAAHflTFTQlTFUngAAQnfAAlTlUgEgVzAooQiGiGAAi9QAAi+CGiGQCHiGC9AAQC+AACGCGQCGCGAAC+QAAC9iGCGQiGCHi+AAQi9AAiHiHgA4iV8QiGiGAAi+QAAi9CGiHQCGiGC+AAQC9AACGCGQCHCHAAC9QAAC+iHCGQiGCGi9AAQi+AAiGiGgAsLJMQiKh1AAilQAAimCKh1QCKh0DEAAQDEAACKB0QCKB1AACmQAACliKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_51 = new cjs.Graphics().p("EgEPAk4QlTlTAAngQAAnfFTlUQFTlTHfAAQHgAAFTFTQFTFUAAHfQAAHglTFTQlTFTngAAQnfAAlTlTgEgVzAnvQiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgA4iVCQiGiGAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCGQiGCHi9AAQi+AAiGiHgAsLITQiKh1AAimQAAilCKh0QCKh1DEAAQDEAACKB1QCKB0AAClQAACmiKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_52 = new cjs.Graphics().p("EgEPAj/QlTlTAAngQAAnfFTlUQFTlTHfAAQHgAAFTFTQFTFUAAHfQAAHglTFTQlTFTngAAQnfAAlTlTgEgVzAm2QiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgA4iUJQiGiGAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCGQiGCHi9AAQi+AAiGiHgAsLHaQiKh1AAimQAAilCKh0QCKh1DEAAQDEAACKB1QCKB0AAClQAACmiKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_53 = new cjs.Graphics().p("EgEPAjFQlTlTAAnfQAAngFTlTQFTlTHfAAQHgAAFTFTQFTFTAAHgQAAHflTFTQlTFUngAAQnfAAlTlUgEgVzAl8QiGiGAAi9QAAi+CGiGQCHiGC9AAQC+AACGCGQCGCGAAC+QAAC9iGCGQiGCHi+AAQi9AAiHiHgA4iTQQiGiGAAi+QAAi9CGiHQCGiGC+AAQC9AACGCGQCHCHAAC9QAAC+iHCGQiGCGi9AAQi+AAiGiGgAsLGgQiKh1AAilQAAilCKh1QCKh1DEAAQDEAACKB1QCKB1AAClQAACliKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_54 = new cjs.Graphics().p("EgEPAiMQlTlTAAnfQAAngFTlTQFTlTHfAAQHgAAFTFTQFTFTAAHgQAAHflTFTQlTFUngAAQnfAAlTlUgEgVzAlDQiGiGAAi9QAAi+CGiGQCHiGC9AAQC+AACGCGQCGCGAAC+QAAC9iGCGQiGCHi+AAQi9AAiHiHgA4iSXQiGiGAAi+QAAi9CGiHQCGiGC+AAQC9AACGCGQCHCHAAC9QAAC+iHCGQiGCGi9AAQi+AAiGiGgAsLFnQiKh1AAilQAAilCKh1QCKh1DEAAQDEAACKB1QCKB1AAClQAACliKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_55 = new cjs.Graphics().p("EgEPAhTQlTlTAAnfQAAngFTlTQFTlTHfAAQHgAAFTFTQFTFTAAHgQAAHflTFTQlTFUngAAQnfAAlTlUgEgVzAkKQiGiGAAi9QAAi+CGiGQCHiGC9AAQC+AACGCGQCGCGAAC+QAAC9iGCGQiGCHi+AAQi9AAiHiHgA4iReQiGiGAAi+QAAi9CGiHQCGiGC+AAQC9AACGCGQCHCHAAC9QAAC+iHCGQiGCGi9AAQi+AAiGiGgAsLEuQiKh1AAilQAAilCKh1QCKh1DEAAQDEAACKB1QCKB1AAClQAACliKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_56 = new cjs.Graphics().p("EgEPAgaQlTlTAAngQAAnfFTlUQFTlTHfAAQHgAAFTFTQFTFUAAHfQAAHglTFTQlTFTngAAQnfAAlTlTgEgVzAjRQiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgA4iQkQiGiGAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCGQiGCHi9AAQi+AAiGiHgAsLD1QiKh1AAilQAAilCKh1QCKh1DEAAQDEAACKB1QCKB1AAClQAACliKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_57 = new cjs.Graphics().p("AkPfhQlTlTAAngQAAnfFTlUQFTlTHfAAQHgAAFTFTQFTFUAAHfQAAHglTFTQlTFTngAAQnfAAlTlTgEgVzAiYQiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgA4iPrQiGiGAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCGQiGCHi9AAQi+AAiGiHgAsLC8QiKh1AAilQAAilCKh1QCKh1DEAAQDEAACKB1QCKB1AAClQAACliKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_58 = new cjs.Graphics().p("AjtenQlTlTAAnfQAAngFTlTQFTlSHfAAQHgAAFTFSQFTFTAAHgQAAHflTFTQlTFUngAAQnfAAlTlUgEgVRAheQiGiGAAi9QAAi+CGiGQCHiGC9AAQC+AACGCGQCGCGAAC+QAAC9iGCGQiGCHi+AAQi9AAiHiHgA4AOyQiGiGAAi+QAAi9CGiHQCGiGC+AAQC9AACGCGQCHCHAAC9QAAC+iHCGQiGCGi9AAQi+AAiGiGgArpCCQiKh1AAikQAAimCKh1QCKh1DEAAQDEAACKB1QCKB1AACmQAACkiKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_59 = new cjs.Graphics().p("AinduQlTlTAAnfQAAngFTlTQFTlSHfAAQHgAAFTFSQFTFTAAHgQAAHflTFTQlTFUngAAQnfAAlTlUgEgULAglQiGiGAAi9QAAi+CGiGQCHiGC9AAQC+AACGCGQCGCGAAC+QAAC9iGCGQiGCHi+AAQi9AAiHiHgA26N5QiGiGAAi+QAAi9CGiHQCGiGC+AAQC9AACGCGQCHCHAAC9QAAC+iHCGQiGCGi9AAQi+AAiGiGgAqjBJQiKh0AAilQAAimCKh1QCKh1DEAAQDEAACKB1QCKB1AACmQAACliKB0QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_60 = new cjs.Graphics().p("Ahhc1QlTlTAAnfQAAngFTlTQFSlSHgAAQHfAAFTFSQFUFTAAHgQAAHflUFTQlTFUnfAAQngAAlSlUgAzFfsQiGiGAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCGQiGCHi9AAQi+AAiGiHgA11NAQiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgApdAQQiLh0AAilQAAimCLh1QCKh1DEAAQDDAACKB1QCKB1AACmQAACliKB0QiKB1jDAAQjEAAiKh1g");
	var mask_graphics_61 = new cjs.Graphics().p("Agbb8QlTlTAAngQAAnfFTlUQFSlSHgAAQHfAAFTFSQFUFUAAHfQAAHglUFTQlTFTnfAAQngAAlSlTgAx/ezQiGiGAAi+QAAi9CGiHQCGiGC+AAQC9AACGCGQCHCHAAC9QAAC+iHCGQiGCGi9AAQi+AAiGiGgA0vMGQiGiGAAi9QAAi+CGiGQCHiFC9AAQC+AACGCFQCGCGAAC+QAAC9iGCGQiGCHi+AAQi9AAiHiHgAoXgoQiLh1AAimQAAilCLh1QCKh1DEAAQDDAACKB1QCKB1AAClQAACmiKB1QiKB0jDAAQjEAAiKh0g");
	var mask_graphics_62 = new cjs.Graphics().p("AAqbDQlSlTAAngQAAnfFSlUQFTlSHgAAQHfAAFTFSQFUFUAAHfQAAHglUFTQlTFTnfAAQngAAlTlTgAw5d6QiGiGAAi+QAAi9CGiHQCGiGC+AAQC9AACGCGQCHCHAAC9QAAC+iHCGQiGCGi9AAQi+AAiGiGgAzpLNQiGiGAAi9QAAi+CGiGQCHiFC9AAQC+AACGCFQCGCGAAC+QAAC9iGCGQiGCHi+AAQi9AAiHiHgAnRhhQiLh1AAimQAAilCLh1QCKh1DEAAQDCAACLB1QCKB1AAClQAACmiKB1QiLB0jCAAQjEAAiKh0g");
	var mask_graphics_63 = new cjs.Graphics().p("ABwaJQlSlTAAnfQAAngFSlTQFTlSHgAAQHfAAFTFSQFUFTAAHgQAAHflUFTQlTFUnfAAQngAAlTlUgAvzdAQiGiGAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCGQiGCHi9AAQi+AAiGiHgAyjKUQiGiGAAi+QAAi9CGiHQCHiFC9AAQC+AACGCFQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgAmLibQiLh1AAilQAAimCLh1QCKh1DEAAQDCAACLB1QCKB1AACmQAACliKB1QiLB1jCAAQjEAAiKh1g");
	var mask_graphics_64 = new cjs.Graphics().p("AC2ZQQlSlTAAnfQAAngFSlSQFTlTHgAAQHfAAFTFTQFUFSAAHgQAAHflUFTQlTFUnfAAQngAAlTlUgAutcHQiGiGAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCGQiGCHi9AAQi+AAiGiHgAxdJbQiGiGAAi+QAAi9CGiGQCHiGC9AAQC+AACGCGQCGCGAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgAlFjUQiLh1AAilQAAimCLh1QCKh1DDAAQDDAACLB1QCKB1AACmQAACliKB1QiLB1jDAAQjDAAiKh1g");
	var mask_graphics_65 = new cjs.Graphics().p("AD7YXQlSlTAAnfQAAngFSlSQFUlTHfAAQHgAAFTFTQFTFSAAHgQAAHflTFTQlTFUngAAQnfAAlUlUgAtobOQiGiGAAi9QAAi+CGiGQCHiGC9AAQC+AACGCGQCGCGAAC+QAAC9iGCGQiGCHi+AAQi9AAiHiHgAwXIiQiGiGAAi+QAAi9CGiGQCGiGC+AAQC9AACGCGQCHCGAAC9QAAC+iHCGQiGCGi9AAQi+AAiGiGgAkAkNQiKh1AAilQAAimCKh1QCKh1DDAAQDEAACKB1QCLB1AACmQAACliLB1QiKB1jEAAQjDAAiKh1g");
	var mask_graphics_66 = new cjs.Graphics().p("AFBXeQlSlTAAngQAAnfFSlTQFUlTHfAAQHgAAFTFTQFTFTAAHfQAAHglTFTQlTFTngAAQnfAAlUlTgAsiaVQiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgAvRHoQiGiGAAi9QAAi9CGiGQCGiGC+AAQC9AACGCGQCHCGAAC9QAAC9iHCGQiGCHi9AAQi+AAiGiHgAi6lGQiKh1AAimQAAilCKh1QCKh1DDAAQDEAACKB1QCLB1AAClQAACmiLB1QiKB1jEAAQjDAAiKh1g");
	var mask_graphics_67 = new cjs.Graphics().p("AGHWlQlTlTAAngQAAnfFTlTQFUlTHfAAQHgAAFTFTQFTFTAAHfQAAHglTFTQlTFTngAAQnfAAlUlTgArcZcQiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCFCHAAC9QAAC+iFCGQiGCGi+AAQi9AAiHiGgAuLGvQiGiGAAi9QAAi9CGiGQCGiGC+AAQC9AACGCGQCHCGAAC9QAAC9iHCGQiGCHi9AAQi+AAiGiHgAh0l/QiKh1AAimQAAilCKh1QCJh1DEAAQDEAACKB1QCLB1AAClQAACmiLB1QiKB1jEAAQjEAAiJh1g");
	var mask_graphics_68 = new cjs.Graphics().p("AHNVrQlTlTAAnfQAAngFTlSQFUlTHfAAQHgAAFTFTQFTFSAAHgQAAHflTFTQlTFUngAAQnfAAlUlUgAqWYiQiGiGAAi9QAAi+CGiGQCHiGC9AAQC+AACGCGQCFCGAAC+QAAC9iFCGQiGCHi+AAQi9AAiHiHgAtFF2QiGiGAAi+QAAi8CGiHQCGiGC+AAQC9AACGCGQCHCHAAC8QAAC+iHCGQiGCGi9AAQi+AAiGiGgAgum5QiKh1AAilQAAimCKh1QCJh1DEAAQDEAACKB1QCLB1AACmQAACliLB1QiKB1jEAAQjEAAiJh1g");
	var mask_graphics_69 = new cjs.Graphics().p("AITUyQlTlTAAnfQAAngFTlSQFTlTHgAAQHfAAFTFTQFUFSAAHgQAAHflUFTQlTFUnfAAQngAAlTlUgApQXpQiGiGAAi9QAAi+CGiGQCGiGC+AAQC9AACFCGQCHCGAAC+QAAC9iHCGQiFCHi9AAQi+AAiGiHgAsAE9QiGiGAAi9QAAi9CGiHQCHiGC9AAQC+AACGCGQCFCHAAC9QAAC9iFCGQiGCGi+AAQi9AAiHiGgAAXnyQiKh1AAilQAAimCKh1QCKh1DEAAQDDAACLB1QCKB1AACmQAACliKB1QiLB1jDAAQjEAAiKh1g");
	var mask_graphics_70 = new cjs.Graphics().p("AJZT5QlTlTAAnfQAAnfFTlTQFTlTHgAAQHfAAFTFTQFUFTAAHfQAAHflUFTQlTFUnfAAQngAAlTlUgAoKWwQiGiGAAi9QAAi+CGiGQCGiGC+AAQC9AACFCGQCHCGAAC+QAAC9iHCGQiFCHi9AAQi+AAiGiHgAq6EEQiGiGAAi9QAAi9CGiHQCHiGC9AAQC+AACGCGQCFCHAAC9QAAC9iFCGQiGCGi+AAQi9AAiHiGgABdorQiKh1AAilQAAimCKh1QCKh1DEAAQDDAACLB1QCKB1AACmQAACliKB1QiLB1jDAAQjEAAiKh1g");
	var mask_graphics_71 = new cjs.Graphics().p("AKfTAQlTlTAAngQAAneFTlUQFTlTHgAAQHfAAFTFTQFUFUAAHeQAAHglUFTQlTFTnfAAQngAAlTlTgAnEV3QiGiGAAi+QAAi9CGiHQCGiGC+AAQC8AACGCGQCHCHAAC9QAAC+iHCGQiGCGi8AAQi+AAiGiGgAp0DKQiGiGAAi8QAAi+CGiGQCHiGC9AAQC+AACFCGQCGCGAAC+QAAC8iGCGQiFCHi+AAQi9AAiHiHgACjpkQiLh1AAimQAAilCLh1QCKh1DEAAQDDAACLB1QCKB1AAClQAACmiKB1QiLB1jDAAQjEAAiKh1g");
	var mask_graphics_72 = new cjs.Graphics().p("ALlSHQlTlTAAngQAAneFTlUQFTlTHgAAQHfAAFTFTQFUFUAAHeQAAHglUFTQlTFTnfAAQngAAlTlTgAl+U+QiGiGAAi+QAAi9CGiHQCGiGC+AAQC8AACGCGQCHCHAAC9QAAC+iHCGQiGCGi8AAQi+AAiGiGgAouCRQiGiGAAi8QAAi+CGiGQCHiGC9AAQC+AACFCGQCGCGAAC+QAAC8iGCGQiFCHi+AAQi9AAiHiHgADpqdQiLh1AAimQAAilCLh1QCKh1DEAAQDDAACLB1QCKB1AAClQAACmiKB1QiLB1jDAAQjEAAiKh1g");
	var mask_graphics_73 = new cjs.Graphics().p("AMqRNQlTlTAAnfQAAnfFTlTQFUlTHfAAQHgAAFTFTQFTFTAAHfQAAHflTFTQlTFUngAAQnfAAlUlUgAk5UEQiGiGAAi9QAAi+CGiGQCHiGC8AAQC+AACGCGQCGCGAAC+QAAC9iGCGQiGCHi+AAQi8AAiHiHgAnoBYQiGiFAAi+QAAi9CGiHQCGiGC+AAQC8AACGCGQCHCHAAC9QAAC+iHCFQiGCGi8AAQi+AAiGiGgAEurXQiKh1AAilQAAimCKh1QCKh1DEAAQDEAACKB1QCLB1AACmQAACliLB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_74 = new cjs.Graphics().p("ANwQ+QlTlTAAngQAAneFTlUQFUlTHfAAQHgAAFTFTQFTFUAAHeQAAHglTFTQlTFTngAAQnfAAlUlTgAjzT1QiGiGAAi+QAAi9CGiHQCHiGC8AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi8AAiHiGgAmiBIQiGiFAAi9QAAi+CGiGQCGiGC+AAQC8AACGCGQCHCGAAC+QAAC9iHCFQiGCHi8AAQi+AAiGiHgAF0rmQiKh1AAimQAAilCKh1QCKh1DEAAQDEAACKB1QCLB1AAClQAACmiLB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_75 = new cjs.Graphics().p("AO2Q+QlTlTAAngQAAneFTlUQFUlTHfAAQHgAAFTFTQFTFUAAHeQAAHglTFTQlTFTngAAQnfAAlUlTgAitT1QiGiGAAi+QAAi9CGiHQCHiGC8AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi8AAiHiGgAlcBIQiGiFAAi9QAAi+CGiGQCGiGC+AAQC8AACGCGQCHCGAAC+QAAC9iHCFQiGCHi8AAQi+AAiGiHgAG6rmQiKh1AAimQAAilCKh1QCKh1DEAAQDEAACKB1QCLB1AAClQAACmiLB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_76 = new cjs.Graphics().p("AN8Q+QlTlTAAngQAAneFTlUQFUlTHfAAQHgAAFTFTQFTFUAAHeQAAHglTFTQlTFTngAAQnfAAlUlTgAjnT1QiGiGAAi+QAAi9CGiHQCHiGC8AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi8AAiHiGgAmWBIQiGiFAAi9QAAi+CGiGQCGiGC+AAQC8AACGCGQCHCGAAC+QAAC9iHCFQiGCHi8AAQi+AAiGiHgAGArmQiKh1AAimQAAilCKh1QCKh1DEAAQDEAACKB1QCLB1AAClQAACmiLB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_77 = new cjs.Graphics().p("ANDQ+QlTlTAAngQAAneFTlUQFTlTHgAAQHfAAFTFTQFUFUAAHeQAAHglUFTQlTFTnfAAQngAAlTlTgAkgT1QiGiGAAi+QAAi9CGiHQCGiGC9AAQC9AACGCGQCHCHAAC9QAAC+iHCGQiGCGi9AAQi9AAiGiGgAnQBIQiGiFAAi9QAAi+CGiGQCHiGC9AAQC9AACGCGQCGCGAAC+QAAC9iGCFQiGCHi9AAQi9AAiHiHgAFHrmQiLh1AAimQAAilCLh1QCKh1DEAAQDDAACLB1QCKB1AAClQAACmiKB1QiLB1jDAAQjEAAiKh1g");
	var mask_graphics_78 = new cjs.Graphics().p("AMJQ+QlTlTAAngQAAneFTlUQFTlTHgAAQHfAAFTFTQFUFUAAHeQAAHglUFTQlTFTnfAAQngAAlTlTgAlaT1QiGiGAAi+QAAi9CGiHQCGiGC+AAQC8AACGCGQCHCHAAC9QAAC+iHCGQiGCGi8AAQi+AAiGiGgAoKBIQiGiFAAi9QAAi+CGiGQCHiGC9AAQC+AACFCGQCGCGAAC+QAAC9iGCFQiFCHi+AAQi9AAiHiHgAENrmQiLh1AAimQAAilCLh1QCKh1DEAAQDDAACLB1QCKB1AAClQAACmiKB1QiLB1jDAAQjEAAiKh1g");
	var mask_graphics_79 = new cjs.Graphics().p("ALPQ+QlTlTAAngQAAneFTlUQFTlTHgAAQHfAAFTFTQFUFUAAHeQAAHglUFTQlTFTnfAAQngAAlTlTgAmUT1QiGiGAAi+QAAi9CGiHQCGiGC+AAQC8AACGCGQCHCHAAC9QAAC+iHCGQiGCGi8AAQi+AAiGiGgApEBIQiGiFAAi9QAAi+CGiGQCHiGC9AAQC+AACFCGQCGCGAAC+QAAC9iGCFQiFCHi+AAQi9AAiHiHgADTrmQiLh1AAimQAAilCLh1QCKh1DEAAQDDAACLB1QCKB1AAClQAACmiKB1QiLB1jDAAQjEAAiKh1g");
	var mask_graphics_80 = new cjs.Graphics().p("AKVQ+QlTlTAAngQAAneFTlUQFTlTHgAAQHfAAFTFTQFUFUAAHeQAAHglUFTQlTFTnfAAQngAAlTlTgAnOT1QiGiGAAi+QAAi9CGiHQCGiGC+AAQC8AACGCGQCHCHAAC9QAAC+iHCGQiGCGi8AAQi+AAiGiGgAp+BIQiGiFAAi9QAAi+CGiGQCHiGC9AAQC+AACFCGQCGCGAAC+QAAC9iGCFQiFCHi+AAQi9AAiHiHgACZrmQiLh1AAimQAAilCLh1QCKh1DEAAQDDAACLB1QCKB1AAClQAACmiKB1QiLB1jDAAQjEAAiKh1g");
	var mask_graphics_81 = new cjs.Graphics().p("AJbQ+QlTlTAAngQAAneFTlUQFUlTHfAAQHgAAFTFTQFTFUAAHeQAAHglTFTQlTFTngAAQnfAAlUlTgAoIT1QiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACFCGQCGCHAAC9QAAC+iGCGQiFCGi+AAQi9AAiHiGgAq3BIQiGiFAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCGCGAAC+QAAC9iGCFQiGCHi9AAQi+AAiGiHgABfrmQiJh1AAimQAAilCJh1QCKh1DEAAQDEAACKB1QCLB1AAClQAACmiLB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_82 = new cjs.Graphics().p("AIhQ+QlTlTAAngQAAneFTlUQFUlTHfAAQHgAAFTFTQFTFUAAHeQAAHglTFTQlTFTngAAQnfAAlUlTgApCT1QiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACFCGQCGCHAAC9QAAC+iGCGQiFCGi+AAQi9AAiHiGgArxBIQiGiFAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCGCGAAC+QAAC9iGCFQiGCHi9AAQi+AAiGiHgAAlrmQiJh1AAimQAAilCJh1QCKh1DEAAQDEAACKB1QCLB1AAClQAACmiLB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_83 = new cjs.Graphics().p("AHnQ+QlTlTAAngQAAneFTlUQFUlTHfAAQHgAAFTFTQFTFUAAHeQAAHglTFTQlTFTngAAQnfAAlUlTgAp8T1QiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACFCGQCGCHAAC9QAAC+iGCGQiFCGi+AAQi9AAiHiGgAsrBIQiGiFAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCFQiGCHi9AAQi+AAiGiHgAgUrmQiKh1AAimQAAilCKh1QCJh1DEAAQDEAACKB1QCLB1AAClQAACmiLB1QiKB1jEAAQjEAAiJh1g");
	var mask_graphics_84 = new cjs.Graphics().p("AGtQ+QlTlTAAngQAAneFTlUQFUlTHfAAQHgAAFTFTQFTFUAAHeQAAHglTFTQlTFTngAAQnfAAlUlTgAq2T1QiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCFCHAAC9QAAC+iFCGQiGCGi+AAQi9AAiHiGgAtlBIQiGiFAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCFQiGCHi9AAQi+AAiGiHgAhOrmQiKh1AAimQAAilCKh1QCJh1DEAAQDEAACKB1QCLB1AAClQAACmiLB1QiKB1jEAAQjEAAiJh1g");
	var mask_graphics_85 = new cjs.Graphics().p("AF0Q+QlTlTAAngQAAneFTlUQFTlTHgAAQHfAAFTFTQFUFUAAHeQAAHglUFTQlTFTnfAAQngAAlTlTgArvT1QiGiGAAi+QAAi9CGiHQCGiGC+AAQC9AACGCGQCGCHAAC9QAAC+iGCGQiGCGi9AAQi+AAiGiGgAufBIQiGiFAAi9QAAi+CGiGQCHiGC9AAQC+AACGCGQCGCGAAC+QAAC9iGCFQiGCHi+AAQi9AAiHiHgAiHrmQiLh1AAimQAAilCLh1QCJh1DEAAQDDAACLB1QCKB1AAClQAACmiKB1QiLB1jDAAQjEAAiJh1g");
	var mask_graphics_86 = new cjs.Graphics().p("AE6Q+QlSlTAAngQAAneFSlUQFTlTHgAAQHfAAFTFTQFUFUAAHeQAAHglUFTQlTFTnfAAQngAAlTlTgAspT1QiGiGAAi+QAAi9CGiHQCGiGC+AAQC9AACGCGQCHCHAAC9QAAC+iHCGQiGCGi9AAQi+AAiGiGgAvZBIQiGiFAAi9QAAi+CGiGQCHiGC9AAQC+AACGCGQCGCGAAC+QAAC9iGCFQiGCHi+AAQi9AAiHiHgAjBrmQiLh1AAimQAAilCLh1QCKh1DDAAQDDAACLB1QCKB1AAClQAACmiKB1QiLB1jDAAQjDAAiKh1g");
	var mask_graphics_87 = new cjs.Graphics().p("AEAQ+QlSlTAAngQAAneFSlUQFTlTHgAAQHfAAFTFTQFUFUAAHeQAAHglUFTQlTFTnfAAQngAAlTlTgAtjT1QiGiGAAi+QAAi9CGiHQCGiGC+AAQC9AACGCGQCHCHAAC9QAAC+iHCGQiGCGi9AAQi+AAiGiGgAwTBIQiGiFAAi9QAAi+CGiGQCHiGC9AAQC+AACGCGQCGCGAAC+QAAC9iGCFQiGCHi+AAQi9AAiHiHgAj7rmQiLh1AAimQAAilCLh1QCKh1DDAAQDDAACLB1QCKB1AAClQAACmiKB1QiLB1jDAAQjDAAiKh1g");
	var mask_graphics_88 = new cjs.Graphics().p("ADGQ+QlSlTAAngQAAneFSlUQFUlTHfAAQHgAAFTFTQFTFUAAHeQAAHglTFTQlTFTngAAQnfAAlUlTgAudT1QiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgAxMBIQiGiFAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCFQiGCHi9AAQi+AAiGiHgAk1rmQiKh1AAimQAAilCKh1QCKh1DDAAQDEAACKB1QCLB1AAClQAACmiLB1QiKB1jEAAQjDAAiKh1g");
	var mask_graphics_89 = new cjs.Graphics().p("ACMQ+QlSlTAAngQAAneFSlUQFUlTHfAAQHgAAFTFTQFTFUAAHeQAAHglTFTQlTFTngAAQnfAAlUlTgAvXT1QiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgAyGBIQiGiFAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCFQiGCHi9AAQi+AAiGiHgAlvrmQiKh1AAimQAAilCKh1QCKh1DEAAQDDAACKB1QCLB1AAClQAACmiLB1QiKB1jDAAQjEAAiKh1g");
	var mask_graphics_90 = new cjs.Graphics().p("ABSQ+QlSlTAAngQAAneFSlUQFUlTHfAAQHgAAFTFTQFTFUAAHeQAAHglTFTQlTFTngAAQnfAAlUlTgAwRT1QiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgAzABIQiGiFAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCFQiGCHi9AAQi+AAiGiHgAmprmQiKh1AAimQAAilCKh1QCKh1DEAAQDDAACKB1QCLB1AAClQAACmiLB1QiKB1jDAAQjEAAiKh1g");
	var mask_graphics_91 = new cjs.Graphics().p("AAYQ+QlSlTAAngQAAneFSlUQFUlTHfAAQHgAAFTFTQFTFUAAHeQAAHglTFTQlTFTngAAQnfAAlUlTgAxLT1QiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgAz6BIQiGiFAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCFQiGCHi9AAQi+AAiGiHgAnjrmQiKh1AAimQAAilCKh1QCKh1DEAAQDDAACKB1QCLB1AAClQAACmiLB1QiKB1jDAAQjEAAiKh1g");
	var mask_graphics_92 = new cjs.Graphics().p("AggQ+QlTlTAAngQAAneFTlUQFSlTHgAAQHfAAFTFTQFUFUAAHeQAAHglUFTQlTFTnfAAQngAAlSlTgAyET1QiGiGAAi+QAAi9CGiHQCGiGC+AAQC9AACGCGQCHCHAAC9QAAC+iHCGQiGCGi9AAQi+AAiGiGgA00BIQiGiFAAi9QAAi+CGiGQCHiGC9AAQC+AACGCGQCGCGAAC+QAAC9iGCFQiGCHi+AAQi9AAiHiHgAocrmQiLh1AAimQAAilCLh1QCKh1DEAAQDDAACKB1QCKB1AAClQAACmiKB1QiKB1jDAAQjEAAiKh1g");
	var mask_graphics_93 = new cjs.Graphics().p("AhaQ+QlTlTAAngQAAneFTlUQFSlTHgAAQHfAAFTFTQFUFUAAHeQAAHglUFTQlTFTnfAAQngAAlSlTgAy+T1QiGiGAAi+QAAi9CGiHQCGiGC+AAQC9AACGCGQCHCHAAC9QAAC+iHCGQiGCGi9AAQi+AAiGiGgA1uBIQiGiFAAi9QAAi+CGiGQCHiGC9AAQC+AACGCGQCGCGAAC+QAAC9iGCFQiGCHi+AAQi9AAiHiHgApWrmQiLh1AAimQAAilCLh1QCKh1DEAAQDDAACKB1QCKB1AAClQAACmiKB1QiKB1jDAAQjEAAiKh1g");
	var mask_graphics_94 = new cjs.Graphics().p("AiUQ+QlTlTAAngQAAneFTlUQFSlTHgAAQHfAAFTFTQFUFUAAHeQAAHglUFTQlTFTnfAAQngAAlSlTgAz4T1QiGiGAAi+QAAi9CGiHQCGiGC+AAQC9AACGCGQCHCHAAC9QAAC+iHCGQiGCGi9AAQi+AAiGiGgA2oBIQiGiFAAi9QAAi+CGiGQCHiGC9AAQC+AACGCGQCGCGAAC+QAAC9iGCFQiGCHi+AAQi9AAiHiHgAqQrmQiLh1AAimQAAilCLh1QCKh1DEAAQDDAACKB1QCKB1AAClQAACmiKB1QiKB1jDAAQjEAAiKh1g");
	var mask_graphics_95 = new cjs.Graphics().p("AjOQ+QlTlTAAngQAAneFTlUQFTlTHfAAQHgAAFTFTQFTFUAAHeQAAHglTFTQlTFTngAAQnfAAlTlTgA0yT1QiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgA3hBIQiGiFAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCFQiGCHi9AAQi+AAiGiHgArKrmQiKh1AAimQAAilCKh1QCKh1DEAAQDEAACKB1QCKB1AAClQAACmiKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_96 = new cjs.Graphics().p("AkIQ+QlTlTAAngQAAneFTlUQFTlTHfAAQHgAAFTFTQFTFUAAHeQAAHglTFTQlTFTngAAQnfAAlTlTgA1sT1QiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgA4bBIQiGiFAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCFQiGCHi9AAQi+AAiGiHgAsErmQiKh1AAimQAAilCKh1QCKh1DEAAQDEAACKB1QCKB1AAClQAACmiKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_97 = new cjs.Graphics().p("AkPQ+QlTlTAAngQAAneFTlUQFTlTHfAAQHgAAFTFTQFTFUAAHeQAAHglTFTQlTFTngAAQnfAAlTlTgA1zT1QiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgA4iBIQiGiFAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCFQiGCHi9AAQi+AAiGiHgAsLrmQiKh1AAimQAAilCKh1QCKh1DEAAQDEAACKB1QCKB1AAClQAACmiKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_98 = new cjs.Graphics().p("AkPQ+QlTlTAAngQAAneFTlUQFTlTHfAAQHgAAFTFTQFTFUAAHeQAAHglTFTQlTFTngAAQnfAAlTlTgA1zT1QiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgA4iBIQiGiFAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCFQiGCHi9AAQi+AAiGiHgAsLrmQiKh1AAimQAAilCKh1QCKh1DEAAQDEAACKB1QCKB1AAClQAACmiKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_99 = new cjs.Graphics().p("AkPQ+QlTlTAAngQAAneFTlUQFTlTHfAAQHgAAFTFTQFTFUAAHeQAAHglTFTQlTFTngAAQnfAAlTlTgA1zT1QiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgA4iBIQiGiFAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCFQiGCHi9AAQi+AAiGiHgAsLrmQiKh1AAimQAAilCKh1QCKh1DEAAQDEAACKB1QCKB1AAClQAACmiKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_100 = new cjs.Graphics().p("AkPQ+QlTlTAAngQAAneFTlUQFTlTHfAAQHgAAFTFTQFTFUAAHeQAAHglTFTQlTFTngAAQnfAAlTlTgA1zT1QiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgA4iBIQiGiFAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCFQiGCHi9AAQi+AAiGiHgAsLrmQiKh1AAimQAAilCKh1QCKh1DEAAQDEAACKB1QCKB1AAClQAACmiKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_101 = new cjs.Graphics().p("AkPQ+QlTlTAAngQAAneFTlUQFTlTHfAAQHgAAFTFTQFTFUAAHeQAAHglTFTQlTFTngAAQnfAAlTlTgA1zT1QiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgA4iBIQiGiFAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCFQiGCHi9AAQi+AAiGiHgAsLrmQiKh1AAimQAAilCKh1QCKh1DEAAQDEAACKB1QCKB1AAClQAACmiKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_102 = new cjs.Graphics().p("AkPQ+QlTlTAAngQAAneFTlUQFTlTHfAAQHgAAFTFTQFTFUAAHeQAAHglTFTQlTFTngAAQnfAAlTlTgA1zT1QiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgA4iBIQiGiFAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCFQiGCHi9AAQi+AAiGiHgAsLrmQiKh1AAimQAAilCKh1QCKh1DEAAQDEAACKB1QCKB1AAClQAACmiKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_103 = new cjs.Graphics().p("AkPQ+QlTlTAAngQAAneFTlUQFTlTHfAAQHgAAFTFTQFTFUAAHeQAAHglTFTQlTFTngAAQnfAAlTlTgA1zT1QiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgA4iBIQiGiFAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCFQiGCHi9AAQi+AAiGiHgAsLrmQiKh1AAimQAAilCKh1QCKh1DEAAQDEAACKB1QCKB1AAClQAACmiKB1QiKB1jEAAQjEAAiKh1g");
	var mask_graphics_104 = new cjs.Graphics().p("AkPQ+QlTlTAAngQAAneFTlUQFTlTHfAAQHgAAFTFTQFTFUAAHeQAAHglTFTQlTFTngAAQnfAAlTlTgA1zT1QiGiGAAi+QAAi9CGiHQCHiGC9AAQC+AACGCGQCGCHAAC9QAAC+iGCGQiGCGi+AAQi9AAiHiGgA4iBIQiGiFAAi9QAAi+CGiGQCGiGC+AAQC9AACGCGQCHCGAAC+QAAC9iHCFQiGCHi9AAQi+AAiGiHgAsLrmQiKh1AAimQAAilCKh1QCKh1DEAAQDEAACKB1QCKB1AAClQAACmiKB1QiKB1jEAAQjEAAiKh1g");

	this.timeline.addTween(cjs.Tween.get(mask).to({graphics:mask_graphics_0,x:74.825,y:74.375}).wait(1).to({graphics:mask_graphics_1,x:88.2583,y:89.6396}).wait(1).to({graphics:mask_graphics_2,x:101.6917,y:104.9042}).wait(1).to({graphics:mask_graphics_3,x:115.125,y:120.1688}).wait(1).to({graphics:mask_graphics_4,x:128.5583,y:135.4333}).wait(1).to({graphics:mask_graphics_5,x:141.9917,y:146.6115}).wait(1).to({graphics:mask_graphics_6,x:155.425,y:154.2438}).wait(1).to({graphics:mask_graphics_7,x:168.8583,y:161.876}).wait(1).to({graphics:mask_graphics_8,x:176.4083,y:169.5083}).wait(1).to({graphics:mask_graphics_9,x:183.125,y:177.1406}).wait(1).to({graphics:mask_graphics_10,x:189.8417,y:184.7729}).wait(1).to({graphics:mask_graphics_11,x:196.5583,y:192.4052}).wait(1).to({graphics:mask_graphics_12,x:203.275,y:200.0375}).wait(1).to({graphics:mask_graphics_13,x:209.9917,y:207.6698}).wait(1).to({graphics:mask_graphics_14,x:216.7083,y:215.3021}).wait(1).to({graphics:mask_graphics_15,x:223.425,y:222.9344}).wait(1).to({graphics:mask_graphics_16,x:230.1417,y:230.5667}).wait(1).to({graphics:mask_graphics_17,x:236.8583,y:238.199}).wait(1).to({graphics:mask_graphics_18,x:243.575,y:245.8313}).wait(1).to({graphics:mask_graphics_19,x:250.2917,y:253.4635}).wait(1).to({graphics:mask_graphics_20,x:257.0083,y:261.0958}).wait(1).to({graphics:mask_graphics_21,x:263.725,y:268.7281}).wait(1).to({graphics:mask_graphics_22,x:270.4417,y:276.3604}).wait(1).to({graphics:mask_graphics_23,x:277.1583,y:283.9927}).wait(1).to({graphics:mask_graphics_24,x:283.875,y:291.625}).wait(1).to({graphics:mask_graphics_25,x:276.961,y:291.215}).wait(1).to({graphics:mask_graphics_26,x:270.047,y:290.805}).wait(1).to({graphics:mask_graphics_27,x:263.133,y:290.395}).wait(1).to({graphics:mask_graphics_28,x:256.219,y:289.985}).wait(1).to({graphics:mask_graphics_29,x:249.305,y:289.575}).wait(1).to({graphics:mask_graphics_30,x:242.391,y:289.165}).wait(1).to({graphics:mask_graphics_31,x:235.477,y:288.755}).wait(1).to({graphics:mask_graphics_32,x:228.563,y:288.345}).wait(1).to({graphics:mask_graphics_33,x:221.649,y:287.935}).wait(1).to({graphics:mask_graphics_34,x:214.735,y:287.525}).wait(1).to({graphics:mask_graphics_35,x:207.821,y:287.115}).wait(1).to({graphics:mask_graphics_36,x:200.907,y:286.705}).wait(1).to({graphics:mask_graphics_37,x:193.993,y:286.295}).wait(1).to({graphics:mask_graphics_38,x:187.079,y:285.885}).wait(1).to({graphics:mask_graphics_39,x:180.165,y:285.475}).wait(1).to({graphics:mask_graphics_40,x:173.251,y:285.065}).wait(1).to({graphics:mask_graphics_41,x:162.149,y:284.655}).wait(1).to({graphics:mask_graphics_42,x:148.321,y:284.245}).wait(1).to({graphics:mask_graphics_43,x:134.493,y:283.835}).wait(1).to({graphics:mask_graphics_44,x:120.665,y:283.425}).wait(1).to({graphics:mask_graphics_45,x:106.837,y:283.015}).wait(1).to({graphics:mask_graphics_46,x:93.009,y:282.605}).wait(1).to({graphics:mask_graphics_47,x:79.181,y:282.195}).wait(1).to({graphics:mask_graphics_48,x:65.353,y:281.785}).wait(1).to({graphics:mask_graphics_49,x:51.525,y:281.375}).wait(1).to({graphics:mask_graphics_50,x:65.5019,y:275.6548}).wait(1).to({graphics:mask_graphics_51,x:79.4788,y:269.9346}).wait(1).to({graphics:mask_graphics_52,x:93.4558,y:264.2144}).wait(1).to({graphics:mask_graphics_53,x:107.4327,y:258.4942}).wait(1).to({graphics:mask_graphics_54,x:121.4096,y:252.774}).wait(1).to({graphics:mask_graphics_55,x:135.3865,y:247.0539}).wait(1).to({graphics:mask_graphics_56,x:149.3635,y:241.3337}).wait(1).to({graphics:mask_graphics_57,x:163.3404,y:235.6135}).wait(1).to({graphics:mask_graphics_58,x:173.9212,y:229.8933}).wait(1).to({graphics:mask_graphics_59,x:180.9096,y:224.1731}).wait(1).to({graphics:mask_graphics_60,x:187.8981,y:218.4529}).wait(1).to({graphics:mask_graphics_61,x:194.8865,y:212.7327}).wait(1).to({graphics:mask_graphics_62,x:201.875,y:207.0125}).wait(1).to({graphics:mask_graphics_63,x:208.8635,y:201.2923}).wait(1).to({graphics:mask_graphics_64,x:215.8519,y:195.5721}).wait(1).to({graphics:mask_graphics_65,x:222.8404,y:189.8519}).wait(1).to({graphics:mask_graphics_66,x:229.8289,y:184.1317}).wait(1).to({graphics:mask_graphics_67,x:236.8173,y:178.4115}).wait(1).to({graphics:mask_graphics_68,x:243.8058,y:172.6914}).wait(1).to({graphics:mask_graphics_69,x:250.7942,y:166.9712}).wait(1).to({graphics:mask_graphics_70,x:257.7827,y:161.251}).wait(1).to({graphics:mask_graphics_71,x:264.7712,y:155.5308}).wait(1).to({graphics:mask_graphics_72,x:271.7596,y:149.8106}).wait(1).to({graphics:mask_graphics_73,x:278.7481,y:144.0904}).wait(1).to({graphics:mask_graphics_74,x:285.7365,y:134.2154}).wait(1).to({graphics:mask_graphics_75,x:292.725,y:122.775}).wait(1).to({graphics:mask_graphics_76,x:286.9388,y:122.775}).wait(1).to({graphics:mask_graphics_77,x:281.1526,y:122.775}).wait(1).to({graphics:mask_graphics_78,x:275.3664,y:122.775}).wait(1).to({graphics:mask_graphics_79,x:269.5802,y:122.775}).wait(1).to({graphics:mask_graphics_80,x:263.794,y:122.775}).wait(1).to({graphics:mask_graphics_81,x:258.0078,y:122.775}).wait(1).to({graphics:mask_graphics_82,x:252.2216,y:122.775}).wait(1).to({graphics:mask_graphics_83,x:246.4353,y:122.775}).wait(1).to({graphics:mask_graphics_84,x:240.6491,y:122.775}).wait(1).to({graphics:mask_graphics_85,x:234.8629,y:122.775}).wait(1).to({graphics:mask_graphics_86,x:229.0767,y:122.775}).wait(1).to({graphics:mask_graphics_87,x:223.2905,y:122.775}).wait(1).to({graphics:mask_graphics_88,x:217.5043,y:122.775}).wait(1).to({graphics:mask_graphics_89,x:211.7181,y:122.775}).wait(1).to({graphics:mask_graphics_90,x:205.9319,y:122.775}).wait(1).to({graphics:mask_graphics_91,x:200.1457,y:122.775}).wait(1).to({graphics:mask_graphics_92,x:194.3595,y:122.775}).wait(1).to({graphics:mask_graphics_93,x:188.5733,y:122.775}).wait(1).to({graphics:mask_graphics_94,x:182.7871,y:122.775}).wait(1).to({graphics:mask_graphics_95,x:177.0009,y:122.775}).wait(1).to({graphics:mask_graphics_96,x:171.2147,y:122.775}).wait(1).to({graphics:mask_graphics_97,x:160.3319,y:122.775}).wait(1).to({graphics:mask_graphics_98,x:148.7595,y:122.775}).wait(1).to({graphics:mask_graphics_99,x:137.1871,y:122.775}).wait(1).to({graphics:mask_graphics_100,x:125.6147,y:122.775}).wait(1).to({graphics:mask_graphics_101,x:114.0422,y:122.775}).wait(1).to({graphics:mask_graphics_102,x:102.4698,y:122.775}).wait(1).to({graphics:mask_graphics_103,x:90.8974,y:122.775}).wait(1).to({graphics:mask_graphics_104,x:79.325,y:122.775}).wait(1));

	// Layer_2
	this.instance = new lib._1187120_409050025866907_1746489663_n();
	this.instance.setTransform(-118,-86,0.75,1.211);

	var maskedShapeInstanceList = [this.instance];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(105));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-118,-68.1,703.5,651.4);


(lib.Symbol1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_40();
	this.instance.setTransform(0,0,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_41();
	this.instance_1.setTransform(-21.95,0,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_42();
	this.instance_2.setTransform(-1.9,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-21.9,0,197,78.5);


(lib.home3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_35();
	this.instance.setTransform(12.95,0,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_34();
	this.instance_1.setTransform(0,0.3,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_37();
	this.instance_2.setTransform(19.2,0,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_36();
	this.instance_3.setTransform(8,0.3,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_39();
	this.instance_4.setTransform(3.5,0,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_38();
	this.instance_5.setTransform(-12,0.3,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).to({state:[{t:this.instance_3},{t:this.instance_2}]},1).to({state:[{t:this.instance_5},{t:this.instance_4}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-12,0,145,59.5);


(lib.Symbol2_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FF0000").ss(23,1,1).p("AiiisIFFFZ");
	this.shape.setTransform(16.25,17.25);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-11.5,-11.5,55.5,57.5);


(lib.btnoff = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.itunes();
	this.instance.setTransform(-22,-8,0.1096,0.1017);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(2).to({scaleX:0.0822,scaleY:0.0705,x:-15,y:0},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-22,-8,56.1,52.1);


(lib.btngithub = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_31();
	this.instance.setTransform(0,0,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_32();
	this.instance_1.setTransform(-4.95,0,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_33();
	this.instance_2.setTransform(4.05,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4.9,0,119,41);


(lib.btn_trs = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_28();
	this.instance.setTransform(0,0,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_29();
	this.instance_1.setTransform(-4.95,0,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_30();
	this.instance_2.setTransform(3.1,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4.9,0,60,51);


(lib.btn_ig = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_25();
	this.instance.setTransform(0,0,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_26();
	this.instance_1.setTransform(-2.95,0,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_27();
	this.instance_2.setTransform(7.95,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.9,0,158,41);


(lib.btn_fb = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_22();
	this.instance.setTransform(0,0,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_23();
	this.instance_1.setTransform(-5.95,0,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_24();
	this.instance_2.setTransform(11.05,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-5.9,0,164.5,41);


(lib.BACK = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_19();
	this.instance.setTransform(0,0,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_20();
	this.instance_1.setTransform(-6.05,0,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_21();
	this.instance_2.setTransform(2.9,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-6,0,62,51);


(lib.an_logo = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// kotak (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	var mask_graphics_0 = new cjs.Graphics().p("AlnL4IAA3vILPAAIAAXvg");
	var mask_graphics_1 = new cjs.Graphics().p("AvXL4IAA3vILQAAIAAXvg");
	var mask_graphics_2 = new cjs.Graphics().p("AtkL4IAA3vILQAAIAAXvg");
	var mask_graphics_3 = new cjs.Graphics().p("ArwL4IAA3vILQAAIAAXvg");
	var mask_graphics_4 = new cjs.Graphics().p("Ap9L4IAA3vILPAAIAAXvg");
	var mask_graphics_5 = new cjs.Graphics().p("AoJL4IAA3vILPAAIAAXvg");
	var mask_graphics_6 = new cjs.Graphics().p("AmVL4IAA3vILPAAIAAXvg");
	var mask_graphics_7 = new cjs.Graphics().p("AlnL4IAA3vILPAAIAAXvg");
	var mask_graphics_8 = new cjs.Graphics().p("AlnL4IAA3vILPAAIAAXvg");
	var mask_graphics_9 = new cjs.Graphics().p("AlnL4IAA3vILPAAIAAXvg");
	var mask_graphics_10 = new cjs.Graphics().p("AkvL4IAA3vILPAAIAAXvg");
	var mask_graphics_11 = new cjs.Graphics().p("Ai7L4IAA3vILPAAIAAXvg");
	var mask_graphics_12 = new cjs.Graphics().p("AhHL4IAA3vILPAAIAAXvg");
	var mask_graphics_13 = new cjs.Graphics().p("AArL4IAA3vILQAAIAAXvg");
	var mask_graphics_14 = new cjs.Graphics().p("ACfL4IAA3vILQAAIAAXvg");
	var mask_graphics_15 = new cjs.Graphics().p("AESL4IAA3vILQAAIAAXvg");
	var mask_graphics_16 = new cjs.Graphics().p("AGGL4IAA3vILQAAIAAXvg");
	var mask_graphics_17 = new cjs.Graphics().p("AH6L4IAA3vILQAAIAAXvg");
	var mask_graphics_18 = new cjs.Graphics().p("AJtL4IAA3vILQAAIAAXvg");
	var mask_graphics_19 = new cjs.Graphics().p("ALhL4IAA3vILQAAIAAXvg");
	var mask_graphics_20 = new cjs.Graphics().p("ANUL4IAA3vILQAAIAAXvg");
	var mask_graphics_21 = new cjs.Graphics().p("APIL4IAA3vILQAAIAAXvg");
	var mask_graphics_22 = new cjs.Graphics().p("AQ8L4IAA3vILQAAIAAXvg");
	var mask_graphics_23 = new cjs.Graphics().p("ASvL4IAA3vILQAAIAAXvg");
	var mask_graphics_24 = new cjs.Graphics().p("AlnL4IAA3vILPAAIAAXvg");
	var mask_graphics_25 = new cjs.Graphics().p("AS0L4IAA3vILQAAIAAXvg");
	var mask_graphics_26 = new cjs.Graphics().p("ARFL4IAA3vILQAAIAAXvg");
	var mask_graphics_27 = new cjs.Graphics().p("APWL4IAA3vILQAAIAAXvg");
	var mask_graphics_28 = new cjs.Graphics().p("ANnL4IAA3vILQAAIAAXvg");
	var mask_graphics_29 = new cjs.Graphics().p("AL4L4IAA3vILQAAIAAXvg");
	var mask_graphics_30 = new cjs.Graphics().p("AKJL4IAA3vILQAAIAAXvg");
	var mask_graphics_31 = new cjs.Graphics().p("AIaL4IAA3vILQAAIAAXvg");
	var mask_graphics_32 = new cjs.Graphics().p("AGrL4IAA3vILQAAIAAXvg");
	var mask_graphics_33 = new cjs.Graphics().p("AE8L4IAA3vILQAAIAAXvg");
	var mask_graphics_34 = new cjs.Graphics().p("ADNL4IAA3vILQAAIAAXvg");
	var mask_graphics_35 = new cjs.Graphics().p("ABeL4IAA3vILQAAIAAXvg");
	var mask_graphics_36 = new cjs.Graphics().p("AgQL4IAA3vILPAAIAAXvg");
	var mask_graphics_37 = new cjs.Graphics().p("Ah/L4IAA3vILPAAIAAXvg");
	var mask_graphics_38 = new cjs.Graphics().p("AjuL4IAA3vILPAAIAAXvg");
	var mask_graphics_39 = new cjs.Graphics().p("AldL4IAA3vILPAAIAAXvg");
	var mask_graphics_40 = new cjs.Graphics().p("AlnL4IAA3vILPAAIAAXvg");
	var mask_graphics_41 = new cjs.Graphics().p("AlnL4IAA3vILPAAIAAXvg");
	var mask_graphics_42 = new cjs.Graphics().p("AlnL4IAA3vILPAAIAAXvg");
	var mask_graphics_43 = new cjs.Graphics().p("AmxL4IAA3vILPAAIAAXvg");
	var mask_graphics_44 = new cjs.Graphics().p("AogL4IAA3vILPAAIAAXvg");
	var mask_graphics_45 = new cjs.Graphics().p("AqPL4IAA3vILPAAIAAXvg");
	var mask_graphics_46 = new cjs.Graphics().p("Ar+L4IAA3vILQAAIAAXvg");
	var mask_graphics_47 = new cjs.Graphics().p("AttL4IAA3vILQAAIAAXvg");
	var mask_graphics_48 = new cjs.Graphics().p("AvcL4IAA3vILQAAIAAXvg");
	var mask_graphics_49 = new cjs.Graphics().p("AlnL4IAA3vILPAAIAAXvg");

	this.timeline.addTween(cjs.Tween.get(mask).to({graphics:mask_graphics_0,x:-184,y:43.05}).wait(1).to({graphics:mask_graphics_1,x:-98.4375,y:43.05}).wait(1).to({graphics:mask_graphics_2,x:-86.875,y:43.05}).wait(1).to({graphics:mask_graphics_3,x:-75.3125,y:43.05}).wait(1).to({graphics:mask_graphics_4,x:-63.75,y:43.05}).wait(1).to({graphics:mask_graphics_5,x:-52.1875,y:43.05}).wait(1).to({graphics:mask_graphics_6,x:-40.625,y:43.05}).wait(1).to({graphics:mask_graphics_7,x:-22.125,y:43.05}).wait(1).to({graphics:mask_graphics_8,x:1,y:43.05}).wait(1).to({graphics:mask_graphics_9,x:24.125,y:43.05}).wait(1).to({graphics:mask_graphics_10,x:41.625,y:43.05}).wait(1).to({graphics:mask_graphics_11,x:53.1875,y:43.05}).wait(1).to({graphics:mask_graphics_12,x:64.75,y:43.05}).wait(1).to({graphics:mask_graphics_13,x:76.3125,y:43.05}).wait(1).to({graphics:mask_graphics_14,x:87.875,y:43.05}).wait(1).to({graphics:mask_graphics_15,x:99.4375,y:43.05}).wait(1).to({graphics:mask_graphics_16,x:111,y:43.05}).wait(1).to({graphics:mask_graphics_17,x:122.5625,y:43.05}).wait(1).to({graphics:mask_graphics_18,x:134.125,y:43.05}).wait(1).to({graphics:mask_graphics_19,x:145.6875,y:43.05}).wait(1).to({graphics:mask_graphics_20,x:157.25,y:43.05}).wait(1).to({graphics:mask_graphics_21,x:168.8125,y:43.05}).wait(1).to({graphics:mask_graphics_22,x:180.375,y:43.05}).wait(1).to({graphics:mask_graphics_23,x:191.9375,y:43.05}).wait(1).to({graphics:mask_graphics_24,x:371,y:43.05}).wait(1).to({graphics:mask_graphics_25,x:192.4,y:43.05}).wait(1).to({graphics:mask_graphics_26,x:181.3,y:43.05}).wait(1).to({graphics:mask_graphics_27,x:170.2,y:43.05}).wait(1).to({graphics:mask_graphics_28,x:159.1,y:43.05}).wait(1).to({graphics:mask_graphics_29,x:148,y:43.05}).wait(1).to({graphics:mask_graphics_30,x:136.9,y:43.05}).wait(1).to({graphics:mask_graphics_31,x:125.8,y:43.05}).wait(1).to({graphics:mask_graphics_32,x:114.7,y:43.05}).wait(1).to({graphics:mask_graphics_33,x:103.6,y:43.05}).wait(1).to({graphics:mask_graphics_34,x:92.5,y:43.05}).wait(1).to({graphics:mask_graphics_35,x:81.4,y:43.05}).wait(1).to({graphics:mask_graphics_36,x:70.3,y:43.05}).wait(1).to({graphics:mask_graphics_37,x:59.2,y:43.05}).wait(1).to({graphics:mask_graphics_38,x:48.1,y:43.05}).wait(1).to({graphics:mask_graphics_39,x:37,y:43.05}).wait(1).to({graphics:mask_graphics_40,x:15.8,y:43.05}).wait(1).to({graphics:mask_graphics_41,x:-6.4,y:43.05}).wait(1).to({graphics:mask_graphics_42,x:-28.6,y:43.05}).wait(1).to({graphics:mask_graphics_43,x:-43.4,y:43.05}).wait(1).to({graphics:mask_graphics_44,x:-54.5,y:43.05}).wait(1).to({graphics:mask_graphics_45,x:-65.6,y:43.05}).wait(1).to({graphics:mask_graphics_46,x:-76.7,y:43.05}).wait(1).to({graphics:mask_graphics_47,x:-87.8,y:43.05}).wait(1).to({graphics:mask_graphics_48,x:-98.9,y:43.05}).wait(1).to({graphics:mask_graphics_49,x:-184,y:43.05}).wait(1));

	// logo_copy
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFF33").s().p("Ap9H8QgrgNgJgBQgJgDgOAAQgjAAgSAYIgQAAIAAjYIAQAAQAcBPAqAvQBMBXBmAAQAlAAAfgLIAAgEIANAAQAOgHANgIQAygfAAg8QAAgvgkgkQgUgUgegQQgfgPhHgeQh8gzgqgjQg8gwAAhAQAAhEA8gyQBEg5ByAAQAyAAAsAOIAiAMQAQAEAMABQATAAARgYIATAAIALCtIgVAAQgKgkgMgWQgNgWgXgVQgfgdgpgQQgogRgnAAQg4AAgoAgQgmAfAAAsQAAAlAiAfQAkAdBKAaIBoAkQBeAhAvAxQAiAjAKAuIAAgaIAAoxQAAhPgLglQgLgmgggYQgbgXgkgKQgjgJg5gDIAAgSIKMAAQBjABAfABQByAHBKAjQBBAeAkAyQAiAxAAA+QAABlhQA/QgdAYglAQQglAPhFAUQBfAMA1APQA1AOAqAZQBAAnAkA8QAjA7AABEQAABGgkA6QglA6hBAjQg6AfhRANQhRALiTABIqjAAQgwANg5AAQhCABhEgVgAgXEgQAAA5ALAjQAKAjAXAZQAzAzB7AAQCgAABehDQBchDAAh1QAAhCgdg5Qgdg5gwgfQhag3i/AAIixAAgAgXgyIBQAAQA5AAA8gGQA1gGAhgIQAggJAagPQAzgdAcgtQAbgtAAg3QAAg7gcgzQgdg1gvgdQgogag0gIQg1gJhqAAIhcAAg");
	this.shape.setTransform(78.175,52.85);

	var maskedShapeInstanceList = [this.shape];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(50));

	// logo
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#3300FF").s().p("Ap9H8QgrgNgJgBQgJgDgOAAQgjAAgSAYIgQAAIAAjYIAQAAQAcBPAqAvQBMBXBmAAQAlAAAfgLIAAgEIANAAQAOgHANgIQAygfAAg8QAAgvgkgkQgUgUgegQQgfgPhHgeQh8gzgqgjQg8gwAAhAQAAhEA8gyQBEg5ByAAQAyAAAsAOIAiAMQAQAEAMABQATAAARgYIATAAIALCtIgVAAQgKgkgMgWQgNgWgXgVQgfgdgpgQQgogRgnAAQg4AAgoAgQgmAfAAAsQAAAlAiAfQAkAdBKAaIBoAkQBeAhAvAxQAiAjAKAuIAAgaIAAoxQAAhPgLglQgLgmgggYQgbgXgkgKQgjgJg5gDIAAgSIKMAAQBjABAfABQByAHBKAjQBBAeAkAyQAiAxAAA+QAABlhQA/QgdAYglAQQglAPhFAUQBfAMA1APQA1AOAqAZQBAAnAkA8QAjA7AABEQAABGgkA6QglA6hBAjQg6AfhRANQhRALiTABIqjAAQgwANg5AAQhCABhEgVgAgXEgQAAA5ALAjQAKAjAXAZQAzAzB7AAQCgAABehDQBchDAAh1QAAhCgdg5Qgdg5gwgfQhag3i/AAIixAAgAgXgyIBQAAQA5AAA8gGQA1gGAhgIQAggJAagPQAzgdAcgtQAbgtAAg3QAAg7gcgzQgdg1gvgdQgogag0gIQg1gJhqAAIhcAAg");
	this.shape_1.setTransform(78.175,52.85);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(50));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,156.4,105.7);


(lib.welcome = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// _
	this.instance = new lib.CachedBmp_65();
	this.instance.setTransform(306.6,0,0.5,0.5);

	this.instance_1 = new lib.Tween19("synched",0);
	this.instance_1.setTransform(319.65,-85.65);
	this.instance_1.alpha = 0.0391;
	this.instance_1._off = true;

	this.instance_2 = new lib.Tween20("synched",0);
	this.instance_2.setTransform(315.45,30.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},34).to({state:[{t:this.instance_2}]},5).wait(16));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(34).to({_off:false},0).to({_off:true,x:315.45,y:30.3,alpha:1},5).wait(16));

	// E
	this.instance_3 = new lib.CachedBmp_66();
	this.instance_3.setTransform(264.6,0,0.5,0.5);

	this.instance_4 = new lib.Tween13("synched",0);
	this.instance_4.setTransform(291.9,-87.65);
	this.instance_4.alpha = 0.0391;
	this.instance_4._off = true;

	this.instance_5 = new lib.Tween14("synched",0);
	this.instance_5.setTransform(287.7,30.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3}]}).to({state:[{t:this.instance_4}]},29).to({state:[{t:this.instance_5}]},5).wait(21));
	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(29).to({_off:false},0).to({_off:true,x:287.7,y:30.3,alpha:1},5).wait(21));

	// M
	this.instance_6 = new lib.CachedBmp_67();
	this.instance_6.setTransform(213.7,0,0.5,0.5);

	this.instance_7 = new lib.Tween11("synched",0);
	this.instance_7.setTransform(245.45,-85.65);
	this.instance_7.alpha = 0.0391;
	this.instance_7._off = true;

	this.instance_8 = new lib.Tween12("synched",0);
	this.instance_8.setTransform(241.25,30.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_6}]}).to({state:[{t:this.instance_7}]},24).to({state:[{t:this.instance_8}]},5).wait(26));
	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(24).to({_off:false},0).to({_off:true,x:241.25,y:30.3,alpha:1},5).wait(26));

	// O
	this.instance_9 = new lib.CachedBmp_68();
	this.instance_9.setTransform(173.75,0,0.5,0.5);

	this.instance_10 = new lib.Tween9("synched",0);
	this.instance_10.setTransform(200,-87.65);
	this.instance_10.alpha = 0.0391;
	this.instance_10._off = true;

	this.instance_11 = new lib.Tween10("synched",0);
	this.instance_11.setTransform(195.8,30.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_9}]}).to({state:[{t:this.instance_10}]},19).to({state:[{t:this.instance_11}]},5).wait(31));
	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(19).to({_off:false},0).to({_off:true,x:195.8,y:30.3,alpha:1},5).wait(31));

	// C
	this.instance_12 = new lib.CachedBmp_69();
	this.instance_12.setTransform(135.4,0,0.5,0.5);

	this.instance_13 = new lib.Tween7("synched",0);
	this.instance_13.setTransform(160.85,-85.65);
	this.instance_13.alpha = 0.0391;
	this.instance_13._off = true;

	this.instance_14 = new lib.Tween8("synched",0);
	this.instance_14.setTransform(156.65,30.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_12}]}).to({state:[{t:this.instance_13}]},14).to({state:[{t:this.instance_14}]},5).wait(36));
	this.timeline.addTween(cjs.Tween.get(this.instance_13).wait(14).to({_off:false},0).to({_off:true,x:156.65,y:30.3,alpha:1},5).wait(36));

	// L
	this.instance_15 = new lib.CachedBmp_70();
	this.instance_15.setTransform(95.75,0,0.5,0.5);

	this.instance_16 = new lib.Tween5("synched",0);
	this.instance_16.setTransform(121.85,-87.65);
	this.instance_16.alpha = 0.0391;
	this.instance_16._off = true;

	this.instance_17 = new lib.Tween6("synched",0);
	this.instance_17.setTransform(117.65,30.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_15}]}).to({state:[{t:this.instance_16}]},9).to({state:[{t:this.instance_17}]},5).wait(41));
	this.timeline.addTween(cjs.Tween.get(this.instance_16).wait(9).to({_off:false},0).to({_off:true,x:117.65,y:30.3,alpha:1},5).wait(41));

	// E
	this.instance_18 = new lib.CachedBmp_71();
	this.instance_18.setTransform(53.75,0,0.5,0.5);

	this.instance_19 = new lib.Tween3("synched",0);
	this.instance_19.setTransform(81.05,-87.65);
	this.instance_19.alpha = 0.0391;
	this.instance_19._off = true;

	this.instance_20 = new lib.Tween4("synched",0);
	this.instance_20.setTransform(76.85,30.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_18}]}).to({state:[{t:this.instance_19}]},4).to({state:[{t:this.instance_20}]},5).wait(46));
	this.timeline.addTween(cjs.Tween.get(this.instance_19).wait(4).to({_off:false},0).to({_off:true,x:76.85,y:30.3,alpha:1},5).wait(46));

	// W
	this.instance_21 = new lib.Tween1("synched",0);
	this.instance_21.setTransform(28.95,-83.65);
	this.instance_21.alpha = 0.0391;

	this.instance_22 = new lib.Tween2("synched",0);
	this.instance_22.setTransform(28.95,30.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_21}]}).to({state:[{t:this.instance_22}]},4).wait(51));
	this.timeline.addTween(cjs.Tween.get(this.instance_21).to({_off:true,y:30.3,alpha:1},4).wait(51));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-117.9,328.8,178.4);


(lib.btnon = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Symbol2_1("synched",0);
	this.instance.setTransform(5.3,18.75,0.6923,1,0,0,0,16.2,17.2);

	this.instance_1 = new lib.itunes();
	this.instance_1.setTransform(-22,-8,0.1096,0.1017);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1,p:{scaleX:0.1096,scaleY:0.1017,x:-22,y:-8}},{t:this.instance,p:{regX:16.2,regY:17.2,scaleX:0.6923,scaleY:1,x:5.3,y:18.75}}]}).to({state:[{t:this.instance_1,p:{scaleX:0.0822,scaleY:0.0705,x:-15,y:0}},{t:this.instance,p:{regX:16.1,regY:17.3,scaleX:0.5195,scaleY:0.6929,x:5.5,y:18.6}}]},2).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-22,-8.3,56.1,54.2);


(lib.musik_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		/* Click to Go to Frame and Stop
		Clicking on the specified symbol instance moves the playhead to the specified frame in the timeline and stops the movie.
		Can be used on the main timeline or on movie clip timelines.
		
		Instructions:
		1. Replace the number 5 in the code below with the frame number you would like the playhead to move to when the symbol instance is clicked.
		2.Frame numbers in EaselJS start at 0 instead of 1
		*/
		
		
		this.musikoff.addEventListener("click", fl_ClickToGoToAndStopAtFrame.bind(this));
		
		function fl_ClickToGoToAndStopAtFrame()
		{
			createjs.Sound.stop("musik");
			this.gotoAndStop(1);
		}
		
		createjs.Sound.play("musik");
		
		/* Stop at This Frame
		The  timeline will stop/pause at the frame where you insert this code.
		Can also be used to stop/pause the timeline of movieclips.
		*/
		
		this.stop();
	}
	this.frame_1 = function() {
		/* Click to Go to Frame and Stop
		Clicking on the specified symbol instance moves the playhead to the specified frame in the timeline and stops the movie.
		Can be used on the main timeline or on movie clip timelines.
		
		Instructions:
		1. Replace the number 5 in the code below with the frame number you would like the playhead to move to when the symbol instance is clicked.
		2.Frame numbers in EaselJS start at 0 instead of 1
		*/
		
		
		this.musikon.addEventListener("click", fl_ClickToGoToAndStopAtFrame_2.bind(this));
		
		function fl_ClickToGoToAndStopAtFrame_2()
		{
			this.gotoAndStop(0);
		}
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1));

	// Layer_1
	this.musikoff = new lib.btnoff();
	this.musikoff.name = "musikoff";
	this.musikoff.setTransform(28.1,26.1,1,1,0,0,0,28.1,26.1);
	this.musikoff.compositeOperation = "difference";
	new cjs.ButtonHelper(this.musikoff, 0, 1, 2);

	this.musikon = new lib.btnon();
	this.musikon.name = "musikon";
	this.musikon.setTransform(28.1,26.1,1,1,0,0,0,28.1,26.1);
	new cjs.ButtonHelper(this.musikon, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.musikoff}]}).to({state:[{t:this.musikon}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-22,-9.9,56.1,57.5);


// stage content:
(lib.tugasindividu = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {propil:4,pengalaman:9,musik:0,bg:0};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0,4,9];
	this.streamSoundSymbolsList[0] = [{id:"musik",startFrame:0,endFrame:10,loop:1,offset:0}];
	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
		var soundInstance = playSound("musik",0);
		this.InsertIntoSoundStreamData(soundInstance,0,10,1);
		/* Stop at This Frame
		The  timeline will stop/pause at the frame where you insert this code.
		Can also be used to stop/pause the timeline of movieclips.
		*/
		
		this.stop();
		
		/* Click to Go to Frame and Stop
		Clicking on the specified symbol instance moves the playhead to the specified frame in the timeline and stops the movie.
		Can be used on the main timeline or on movie clip timelines.
		
		Instructions:
		1. Replace the number 5 in the code below with the frame number you would like the playhead to move to when the symbol instance is clicked.
		2.Frame numbers in EaselJS start at 0 instead of 1
		*/
		
		
		this.portfolio.addEventListener("click", fl_ClickToGoToAndStopAtFrame.bind(this));
		
		function fl_ClickToGoToAndStopAtFrame()
		{
			this.gotoAndStop("propil");
		}
		
		
		/* Click to Go to Web Page
		Clicking on the specified symbol instance loads the URL in a new browser window.
		
		Instructions:
		1. Replace http://www.adobe.com with the desired URL address.
		   Keep the quotation marks ("").
		*/
		
		this.btn_fb.addEventListener("click", fl_ClickToGoToWebPage);
		
		function fl_ClickToGoToWebPage() {
			window.open("https://web.facebook.com/profile.php?id=100087378074185", "_blank");
		}
		
		/* Click to Go to Web Page
		Clicking on the specified symbol instance loads the URL in a new browser window.
		
		Instructions:
		1. Replace http://www.adobe.com with the desired URL address.
		   Keep the quotation marks ("").
		*/
		
		this.button_1.addEventListener("click", fl_ClickToGoToWebPage_2);
		
		function fl_ClickToGoToWebPage_2() {
			window.open("https://github.com/suhendraberta");
		}
		
		/* Click to Go to Web Page
		Clicking on the specified symbol instance loads the URL in a new browser window.
		
		Instructions:
		1. Replace http://www.adobe.com with the desired URL address.
		   Keep the quotation marks ("").
		*/
		
		this.button_5.addEventListener("click", fl_ClickToGoToWebPage_3);
		
		function fl_ClickToGoToWebPage_3() {
			window.open("https://www.youtube.com/@suhendraberta");
		}
		
		/* Click to Go to Web Page
		Clicking on the specified symbol instance loads the URL in a new browser window.
		
		Instructions:
		1. Replace http://www.adobe.com with the desired URL address.
		   Keep the quotation marks ("").
		*/
		
		this.btn_ig.addEventListener("click", fl_ClickToGoToWebPage_5);
		
		function fl_ClickToGoToWebPage_5() {
			window.open("https://www.instagram.com/hendra_enkya/");
		}
		playSound("musik");
	}
	this.frame_4 = function() {
		/* Click to Go to Frame and Stop
		Clicking on the specified symbol instance moves the playhead to the specified frame in the timeline and stops the movie.
		Can be used on the main timeline or on movie clip timelines.
		
		Instructions:
		1. Replace the number 5 in the code below with the frame number you would like the playhead to move to when the symbol instance is clicked.
		2.Frame numbers in EaselJS start at 0 instead of 1
		*/
		
		
		this.home.addEventListener("click", fl_ClickToGoToAndStopAtFrame_9.bind(this));
		
		function fl_ClickToGoToAndStopAtFrame_9()
		{
			this.gotoAndStop("bg");
		}
		
		
		/* Click to Go to Frame and Stop
		Clicking on the specified symbol instance moves the playhead to the specified frame in the timeline and stops the movie.
		Can be used on the main timeline or on movie clip timelines.
		
		Instructions:
		1. Replace the number 5 in the code below with the frame number you would like the playhead to move to when the symbol instance is clicked.
		2.Frame numbers in EaselJS start at 0 instead of 1
		*/
		
		
		this.btn_trs.addEventListener("click", fl_ClickToGoToAndStopAtFrame_10.bind(this));
		
		function fl_ClickToGoToAndStopAtFrame_10()
		{
			this.gotoAndStop("pengalaman");
		}
	}
	this.frame_9 = function() {
		/* Click to Go to Frame and Stop
		Clicking on the specified symbol instance moves the playhead to the specified frame in the timeline and stops the movie.
		Can be used on the main timeline or on movie clip timelines.
		
		Instructions:
		1. Replace the number 5 in the code below with the frame number you would like the playhead to move to when the symbol instance is clicked.
		2.Frame numbers in EaselJS start at 0 instead of 1
		*/
		
		
		this.button_4.addEventListener("click", fl_ClickToGoToAndStopAtFrame_11.bind(this));
		
		function fl_ClickToGoToAndStopAtFrame_11()
		{
			this.gotoAndStop("bg");
		}
		
		
		/* Click to Go to Frame and Stop
		Clicking on the specified symbol instance moves the playhead to the specified frame in the timeline and stops the movie.
		Can be used on the main timeline or on movie clip timelines.
		
		Instructions:
		1. Replace the number 5 in the code below with the frame number you would like the playhead to move to when the symbol instance is clicked.
		2.Frame numbers in EaselJS start at 0 instead of 1
		*/
		
		
		this.back.addEventListener("click", fl_ClickToGoToAndStopAtFrame_12.bind(this));
		
		function fl_ClickToGoToAndStopAtFrame_12()
		{
			this.gotoAndStop("propil");
		}
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(4).call(this.frame_4).wait(5).call(this.frame_9).wait(1));

	// Actions
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#CCCCCC").ss(1,1,1).p("EAvmhLSIGQGQEAfJhaSIMFMFIIjojEAcShVrIH7H7In7H7In7n7gEAmOhJNIFAlAEAQWhToImrmrEASihL6QAAAtgfAfQgfAfgsAAQgtAAgfgfQgfgfAAgtQAAgsAfggQAfgfAtAAQAsAAAfAfQAfAgAAAsgEAFuhJAIKoqoIGrmqEAQxgmNIiuCtEAIOguwIIjIjIJlJlEAjug8FIF2F1EAgNg6cIH7H7In7H7In7n7gEAeGg8TIqAKAEASOhRwIh4h4EAVJgqlIkYEYEgmZhZeIFcFcIlcFdIlcldgEgw8hKWIC0i1Egw8hKWIDODOEg1OhGFIESkREg0LhNlIDPDPEg0LhWwIPAPAEgujhWVIFNlNEgmngsRQAAAtggAfQgfAfgsAAQgtAAgfgfQgfgfAAgtQAAgsAfggQAfgfAtAAQAsAAAfAfQAgAgAAAsgEgyTgvLIIWIWEgXpgwOIDjjjEgQwgqzQAAAsgfAfQgfAggtAAQgsAAggggQgfgfAAgsQAAgtAfgfQAggfAsAAQAtAAAfAfQAfAfAAAtgEgRzgxrIEyEzEgj7hMiIFNlOEghOhagIEYEYEgiBggLIJyJyIpyJyIpypygEg0mgWZIJmJmEgi4gERIOyuyAeAs5IKyqyAAOmpQAAAsgfAfQgfAfgtAAQgsAAgfgfQgggfAAgsQAAgtAgggQAfgfAsAAQAtAAAfAfQAfAgAAAtgEAi/AH+QAAAzgkAkQgkAkgzAAQgzAAgkgkQgkgkAAgzQAAgzAkgkQAkgkAzAAQAzAAAkAkQAkAkAAAzgEAl+AYNIFlFlIllFlIllllgEAn5AJ5IoVIVEgu+geTIMTsTEgdQglzIT/T/EgbphULMAj+AAAEAeUAnrIFoFoEgDvBThIBJhJEgDvBThIFFFHEAMmBU4IELELEAKGBSYICgCgEAKTBXLICTiTIEzkzEACmBUrIEYkYEAltA93IinCnEASpBVGIDiAAIjIDIEAWLBVGIELAAEAZGBSLIi7C7EAxRBQYQAACEheBdQheBfiEAAQiFAAhehfQhdhdAAiEQAAiFBdheQBehdCFAAQCEAABeBdQBeBeAACFgEAlZBVgIEzEzEAo8BILIreLdEAeUA2dIHZHaEgqzAiRQAACEheBeQhdBeiFAAQiEAAheheQheheAAiEQAAiFBeheQBehdCEAAQCFAABdBdQBeBeAACFgEgtrA3yIFlFlIllFlIlkllgEgyABNTQAAAygkAlQgkAjgzAAQgzAAgkgjQgkglAAgyQAAgzAkglQAkgjAzAAQAzAAAkAjQAkAlAAAzgEgvGBNlIFeFdIleFeIlelegEg12A/AIPoQrEgSsBU7QAAAzgkAkQgkAkgzAAQgzAAgkgkQgkgkAAgzQAAgzAkgkQAkgkAzAAQAzAAAkAkQAkAkAAAzgEgeJBS0QAAAWgPAPQgPAPgVAAQgWAAgPgPQgPgPAAgWQAAgVAPgPQAPgPAWAAQAVAAAPAPQAPAPAAAVgEgXBBYoIC7C7IDJjJEgJqBQHIDUDOIjUDOIjUjOgEgQkBSlIElEmEgqzBFrIKAqAEgJRBZDIFiliEAt8Au9IH7H8EAvIA3yIFlFlIllFlIlkllgEAwOBZDIDwjwEAuWhYoIkKELEAeugkjISjyiEAgZgCZIS+S8EApWARmIKbKbEAyUAi5IuzOyEAt8A1pIoPIOIJRJR");
	this.shape.setTransform(370,596.6);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#CCFF66").s().p("Eg2vAZjIhghZIAAzEIAsgvQCIiTCSCIIIuIEQCSCIiICTIoEItQhGBNhJAAQhEAAhHhCgEAzKgELIouoEQiSiICIiTIIEotQCHiTCTCIIBgBYIAATFIgsAvQhGBMhKAAQhEAAhGhBg");
	this.shape_1.setTransform(359.975,482.225);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape_1},{t:this.shape}]},9).wait(1));

	// logo
	this.btn_ig = new lib.btn_ig();
	this.btn_ig.name = "btn_ig";
	this.btn_ig.setTransform(230.9,1039.65);
	new cjs.ButtonHelper(this.btn_ig, 0, 1, 2);

	this.button_5 = new lib.Symbol4();
	this.button_5.name = "button_5";
	this.button_5.setTransform(638.95,1059,1,1,0,0,0,68,20.4);
	new cjs.ButtonHelper(this.button_5, 0, 1, 2);

	this.button_1 = new lib.btngithub();
	this.button_1.name = "button_1";
	this.button_1.setTransform(482.45,1060,1,1,0,0,0,54.6,20.4);
	new cjs.ButtonHelper(this.button_1, 0, 1, 2);

	this.btn_fb = new lib.btn_fb();
	this.btn_fb.name = "btn_fb";
	this.btn_fb.setTransform(106.2,1059,1,1,0,0,0,76.2,20.4);
	new cjs.ButtonHelper(this.btn_fb, 0, 1, 2);

	this.instance = new lib.an_logo();
	this.instance.setTransform(360.05,291.05,1,1,0,0,0,78.2,52.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.btn_fb},{t:this.button_1},{t:this.button_5},{t:this.btn_ig}]}).to({state:[]},1).wait(9));

	// line
	this.instance_1 = new lib.CachedBmp_2();
	this.instance_1.setTransform(141.2,955.25,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_1();
	this.instance_2.setTransform(-1.5,-1.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1}]}).to({state:[]},1).wait(9));

	// POTO
	this.instance_3 = new lib.Symbol2();
	this.instance_3.setTransform(291.15,549.15,1,1,0,0,0,170.5,142.5);
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(4).to({_off:false},0).to({_off:true},1).wait(5));

	// konten
	this.btn_trs = new lib.btn_trs();
	this.btn_trs.name = "btn_trs";
	this.btn_trs.setTransform(654.4,1208.25);
	new cjs.ButtonHelper(this.btn_trs, 0, 1, 2);

	this.instance_4 = new lib.CachedBmp_6();
	this.instance_4.setTransform(677.3,1177.85,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_5();
	this.instance_5.setTransform(134,119.2,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_4();
	this.instance_6.setTransform(49.05,52.1,0.5,0.5);

	this.home = new lib.tmb_home();
	this.home.name = "home";
	this.home.setTransform(354.8,1241.45,1,1,0,0,0,49.1,29.8);
	new cjs.ButtonHelper(this.home, 0, 1, 2);

	this.instance_7 = new lib.CachedBmp_3();
	this.instance_7.setTransform(-1,-3,0.5,0.5);

	this.instance_8 = new lib.CachedBmp_11();
	this.instance_8.setTransform(140.15,1024.95,0.5,0.5);

	this.back = new lib.BACK();
	this.back.name = "back";
	this.back.setTransform(49.5,1212.7,1,1,0,0,0,25.1,25.6);
	new cjs.ButtonHelper(this.back, 0, 1, 2);

	this.instance_9 = new lib.CachedBmp_10();
	this.instance_9.setTransform(33.55,1183.05,0.5,0.5);

	this.instance_10 = new lib.samurairemovebgpreview();
	this.instance_10.setTransform(80,368,1.4289,1.207);

	this.instance_11 = new lib.CachedBmp_9();
	this.instance_11.setTransform(70.3,149.65,0.5,0.5);

	this.instance_12 = new lib.CachedBmp_8();
	this.instance_12.setTransform(193,57.8,0.5,0.5);

	this.button_4 = new lib.home3();
	this.button_4.name = "button_4";
	this.button_4.setTransform(353.55,1223.05,1,1,0,0,0,60.5,29.8);
	new cjs.ButtonHelper(this.button_4, 0, 1, 2);

	this.instance_13 = new lib.CachedBmp_7();
	this.instance_13.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_7},{t:this.home},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.btn_trs}]},4).to({state:[{t:this.instance_13},{t:this.button_4},{t:this.instance_12},{t:this.instance_11},{t:this.instance_10},{t:this.instance_9},{t:this.back},{t:this.instance_8}]},5).wait(1));

	// tombol
	this.portfolio = new lib.Symbol1();
	this.portfolio.name = "portfolio";
	this.portfolio.setTransform(237.2,813.5,1,1,0,0,0,76.4,39.2);
	new cjs.ButtonHelper(this.portfolio, 0, 1, 2);

	this.instance_14 = new lib.CachedBmp_13();
	this.instance_14.setTransform(251.9,793.3,0.5,0.5);

	this.instance_15 = new lib.CachedBmp_12();
	this.instance_15.setTransform(18.2,768.25,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_15},{t:this.instance_14},{t:this.portfolio}]}).to({state:[]},1).wait(9));

	// TEXT
	this.instance_16 = new lib.CachedBmp_16();
	this.instance_16.setTransform(81.95,665,0.5,0.5);

	this.instance_17 = new lib.CachedBmp_15();
	this.instance_17.setTransform(181.9,597.1,0.5,0.5);

	this.instance_18 = new lib.CachedBmp_14();
	this.instance_18.setTransform(201.95,649.9,0.5,0.5);

	this.instance_19 = new lib.welcome();
	this.instance_19.setTransform(351.2,165.6,1,1,0,0,0,162.2,30.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_19},{t:this.instance_18},{t:this.instance_17},{t:this.instance_16}]}).to({state:[]},1).wait(9));

	// BG
	this.instance_20 = new lib.musik_1();
	this.instance_20.setTransform(696.5,55.45,1,1,0,0,0,28.1,26.1);

	this.instance_21 = new lib.CachedBmp_18();
	this.instance_21.setTransform(262.65,1222.9,0.5,0.5);

	this.instance_22 = new lib.CachedBmp_17();
	this.instance_22.setTransform(0,2,0.5,0.5);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFFFF").s().p("EAvtAMjIgHgGQglgmgdgpIgKAIQgzAshIAAQgxAAgngTQg7AihBASIlAAAQiCgkhohhIgQgQIgMAQQgfAoglAkQgfAfggAaIu4AAQgggagegfQgWgVgUgXQhkBOh5AXIjXAAQh0gWhihJQhmBBhzAeI9iAAIAGghQh/ghhshDIgDgCIgKACQhrASh5AAQgzAAgygDQAMAzAAA7IAAAIItqAAQgygVgtgdIgKgGIgUAWQgTATgVAPIhxAAIAAsMIAUAAIAMAAIAhAAQAtg2BZguQCzhcD9ABQCZgBB+AiQAIhqByhNQB6hSCtAAQCtAAB7BSQAWAPASAQQCTgwCuAAQFDAADlCnQAZASAXAUQApj3C7i6QDvjvFSAAQFRAADvDvQAqAqAjAuQAvgIAyAAQDYAACfCWQDdjcE5ABQE8gBDfDgQBABAAuBIQChiNDbAAQDwAACpCqQBgBfAqB1IAYgaQChifDjAAQBEAAA/APQATAEATAGIAAOTg");
	this.shape_2.setTransform(360.325,575);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#0066CC").s().p("EAf0AyAIAMgQIAQAQgEghmAyAIAKgCIADACgEAszAk9QipiqjwAAQjbAAihCNQguhIhAhAQjfjgk7ABQk5gBjeDcQifiWjXAAQgzAAguAIQgkgugqgqQjvjvlRAAQlSAAjvDvQi6C6gpD3QgXgUgagSQjlinlDAAQiuAAiTAwQgSgQgWgPQh6hSiuAAQitAAh6BSQhxBNgJBqQh+giiZABQj9gBizBcQhZAugtA3IghAAIgMAAMAAAhZ4MBwfAAAMAAABBRIgOAAIAAWfQgSgGgUgEQg+gPhFAAQjjAAihCgIgYAaQgqh2hghfg");
	this.shape_3.setTransform(362,322);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_22},{t:this.instance_21},{t:this.instance_20}]}).to({state:[{t:this.shape_3},{t:this.shape_2}]},4).to({state:[]},1).wait(5));

	// stageBackground
	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("rgba(0,0,0,0)").ss(1,1,1,3,true).p("Eg5zhljMBznAAAMAAADLHMhznAAAg");
	this.shape_4.setTransform(360,640);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#FFFFFF").s().p("Eg5zBlkMAAAjLHMBznAAAMAAADLHg");
	this.shape_5.setTransform(360,640);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_5},{t:this.shape_4}]}).wait(10));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(349,629,382,662);
// library properties:
lib.properties = {
	id: 'EEB5A791D6ADE44EA11457F6B7FBF417',
	width: 720,
	height: 1280,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/CachedBmp_17.png?1670659539705", id:"CachedBmp_17"},
		{src:"images/CachedBmp_7.png?1670659539705", id:"CachedBmp_7"},
		{src:"images/CachedBmp_3.png?1670659539705", id:"CachedBmp_3"},
		{src:"images/CachedBmp_1.png?1670659539705", id:"CachedBmp_1"},
		{src:"images/tugas individu_atlas_1.png?1670659539623", id:"tugas individu_atlas_1"},
		{src:"images/tugas individu_atlas_2.png?1670659539624", id:"tugas individu_atlas_2"},
		{src:"sounds/musik.mp3?1670659539705", id:"musik"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['EEB5A791D6ADE44EA11457F6B7FBF417'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused || stageChild.ignorePause){
			stageChild.syncStreamSounds();
		}
	}
}
an.handleFilterCache = function(event) {
	if(!event.paused){
		var target = event.target;
		if(target){
			if(target.filterCacheList){
				for(var index = 0; index < target.filterCacheList.length ; index++){
					var cacheInst = target.filterCacheList[index];
					if((cacheInst.startFrame <= target.currentFrame) && (target.currentFrame <= cacheInst.endFrame)){
						cacheInst.instance.cache(cacheInst.x, cacheInst.y, cacheInst.w, cacheInst.h);
					}
				}
			}
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;