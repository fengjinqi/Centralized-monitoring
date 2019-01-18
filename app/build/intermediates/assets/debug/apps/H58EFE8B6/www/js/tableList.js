
var vm=new Vue({
el:'#root',
data:{
activeFixed:{
    position:'fixed',
    paddingTop: '20px',
    background: '#519be7',
    zIndex:99
},
activeMargin:{
    marginTop:'70px'
},
author:'gzcllc1',
title:'',
type:'',
items:'',
getLogin:'',
total:''

}
})
function getTime(obj){
    var picker = new mui.DtPicker({
 "type": "datatime",
 beginDate: new Date(1990, 04, 25),//设置开始日期
endDate: new Date(2099, 04, 25),//设置结束日期
});
    picker.show(function(rs) {
// alert(rs.y.value+"-"+rs.m.value+"-"+rs.d.value+' '+rs.h.value+':'+rs.i.value)
/*
 * rs.value 拼合后的 value
 * rs.text 拼合后的 text
 * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
 * rs.m 月，用法同年
 * rs.d 日，用法同年
 * rs.h 时，用法同年
 * rs.i 分（minutes 的第二个字母），用法同年
 */
obj.value =rs.y.value+"-"+rs.m.value+"-"+rs.d.value+' '+rs.h.value+':'+rs.i.value+":00";
/*
 * 返回 false 可以阻止选择框的关闭
 * return false;
 */
/*
 * 释放组件资源，释放后将将不能再操作组件
 * 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
 * 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
 * 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
 */
picker.dispose();
});
}
mui.plusReady(function(){
    /*var showUserPickerButton = document.getElementById('danwei');
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

            if(danwei.getAttribute('data')==null||danwei.getAttribute('data')==''){
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
                         if(items[0].text==undefined){
                            bumen.value = ''
                            return false;
                        }else{
                            bumen.value = items[0].text;
                        }

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

            if(bumen.getAttribute('data')==null||bumen.getAttribute('data')==''){
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
                         if(items[0].text==undefined){
                                jianchar.value = ''

                            }else{
                            jianchar.value = items[0].text;
                            }
                        document.getElementById('jianchar').setAttribute('data',items[0].id)
                        //返回 false 可以阻止选择框的关闭
                        //return false;
                        user.dispose()
                    });

                }

                }, false);
*/








window.addEventListener('detail',function(event){

  vm.title= event.detail.guid;
  var author=event.detail.author;
  vm.author=author;
  vm.type=event.detail.title;
  vm.getLogin=event.detail.getLogin
  function windowHeight(){
  return (document.compatMode == "CSS1Compat")?
  document.documentElement.clientHeight:
  document.body.clientHeight;
 }
  //获取页面文档的总高度
  function documentHeight(){
  //现代浏览器（IE9+和其他浏览器）和IE8的document.body.scrollHeight和document.documentElement.scrollHeight都可以
  return Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);
 }
  //获取页面顶部被卷起来的高度
  function scrollTop(){
  return Math.max(
   //chrome
   document.body.scrollTop,
   //firefox/IE
   document.documentElement.scrollTop);
 }
  //参与
 // if(vm.type==='canyu'){
        plus.nativeUI.showWaiting( '正在加载' )
        mui.ajax("http://127.0.0.1:10332/itsm/rest/api/v2/itsm/tickets/query/part?userId="+vm.getLogin+"&moduleId="+vm.author,{
            dataType:'json',
            type:'get',
            success:function(res){
                if(res.success==false){
                    mui.alert('数据有误，请返回')
                     plus.nativeUI.closeWaiting()
                }
                vm.total=res.total
                vm.items=res.ticket;
                        //总条数
                var num=vm.total;
                //总共多少页；
                var pageSize=num/20
                //第几页
                pageStatr=1
                window.onscroll=function(){
                     if(scrollTop() + windowHeight() >= documentHeight()){
                    pageStatr++;
                    if(pageStatr<=Math.ceil(pageSize)){

                    waterallowData(pageStatr);
                    }else{
                         plus.nativeUI.toast( "没有更多数据了")
                    }

                  }
                }
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
        function waterallowData(pageStatr){

         plus.nativeUI.showWaiting( '正在加载...请稍后' )
         mui.ajax("http://127.0.0.1:10332/itsm/rest/api/v2/itsm/tickets/query/part?userId="+vm.getLogin+"&moduleId="+vm.author+"&pageNum="+pageStatr,{
        dataType:'json',//服务器返回json格式数据
        type:'get',//HTTP请求类型
        timeout:12000,
        success:function(data){

                for(var i=0;i<data.ticket.length;i++){
                vm.items.push(data.ticket[i]);

                }

        },
        error:function(xhr,type,errorThrown){
            plus.nativeUI.closeWaiting();

                mui.alert("与大厅连接中断,请退出APP重新进入大厅唤醒")
        },
         complete :function(){
              setTimeout(function(){
                  plus.nativeUI.closeWaiting()
              },500)
          }
    });
    }
        var sear=document.getElementById('sear')
        sear.addEventListener('tap', function(event) {
            var evt=event ||window.event
            evt.stopPropagation()
            plus.nativeUI.showWaiting( '正在加载' )
//var name=jianchar.getAttribute('data')||"";

            mui.ajax("http://127.0.0.1:10332/itsm/rest/api/v2/itsm/tickets/query/part?userId="+vm.getLogin+"&moduleId="+vm.author+"&startTime="+document.getElementById('startTime').value+"&endTime="+document.getElementById('endTime').value,{
                dataType:'json',
                type:'get',
                success:function(res){
                    if(res.success==false){
                        mui.alert('数据有误，请返回')
                         plus.nativeUI.closeWaiting()

                    }

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

}, false);
 /* }else if(vm.type==='chuangjian'){//创建
      plus.nativeUI.showWaiting( '正在加载' )
       mui.ajax("http://127.0.0.1:10332/itsm/rest/api/v2/itsm/tickets/query/create?userId="+vm.getLogin+"&moduleId="+vm.author,{
            dataType:'json',
            type:'get',
            success:function(res){
                if(res.success==false){
                    mui.alert('数据有误，请返回')
                     plus.nativeUI.closeWaiting()

                }
                vm.total=res.total
                vm.items=res.ticket;

                //总条数
                    var num=vm.total;
                    //总共多少页；
                    var pageSize=num/20
                    //第几页
                    pageStatr=1
        window.onscroll=function(){
                     if(scrollTop() + windowHeight() >= documentHeight()){
                    pageStatr++;
                    if(pageStatr<=Math.ceil(pageSize)){

                    waterallowDatatwo(pageStatr);
                    }else{
                         plus.nativeUI.toast( "没有更多数据了")
                    }

                  }
                }



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

       function waterallowDatatwo(pageStatr){

         plus.nativeUI.showWaiting( '正在加载...请稍后' )
         mui.ajax("http://127.0.0.1:10261/itsm/rest/api/v2/itsm/tickets/query/create?userId="+vm.getLogin+"&moduleId="+vm.author+"&pageNum="+pageStatr,{
        dataType:'json',//服务器返回json格式数据
        type:'get',//HTTP请求类型
        timeout:12000,
        success:function(data){

                for(var i=0;i<data.ticket.length;i++){

                vm.items.push(data.ticket[i]);

                }

        },
        error:function(xhr,type,errorThrown){
            plus.nativeUI.closeWaiting();

                mui.alert("与大厅连接中断,请退出APP重新进入大厅唤醒")
        },
         complete :function(){
              setTimeout(function(){
                  plus.nativeUI.closeWaiting()
              },500)
          }
    });
    }

       var sear=document.getElementById('sear')

        sear.addEventListener('tap', function(event) {
        alert()
            var evt=event ||window.event
                evt.stopPropagation()
            plus.nativeUI.showWaiting( '正在加载' )
            //var name=jianchar.getAttribute('data')||"";

        mui.ajax("http://127.0.0.1:10261/itsm/rest/api/v2/itsm/tickets/query/create?userId="+vm.getLogin+"&moduleId="+vm.author+"&startTime="+document.getElementById('startTime').value+"&endTime="+document.getElementById('endTime').value,{
            dataType:'json',
            type:'get',
            success:function(res){
            if(res.success==false){
                    mui.alert('数据有误，请返回')
                     plus.nativeUI.closeWaiting()

                }
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

}, false);
  }else if(vm.type=='chaxun'){
            plus.nativeUI.showWaiting( '正在加载' )
        mui.ajax("http://127.0.0.1:10261/itsm/rest/api/v2/itsm/tickets/query/onhand?userId="+vm.getLogin+"&moduleId="+vm.author,{
            dataType:'json',
            type:'get',
            success:function(res){
                vm.items=res.ticket;
                //setTimeout(function(){
                    plus.nativeUI.closeWaiting()
                //},500)
            },
            error:function(xhr,type,errorThrown){
                plus.nativeUI.closeWaiting();
                alert('错误'+xhr.status+type+errorThrown)
            }
        })
  }
*/


webview_detail = mui.preload({
url: 'tableView.html',
id: 'tableView',
});
mui(".top").on("tap",".mui-table-view .append",function(e){
mui.fire(webview_detail, 'get_detail', {
guid:vm.title,
author:vm.author,
id:this.getAttribute('data-id'),
getLogin:vm.getLogin
});
mui.openWindowWithTitle({
url:'tableView.html',
id:'tableView',
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
/* setTimeout(function(){
plus.nativeUI.closeWaiting()
},500)*/
})


  mui.back = function() {
    plus.webview.currentWebview().hide("auto", 300);
        //document.getElementById('bumen').setAttribute("data",'')
    //document.getElementById('danwei').setAttribute("data",'')
    //document.getElementById('jianchar').setAttribute("data",'')
    var self = plus.webview.currentWebview();
    self.addEventListener("hide",function (e) {
        vm.author='',
        vm.title='',
        vm.type='',
        vm.items='',
        //document.getElementById('bumen').value="",
    //document.getElementById('danwei').value="",
    //document.getElementById('jianchar').value="",

    document.getElementById('startTime').value="",
    document.getElementById('endTime').value=""
    },false);
}
})
})
