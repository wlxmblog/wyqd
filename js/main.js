/* 顶部消息模块 */
var cookiee = new cookie();
var clsmsg = function (clsbtn, parent) {
	if (cookiee.get('isClosed'))
		parent.style.display = "none";
	clsbtn.onclick = function () {
		cookiee.set("isClosed", "closed", "99999h");
		parent.style.display = "none";
	}
};
clsmsg(document.getElementById("close"), document.querySelector(".m-message"));

/* 登陆模块 */
var M_login = function (module) {
	var _this = this;
	this.attnBtn = module.querySelectorAll(".btn_attn");
	this.cancelBtn = module.querySelector("#cancel");
	this.popup = module.querySelector(".login-popup");
	this.userName = module.querySelector("#userName");
	this.password = module.querySelector("#password");
	this.submitBtn = module.querySelector("#submit");
	this.mask = module.querySelector(".mask");
	this.closeBtn = module.querySelector(".close");
	this.init = function () {
		isExist();
		_this.attnBtn[0].onclick = function () {
			if (isExist() == false) {
				_this.showPopup();
				_this.login();
			}
		}
		
		function isExist(){
			if (cookiee.get("loginSuc") == null) {
				_this.cancelAttn();
				return false;
			}else{
				if(_this.existFollowSuc() == true){
					_this.attention();
				}
				return true;
			}
		}
	};

	this.existFollowSuc = function () {
		ajax({
			method: "GET",
			async: true,
			url: "http://study.163.com/webDev/attention.htm",
			callback: function (res) {
				if (res == 1) {
					return true;
				}
			}
		});
	};
	this.attention = function () {
		_this.attnBtn[0].style.display = "none";
		_this.attnBtn[1].style.display = "block";
		_this.attnBtn[1].style.cursor = "";
		cookiee.set("followSuc", "followSucExsited", "9999h");
	};
	this.cancelAttn = function () {
		_this.attnBtn[1].style.display = "none";
		_this.attnBtn[0].style.display = "block";
		cookiee.del("followSuc");
	};
	this.showPopup = function () {
			if (!cookiee.get("loginSuc")) {
				_this.mask.style.display = "block";
				_this.popup.style.top = "50%";
			} else {
				_this.attention();
			}
		addEvent(_this.closeBtn, "click", function () {
			_this.mask.style.display = "none";
			_this.popup.style.top = "-150%";
		});
	};
	//	_this.password.onchange = function(){
	//		_this.userName.value = hex_md5(_this.userName.value);
	//		_this.password.value = hex_md5(_this.password.value);
	//	};
	this.login = function () {
		addEvent(_this.submitBtn, "click", function () {
			var dataObj = {
				userName: hex_md5(_this.userName.value),
				password: hex_md5(_this.password.value)
			};
			//console.log(dataObj);
			//console.log(validate());
			if (validate()) {
				ajax({
					method: "GET",
					async: true,
					data: dataObj,
					url: "http://study.163.com/webDev/login.htm",
					callback: function (res) {
						if (res == 1) {
							_this.mask.style.display = "none";
							_this.popup.style.top = "-150%";
							_this.attention();
							cookiee.set("loginSuc", "isLogined", "24h");
						} else {
							addClass(_this.userName, "f-validate")
							_this.userName.value = "用户名或密码错误"
						}
					}
				});
			}

		});

		function validate() {
			var u = _this.userName,
				p = _this.password,
				result = false;
			if (!u.value) {
				addClass(u, "f-validate")
				u.placeholder = "请输入您的用户名"
			} else if (!p.value) {
				addClass(p, "f-validate")
				p.placeholder = "请输入您的密码"
			} else {
				removeClass(u, "f-validate");
				removeClass(p, "f-validate");
				result = true;
			}
			return result;
		}
	}
};
var m_login = new M_login(document.querySelector(".m-navbar"));
m_login.init();

/* 轮播图模块 */
var M_flash = function (bnr, dot) {
	var _this = this,
			arr = []; //缓存当前与当前的上一张图片的id（兼容IE8/9时会用到）
	this.currId = 0; //当前图片id
	this.bnrs = bnr.querySelectorAll("li");
	this.dots = dot.querySelectorAll("li");
	this.len = this.dots.length;
	this.time = null; //自动播放定时器
	this.flash = function () { //幻灯播放与控制
		//			Array.prototype.forEach.call(_this.dots, function(){});
		forEach(this.dots, function (index, that) {
			//鼠标点击小圆点切换图片
			//				console.log(that);
			addEvent(that, "click", function () {
				_this.change(that, index);
				_this.currId = index;
			})
		});
		this.playStart(); //开始播放
		this.PlayControl(); //控制播放，鼠标移到某图片，播放暂停，移除则继续播放
	};
	this.playStart = function () { //自动播放函数（每隔5s）
		this.time = setInterval(function () {
			if (_this.currId == _this.len) {
				_this.currId = 0;
				//						console.log(_this.currId);
			}
			_this.change(_this.dots[_this.currId], _this.currId++); //调用切换状态函数
			//				console.log(_this.currId);
		}, 5000);
	};
	this.PlayControl = function () { //用于播放控制
		forEach(this.bnrs, function (_index, _that) {
			addEvent(_that, "mouseover", function () {
				clearInterval(_this.time);
			});
			addEvent(_that, "mouseout", function () {
				_this.playStart();
			});
		});
	};
	this.change = function (that, id) { //用于切换小圆点和图片的函数

		forEach(_this.dots, function (_index, _that) {
			_that.className = "";
			_this.bnrs[_index].className = "";
		});
		that.className = "act";
		_this.bnrs[id].className = "act";
		/*兼容IE8/9轮播，模拟transition过渡效果*/
		isIE(function (version) {
			if (version == 8 || 9) {
				arr.push(parseInt(id));
				if (arr.length > 2) {
					arr = arr.slice(arr.length - 2);
				}
				//			console.log(arr);
				forEach(_this.dots, function (_index, _that) {
					_this.bnrs[_index].style.filter = "Alpha(opacity=0)";
				});
				var i = 0,
					j = 100;
				var t = setInterval(function () {
					--j;
					++i;
					if (j >= 0) {
						_this.bnrs[arr[0]].style.filter = "Alpha(opacity=" + j + ")";
					}
					if (i <= 100) {
						_this.bnrs[id].style.filter = "Alpha(opacity=" + i + ")";
					}
				}, 5);
			}
		});
		/*兼容IE8/9轮播，模拟transition过渡效果*/
	}
};
var m_banner = new M_flash(document.querySelector(".banners"), document.querySelector(".dots"));
m_banner.flash();
/* 图文介绍模块 */
var M_introduce = function (parent) {
	var _this = this;
	this.pboxWd = 0;
	this.pBox = parent.querySelector(".pic-introduce");
	this.pics = this.pBox.querySelectorAll("li");
	this.picWd = this.pics[0].clientWidth + 4;
	this.picsLen = this.pics.length;
	this.pSet = function () {
		forEach(_this.pics, function (index, that) {
			if (index != 0)
				that.style.left = index * _this.picWd + "px";
		});
		_this.pboxWd = _this.picWd * _this.picsLen - 4;
		_this.pBox.style.width = _this.pboxWd + "px";
		_this.pBox.style.marginLeft = -_this.pboxWd / 2 + "px"
	}
}
var m_introduce = new M_introduce(document.querySelector(".m-introduce"));
m_introduce.pSet();
/* 课程列表模块 */
var M_course = function (module) {
	var _this = this,
		winW = document.documentElement.clientWidth;
	this.module = module;
	this.tabs = module.querySelector(".tab").querySelectorAll("li");
	this.courseType = module.querySelectorAll(".course-type");
	this.contentBox = module.querySelectorAll(".content");
	this.course = module.querySelectorAll(".course");
	this.popup = module.querySelectorAll(".popup");
	this.paging = module.querySelectorAll(".paging");
	this.pageIndex = 0;
	/* 初始化 */
	this.init = function () {
		_this.select();
		if (winW >= 1205) {
			cloneAndAppend(_this.contentBox[0], _this.contentBox[0].querySelector("li"), 19);
			cloneAndAppend(_this.contentBox[1], _this.contentBox[1].querySelector("li"), 19);
			_this.getDatas("10", "1", "10", 0);
			_this.getDatas("10", "2", "10", 0);
			_this.getDatas("20", "1", "10", 0);
			_this.getDatas("20", "2", "10", 0);
		} else {
			cloneAndAppend(_this.contentBox[0], _this.contentBox[0].querySelector("li"), 29);
			cloneAndAppend(_this.contentBox[1], _this.contentBox[1].querySelector("li"), 29);
			_this.getDatas("10", "1", "10", 0);
			_this.getDatas("10", "2", "10", 0);
			_this.getDatas("10", "3", "10", 0);
			_this.getDatas("20", "1", "10", 0);
			_this.getDatas("20", "2", "10", 0);
			_this.getDatas("20", "3", "10", 0);
		}
		_this.getDataLen();
	};

	this.specPaging = function (id) {
		if (winW < 1205) {
			forEach(_this.contentBox[id].querySelectorAll("li"), function (_index, _that) {
				if (_index >= 15)
					_that.style.display = "none"
			});
		}
	}

	/* tab选项卡状态切换 */
	this.select = function () {
		forEach(_this.tabs, function (index, that) {
			addEvent(that, "mouseover", function () {
				forEach(_this.tabs, function (_index, _that) {
					removeClass(_that, "act");
					removeClass(_this.courseType[_index], "f-show");
				});
				addClass(that, "act");
				addClass(_this.courseType[index], "f-show");
			});
		});
	};

	/* 创建课程分类对象，设计类为dsnObj，编程类为pgmObj，以对象的形式返回 */
	this.getNodes = function () {
		/*
		 * 创建并获取相应课程列表的相应元素的对象，以便填充数据 
		 * 参数说明：
		 ** tabId: 当前选项卡的index
		 * 返回值：
		 ** courseObjArr: 课程列表所有子节点的对象集合
		 ** popupObjArr: 课程列表弹窗所有子节点的对象集合
		 */
		var Geter = function (tabId) {
			var courseObj = {},
				popupObj = {},
				courseObjArr = [],
				popupObjArr = [],
				courses = _this.contentBox[tabId].querySelectorAll(".course"),
				popups = _this.contentBox[tabId].querySelectorAll(".popup");
			forEach(courses, function (index, that) {
				courseObj = { //课程列表列表项对象
					pic: that.querySelector(".pic img"),
					title: that.querySelector(".title"),
					classify: that.querySelector(".classify"),
					number: that.querySelector(".number"),
					price: that.querySelector(".price")
				};
				popupObj = { //课程弹窗列表列表项对象
					pic: popups[index].querySelector(".pic img"),
					title: popups[index].querySelector(".title"),
					number: popups[index].querySelector(".number"),
					classify: popups[index].querySelector(".classify"),
					provider: popups[index].querySelector(".provider"),
					description: popups[index].querySelector(".description")
				};
				courseObjArr.push(courseObj);
				popupObjArr.push(popupObj);
			});

			return {
				courseObjArr: courseObjArr,
				popupObjArr: popupObjArr
			}
		};

		return {
			dsnObj: new Geter(0), //返回产品设计下的课程列表对象
			pgmObj: new Geter(1) //返回编程语言下的课程列表对象
		}
	};
	/*--以下是数据处理--*/

	/*
	 * 分页 获取数据并填充
	 * 参数说明：
	 ** id: 当前选项卡的index
	 ** dataTotlePageCount: 数据总页数
	 */
	this.flip = function (id, dataTotlePageCount) {
		var page = _this.paging[id].querySelectorAll(".page"),
			pre = _this.paging[id].querySelector(".pre"),
			next = _this.paging[id].querySelector(".next"),
			courseList = _this.contentBox[id].querySelectorAll("li"),
			dataType = (id + 1) * 10 + "", //获得课程类型
			dataPage1, dataPage2, dataPage3,
			i = 0,
			pageCount = page.length;
		pre.onclick = function () {
			if (_this.pageIndex > 0) {
				_this.pageIndex--;
				fillData(_this.pageIndex);
				pageStateChange(page[_this.pageIndex]);
			}
		};
		next.onclick = function () {
			if (_this.pageIndex < pageCount - 1) {
				_this.pageIndex++;
				fillData(_this.pageIndex);
				pageStateChange(page[_this.pageIndex]);
			}
		}
		forEach(page, function (index, that) {
			addEvent(that, "click", function (ev) {
				_this.pageIndex = index;
				fillData(index);
				pageStateChange(that);
			});
		});

		function pageStateChange(that) {
			forEach(page, function (_index, _that) {
				removeClass(_that, "act");
			});
			addClass(that, "act");
		}

		function fillData(index) {
			dataPage1 = parseInt(index) * 2 + 1 + ""; //需要从那一数据页获取数据
			dataPage2 = parseInt(index) * 2 + 2 + ""; //同上
			/* 如果窗口小于1205px */
			if (winW < 1205) {
				dataPage1 = parseInt(index) / 2 * 3 + 1 + ""; //同上
				dataPage2 = parseInt(index) / 2 * 3 + 2 + ""; //同上
				dataPage3 = parseInt(index) / 2 * 3 + 3 + ""; //同上
				/*如果点击的是偶数页则获取数据*/
				if (index % 2 == 0) {
					_this.getDatas(dataType, dataPage1, "10", index); //获取第一个数据页的数据并填充
					_this.getDatas(dataType, dataPage2, "10", index); //同上
					if (dataPage3 < dataTotlePageCount) {
						_this.getDatas(dataType, dataPage3, "10", index); //同上
					}
					forEach(courseList, function (_index, _that) { //奇偶页切换
						_that.style.display = _index >= 15 ? "none" : "block";
					});
					/*奇数页无需获取数据*/
				} else {
					forEach(courseList, function (_index, _that) { //奇偶页切换
						_that.style.display = _index >= 15 ? "block" : "none";
					});
					if (dataPage3 >= dataTotlePageCount) {
						forEach(courseList, function (_index, _that) {
							if (_index >= 20)
								_that.style.display = "none";
						});
					}
				}
				/* 如果窗口大于或等于1205px */
			} else {
				_this.getDatas(dataType, dataPage1, "10", index);
				if (dataPage2 < dataTotlePageCount) {
					forEach(courseList, function (_index, _that) {
						_that.style.display = "block";
					});
					_this.getDatas(dataType, dataPage2, "10", index);
				} else {
					forEach(courseList, function (_index, _that) {
						_that.style.display = _index >= 10 ? "none" : "block";
					});
				}
			}
		}
	};

	/* 根据数据量设置分页 */
	this.getDataLen = function () {
		var paramsArr = [
			{
				pageNo: "1",
				psize: "10",
				type: "10"
			},
			{
				pageNo: "1",
				psize: "10",
				type: "20"
			}
			];
		forEach(paramsArr, function (index, that) {
			ajax({
				method: "GET",
				async: true,
				data: that,
				url: "http://study.163.com/webDev/couresByCategory.htm",
				callback: function (res) {
					var resObj = JSON.parse(res), //转化返回的json数据
						totalCount = resObj.totalCount, //获取数据的总数
						totalPageCount = resObj.pagination.totlePageCount; //获取数据的总页数
					if (winW >= 1205)
						_this.setPaging(totalCount, 20, index); //如果窗口宽度>=1205px ，根据数据总量和视觉页面列表的数量设置分页
					else
						_this.setPaging(totalCount, 15, index); //同上
					_this.flip(0, totalPageCount);
					_this.flip(1, totalPageCount);
				}
			});
		});
	};
	/*
	 * 创建并获取相应课程列表的相应元素的对象，以便填充数据 
	 * 参数说明：
	 ** type: 课程类型(string), 例如："10"，代表产品设计
	 ** pageNo: 需要获取的数据页码(string)，例如："1"，代表第一页
	 ** psize: 需要获取多少条数据(string)，例如："10"，代表需要从该页获取10条数据
	 ** currPageIndex: 页面的当前页码
	 */
	this.getDatas = function (type, pageNo, psize, currPageIndex) { //获取编程语言类课程
		var paramsObj = {
				pageNo: pageNo,
				psize: psize,
				type: type
			},
			CourseTypeObj;
		ajax({
			method: "GET",
			async: true,
			data: paramsObj,
			url: "http://study.163.com/webDev/couresByCategory.htm",
			callback: function (res) {
				var resObj = JSON.parse(res);
				CourseTypeObj = _this.getNodes();
				winW < 1205 ? fill(15) : fill(20);
				/* 调用数据填充，判断数据类型 */
				function fill(pagesize) {
					if (type == 10)
						_this.fillDatas(res, CourseTypeObj.dsnObj, currPageIndex, pagesize);
					else
						_this.fillDatas(res, CourseTypeObj.pgmObj, currPageIndex, pagesize);
				}
			}
		});
	};
	/*
	 * 填充数据 
	 * 参数说明：
	 ** res: ajax返回的数据(json)
	 ** CourseTypeObj: 哪个类型的课程节点对象集合
	 ** psize: 需要获取多少条数据(string)，例如："10"，代表需要从该页获取10条数据
	 ** currPageIndex: 课程类型
	 ** currPageIndex: 页面的当前页码
	 ** pagesize: 每页需要显示的量
	 */
	this.fillDatas = function (res, CourseTypeObj, currPageIndex, pagesize) {
		var dataObj = JSON.parse(res), //将返回的json数据转化为对象
			totalCount = dataObj.totalCount, //数据总数
			pageIndex = dataObj.pagination.pageIndex, //当前数据页码
			i = (pageIndex - 1) * 10, //开始数据填充的位置
			j = i,
			k;
		//			console.log(dataObj);
		//			console.log(dataObj.list);
		//			console.log(CourseTypeObj.courseObjArr);
		for (i; i < pageIndex * 10; i++) {
			k = currPageIndex * pagesize;
			var tmpDataObj = dataObj.list[i - j], //缓存当前数据，并保证每次获取的数据都是从0开始，循环中i-j始终为0-9
				tmpCourseObj = CourseTypeObj.courseObjArr[i - k],
				tmpPopupObj = CourseTypeObj.popupObjArr[i - k];
			tmpDataObj.price = tmpDataObj.price > 0 ? "￥" + tmpDataObj.price : "免费"; //判断价格是否免费
			tmpDataObj.categoryName = tmpDataObj.categoryName == null ? "未分类" : tmpDataObj.categoryName; //判断是否有分类，如果为null则设为未分类
			/* 课程列表填充数据 */
			tmpCourseObj.pic.src = tmpDataObj.bigPhotoUrl;
			tmpCourseObj.title.innerText = tmpDataObj.name;
			tmpCourseObj.classify.innerText = tmpDataObj.categoryName;
			tmpCourseObj.number.innerText = tmpDataObj.learnerCount;
			tmpCourseObj.price.innerText = tmpDataObj.price;
			/* 课程列表弹窗填充数据 */
			tmpPopupObj.pic.src = tmpDataObj.bigPhotoUrl;
			tmpPopupObj.title.title = tmpDataObj.name;
			tmpPopupObj.title.innerText = tmpDataObj.name;
			tmpPopupObj.number.innerText = tmpDataObj.learnerCount;
			tmpPopupObj.classify.innerText = tmpDataObj.categoryName;
			tmpPopupObj.provider.innerText = tmpDataObj.provider;
			tmpPopupObj.description.innerText = tmpDataObj.description;
		}
	};
	/*
	 * 设置页码，并插入页码Dom节点<li class="page">number</li> 
	 * 参数说明：
	 ** totalCount: 数据总数(number)
	 ** pagesize: 每页需要显示多少条数据(number)
	 ** id: 当前属于哪一类课程的分页(number)
	 */
	this.setPaging = function (totalCount, pagesize, id) {
		var nextNode = module.querySelectorAll(".next"),
			pages = [],
			i = 0,
			len = Math.ceil(totalCount / pagesize);
		for (i; i < len - 1; i++) {
			pages.push(new Create("li"));
			pages[i].className = "page";
			pages[i].innerText = i + 2;
			_this.paging[id].insertBefore(pages[i], nextNode[id]);
		}
	}
};
var m_course = new M_course(document.querySelector(".m-course-list"));
m_course.init();
m_course.specPaging(0);
m_course.specPaging(1);
/*视频介绍模块*/
var M_video = function (module) {
	var _this = this;
	this.playBtn = module.querySelector(".video-cover");
	this.mask = module.querySelector(".mask");
	this.popup = module.querySelector(".video-popup");
	this.video = module.querySelector("video");
	this.closeBtn = module.querySelector(".close");
	this.showPopup = function () {
		addEvent(_this.playBtn, "click", function () {
			_this.mask.style.display = "block";
			_this.popup.style.top = "50%";
			_this.video.play();
		});
		addEvent(_this.closeBtn, "click", function () {
			_this.video.pause();
			_this.mask.style.display = "none";
			_this.popup.style.top = "-150%";
		});
	}
};
var m_video = new M_video(document.querySelector(".m-video"));
m_video.showPopup();

/* 热门排行模块 */
var M_hotcoures = function (module) {
	var _this = this,
			time = null;
	this.list = module.querySelector(".hotcoures");
	/* 创建热门课程排行列表的函数 */
	this.createList = function (number) {
		cloneAndAppend(this.list, this.list.querySelector("li"), 9);
	};
	/* ajax获取数据 */
	this.getDatas = function () {
		ajax({
			method: "GET",
			async: true,
			url: "http://study.163.com/webDev/hotcouresByCategory.htm",
			callback: function (res) {
				var data = JSON.parse(res), //将json字符串转换为数组
						len = data.length; //获取数组长度
				_this.createList(len); //创建并插入DOM
				_this.lists = _this.list.querySelectorAll("li");
				_this.insertData(data);
			}
		});
	};
	
	/* 插入数据 */
	this.insertData = function (data) {
		data = data.sort(function () { //将获取的数据数组顺序打乱
			return Math.random() - 0.5;
		});
		/* 遍历并将数据插入到HTML */
		forEach(_this.lists, function (index, that) {
			insert(data, index, that);
		});
		update();
		/* 5s滚动更新课程 */
		function update(){
			var i = 0, j = 0, k = 0;
			tmpData = data.slice(9);
//			console.log(tmpData);
			time = setInterval(function(){
				j++;
				if(j % 10 == 0){
					k++;
					console.log(k);
					if(k % 2 == 0)
						tmpData = data.slice(9);
					else
						tmpData = data.slice(0, 10);
//					console.log(tmpData);
				}
//				console.log(j);
					insert(tmpData, i, _this.lists[i]);
					i = i > 8 ? 0 : i + 1;
//				console.log(i);
			}, 5000);
		};
		function insert(data, index, that){
			that.querySelector(".pic>img").src = data[index].smallPhotoUrl;
			that.querySelector(".pic>img").alt = data[index].name;
			that.querySelector(".title>a").innerText = data[index].name;
			that.querySelector(".title>a").title = data[index].name;
			that.querySelector(".number").innerText = data[index].learnerCount;
		}
	};
};
var m_hotcoures = new M_hotcoures(document.querySelector(".m-hotcoures"));
m_hotcoures.getDatas();