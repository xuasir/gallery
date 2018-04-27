(function () {
	//初始化
	var tol = 16;
	var win = $(window);
	document.addEventListener('touchmove', function (event) {
		event.preventDefault();
	}, false);
	var init = function () {
		var winWidth = win.width();
		var winH = win.height();
		var hh = winH / 12;
		$('#_header').css({
			height: hh + 'px',
		}).css('line-height', hh + 'px');
		$('#fake_header').css({
			height: 4 + hh + 'px'
		});
		$('#large_count').css({
			top: -win.height()
		});
		$('#_line1').css('width', hh / 5 + 'px');
		$('#_line2').css('width', hh / 5 + 'px');
		var padding = 2;
		var picWidth = Math.floor((winWidth - padding * 3) / 4);
		var html = '';
		for (var i = 1; i <= tol; i++) {
			var p = padding;
			var imgSrc = './img/' + i + '.jpg';
			if (i % 4 == 1) {
				p = 0;
			}
			html += '<li data-id="' + i + '" class="canvas-img" style="width:' + picWidth + 'px;height:' + picWidth + 'px;padding-top:' + padding + 'px;padding-left:' + p + 'px;"><canvas id="cvs_' + i + '"></canvas></li>';

			var imgObj = new Image();
			imgObj.index = i;
			imgObj.onload = function () {
				cvs = $('#cvs_' + this.index)[0].getContext('2d');
				cvs.width = this.width;
				cvs.height = this.height;
				cvs.drawImage(this, 0, 0);
			}
			imgObj.src = imgSrc;
		}
		$('#count').html(html);

	}
	init();
	var imgobj = [];
	for (var i = 0; i < tol; i++) {
		var x = i + 1;
		imgobj[i] = new Image();
		imgobj[i].src = './img/' + x + '.large.jpg'
	}
	//查看大图
	var largeimg = $('#large_img');
	var domlargeimg = document.getElementById('large_img');
	var loadimg = function (id, callback) {
		$('#large_count').css({
			width: win.width(),
			height: win.height(),
		});
		var imgsrc = './img/' + id + '.large.jpg';
		//大图的Image对象
		// var imgobj = new Image();
		// imgobj.src = imgsrc;
		var i = id - 1;
		var imgobj = new Image();
		imgobj.src = imgsrc;
		imgobj.onload = function () {
			var w = this.width;
			var h = this.height;
			var winw = win.width();
			var winh = win.height();
			var realw = winh * w / h;
			var paddingleft = parseInt((winw - realw) / 2);
			var realh = winw * h / w;
			var paddingtop = parseInt((winh - realh) / 2);
			largeimg.css('height', 'auto').css('width', 'auto');
			largeimg.css('padding-top', '0px').css('padding-left', '0px');
			if (h / w > 1.2) {
				largeimg.attr('src', imgsrc).css('height', winh).css('padding-left', paddingleft);
			} else {
				largeimg.attr('src', imgsrc).css('width', winw).css('padding-top', paddingtop);
			}
			callback && callback();
		}

	}
	var cid;
	$('#count').delegate('li', 'tap', function () {
		var _id = cid = $(this).attr('data-id');
		// 获取大图
		loadimg(_id);
		// 大图入场动画
		(function () {
			domlargeimg.addEventListener('webkitAnimationEnd', function () {
				$('#large_img').removeClass('animated slideInDown');
				domlargeimg.removeEventListener('webkitAnimationEnd', null);
			}, false);
			largeimg.addClass('animated slideInDown');
		})();
		$('#large_count').css({
			top: '0',
			opacity: '1'
		});
	});
	//大图交互
	$('#close').tap(function () {
		$('#large_count').css({
			top: -win.height(),
			opacity: '0'
		});
	});
	$('#large_count').swipeUp(function () {
		$('#large_count').css({
			top: -win.height(),
			opacity: '0'
		});
	});

	$('#large_count').swipeLeft(function () {
		cid++;
		if (cid > tol) {
			cid = tol;
		}
		loadimg(cid, function () {
			domlargeimg.addEventListener('webkitAnimationEnd', function () {
				$('#large_img').removeClass('animated fadeInRight');
				domlargeimg.removeEventListener('webkitAnimationEnd', null);
			}, false);
			largeimg.addClass('animated fadeInRight');
		});

	});

	$('#large_count').swipeRight(function () {
		cid--;
		if (cid < 1) {
			cid = 1;
		} else {
			loadimg(cid, function () {
				domlargeimg.addEventListener('webkitAnimationEnd', function () {
					largeimg.removeClass('animated fadeInLeft');
					domlargeimg.removeEventListener('webkitAnimationEnd', null);
				}, false);
				largeimg.addClass('animated fadeInLeft');
			});
		}
	});
})();