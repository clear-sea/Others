function snow() {
            //  1、定义一片雪花模板
            var flake = document.createElement('div');
            // 雪花字符 ❄❉❅❆✻✼❇❈❊✥✺
            flake.innerHTML = '❆';
            flake.style.cssText = 'position:absolute;color:#fff;';

            //获取页面的高度 相当于雪花下落结束时Y轴的位置
            var documentHieght = window.innerHeight;
            //获取页面的宽度，利用这个数来算出，雪花开始时left的值
            var documentWidth = window.innerWidth;

            //定义生成一片雪花的毫秒数
            var millisec = 100;
            //2、设置第一个定时器，周期性定时器，每隔一段时间（millisec）生成一片雪花；
            setInterval(function() { //页面加载之后，定时器就开始工作
                //随机生成雪花下落 开始 时left的值，相当于开始时X轴的位置
                var startLeft = Math.random() * documentWidth;

                //随机生成雪花下落 结束 时left的值，相当于结束时X轴的位置
                var endLeft = Math.random() * documentWidth;

                //随机生成雪花大小
                var flakeSize = 5 + 20 * Math.random();

                //随机生成雪花下落持续时间
                var durationTime = 4000 + 7000 * Math.random();

                //随机生成雪花下落 开始 时的透明度
                var startOpacity = 0.7 + 0.3 * Math.random();

                //随机生成雪花下落 结束 时的透明度
                var endOpacity = 0.2 + 0.2 * Math.random();

                //克隆一个雪花模板
                var cloneFlake = flake.cloneNode(true);

                //第一次修改样式，定义克隆出来的雪花的样式
                cloneFlake.style.cssText += `
                        left: ${startLeft}px;
                        opacity: ${startOpacity};
                        font-size:${flakeSize}px;
                        top:-25px;
                            transition:${durationTime}ms;
                    `;

                //拼接到页面中
                document.body.appendChild(cloneFlake);

                //设置第二个定时器，一次性定时器，
                //当第一个定时器生成雪花，并在页面上渲染出来后，修改雪花的样式，让雪花动起来；
                setTimeout(function() {
                    //第二次修改样式
                    cloneFlake.style.cssText += `
                                left: ${endLeft}px;
                                top:${documentHieght}px;
                                opacity:${endOpacity};
                            `;

                    //4、设置第三个定时器，当雪花落下后，删除雪花。
                    setTimeout(function() {
                        cloneFlake.remove();
                    }, durationTime);
                }, 0);

            }, millisec);
        }
        snow();
MorphSVGPlugin.convertToPath('polygon');
var xmlns = "http://www.w3.org/2000/svg",
  xlinkns = "http://www.w3.org/1999/xlink",
select = function(s) {
    return document.querySelector(s);
  },
  selectAll = function(s) {
    return document.querySelectorAll(s);
  },
  pContainer = select('.pContainer'),
  mainSVG = select('.mainSVG'),
  star = select('#star'),
  sparkle = select('.sparkle'),
  tree = select('#tree'),
  showParticle = true,
  particleColorArray = ['#E8F6F8', '#ACE8F8', '#F6FBFE','#A2CBDC','#B74551', '#5DBA72', '#910B28', '#910B28', '#446D39'],
  particleTypeArray = ['#star','#circ','#cross','#heart'],
 // particleTypeArray = ['#star'],
  particlePool = [],
  particleCount = 0,
  numParticles = 201

// gsap动画库
gsap.set('svg', {
  visibility: 'visible'
})

gsap.set(sparkle, {
	transformOrigin:'50% 50%',
	y:-100
})

let getSVGPoints = (path) => {
	
	let arr = []
	var rawPath = MotionPathPlugin.getRawPath(path)[0];
	rawPath.forEach((el, value) => {
		let obj = {}
		obj.x = rawPath[value * 2]
		obj.y = rawPath[(value * 2) + 1]
		if(value % 2) {
			arr.push(obj)
		}
		//console.log(value)
	})
	
	return arr;
}
let treePath = getSVGPoints('.treePath')

var treeBottomPath = getSVGPoints('.treeBottomPath')

//console.log(starPath.length)
var mainTl = gsap.timeline({delay:0, repeat:0}), starTl;


//tl.seek(100).timeScale(1.82)

function flicker(p){
  
  //console.log("flivker")
  gsap.killTweensOf(p, {opacity:true});
  gsap.fromTo(p, {
    opacity:1
  }, {
		duration: 0.07,
    opacity:Math.random(),
    repeat:-1
  })
}

function createParticles() {
  
  //var step = numParticles/starPath.length;
  //console.log(starPath.length)
  var i = numParticles, p, particleTl, step = numParticles/treePath.length, pos;
  while (--i > -1) {
    
    p = select(particleTypeArray[i%particleTypeArray.length]).cloneNode(true);
    mainSVG.appendChild(p);
    p.setAttribute('fill', particleColorArray[i % particleColorArray.length]);
    p.setAttribute('class', "particle");   
    particlePool.push(p);
    //hide them initially
    gsap.set(p, {
                 x:-100, 
                 y:-100,
   transformOrigin:'50% 50%'
                 })
    
    

  }

}

var getScale = gsap.utils.random(0.5, 3, 0.001, true);  //  圣诞树开始绘画时小光点动画的特效（参数：最小值，最大值，延迟）

function playParticle(p){
  if(!showParticle){return};
  var p = particlePool[particleCount]
 gsap.set(p, {
	 x: gsap.getProperty('.pContainer', 'x'),
	 y: gsap.getProperty('.pContainer', 'y'),
	 scale:getScale()
    }
    );
var tl = gsap.timeline();
  tl.to(p, {
		duration: gsap.utils.random(0.61,6),
      physics2D: {
        velocity: gsap.utils.random(-23, 23),
        angle:gsap.utils.random(-180, 180),
        gravity:gsap.utils.random(-6, 50)
      },
      scale:0,
      rotation:gsap.utils.random(-123,360),
      ease: 'power1',
      onStart:flicker,
      onStartParams:[p],
      //repeat:-1,
      onRepeat: (p) => {
        gsap.set(p, {         
            scale:getScale()
        })
      },
      onRepeatParams: [p]

    });
  

  //
  //particlePool[particleCount].play();
  particleCount++;
  //mainTl.add(tl, i / 1.3)
  particleCount = (particleCount >=numParticles) ? 0 : particleCount
  
}
// 圣诞树开始绘画时小光点动画
function drawStar(){
  
  starTl = gsap.timeline({onUpdate:playParticle})
  starTl.to('.pContainer, .sparkle', {
		duration: 6,
		motionPath :{
			path: '.treePath',
      autoRotate: false
		},
    ease: 'linear'
  })  
  .to('.pContainer, .sparkle', {
		duration: 1,
    onStart:function(){showParticle = false},
    x:treeBottomPath[0].x,
    y:treeBottomPath[0].y
  })
  .to('.pContainer, .sparkle',  {
		duration: 2,
    onStart:function(){showParticle = true},
		motionPath :{
			path: '.treeBottomPath',
      autoRotate: false
		},
    ease: 'linear'    
  },'-=0')
// 圣诞树中间那条横线动画   .treeBottomMask  是绑定class='treeBottomMask'这个标签
.from('.treeBottomMask', {
		duration: 2,
  drawSVG:'0% 0%',
  stroke:'#FFF',
  ease:'linear'
},'-=2')  
  

  //gsap.staggerTo(particlePool, 2, {})
  
}


createParticles();
drawStar();
//ScrubGSAPTimeline(mainTl)

mainTl
// 圣诞树上半身轮廓动画
.from(['.treePathMask','.treePotMask'],{
	duration: 6,
  drawSVG:'0% 0%',
  stroke:'#FFF',
	stagger: {
		each: 6
	},
    duration: gsap.utils.wrap([6, 1,2]),
  ease:'linear'
})
//  圣诞树头上的星星动画
.from('.treeStar', {
	duration: 3,
  //skewY:270,
  scaleY:0,
  scaleX:0.15,
  transformOrigin:'50% 50%',
  ease: 'elastic(1,0.5)'
},'-=4')
// 当绘画圣诞树的小光点绘制完时，让小光点消失
 .to('.sparkle', {
	duration: 3,
    opacity:0,
    ease:"rough({strength: 2, points: 100, template: linear, taper: both, randomize: true, clamp: false})"
  },'-=0')
// 给圣诞树头上的星星加个白色特效
  .to('.treeStarOutline', {
	duration: 1,
    opacity:1,
    ease:"rough({strength: 2, points: 16, template: linear, taper: none, randomize: true, clamp: false})"
  },'+=1')
/* .to('.whole', {
  opacity: 0
}, '+=2') */

mainTl.add(starTl, 0)
gsap.globalTimeline.timeScale(1.5);    //  圣诞树开始绘画时小光点动画的绘画速率，越大越快

setTimeout( function(){
  var element = document.getElementById("header");
  element.innerHTML = "圣诞快乐!";

   
}, 7 * 1000 );//延迟5000毫米

setTimeout( function(){

   var element = document.getElementById("p2");
element.innerHTML = "酌一口美酒，心放宽;听一段音乐，心悠闲;赏一番雪景，心坦然;读一封短信，心温暖;传一传祝愿，心里甜。祝君快乐在圣诞，开心快乐永不变。";
  var element = document.getElementById("p1");
element.innerHTML = " <br />    Yours 随便";
     
   
}, 10 * 1000 );//延迟5000毫米



