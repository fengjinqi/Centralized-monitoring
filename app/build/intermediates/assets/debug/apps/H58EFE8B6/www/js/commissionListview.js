
mui.init()
var vm=new Vue({
    el:"#root",
    data:{
        guid:'',
        dwmc:'',
        author:'xcjszclc',
        items:'',
        dw:[],
        field:'',
        activeFixed:{
            position:'fixed',
            paddingTop: '20px',
            background: '#fff',
            zIndex:99
        },
        activeMargin:{
            marginTop:'128px'
        }
    }
})
mui.plusReady(function(){
    var showUserPickerButton = document.getElementById('danwei');
    showUserPickerButton.addEventListener('tap', function(event) {
        var evt=event ||window.event
        evt.stopPropagation()
        document.getElementById('bumen').value=""
        document.getElementById('jianchar').value=""
        var userPicker = new mui.PopPicker();
        mui.ajax("http://127.0.0.1:10261/itsm/rest/api/v2/acm/user/org",{
            dataType:'json',
            type:'get',
            success:function(res){
                var ni=[]
                for(var n in res.data){
                    ni.push({
                        text:res.data[n].name,
                        id:res.data[n].id
                    })
                }
                userPicker.setData(ni);
                userPicker.show(function(items) {
                    showUserPickerButton.value = items[0].text;
                    document.getElementById('danwei').setAttribute('data',items[0].id)
                    //返回 false 可以阻止选择框的关闭
                    //return false;
                    userPicker.dispose()
                });
            },
            error:function(xhr,type,errorThrown){
                plus.nativeUI.closeWaiting();
                alert('错误'+xhr.status+type+errorThrown)
            }
        })
    }, false);
    var bumen = document.getElementById('bumen');
    var danwei = document.getElementById('danwei');
    bumen.addEventListener('tap', function(event) {
    var evt=event ||window.event
    evt.stopPropagation()
    document.getElementById('jianchar').value=""
        var user = new mui.PopPicker();
        if(danwei.getAttribute('data')==null){
                return false;
        }else{
             mui.ajax("http://127.0.0.1:10261/itsm/rest/api/v2/acm/user/dept?orgId="+danwei.getAttribute('data'),{
                dataType:'json',
                type:'get',
                success:function(res){
                    var ni=[]
                    for(var n in res.data){
                        ni.push({
                            text:res.data[n].name,
                            id:res.data[n].id
                        })
                    }
                    user.setData(ni);
                },
                error:function(xhr,type,errorThrown){
                    plus.nativeUI.closeWaiting();
                    alert('错误'+xhr.status+type+errorThrown)
                }
            })
             user.show(function(items) {
                    bumen.value = items[0].text;
                    document.getElementById('bumen').setAttribute('data',items[0].id)
                    //返回 false 可以阻止选择框的关闭
                    //return false;
                    user.dispose()
                });
        }
    }, false);
    var jianchar = document.getElementById('jianchar');
    jianchar.addEventListener('tap', function(event) {
    var evt=event ||window.event
        evt.stopPropagation()
        var user = new mui.PopPicker();
        if(bumen.getAttribute('data')==null){
                return false;
        }else{
            mui.ajax("http://127.0.0.1:10261/itsm/rest/api/v2/acm/user/?deptId="+bumen.getAttribute('data'),{
                dataType:'json',
                type:'get',
                success:function(res){
                    var ni=[]
                    for(var n in res.data){
                        ni.push({
                            text:res.data[n].name,
                            id:res.data[n].id
                        })
                    }
                    user.setData(ni);
                },
                error:function(xhr,type,errorThrown){
                    plus.nativeUI.closeWaiting();
                    alert('错误'+xhr.status+type+errorThrown)
                }
            })
            user.show(function(items) {
                jianchar.value = items[0].text;
                document.getElementById('jianchar').setAttribute('data',items[0].id)
                //返回 false 可以阻止选择框的关闭
                //return false;
                user.dispose()
            });
        }
    }, false);

var sear=document.getElementById('sear')
 sear.addEventListener('tap', function(event) {
    var evt=event ||window.event
        evt.stopPropagation()
        var name=jianchar.getAttribute('data')||"";
        plus.nativeUI.showWaiting( '正在加载' )
        mui.ajax("http://127.0.0.1:10261/itsm/rest/api/v2/itsm/tickets/query/onhand?userId=admin&moduleId="+vm.author+"&creatorId="+name+"&startTime="+document.getElementById('startTime').value+":00&endTime="+document.getElementById('endTime').value+":00",{
                dataType:'json',
                type:'get',
                success:function(res){
                    vm.items=res.ticket;

                              setTimeout(function(){
                                  plus.nativeUI.closeWaiting()
                              },500)
                },
                error:function(xhr,type,errorThrown){
                    plus.nativeUI.closeWaiting();
                    alert('错误'+xhr.status+type+errorThrown)
                }
            })

    }, false);


    window.addEventListener('refresh', function(e) {
//在父页面中添加监听事件，刷新页面
        vm.items="";
        plus.nativeUI.showWaiting( '正在加载' )

        mui.ajax("http://127.0.0.1:10261/itsm/rest/api/v2/itsm/tickets/query/onhand?userId=admin&moduleId="+vm.author,{
            dataType:'json',
            type:'get',
            success:function(res){
                vm.items=res.ticket;
                setTimeout(function(){
                    plus.nativeUI.closeWaiting()
                },500)
            },
            error:function(xhr,type,errorThrown){
                plus.nativeUI.closeWaiting();
                alert('错误'+xhr.status+type+errorThrown)
            }
        })



    },false);





    window.addEventListener('get_detail',function(event){
        vm.guid=event.detail.guid;
        var author=event.detail.author;
        vm.author=author;
        vm.field=event.detail.field
        plus.nativeUI.showWaiting( '正在加载' )
        mui.ajax("http://127.0.0.1:10261/itsm/rest/api/v2/itsm/tickets/query/onhand?userId=admin&moduleId="+vm.author,{
            dataType:'json',
            type:'get',
            success:function(res){
                vm.items=res.ticket;
            },
            error:function(xhr,type,errorThrown){
                plus.nativeUI.closeWaiting();
                alert('错误'+xhr.status+type+errorThrown)
            },
             complete :function(){
                  setTimeout(function(){
                      plus.nativeUI.closeWaiting()
                  },500)
              }
        })
    })

    webview_detail = mui.preload({
        url: 'commissioneditor.html',
        id: 'commissioneditor',
    });
    mui(".top").on("tap",".mui-table-view .append",function(e){
        mui.fire(webview_detail, 'get_detail', {
            guid: vm.guid,
            title:this.getAttribute('data-type'),
            author:vm.author,
            id:this.getAttribute('data-id'),
            field:vm.field
        });
        mui.openWindowWithTitle({
        url:'commissioneditor.html',
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
         plus.nativeUI.showWaiting( '正在加载' )
     /*setTimeout(function(){
        plus.nativeUI.closeWaiting()
    },500)*/
    })


    mui.back = function() {
        plus.webview.currentWebview().hide("auto", 300);
        var self = plus.webview.currentWebview();
        self.addEventListener("hide",function (e) {
            vm.guid='',
            vm.dwmc='',
            vm.author='',
            vm.items='',
            document.getElementById('bumen').value="",
            document.getElementById('danwei').value="",
            document.getElementById('jianchar').value="",
            document.getElementById('startTime').value="",
            document.getElementById('endTime').value=""
        },false);
    }
})
