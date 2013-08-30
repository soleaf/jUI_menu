/*
jQuery UI set: Dropdown menu
VER 0.0.1

by soleaf
http://www.mintcode.org
GitHub : https://github.com/soleaf/jUI_menu
*/

$(document).ready(function(){

	// Click to body: Hide all menus.
	$(document).bind("click",function() {
		jUI_menu_layerHideAll();
	});
	
	// Move Menu Layers definend anywehere to Body root.
	$("body").prepend($(".jUI_memu_layer"));
	$(".pageContent .jUI_memu_layer").remove();
	
	// Search menu objects for event
	$(".jUI_menu").each(function(){
		
		var senderSelector = ".jUI_menu[data-id=" + $(this).attr("data-id") + "]";
		var menuSelector = ".jUI_memu_layer[data-id=" + $(this).attr("data-id") + "]";
		var allMenuSelector = ".jUI_memu_layer[data-root=" + $(this).attr("data-id") + "]";
		
		// Select item that is setted selectedValue
		// Checking Selected value
		var selectedValue = "";
		var selectedLabel = "";
		if(null != $(this).attr("data-selectedValue") && $(this).attr("data-selectedValue").length > 0) {
			selectedValue = $(this).attr("data-selectedValue")
			selectedLabel = $(allMenuSelector).find("LI[data-value="+ selectedValue +"]").text();
		}
		else // Null is setted selected value -> force select first item.
		{
			selectedValue = $(menuSelector).children("LI:first-child").attr("data-value");
			selectedLabel = $(menuSelector).children("LI:first-child").text();
		}
		$(this).find(".label").text(selectedLabel);
		
		// Submenu have arrow mark.
		$(menuSelector).find("LI").each(function(){
			var isHaveSub = $(this).attr("data-sub");
			if (isHaveSub != null){
				var thisText = $(this).text();
				var arrowMark = " <font color='#dbdbdb' style='position:absolute;right:2px;' size='9'>&gt; &nbsp;</font>";
				$(this).css("padding-right","5px");
				$(this).html(thisText + arrowMark);
			}
		});
		
		// Width: if have element of data-width, set force it.
		var data_width = $(this).attr("data-width");
		var menuSenderW = $(this).width();
		var menuW = $(menuSelector).width(); // 26: arrow width
		
		if (data_width > 0){
			$(menuSelector).css("width", data_width);
			$(this).css("width", data_width);
		}
		// Auto with
		else{
			
			if (menuSenderW > menuW){
				$(menuSelector).css("width", menuSenderW);
			}	
			else{
				$(this).css("width", menuW);
			}
				
		}
		
		// 1. Bind Event to .UI_menu click
		//$(this).bind("mouseover",function(){
		$(this).bind("click",function(){
			
			if($(menuSelector).css("display") == "none"){
				var data_root = $(this).attr("data-id");
				jUI_menu_click(this, data_root);
			}
			return false;
		});
		
		// 2. INPUT FOR FORM
		var formInput = "<input type='text' name='" + $(this).attr("data-id") + "' value='" + selectedValue + "' style='display:none' data-role='jUI_menu'/>";
		$(this).append(formInput);
		
			
	}); //jUI_menu each END
	
	
	
});

/* CLICK EVENT */
function jUI_menu_click(senderSelector, data_root){

	var isCallSubMenu = false;
	
	// 2. this.data-sub -> call submenu form main menu
	if( $(senderSelector).attr("data-sub") == null){
		// hide all menu
		jUI_menu_layerHideAll();
		isCallSubMenu = false;
	}
	else{
		$(".jUI_memu_layer[data-role=sub]").fadeOut(150);
		isCallSubMenu = true;
	}
	
	// 3. Select .jUI_menu_layer with maching this.data-injection
	var data_injection = "";
	if(isCallSubMenu){
		data_injection = $(senderSelector).attr("data-sub");
	}
	else{
		data_injection = $(senderSelector).attr("data-id");
	}
	var menuSelector = ".jUI_memu_layer[data-id=" + data_injection + "]";
	
	// 4. Bind event after checking submenu
	$(menuSelector).children("LI").each(function(i) {
		var data_sub = $(this).attr("data-sub");
		var data_value = $(this).attr("data-value");
		
		if(data_sub != null){
			// bind
			//$(this).bind("mouseover",function(){
			$(this).unbind("click");
			$(this).bind("click",function(){
				var data_root_forSub = $(this).parent().attr("data-id");
				jUI_menu_click(this, data_root_forSub);
				return false;
			});
		}
		else{
			// change input value
			$(this).one("click",function(){
	
				var roleOfDiv = $(this).parent().attr("data-role");
				var divOfParent  = ".jUI_menu[data-id=" + data_root + "]";
				var labelOfParent = ".jUI_menu[data-id=" + data_root + "] .label";
	
				// 표시하기
				$(labelOfParent).empty();
				$(labelOfParent).append($(this).text());

				// input에 내용저장
				data_value = $(this).attr("data-value");
				//document.getElementsByName(data_injection)[0].value=data_value;
				$("INPUT[name=" + data_root +"]").val(data_value);
				
				// 이벤트 전달
				$("INPUT[name=" + data_root +"]").trigger("click");
				
				// 버튼 사이즈를 선택한 내용에 맞게 조정
//				if (roleOfDiv == "sub"){
//					var thisW = $(this).parent().width() + 26;
//					var divOfParentW = $(divOfParent).width();
//					if(thisW > divOfParentW)  $(divOfParent).css("width", thisW);
//					else $(divOfParent).css("width", "auto");
//				}
				
				return false;
			});
		}
	});
	
	// 5. POS
	var marginX = 0;
	var marginY = 2;
	if (isCallSubMenu){
		marginX =parseInt($(senderSelector).css("width"));
	}
	
	var menuLocation = jUI_menu_calPosition($(senderSelector), marginX, marginY, isCallSubMenu);
	$(menuSelector).css("left",menuLocation["x"]);
	$(menuSelector).css("top",menuLocation["y"]);

	// width
	//$(menuSelector).css("min-width", $(senderSelector).width());
	
	// 6. Animation
	$(menuSelector).clearQueue().slideDown(250);
	
	return false;
	
}


/* CALCULATE MENU POS */
function jUI_menu_calPosition(obj, marginLeft, marginTop, isCallSubMenu)
{
	var location = new Array();
	
	// obj.Y + obj.Height = layer.Y + 여백
	var locationX = obj.offset().left + marginLeft;
	var locationY = obj.offset().top + marginTop;
	
	if(!isCallSubMenu) locationY += parseInt(obj.css("height"));

	location["x"] = locationX;
	location["y"] = locationY;
	
	return location;
}

// HIDE ALL MENU
function jUI_menu_layerHideAll()
{
	$(".jUI_memu_layer").each(function() {
			$(this).slideUp(200,function() {
			});
	});
}

