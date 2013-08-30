jUI_menu
========

Dropdown Menu UI

##SUMMARY
jUI_menu is a easy beautiful Javascript tool for combobox and menu have input value.
Therefore You can use this component to form on your site. Or Use navigating with submenu!

* Beautiful and customable combobox or menu
* Submenu
* Generate INPUT tag for form.

![screenshot](https://raw.github.com/soleaf/jUI_menu/master/screenshot.png)

##HOW TO USE

1. Write this menu code. This appear menu/combobox button. And modify values
  * `data-id` : id for root menu.
  * `data-selectedValue` : selected value(default value) on items values
  * `data-width` : force width. (Optional)

```html
<a href="#" class="jUI_menu" data-id="one" data-selectedValue="11" data-width="170">
	<span class="label"></span>
	<span class="arrow"></span>
</a>

```

2. Make menu content list
  * `data-id` : id
  * `data-role` : type of menu
      * `root` : root menu
      * `sub`: submenu
  * `data-root` : data-id of root menu
  * `data-value` : value for input(form)
  
```html
<ul class="jUI_memu_layer" data-role="root" data-id="one" data-root="one">
	<li data-value="">ALL</li>
	<li data-value="11">1</li>
	<li data-value="S100" data-sub="sub1">11</li>
	<li data-value="S200" data-sub="sub2">222</li>
</ul>			
	<ul class="jUI_memu_layer" data-role="sub" data-id="sub1" data-root="one">										
    <li data-value="3">A123LL</li>
		<li data-value="31">1</li>
	</ul>
	
	<ul class="jUI_memu_layer" data-role="sub" data-id="sub2" data-root="one">
		<li data-value="3">A123LL</li>
		<li data-value="31">1</li>
	</ul>

<ul class="jUI_memu_layer" data-role="root" data-id="two" data-root="two">
	<li data-value="">ALL</li>
	<li data-value="11">1</li>
	<li data-value="S100">11</li>
	<li data-value="S200">222</li>
</ul>
```

3. That's all!

## USE INPUT FOR FORM
If you use jUI_menu, You see autugenerated input tag in menu through `web browser source viewer(rendered)`
This is rendered code. See input. you cant use it for form and post/get action and other.
This value is changed by selecting menu.

 * name is matched by `data-id`
 
```html
<input type="text" name="one" value="11" style="display:none" data-role="jUI_menu">
```

