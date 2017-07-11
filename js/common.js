/* 
 * 自定义cookie对象
 * 返回一个cookie对象可以通过set，get，del，三个方法设置，获取，删除cookie
 */
var cookie = function () {
	return {
		set: function (name, val, time) { //添加一个cookie
			var getTimes = function (str) { //将输入的时间转化为毫秒
				var str1 = str.substring(str.length - 1).toLowerCase(),
					str2 = str.substring(0, str.length - 1);
				if (str1 == 's') {
					return str2 * 1000;
				} else if (str1 == 'h') {
					return str2 * 60 * 60 * 1000;
				} else if (str1 == 'd') {
					return str2 * 24 * 60 * 60 * 1000;
				}
			};
			var strTimes = getTimes(time),
				exp = new Date();
			exp.setTime(exp.getTime() + strTimes);
			document.cookie = name + '=' + escape(val) + ';expires=' + exp.toGMTString();
		},
		get: function (name) { //读取cookie
			var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
			arr = document.cookie.match(reg);
			if (arr) {
				return unescape(arr[2]);
			} else {
				return null;
			}
		},
		del: function (name) { //删除cookie
			var val = this.get(name),
				exp = new Date();
			exp.setTime(exp.getTime() - 1);
			if (val != null) {
				document.cookie = name + '=' + val + ';expires=' + exp.toGMTString();
			}
		}
	}
};

/* 判断是否为IE，以及IE的版本（IE11一下）*/
function isIE(callback) {
	var userAgent = navigator.userAgent;
	if (userAgent.indexOf("compatible") > -1 && /MSIE/.test(userAgent)) {
		return callback(userAgent.match(/MSIE\s(\d*)/)[1]);
	}
}

/* 兼容各种浏览器的添加事件监听 */
function addEvent(el, ev, fn) {
	ev = ev || window.event;
	if (el.attachEvent)
		el.attachEvent("on" + ev, fn);
	else
		el.addEventListener(ev, fn, false);
}

/* 兼容IE浏览器遍历对象，数组 */
function forEach(obj, callback) {
	for (var key in obj) {
		if (type(obj[key]) != "function" && type(obj[key]) != "number") {
			callback(key, obj[key]);
			//				console.log(obj[key]);
		}
		//			console.log(obj)
	}
}

/* 判断各种数据类型 */
function type(o) {
	return ((o == 0 || false ? o.constructor && o.constructor.toString().match(/\[?\w+\s(\w*\d*)/)[1] : o && o.constructor && o.constructor.toString().match(/\[?\w+\s(\w*\d*)/)[1]) + "").toLowerCase();
}

/* 添加指定class */
function addClass(el, clsname) {
	var reg = new RegExp("(\\s?)" + clsname);
	if (reg.test(el.className)) return false;
	el.className += " " + clsname;
}

/* 移除指定class */
function removeClass(el, clsname) {
	var reg = new RegExp("(\\s?)" + clsname);
	el.className = el.className.replace(reg, "");
}

/* 
 * 创建一个ajax对象 
 * args是一个对象 
 * method: 数据交互方式 (string)
 * async: 是否异步 (bool)
 * url: 提交地址 (string)
 * dsta: 提交参数 (json或者js对象) 
 */
function ajax(args) {
	var xhr = createXhr(); //创建xhr对象
	//	console.log(args.data);
	args.data = formatParams(args.data); //格式化参数，为get方式传参做准备
	//	console.log(args.data);
	args.url += "?randId=" + Math.random() * 10; //解决浏览器缓存的问题
	if (args.method == "GET" && args.data) {
		args.url += args.url.indexOf("?") == -1 ? "?" + args.data : "&" + args.data;
	}
	if (!args.async || args.async == true) {
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == 200) {
				args.callback(xhr.responseText);
			}
		};
	}
	xhr.open(args.method, args.url, true);
	if (args.method == "POST") {
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send(args.data);
	} else {
		xhr.send(null);
	}
//	console.log(args.url);
}

/* 格式化参数方便get方法使用 */
function formatParams(data) {
	var dataStr = "",
		dataArr = [];
	if (data) {
		forEach(data, function (key, value) {
			dataArr.push(key + "=" + value);
		});
		dataStr = dataArr.join("&");
	}
	return dataStr;
}

/* 创建一个XMLHttpRequest对象 */
function createXhr() {
	var xhr;
	if (window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();
	} else {
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}
	return xhr;
}

/* 创建一个Dom节点 */
function Create(node) {
	return document.createElement(node);
}
/* 复制并插入一个Dom节点 */
function cloneAndAppend(parent, target, count) {
	for (var i = 0; i < count; i++) {
		parent.appendChild(target.cloneNode(true));
	}
}

/* 
 * 判断是否为宽屏
 * 参数说明：
 ** size: 屏幕的最小宽度(number)
 */
function isBigScreen(size) {
	return winW >= size ? true : false;
}