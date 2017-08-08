(function(doc){

    var $container = $(".container"),
        gNum = 5*5*5,   //生成的个数   5组 5排 5列
        randomEle = []; //随机li移动
    //生成初始页面
    init();
    function init(){
        var $btnList = $container.siblings(".btn-list");

        for(var i = 0; i < gNum; i++){
            randomEle[i] = i;
            var $li = $("<li></li>");
            $li.css({
                "transform" : "translate3d("+randomNum()[0]+"px,"+randomNum()[0]+"px,"+randomNum()[0]+"px) rotateX("+randomNum()[1]+"deg) rotateY("+randomNum()[1]+"deg) rotateZ("+randomNum()[1]+"deg)",
            });
            $li.html(
                "<p class='title'>Js</p>"+
                "<p class='author'>Print</p>"+
                "<p class='time'>2017.08.11</p>"
            );
            $container.append($li);
        }

        //取随机值
        function randomNum(){
            return [
                Math.floor((Math.random()-0.5)*5000),   //随机位移值
                Math.floor((Math.random()*361)), //取随机度数
            ];
        }

        //按钮出现
        setTimeout(function(){
            $btnList.removeClass("hide");
        });

        //按钮的点击事件
        $btnList.find("li").click(function(){
            switch($(this).index()){
                case 0:
                    Helix();
                    break;
                case 1:
                    Grid();
                    break;
                //拓展
                case 2:
                    Helix(Math.floor(Math.random()*20+50), 10);
                    break;

            };
        });

        //阻止冒泡
        $btnList.mousedown(function(e){
            return false;
        });

    }

    //拖拽,放大缩小
    (function(){
        //现在值 上一次值 差值
        var nowX, lastX, dValX = 0,
            nowY, lastY, dValY = 0;

        var roX = 0,
            roY = 0;

        var $contTz = -1500,
            //timer是放大缩小 timer2是拖拽
            timer , timer2;  //控制缓冲的定时器

        //容器的最大最小缩放值
        var scaleMin = -5000,
            scaleMax = 800;


        //拖拽事件
        $(document).mousedown(function(e){
            lastX = e.clientX;
            lastY = e.clientY;
            $(this).on("mousemove",function(e){
                nowX = e.clientX;
                nowY = e.clientY;

                //计算出差值
                dValX = nowX - lastX;
                dValY = nowY - lastY;

                roY += dValX*0.25;
                roX -= dValY*0.25;

                $container.css({
                    "transform" : "translateZ("+$contTz+"px) rotateX("+roX+"deg) rotateY("+roY+"deg)",
                });

                //储存本次值当上次值
                lastX = nowX;
                lastY = nowY;
            });
        }).mouseup(function(){
            //缓冲值
            clearInterval(timer2);
            timer2 = setInterval(function(){
                dValX *= 0.90;
                dValY *= 0.90;

                if(Math.abs(dValX)<=0.1 && Math.abs(dValY)<=0.1){
                    clearInterval(timer2);
                }

                roY += dValX;
                roX -= dValY;

                $container.css({
                    "transform" : "translateZ("+$contTz+"px) rotateX("+roX+"deg) rotateY("+roY+"deg)",
                });
            },13);


            $(this).off("mousemove");
        }).mousewheel(function(){
            var val = arguments[1]*50;
            $contTz = $contTz + val;

            $contTz = Math.max($contTz, scaleMin);
            $contTz = Math.min($contTz, scaleMax);

            $container.css({
                "transform" : "translateZ("+$contTz+"px) rotateX("+roX+"deg) rotateY("+roY+"deg)",
            });
            clearTimeout(timer);
            timer = setInterval(function(){
                $contTz += (val *= 0.9);

                $contTz = Math.max($contTz, scaleMin);
                $contTz = Math.min($contTz, scaleMax);

                $container.css({
                    "transform" : "translateZ("+$contTz+"px) rotateX("+roX+"deg) rotateY("+roY+"deg)",
                });

                //达到某个值时,停止定时器(或者不能再缩放或者放大时)
                if(Math.abs(val)<=0.05 || $contTz===scaleMin || $contTz===scaleMax){
                    clearTimeout(timer);
                }
            },13);
        });
    })();

    //形状
    setTimeout(function(){
        Grid();
    });

    function Grid(){
        var $li = $container.find("li");
        //li之间的间隔
        var iX = 400, iY = 400, iZ = 800;
        //每一组li的位置
        var firstX = -2 * iX,
            firstY = -2 * iY,
            firstZ = -2 * iZ;

        $li.each(function(i){
            //每个li位置要增加的倍数
            var aX = randomEle[i] % 25 % 5,
                aY = parseInt(randomEle[i] % 25 / 5),
                aZ = parseInt(randomEle[i] / 25);
            $(this).css({
                "transform" : "translate3d("+(firstX+aX*iX)+"px,"+(firstY+aY*iY)+"px,"+(firstZ+aZ*iZ)+"px)",
            });
            again(i);
        });
    }
    function Helix(rY, rX){
        var $li = $container.find('li'),
            rY = rY || 10, tY = rY || 10,
            middleIndex = Math.floor($li.length/2),
            firstty = -rY * middleIndex;
        $li.each(function(i){
            $(this).css({
                'transform' : 'rotateY('+(rY*randomEle[i])+'deg) translateY('+(firstty+randomEle[i]*tY)+'px) translateZ(1000px) ',
            });
            again(i);
        });
    }

    //重新排版 变量randomEle
    var againTimer;
    function again(i){
        clearTimeout(againTimer);
        if(i>=gNum-1){
            againTimer = setTimeout(function(){
                //重排
                randomEle.sort(function(){ return 0.5-Math.random(); });
            },300);
        }
    }
})(document);