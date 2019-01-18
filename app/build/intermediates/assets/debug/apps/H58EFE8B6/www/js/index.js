function getPastHalfYear() {
    // 先获取当前时间
    var curDate = (new Date()).getTime();
    // 将半年的时间单位换算成毫秒
    var halfYear = 365 / 2 * 24 * 3600 * 1000;
    var pastResult = curDate - halfYear;  // 半年前的时间（毫秒单位）

    // 日期函数，定义起点为半年前
    var pastDate = new Date(pastResult),
        pastYear = pastDate.getFullYear(),
        pastMonth = pastDate.getMonth() + 1,
        pastDay = pastDate.getDate(),
		pastH=pastDate.getHours(),
		pastM=pastDate.getMinutes(),
		pastS=pastDate.getSeconds();

    return pastYear + '-' + pastMonth + '-' + pastDay+' '+pastH+':'+pastM+':'+pastS;
}
mui.init({
 preloadPages:[
    {
      url:'main/warning/warning.html',
      id:'warning',
    },
    {
        url:'main/repository/repository.html',
        id:'repository',
    },
    {
        url:'main/car/carMap.html',
        id:'carMap'
    },
    {
        url:'main/car/carList.html',
        id:'carList'
    },
    {

        url:'main/work/work.html',
        id:'workIndex'
    },

  ]
});
var vm=new Vue({
    el:'#root',
    data:{
        items:[],
        number:'',
        yjbzgl:[],
        gzcllc1:[],
        TestPro:[],
        dqgsTest:[],
        jjbgl:[],
        sbxjjl1:[],
        xcjszclc:[],
        ddzdjc:[],
        zxgd:[],
        hah:[],
        agency:0,
        notice:'',
        repository:'',
        getLogin:'',
        getName:''
    },
    computed:{
        agenc:function(){
            return this.agency;
        },
        yjbzg:function(){
            return this.yjbzgl
        }
    }
})

mui.plusReady(function(){
var main = plus.android.runtimeMainActivity();
var Intent = plus.android.importClass('android.content.Intent');
var intent = new Intent();
intent.setClassName(main, "io.dcloud.MyService");
main.startService(intent);

getLogin()
    function getLogin(){
        var name=""
        var test=plus.android.newObject("io.dcloud.GetUserMessage");

        name=plus.android.invoke(test,'getLoginId')

        vm.getLogin=name.toLowerCase();
        vm.getName=plus.android.invoke(test,'getLoginName')

    }

    plus.navigator.setStatusBarBackground('#519be7');
    plus.nativeUI.showWaiting( '正在加载...请稍后' )

    function waring(){
        var data=new Date().getTime()
        var fuller=7*24*60*60*1000
        var time=data-new Date(fuller).getTime()
        mui.ajax("http://127.0.0.1:10332/itsm/rest/api/v2/alert/getAlert?comfirm=0&userId="+vm.getLogin+"&startTime="+getPastHalfYear(),{
        			dataType:'json',//服务器返回json格式数据
        			type:'get',//HTTP请求类型
        			success:function(data){
        				//获得服务器响应,
        				if(data.success==true){
                        vm.number=data.data.length

        				}
        			},
        			error:function(xhr,type,errorThrown){
        				plus.nativeUI.closeWaiting();
        				alert("与大厅连接中断,请退出APP重新进入大厅唤醒")
        			}/*,
        			complete :function(){
        				 setTimeout(function(){
        					 //plus.nativeUI.closeWaiting()
        				 },500)
        			 }*/
        		});
        mui.ajax('http://127.0.0.1:10332/itsm/rest/api/v2/itsm/tickets/bulletin?userId='+vm.getLogin,{
                     dataType:'json',//服务器返回json格式数据
                     type:'get',//HTTP请求类型
                     success:function(data){
                         //获得服务器响应,
                            var datas=new Date().getTime()
                             var fuller=7*24*60*60*1000
                             var time=datas-new Date(fuller).getTime()

                         if(data.success==true){
                         vm.items=[]
                         for(var i=0;i<data.data.length;i++){
                            var timget=new Date(data.data[i].releaseTime).getTime();
                            if(timget>time){

                                vm.items.push(data.data[i]);
                                vm.notice=data.data.length
                            }
                        }

                         }
                     },
                     error:function(xhr,type,errorThrown){
                         plus.nativeUI.closeWaiting();
                         //alert("网络错误")
                     }/*,
                     complete :function(){
                          setTimeout(function(){
                             // plus.nativeUI.closeWaiting()
                          },500)
                      }*/
                 });
        mui.ajax('http://127.0.0.1:10332/itsm/rest/api/v2/itsm/tickets/knowledge',{
        					dataType:'json',//服务器返回json格式数据
        					type:'get',//HTTP请求类型
        					success:function(data){
        					    var datas=new Date().getTime()
                                var fuller=7*24*60*60*1000
                                var time=datas-new Date(fuller).getTime()

        						if(data.success==true){
        						    	for(var i=0;i<data.data.length;i++){
                                            var timget=new Date(data.data[i].create_time).getTime();

                                            if(timget>time){
                                                //vm.items.push(data.data[i]);
                                                vm.hah.push(data.data[i]);
                                                vm.repository=data.data.length;
                                            }
                                        }
        						}
        					},
        					error:function(xhr,type,errorThrown){
        						plus.nativeUI.closeWaiting();
        						//alert("网络错误")
        					}/*,
                             complete :function(){
                                  setTimeout(function(){
                                     // plus.nativeUI.closeWaiting()
                                  },500)
                              }*/
        				});

    }
    waring();
       Agency()
    setInterval(function(){
         waring();
         vm.agency=0;
         Agency();

    },1000*60)
    function Agency(){
        mui.ajax("http://127.0.0.1:10332/itsm/rest/api/v2/itsm/tickets/query/onhand?userId="+vm.getLogin+"&moduleId=yjbzgl",{
            dataType:'json',
            type:'get',
            success:function(res){
            var items = res.ticket;
            var currentData = [];
            //vm.agency+=items.length
            vm.yjbzgl=[]
            if(items.length>0){
                for(var i in items){

                    if(new Date(items[i].createTime).getDate()==new Date().getDate()){
                        currentData.push(items[i]);

                       vm.$set(vm.$data,'yjbzgl',currentData);

                     }
                }
             }
            },
            error:function(xhr,type,errorThrown){
                plus.nativeUI.closeWaiting();
                //alert("网络错误")
            },
             /*complete :function(){
                  setTimeout(function(){
                      //plus.nativeUI.closeWaiting()
                  },500)
              }*/
        })
        mui.ajax("http://127.0.0.1:10332/itsm/rest/api/v2/itsm/tickets/query/onhand?userId="+vm.getLogin+"&moduleId=gzcllc1",{
            dataType:'json',
            type:'get',
            success:function(res){
             var items = res.ticket;
            var currentData = [];
            //vm.agency+=items.length
            vm.gzcllc1=[]
                if(items.length>0){
                    for(var i in items){
                        if(new Date(items[i].createTime).getDate()==new Date().getDate()){
                            currentData.push(items[i]);
                            vm.$set(vm.$data,'gzcllc1',currentData);
                         }
                    }
                }
            },
            error:function(xhr,type,errorThrown){
                plus.nativeUI.closeWaiting();
                //alert("网络错误")
            },
             complete :function(){
                  setTimeout(function(){
                      //plus.nativeUI.closeWaiting()
                  },500)
              }
        })
        mui.ajax("http://127.0.0.1:10332/itsm/rest/api/v2/itsm/tickets/query/onhand?userId="+vm.getLogin+"&moduleId=TestPro",{
            dataType:'json',
            type:'get',
            success:function(res){
              var items = res.ticket;
                var currentData = [];
                //vm.agency+=items.length
                vm.TestPro=[]
                if(items.length>0){
                    for(var i in items){
                        if(new Date(items[i].createTime).getDate()==new Date().getDate()){
                            currentData.push(items[i]);
                            vm.$set(vm.$data,'TestPro',currentData);
                         }
                    }
                }
            },
            error:function(xhr,type,errorThrown){
                plus.nativeUI.closeWaiting();
                //alert("网络错误")
            },
             complete :function(){
                  setTimeout(function(){
                     // plus.nativeUI.closeWaiting()
                  },500)
              }
        })
        mui.ajax("http://127.0.0.1:10332/itsm/rest/api/v2/itsm/tickets/query/onhand?userId="+vm.getLogin+"&moduleId=dqgsTest",{
            dataType:'json',
            type:'get',
            success:function(res){
              var items = res.ticket;
                var currentData = [];
                //vm.agency+=items.length
                 vm.dqgsTest=[]
                if(items.length>0){
                    for(var i in items){
                        if(new Date(items[i].createTime).getDate()==new Date().getDate()){
                            currentData.push(items[i]);
                            vm.$set(vm.$data,'dqgsTest',currentData);
                         }
                    }
                }
            },
            error:function(xhr,type,errorThrown){
                plus.nativeUI.closeWaiting();
                //alert("网络错误")
            },
             complete :function(){
                  setTimeout(function(){
                     // plus.nativeUI.closeWaiting()
                  },500)
              }
        })
        mui.ajax("http://127.0.0.1:10332/itsm/rest/api/v2/itsm/tickets/query/onhand?userId="+vm.getLogin+"&moduleId=jjbgl",{
            dataType:'json',
            type:'get',
            success:function(res){
            var items = res.ticket;
            var currentData = [];
            //vm.agency+=items.length
            vm.jjbgl=[]
                if(items.length>0){
                    for(var i in items){
                        if(new Date(items[i].createTime).getDate()==new Date().getDate()){
                            currentData.push(items[i]);
                            vm.$set(vm.$data,'jjbgl',currentData);
                         }
                    }
                }
            },
            error:function(xhr,type,errorThrown){
                plus.nativeUI.closeWaiting();
                //alert("网络错误")
            },
             complete :function(){
                  setTimeout(function(){
                     // plus.nativeUI.closeWaiting()
                  },500)
              }
        })
        mui.ajax("http://127.0.0.1:10332/itsm/rest/api/v2/itsm/tickets/query/onhand?userId="+vm.getLogin+"&moduleId=ddzdjc",{
            dataType:'json',
            type:'get',
            success:function(res){
                var items = res.ticket;
                var currentData = [];
               // vm.agency+=items.length
                vm.ddzdjc=[]
                if(items.length>0){
                    for(var i in items){
                        if(new Date(items[i].createTime).getDate()==new Date().getDate()){
                            currentData.push(items[i]);
                            vm.$set(vm.$data,'ddzdjc',currentData);
                         }
                    }
                }
            },
            error:function(xhr,type,errorThrown){
                plus.nativeUI.closeWaiting();
                //alert("网络错误")
            },
             complete :function(){
                  setTimeout(function(){
                     // plus.nativeUI.closeWaiting()
                  },500)
              }
        })
        mui.ajax("http://127.0.0.1:10332/itsm/rest/api/v2/itsm/tickets/query/onhand?userId="+vm.getLogin+"&moduleId=sbxjjl1",{
            dataType:'json',
            type:'get',
            success:function(res){
             var items = res.ticket;
                var currentData = [];
                //vm.agency+=items.length
                vm.sbxjjl1=[]
                if(items.length>0){
                    for(var i in items){
                        if(new Date(items[i].createTime).getDate()==new Date().getDate()){
                            currentData.push(items[i]);
                            vm.$set(vm.$data,'sbxjjl1',currentData);
                         }
                    }
                }
            },
            error:function(xhr,type,errorThrown){
                plus.nativeUI.closeWaiting();
                //alert("网络错误")
            },
             complete :function(){
                  setTimeout(function(){
                     // plus.nativeUI.closeWaiting()
                  },500)
              }
        })
        mui.ajax("http://127.0.0.1:10332/itsm/rest/api/v2/itsm/tickets/query/onhand?userId="+vm.getLogin+"&moduleId=zxgd",{
            dataType:'json',
            type:'get',
            success:function(res){
             var items = res.ticket;
                var currentData = [];
                //vm.agency+=items.length
                  vm.zxgd=[]
                if(items.length>0){
                    for(var i in items){
                        if(new Date(items[i].createTime).getDate()==new Date().getDate()){
                            currentData.push(items[i]);
                            vm.$set(vm.$data,'zxgd',currentData);
                         }
                    }
                }
            },
            error:function(xhr,type,errorThrown){
                plus.nativeUI.closeWaiting();
              /* alert("网络错误")*/
            },
             complete :function(){
                  setTimeout(function(){
                      //plus.nativeUI.closeWaiting()
                  },500)
              }
        })
        mui.ajax("http://127.0.0.1:10332/itsm/rest/api/v2/itsm/tickets/query/onhand?userId="+vm.getLogin+"&moduleId=xcjszclc",{
            dataType:'json',
            type:'get',
            success:function(res){
            var items = res.ticket;
                var currentData = [];
                //vm.agency+=items.length
                vm.xcjszclc=[]
                if(items.length>0){
                    for(var i in items){
                        if(new Date(items[i].createTime).getDate()==new Date().getDate()){
                            currentData.push(items[i]);
                            vm.$set(vm.$data,'xcjszclc',currentData);
                         }
                    }
                }
            },
            error:function(xhr,type,errorThrown){
                plus.nativeUI.closeWaiting();
               /* mui.alert("网络错误")*/
            },
             complete :function(){
                  setTimeout(function(){
                      //plus.nativeUI.closeWaiting()
                  },500)
              }
        })
    }

    var onhand  = mui.preload({
            url: 'main/work/workcommission/commissioneditor.html',
            id: 'commissioneditor',
        });
    mui('.article').on('tap','li',function(e){
         mui.fire(onhand, 'get_detail', {
                    guid: this.getAttribute('data-title'),
                    id:this.getAttribute('data-id'),
                    author:this.getAttribute('data-moduleId'),
                    field:this.getAttribute('field'),
                    getLogin:vm.getLogin
                });
                mui.openWindowWithTitle({
                url:'main/work/workcommission/commissioneditor.html',
                id:'commissioneditor',
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
            })
    })

     window.addEventListener('refresh', function(e) {
    //在父页面中添加监听事件，刷新页面
           vm.agency=0;
            //plus.nativeUI.showWaiting( '正在加载' )
             Agency()
    // plus.nativeUI.closeWaiting( '正在加载' )

        },false);

})
mui.plusReady(function(){

mui('.mui-table-view').on('tap', '.waring', function(e){
        openView('main/warning/warning.html','warning')
    })



mui('.mui-table-view').on('tap', '.carMap', function(e){
        mui.openWindow({
            url:'main/car/carMap.html',
            id:'carMap',
            createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
            show:{
              autoShow:true,//页面loaded事件发生后自动显示，默认为true
            },
            waiting:{
              autoShow:true,//自动显示等待框，默认为true
              title:'正在加载...',//等待对话框上显示的提示内容
            }
        })
        plus.nativeUI.showWaiting( '正在加载...请稍后' )
     setTimeout(function(){
        plus.nativeUI.closeWaiting()
    },500)
})

    mui('.mui-table-view').on('tap', '.caratrice', function(e){
        openView('main/car/map.html','caratrice')


    })
    mui('.mui-table-view').on('tap', '.workIndex', function(e){
            openView('main/work/work.html','workIndex')
    })
    webview_detail = mui.preload({
        url: 'main/repository/repository.html',
        id: 'repository',
    });

    mui('.mui-table-view').on('tap', '.repository', function(e){
            mui.fire(webview_detail, 'get_detail', {
            guid: this.innerText,
            title:'title',
            author:'author',
            time:'time',
            cover:'links',
            getLogin:vm.getLogin
        });
        mui.openWindowWithTitle({
        url:'main/repository/repository.html',
        id:'repository',
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
    })
     /*plus.nativeUI.showWaiting( '正在加载' )
     setTimeout(function(){
        plus.nativeUI.closeWaiting()
    },500)*/
    })

    var tice = mui.preload({
        url: 'main/notice/notice.html',
        id: 'notice',
    });
    mui('#root').on('tap', '.notice-time.fr', function(e){
            mui.fire(tice, 'get_detail', {
            guid: 'no',

        });
        mui.openWindowWithTitle({
        url:'main/notice/notice.html',
        id:'notice',
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
    })

    })

    var ti = mui.preload({
        url: 'main/notice/noticeDetail.html',
        id: 'noticeDetail',
    });
    mui('#root').on('tap', '.obj', function(e){

            mui.fire(ti, 'get_detail', {
            guid: this.getAttribute('data-id'),
            getLogin:vm.getLogin
        });
        mui.openWindowWithTitle({
        url:'main/notice/noticeDetail.html',
        id:'noticeDetail',
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
    })
     plus.nativeUI.showWaiting( '正在加载...' )
     setTimeout(function(){
        plus.nativeUI.closeWaiting()
    },500)
    })


    mui('.mui-table-view').on('tap', '.carList', function(e){
        openView('main/car/carList.html','carList')
    })

})
function openView(url,id){
    //打开详情页面
     mui.openWindowWithTitle({
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
    })
     plus.nativeUI.showWaiting( '正在加载' )
     setTimeout(function(){
        plus.nativeUI.closeWaiting()
    },500)

}

