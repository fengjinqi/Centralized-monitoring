
function ope(url,id){
	/*mui.openWindow({
	    url:url,
	    id:id,
	    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
    show:{
      autoShow:true,//页面loaded事件发生后自动显示，默认为true
      aniShow:'slide-in-right',//页面显示动画，默认为”slide-in-right“；
      //duration:animationTime,//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
      event:'titleUpdate',//页面显示时机，默认为titleUpdate事件时显示
      extras:{}//窗口动画是否使用图片加速
    },
    waiting:{
      autoShow:true,//自动显示等待框，默认为true
      title:'正在加载...',//等待对话框上显示的提示内容
	    }
	})*/
	mui.openWindowWithTitle({
	    url:url,
	    id:'id',
	    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
	    show:{
	      autoShow:true,//页面loaded事件发生后自动显示，默认为true
	      aniShow:'slide-in-right',//页面显示动画，默认为”slide-in-right“；
	      //duration:animationTime,//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
	      event:'titleUpdate',//页面显示时机，默认为titleUpdate事件时显示
	      extras:{}//窗口动画是否使用图片加速
	    },
	    /*waiting:{
	      autoShow:true,//自动显示等待框，默认为true
	      title:'正在加载...',//等待对话框上显示的提示内容
		    }*/
	})
	 plus.nativeUI.showWaiting( '正在加载' )
	 setTimeout(function(){
    	plus.nativeUI.closeWaiting()
    },500)
}

		
	

