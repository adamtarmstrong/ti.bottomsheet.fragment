// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

var level = parseInt(args.level) || 1;
var viewHeight = (OS_IOS) ? (100 - 10 - (level*5)) : (100 - (level*5));
var transparentBGColor = (OS_IOS) ? "#4D000000" : "#00000000";

/*
 * Load Initial Configuration
 */
var matrix = Ti.UI.create2DMatrix();
var bottomSheetHeight = (OS_IOS) ? (parseInt(Ti.Platform.displayCaps.platformHeight * (viewHeight/100))) : (parseInt(Ti.Platform.displayCaps.platformHeight * (viewHeight/100)));
var startPosition = (OS_IOS) ? (Ti.Platform.displayCaps.platformHeight - bottomSheetHeight) : (Ti.Platform.displayCaps.platformHeight - bottomSheetHeight - 40);
$.bottomSheetView.height = bottomSheetHeight;

//Ti.API.info("bottomSheetHeight= " + bottomSheetHeight + "\nstartPosition= " + startPosition);
if (OS_IOS) {
	var selectedGenerator = Ti.UI.iOS.createFeedbackGenerator({type: Ti.UI.iOS.FEEDBACK_GENERATOR_TYPE_SELECTION});
	var impactGenerator = Ti.UI.iOS.createFeedbackGenerator({type: Ti.UI.iOS.FEEDBACK_GENERATOR_TYPE_IMPACT, style: Ti.UI.iOS.FEEDBACK_GENERATOR_IMPACT_STYLE_MEDIUM});
	var currentPosition = startPosition;
	var closePosition = startPosition + bottomSheetHeight/3;
	var scrollClosePosition = -startPosition;
}


/*
 * Animation and Transition Helpers
 */
function showBottomSheetView(){
	fadeInWindow();
	if (OS_IOS) {
		$.bottomSheetView.animate(Ti.UI.createAnimation({
			transform: matrix,
			duration: 350,
			curve: Ti.UI.ANIMATION_CURVE_EASE_IN,
			top: startPosition,
			opacity: 1
		}));
	} else if (OS_ANDROID) {
		$.bottomSheetView.animate(Ti.UI.createAnimation({
			transform: matrix,
			duration: 350,
			top: startPosition,
			opacity: 1
		}));
	}
}
function fadeInWindow(){
	$.modalBottomsheet.animate(Ti.UI.createAnimation({
		transform: matrix,
		duration: 200,
		backgroundColor: transparentBGColor
	}));
}
function hideBottomSheetView(){
	fadeOutWindow();
	if (OS_IOS) {
		$.bottomSheetView.animate(Ti.UI.createAnimation({
			transform: matrix,
			duration: 200,
			curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
			top: "115%",
			opacity: 0.7
		}));
	} else if (OS_ANDROID) {
		$.bottomSheetView.animate(Ti.UI.createAnimation({
			transform: matrix,
			duration: 200,
			top: "115%",
			opacity: 0.7
		}));
	}
}
function fadeOutWindow(){
	$.modalBottomsheet.animate(Ti.UI.createAnimation({
		transform: matrix,
		duration: 100,
		backgroundColor: "#00000000"
	}));
	if (OS_IOS) { impactGenerator.impactOccurred();  }
	setTimeout(function() {
		close();
	}, 200);
}
function handleTouchMove(e){				Ti.API.info("TouchMove Object: " + JSON.stringify(e));
	$.bottomSheetView.top = startPosition + e.y/2;
}
function handleTouchEnd(e){				Ti.API.info("TouchEnd Object: " + JSON.stringify(e));
	if (startPosition + e.y  > closePosition) {
		hideBottomSheetView();
	} else {
		$.bottomSheetView.top = startPosition;
		currentPosition = startPosition;
	}
}
function handleContainerBGSwipe(evt){
	if (evt.direction === "down") {
		hideBottomSheetView();
	}
}
/*
 * -y coords only appears to work on iOS.  This event will be skipped on Android
 */
function handleScroll(evt){		Ti.API.info("Scroll Event: " + JSON.stringify(evt));
	if (OS_IOS && evt.dragging === false && evt.y < scrollClosePosition) {
		hideBottomSheetView();
	}
}
function close(){
	$.modalBottomsheet.close();
}
function openAdditionalLevelModal(){
	Alloy.createController("modalBottomsheet", {level: level+1}).getView().open();
}
//POSTLAYOUT
setTimeout(function() {
	if (OS_IOS) { selectedGenerator.selectionChanged(); }
	showBottomSheetView();
}, 100);
