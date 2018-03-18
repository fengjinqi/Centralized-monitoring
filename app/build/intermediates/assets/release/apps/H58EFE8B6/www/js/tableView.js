
/*	mui.init({
beforeback: function(){
    //获得列表界面的webview
    var list = plus.webview.getWebviewById('commissionListview');
    //触发列表界面的自定义事件（refresh）,从而进行数据刷新
    mui.fire(list,'get_detail');
    //返回true，继续页面关闭逻辑
    return true;
}
});*/
    var vm=new Vue({
        el:"#root",
        data:{
            guid:'',
            validate:'validate',
            author:'TestPro',
            validaTetable:'validaTetable',
            items:[],
            task:[],
            id:'',
            taskid:'',
            select:'',

        },
        methods:{
            getTask: function(item){
                var obj={};
                  var check;
                obj.processId=this.id,
                obj.transitionId=item.id,
                obj.taskId=String(this.taskid),
                obj.creator='admin',
                obj.bizObj={};
                var input=document.querySelectorAll('#form1 .text ')
                for(var i=0;i<input.length;i++){
                    obj.bizObj[input[i].name]=input[i].value
                }
                var checked=document.querySelectorAll('#form1 .checked ')

                for(var i=0;i<checked.length;i++){
                    if(checked[i].checked){
                          if(obj.bizObj.hasOwnProperty(checked[i].name)){
                            obj.bizObj[checked[i].name] += ',' + checked[i].value;
                          }else{
                            obj.bizObj[checked[i].name] = checked[i].value;
                          }
                    }
                }

                var select=document.querySelectorAll('#form1 select ')
                for(var i=0;i<select.length;i++){
                    select[i].disabled=false
                     obj.bizObj[select[i].name]=select[i].value
                }
                var textare=document.querySelectorAll('#form1 textarea ')
                for(var i=0;i<textare.length;i++){
                     obj.bizObj[textare[i].name]=textare[i].value
                }
                        alert(JSON.stringify(obj))
               mui("#form1 .validaTetable").each(function() {
                        //若当前input为空，则alert提醒
                        if(!this.value || this.value.trim() == "") {
                            var label = this.previousElementSibling;
                            mui.alert("必填项不允许为空");
                            check = false;
                            return false;
                        }else{
                            check=true
                        }
                        }); //校验通过，继续执行业务逻辑
                        if(check){
                            mui.alert('验证通过!')
                             mui.ajax('http://127.0.0.1:10261/itsm/rest/api/v2/itsm/tickets/progressing',{
                                                data:obj,
                                                dataType:'json',
                                                type:'post',
                                                headers:{'Content-Type':'application/json'},
                                                success:function(data){
                                                    alert(JSON.stringify(data))
                                                    mui.back()
                                                },
                                                error:function(xhr,type,errorThrown){
                                                    //异常处理；
                                                    alert(2332);
                                                }
                                            })
                        }
            }
        }
    })
    mui.plusReady(function(){

        window.addEventListener('get_detail',function(event){
            vm.guid=event.detail.guid;
            vm.id=event.detail.id
            vm.author=event.detail.author;
            plus.nativeUI.showWaiting( '正在加载' )
            mui.ajax("http://127.0.0.1:10261/itsm/rest/api/v2/itsm/tickets/queryByForm?userId=admin&processId="+vm.id,{
                dataType:'json',
                type:'get',
                success:function(res){/*

                var res={"result":{"success":true},"ticket":{"id":"57b5dd59-c293-4d03-9900-ee817453eceb","data":[{"id":"47be51f3-63e6-492b-8f3f-9fcfeec56219","row":1,"col":1,"title":"测试计划","type":"group","item":[{"id":"517f8f18-c022-42b0-a4fc-7a1006ae7c11","row":1,"col":1,"type":"group","item":[{"id":"ac157a7c-44af-4652-9718-a67d2e996cc2","row":1,"col":1,"title":"测试主题","bizClass":"Test","bizField":"title","displayType":"required","readonly":"false","type":"element","bzType":"text","value":"测试一波"}]},{"id":"66ac1acb-2713-45d1-8eab-9d63dbd4709b","row":2,"col":1,"type":"group","item":[{"id":"1a9156e3-3c6b-4c03-bb07-79eb2580393b","row":1,"col":1,"title":"联系人","bizClass":"Test","bizField":"txr","displayType":"required","readonly":"false","type":"element","bzType":"userSelect","value":{"id":"admin","name":"顶级管理员","dept":"应急通信保障中心","mobile":"13810855414"}}]},{"id":"617785c4-be58-492f-a29f-d8ad43d9000b","row":3,"col":1,"type":"group","item":[{"id":"53e4a7bf-a118-4640-a10b-dfb6b7f62695","row":1,"col":1,"title":"测试开始时间","bizClass":"Test","bizField":"Time_Start","displayType":"required","readonly":"false","type":"element","bzType":"date","value":"2018-02-01 16:32","dataType":"Date","dataFormat":"yyyy-MM-dd HH:mm"}]},{"id":"bc190418-c843-4557-8bf6-3c32860c6006","row":4,"col":1,"type":"group","item":[{"id":"ae8b742a-7bac-4c71-ae9d-507842cdb22d","row":1,"col":1,"title":"测试车辆","bizClass":"Test","bizField":"cscl","displayType":"required","readonly":"false","type":"element","bzType":"textarea","value":"测试一波测试一波测试一波"}]},{"id":"c94b9915-073d-4200-9ad8-9e5c915cc279","row":5,"col":1,"type":"group","item":[{"id":"6a07caf3-a609-4d24-a77c-77812945daab","row":1,"col":1,"title":"测试内容","bizClass":"Test","bizField":"csnr","displayType":"required","readonly":"false","type":"element","bzType":"textarea","value":"测试一波测试一波测试一波测试一波测试一波测试一波"}]},{"id":"1bbd25ae-bfbd-4327-a14b-93434953bdd2","row":6,"col":1,"type":"group","item":[{"id":"6f11fed6-a8f0-4d60-b281-6db1bb6bd349","row":1,"col":1,"title":"附件","bizClass":"Test","bizField":"fj","displayType":"opitonal","readonly":"false","type":"element","bzType":"attachFile","value":[]}]}]}]},"task":[{"id":43132,"name":"联调测试申请","action":[{"id":"Link_3","name":"发布计划","performer":[{"id":"56a1d03d-3053-436f-8927-d88bbb7a752f","name":"乔鹏","account":"qiaop","orgId":"109ea40e-651c-4ac7-b01b-cd31bb3bc2b7","deptId":"1232e39d-60f7-4266-bddb-75d37016a49b"},{"id":"a8e19bb5-aea8-483c-942a-30ce87332e00","name":"吴雷","account":"wul","orgId":"16fd884c-11ca-4982-9f91-9f3ed778bcd9","deptId":"bb7f555c-c2d6-4c53-9fac-6a98aa596ab6"},{"id":"276a270c-7b0d-49c4-b19a-ce65601c057e","name":"孙建","account":"sunj","orgId":"109ea40e-651c-4ac7-b01b-cd31bb3bc2b7","deptId":"1232e39d-60f7-4266-bddb-75d37016a49b"},{"id":"16ec12b7-81b1-4dde-b230-8971134978f8","name":"肖健","account":"xiaoj","orgId":"default","deptId":"d755e3a9-f2e3-4ffe-adb2-48bfd3cbab6f"},{"id":"1e8e8c33-001c-4fcb-a5dc-d9aad462e4b9","name":"董浩","account":"donghao","orgId":"16fd884c-11ca-4982-9f91-9f3ed778bcd9","deptId":"bb7f555c-c2d6-4c53-9fac-6a98aa596ab6"},{"id":"2c7afcd0-f0ca-433b-94d8-abcd0b6a6ebc","name":"陈小兵","account":"chenxb","orgId":"default","deptId":"d755e3a9-f2e3-4ffe-adb2-48bfd3cbab6f"},{"id":"admin","name":"顶级管理员","account":"admin","orgId":"default","deptId":"d755e3a9-f2e3-4ffe-adb2-48bfd3cbab6f"}]},{"id":"Link_1","name":"保存"}]}]}
*/
                var ob=[]
                var n=res.ticket.data
                for(var obj in n){
                    if(n[obj].hasOwnProperty('item')&& Array.isArray(n[obj].item)){
                        ob.push(Recursion(n[obj]))
                    }
                }
                function Recursion(item){
                    var m = [];
                    for(var i in item.item){
                        if(item.item[i].hasOwnProperty('item') && Array.isArray(item.item[i].item)){
                            m.push(Recursion(item.item[i]))
                        }else{
                            if(item.item[i].title!==undefined){
                                if(item.item[i].value===undefined){
                                    item.item[i].value=""
                                }
                                m.push({
                                id: item.item[i].id,
                                title: item.item[i].title,
                                value: item.item[i].value,
                                bizClass:item.item[i].bizClass,
                                bizField:item.item[i].bizField,
                                bzType:item.item[i].bzType,
                                displayType:item.item[i].displayType,
                                defaultValue:item.item[i].defaultValue
                            })
                            }
                        }
                    }
                    return m;
                }
                var t = [];
               function tran(n){
                    for(var i in n){
                        if(Array.isArray(n[i])){
                            tran(n[i])
                        }else{
                            t.push(n[i])
                        }
                    }
               }
            tran(ob)
            String.prototype.endWith=function(endStr){
                  var d=this.length-endStr.length;
                  return (d>=0&&this.lastIndexOf(endStr)==d)
                }
            function GetChinese(strValue,sValue) {
            	console.log("=="+sValue+"==");
                if(strValue!= null && strValue!= ""){
                    //var reg = /[\u4e00-\u9fa5]/g;
            		var return_strs = new Array();
            		var strs = new Array();
            		strs = strValue.split('$?$');
            		for(var i = 0; i < strs.length; i ++){
            			var st = new Array();
            			st = strs[i].split('$^$');
            			var re_str ;
            			console.log("=="+st[0]+"==");
            			if(st[0].endWith(":default")){
            				if(contains(sValue, st[0].trim().substring(0,(st[0].length - 8)))){
            					re_str = '{"value" : "' + st[0].substring(0,(st[0].length - 8)) + '","name" : "' + st[1] + '","default" : true,"selected" : true}';
            				}else{
            					re_str = '{"value" : "' + st[0].substring(0,(st[0].length - 8)) + '","name" : "' + st[1] + '","default" : true,"selected" : false}';
            				}
            			}else{
            				if(contains(sValue, st[0].trim())){
            					re_str = '{"value" : "' + st[0] + '","name" : "' + st[1] + '","default" : false,"selected" : true}';
            				}else{
            					re_str = '{"value" : "' + st[0] + '","name" : "' + st[1] + '","default" : false,"selected" : false}';
            				}

            			}
            			re_str = eval('(' + re_str + ')');
            			//console.log(re_str);
            			return_strs.push(re_str);
            		}
            		//console.log(strs);
                    return return_strs;
                }
                else
                    return "";
            }

            for(var n in t){

            	if(t[n].value != undefined && t[n].value != "" && t[n].value != null){
            		if(typeof(t[n].value) == 'string'){
            			if((t[n].value).indexOf('$?$') >= 0){
            				var strs = new Array();
            				strs = (t[n].value).split('$?$');
            				var return_strs = new Array();
            				for(var i = 1; i < strs.length; i++){
            					return_strs.push(strs[i].trim());
            				}
            				t[n].value = return_strs;
            			}
            			if((t[n].value).indexOf(',') >= 0){
            				var strs = new Array();
            				strs = (t[n].value).split(',');
            				var return_strs = new Array();
            				for(var i = 0; i < strs.length; i++){
            					return_strs.push(strs[i].trim());
            				}
            				t[n].value = return_strs;
            			}
            		}
            	}

            	if(t[n].defaultValue!=undefined){
            		t[n].defaultValue = GetChinese(t[n].defaultValue,t[n].value);
            	}

            }
        function contains(arr, obj) {
          var i = arr.length;
          while (i--) {
            if (arr[i] === obj) {
              return true;
            }
          }
          return false;
        }
        vm.items=t
        console.log(vm.items)
alert(JSON.stringify(res))
        var task=res.task[0];
        for(var n in task.action){
            vm.task.push(task.action[n])
            if(task.action[n].hasOwnProperty("performer")&&Array.isArray(task.action[n].performer)&&task.action[n].name==='交班'){
                for(var j in task.action[n].performer){
                    console.log(task.action[n].performer[j])
                }
            }
        }
            vm.taskid=task.id
                       /*setTimeout(function(){
                            plus.nativeUI.closeWaiting()
                        },800)*/
                },
                error:function(xhr,type,errorThrown){
                    alert('错误'+xhr.status+type+errorThrown)
                }
                ,
                complete :function(){
                    setTimeout(function(){
                        plus.nativeUI.closeWaiting()
                    },1500)
                }
            })



        })
    })

        mui.back = function() {
       // var list = plus.webview.getWebviewById('commissionListview');
    //触发列表界面的自定义事件（refresh）,从而进行数据刷新
       // mui.fire(list,'refresh');
        plus.webview.currentWebview().hide("auto", 300);
        var self = plus.webview.currentWebview();
        //confirm()
        self.addEventListener("hide",function (e) {
            vm.guid='',
            vm.author='',
            vm.items=[],
            vm.task=[]
        },false);
    }
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
    function gettPerson(obj){

    }


function close(){
    document.getElementById('mui-backdrop').style.display='none';
    document.getElementById('bumen').value="";
    document.getElementById('jianchar').value="";
    document.getElementById('danwei').value="";
}
function show(){
    document.getElementById('mui-backdrop').style.display='block';
}
function confirm(){
    if(document.getElementById('jianchar').value==""){
        return false
    }else{
        document.querySelector('.obj').value=document.getElementById('jianchar').value
        document.getElementById('mui-backdrop').style.display='none';
        document.getElementById('bumen').value="";
        document.getElementById('jianchar').value="";
        document.getElementById('danwei').value="";
    }

}