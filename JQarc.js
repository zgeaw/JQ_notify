(function($) {
	var Dialog = function(opts) {
		var _this = this;
		//默认配置参数
		this.config = {
			width: 'auto', //对话框宽度
			message: null, //对话框提示信息
			type: 'waiting', //对话框类型
			buttons: null, //按钮配置
			delay: null, //对话框延迟多久关闭
			opacity: null, //对话框遮罩层透明度
			callback:function(){}//回调
		}
		if(opts && $.isPlainObject(opts)) { //默认参数扩展
			$.extend(this.config, opts);
		} else {
			this.isConfig = true; //没有传入配置参数
		}

		this.contianer = $('body'); //创建基本DOM
		this.mask = $('<div class="arc_dialog"><i class="arc_dialogbg"></i>'); //创建遮罩层
		this.win = $('<div class="arc_dialog_win">'); //创建弹出框
		this.winHeader = $('<div class="arc_dialog_header"></div>'); //创建弹出框头部
		this.winMsg = $('<div class="arc_dialog_msg">'); //创建提示信息
		this.winFooter = $('<div class="arc_dialog_footer">'); //创建弹出框按钮
		this.creat(); //渲染DOM
	};
	Dialog.Zindex = 10000; //记录弹框层级
	Dialog.prototype = { //扩展Dialog属性
		creat: function() { //创建弹出层
			var _this_ = this,
				config = this.config,
				mask = this.mask,
				win = this.win,
				header = this.winHeader,
				msg = this.winMsg,
				footer = this.winFooter,
				contianer = this.contianer;

			Dialog.Zindex++; //增加弹出框层级
			mask.css('z-index', Dialog.Zindex);

			header.addClass(config.type); //传入类型
			win.append(header);
			if(!this.isConfig) { //判断是否有传入配置参数	
				if(config.width != 'auto') { //设置对话框宽度
					win.width(config.width);
				}

				if(config.message) { //如果传入信息文本
					win.append(msg.html(config.message));
				}

				if(config.buttons) { //按钮组
					this.creatButtons(footer, config.buttons); //创建按钮组
					win.append(footer);
				}

				if(config.delay && config.delay != 0) { //对话框延迟多久关闭
					setTimeout(function() {
						_this_.close();
					}, config.delay);
				}

				if(config.opacity) { //设置透明度
					mask.css('background', 'rgba(0,0,0,' + config.opacity + ')');
				}
			}
			mask.css('z-index', this.Zindex++);
			_this_.animation(); //动画效果
			if (navigator.userAgent.indexOf('MSIE') >= 0 || navigator.userAgent.indexOf('rv:11.0') >= 0){	//判断是否为IE浏览器，或IE11浏览器
				var setMargin = function() { //设置对话框垂直居中,IE浏览器下生效
					var height = ($(window).height() - 200) / 2;
					$(win).css('margin-top', height + 'px');
				}
				setMargin(); //设置对话框垂直居中
				$(window).resize(function() { //窗口改变自动居中
					setMargin(); //设置对话框垂直居中
				});
			}
			mask.append(win);
			$(mask).click(function(e) {
				_this_.close();
			});
			$(document).keyup(function(event) {//绑定Esc事件，关闭弹出框
				if(event.keyCode == '27'){
					_this_.close();
				}
			});
			contianer.append(mask);
		},
		creatButtons: function(footer, bottons) { //创建按钮组
			var _this_ = this;
			$(bottons).each(function(i) {
				var type = this.type ? ' class="' + this.type + '"' : '',
					title = this.title ? this.title : '按钮' + i,
					callback = this.callback ? this.callback : null,
					_button = $('<button ' + type + '>' + title + '</button>');

				_button.click(function(e) { //回调按钮点击事件
					if(callback) {
						var isClose = callback(); //定义回调返回值
						if(isClose != false) {
							_this_.close(); //关闭弹出框
						}
					} else {
						_this_.close(); //关闭弹出框
					}
					e.stopPropagation(); //阻止事件冒泡
				});
				footer.append(_button);
			});
		},
		animation: function() { //动画效果
			var _this_ = this;
			this.win.css({
				'transform': 'scale(0)',
				'opacity': '0'
			}); //设置弹出框缩放为0%
			setTimeout(function() {
				_this_.win.css({
					'transform': 'scale(1)',
					'opacity': '1'
				}); //延迟200毫秒设置弹出框缩放为100%
			}, 200);
		},
		close: function() { //关闭弹出框			
			var _this_ = this;
			_this_.win.css({
				'transform': 'scale(0)',
				'opacity': '0'
			}); //设置弹出框缩放为0%
			setTimeout(function() {
				_this_.mask.remove(); //延迟300毫秒移除弹出插件
				_this_.config.callback();
			}, 300);
		}
	};
	window.Dialog = Dialog; //注册window对象
	$.Dialog = function(config) { //注册JQ插件
		return new Dialog(config);
	}
})(jQuery);