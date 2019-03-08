var scroll_top = 0;
$(function(){
//拖拽游戏特效
function Pointer(x,y){ //创建坐标点对象
	this.x = x;
	this.y = y;

}
function Position(left,top){//创建位置对象
	this.left = left;
	this.top = top;

}
$(".moon ul li .item").each(function(i){
	//初始化,把浮动布局改为定位布局
	this.init = function(){
		this.box = $(this).parent();//用box存储每个item父元素li
		$(this).attr("index",i).css({
			"position" : "absolute",
			"left" : this.box.position().left,//获取父元素偏移值
			// "top" : (this.box.offset().top - 180)
			"top" : this.box.position().top

		}).appendTo(".moon");//添加自定义序列号
		this.drag();//调用拖拽功能
	}
	//实现拖拽功能
	this.drag = function(){
		var oldPointer = new Pointer();
		var oldPosition = new Position();
		var currentitem =null;
		var isDrag = false;//判断是否被拖拽
		$(this).mousedown(function(ev){
			ev.preventDefault();//阻止默认事件
			currentitem = this;
			oldPointer.x = ev.pageX;//获取点击时鼠标位置坐标
			oldPointer.y =ev.pageY;
			oldPosition.left = $(this).position().left;//被移动块初始位置
			oldPosition.top = ($(this).position().top);
			isDrag = true;
			$(document).mousemove(function(ev){//在文档移动时候(绑定事件)
               var currentPointer = new Pointer(ev.pageX,ev.pageY);
               //改变被拖拽元素位置，获取移动时候鼠标位置

               if(!isDrag){// 如果是false，不移动
               	return false;//下面代码不执行
               }
               $(currentitem).css({
               	   "opacity":0.5,
               	   "z-index":2
               })
               var _leftm = currentPointer.x-oldPointer.x+oldPosition.left;
               var _topm = currentPointer.y - oldPointer.y+oldPosition.top + scroll_top;
               $(currentitem).css({
               	   "left" : _leftm,
               	   "top" : (_topm - 0)

               })
               //检测碰撞
              currentitem.pointer = currentPointer;
               currentitem.collisionCheck();//调用下面碰撞检测函数
            $(document).mouseup(function(ev){//在文档移动时候(解绑事件)
              if(!isDrag){// 如果是false，不移动
               	return false;//下面代码不执行
                }
                 isDrag = false;
                 //移动完成后把透明度和层级改回去
                 currentitem.move(function(){
                 	$(this).css({   //对象发生变化？？？？
                 		"opacity":1,
               	        "z-index":0
                 	});

                 });//调用移动功能，回调函数
               })

			})
		})//鼠标按下

	};
	//碰撞检测功能
	this.collisionCheck = function(){
		var currentitem =this;
		var direction = null;//交换方向
		$(this).siblings(".item").each(function(){//兄弟元素
			if(currentitem.pointer.x >this.box.offset().left&&
				currentitem.pointer.y>this.box.offset().top &&
				(currentitem.pointer.x <this.box.offset().left+this.box.width())&&
				(currentitem.pointer.y <this.box.offset().top+this.box.height())){
				//console.log("碰撞成功");
			    if(currentitem.box.offset().top <this.box.offset().top){
			    	direction = "down";
			    }else if(currentitem.box.offset().top >this.box.offset().top){
			    	direction = "up";
			    }else{
			    	direction = "normal";
			    }
			    //执行交换功能
			    this.swap(currentitem,direction);

			}
		})
	};
	//交换位置
	this.swap =function(currentitem,direction){
		var directions={
			normal : function(){
				var saveBox = this.box;//保存当前父元素
				this.box =currentitem.box;
				currentitem.box = saveBox;
				this.move();//this指代碰撞成功的兄弟元素
				$(this).attr("index",this.box.index());
				$(currentitem).attr("index",currentitem.box.index())

			},
			down :function(){
				var box = this.box;
				var node = this;//当前碰撞成功的兄弟元素
				var startindex = currentitem.box.index();//拖拽的索引
				var endindex =node.box.index();
				for(var i =endindex;i>startindex;i--){
					var prevNode = $(".moon .item[index="+(i-1)+"]")[0];
					node.box = prevNode.box;
					$(node).attr("index",node.box.index());
					node.move();
					node = prevNode;
				}
				currentitem.box = box;//当前交换的索引也改变
				$(currentitem).attr("index",box.index());

			},
			up : function(){
				var box = this.box;
				var node = this;//当前碰撞成功的兄弟元素
				var startindex = node.box.index();//拖拽的索引
				var endindex =currentitem.box.index();
				for(var i =startindex;i<endindex;i++){
					var nextNode = $(".moon .item[index="+(i+1)+"]")[0];
					node.box = nextNode.box;
					$(node).attr("index",node.box.index());
					node.move();
					node = nextNode;
				}
				currentitem.box = box;//当前交换的索引也改变
				$(currentitem).attr("index",box.index());

			}
		}
		directions[direction].call(this);
	};
	//移动位置
	this.move = function(callback){//移动块回到父元素li位置
		$(this).animate({
			left:(this.box.position().left),
		    // top:(this.box.offset().top - 98 - 20)
		    top:(this.box.position().top + scroll_top)
		},500,function(){
			callback&&callback.call(this);//callback存在调用callback函数
            //把this作用域传递过去
		});
	}
    this.init();
});
});


$('.moon').scroll(function(){
	scroll_top = $(this).scrollTop();
});
