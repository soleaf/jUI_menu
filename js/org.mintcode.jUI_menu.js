/*
jQuery UI set: Dropdown menu
VER 0.0.1

by soleaf
http://www.mintcode.org
GitHub : https://github.com/soleaf/jUI_menu
*/

$(document).ready(function(){

	// 바디 클릭시 레이러 사라지게
	$(document).bind("click",function() {
		jUI_menu_layerHideAll();
	});
	
	// 메뉴 레이어를 바디로 옮기기:포지션 문제
	$("body").prepend($(".jUI_memu_layer"));
	$(".pageContent .jUI_memu_layer").remove();
	
	// 메뉴객체 찾아내기
	$(".jUI_menu").each(function(){
		
		var senderSelector = ".jUI_menu[data-id=" + $(this).attr("data-id") + "]";
		var menuSelector = ".jUI_memu_layer[data-id=" + $(this).attr("data-id") + "]";
		var allMenuSelector = ".jUI_memu_layer[data-root=" + $(this).attr("data-id") + "]";
		
		// 선택된 값이 지정되어있나?
		var selectedValue = "";
		var selectedLabel = "";
		if(null != $(this).attr("data-selectedValue") && $(this).attr("data-selectedValue").length > 0) {
			selectedValue = $(this).attr("data-selectedValue")
			selectedLabel = $(allMenuSelector).find("LI[data-value="+ selectedValue +"]").text();
		}
		else // 선택X -> 첫번째 아이템을 자동선택
		{
			selectedValue = $(menuSelector).children("LI:first-child").attr("data-value");
			selectedLabel = $(menuSelector).children("LI:first-child").text();
		}
		$(this).find(".label").text(selectedLabel);
		
		// 메뉴에서 서브메뉴가있으면 화살표 주기
		$(menuSelector).find("LI").each(function(){
			var isHaveSub = $(this).attr("data-sub");
			if (isHaveSub != null){
				var thisText = $(this).text();
				var arrowMark = " <font color='#dbdbdb' style='position:absolute;right:2px;' size='9'>&gt; &nbsp;</font>";
				$(this).css("padding-right","5px");
				$(this).html(thisText + arrowMark);
			}
		});
		
		// 너비 지정: data-width이 있으면 강제 지정
		var data_width = $(this).attr("data-width");
		var menuSenderW = $(this).width();
		var menuW = $(menuSelector).width(); // 26: arrow width 포함
		
		if (data_width > 0){
			$(menuSelector).css("width", data_width);
			$(this).css("width", data_width);
		}
		else{
			// 속성이 없으면 자동너비 맞춤: 큰쪽기준
			if (menuSenderW > menuW){
				$(menuSelector).css("width", menuSenderW);
			}	
			else{
				$(this).css("width", menuW);
			}
				
		}
		
		// 1. .jUI_menu click 이벤트 연결
		//$(this).bind("mouseover",function(){
		$(this).bind("click",function(){
			
			if($(menuSelector).css("display") == "none"){
				var data_root = $(this).attr("data-id");
				jUI_menu_click(this, data_root);
			}
			return false;
		});
		
		// 2. 메뉴 선택후 값을 전달할 객체 생성
		var formInput = "<input type='text' name='" + $(this).attr("data-id") + "' value='" + selectedValue + "' style='display:none' data-role='jUI_menu'/>";
		$(this).append(formInput);
		
			
	}); //jUI_menu each END
	
	
	
});

/* 클릭 메서드 */
function jUI_menu_click(senderSelector, data_root){

//	console.log("이 메뉴를 소유한 버튼 id: " + data_root);
	var isCallSubMenu = false;
	
	// 2. this.data-sub인지 확인 -> data-sub인경우 메인메뉴에서 서브메뉴를 호출하는 과정임
	if( $(senderSelector).attr("data-sub") == null){
		// 모든 메뉴 삭제
		jUI_menu_layerHideAll();
		isCallSubMenu = false;
	}
	else{
		$(".jUI_memu_layer[data-role=sub]").fadeOut(150);
		isCallSubMenu = true;
	}
	
	// 3. this.data-injection과 일치하는 .jUI_menu_layer를 선택
	var data_injection = "";
	if(isCallSubMenu){
		data_injection = $(senderSelector).attr("data-sub");
	}
	else{
		data_injection = $(senderSelector).attr("data-id");
	}
	var menuSelector = ".jUI_memu_layer[data-id=" + data_injection + "]";
	
	// 4. 서브메뉴 확인 후 이벤트 연결
	$(menuSelector).children("LI").each(function(i) {
		var data_sub = $(this).attr("data-sub");
		var data_value = $(this).attr("data-value");
		
		if(data_sub != null){
			// 서브메뉴를 연결
			//$(this).bind("mouseover",function(){
			$(this).unbind("click");
			$(this).bind("click",function(){
				var data_root_forSub = $(this).parent().attr("data-id");
				jUI_menu_click(this, data_root_forSub);
				return false;
			});
		}
		else{
			// 루트 메뉴버튼 값에 반영
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
	
	// 5. 좌표설정
	var marginX = 0;
	var marginY = 2;
	if (isCallSubMenu){
		marginX =parseInt($(senderSelector).css("width"));
	}
	
	var menuLocation = jUI_menu_calPosition($(senderSelector), marginX, marginY, isCallSubMenu);
	$(menuSelector).css("left",menuLocation["x"]);
	$(menuSelector).css("top",menuLocation["y"]);

	// 가로너비 지정
	//$(menuSelector).css("min-width", $(senderSelector).width());
	
	// 6. 애니메이션
	$(menuSelector).clearQueue().slideDown(250);
	
	return false;
	
}


/* 레이어 좌표를 계산하기 */
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

// 메뉴 숨기기
function jUI_menu_layerHideAll()
{
	$(".jUI_memu_layer").each(function() {
			$(this).slideUp(200,function() {
			});
	});
}

