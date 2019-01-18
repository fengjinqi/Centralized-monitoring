
//创建提交
/*window.addEventListener('get_detail',function(event){
*/
var clickListener,map
map = new AMap.Map('container', {
    resizeEnable: true,
    zoom:5,
    center: [116.397428, 39.90923]
});

//输入提示
    var autoOptions = {
        input: "tipinput"
    };
    var auto = new AMap.Autocomplete(autoOptions);
    var placeSearch = new AMap.PlaceSearch({
        map: map
    });  //构造地点查询类
    AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
    function select(e) {
        placeSearch.setCity(e.poi.adcode);
        placeSearch.search(e.poi.name);  //关键字查询查询
    }
var infoWindow;
getAjax()
function getAjax(){

    mui.ajax('http://127.0.0.1:10330/cmonitor/servlet/GetCarGDServlet',{
        type:'get',//HTTP请求类型
         dataType:'text',
        success:function(data){

            /*var lnglats =[
                             {
                                 "carid": "新885",
                                 "carmodel": "A006",
                                 "fzr": "admin",
                                 "id": "4028800264fecae50164fecd170d0002",
                                 "jd": "115.15962",
                                 "orgname": "中国石油",
                                 "wd": "38.283658"
                             },
                             {
                                 "carid": "新8858",
                                 "carmodel": "B996",
                                 "fzr": "晓晓",
                                 "id": "4028800264fecae50164fecdd7db0003",
                                 "jd": "114.478468",
                                 "orgname": "中国石油",
                                 "wd": "35.017472"
                             },
                             {
                                 "carid": "黑858",
                                 "carmodel": "B996",
                                 "fzr": "admin",
                                 "id": "4028800264fecae50164fece37d70004",
                                 "jd": "109.965592",
                                 "orgname": "没有",
                                 "wd": "34.558796"
                             },
                             {
                                 "carid": "黑858",
                                 "carmodel": "B996",
                                 "fzr": "admin",
                                 "id": "4028800264fecae50164fece57c10005",
                                 "jd": "111.749816",
                                 "orgname": "没有",
                                 "wd": "41.273809"
                             },
                             {
                                 "carid": "黑858",
                                 "carmodel": "B996",
                                 "fzr": "admin",
                                 "id": "4028800264fecae50164fece74500006",
                                 "jd": "117.828903",
                                 "orgname": "没有",
                                 "wd": "40.587658"
                             }
                         ]*/
            var lnglats=JSON.parse(data)
     infoWindow= new AMap.InfoWindow();
           for (var i = 0, marker; i < lnglats.length; i++) {
               var marker = new AMap.Marker({
                   position: [lnglats[i].jd,lnglats[i].wd],
                   map: map,
                   icon: new AMap.Icon({
                       size: new AMap.Size(40, 35),  //图标大小
                       image: "../../images/ditu.png",
                       imageOffset: new AMap.Pixel(-5, -60)
                    }),
                    draggable: true,
                    cursor: 'move',
                    raiseOnDrag: true,
                    clickable:true
               });
               //marker.content =
               //marker.content ="<p>经度:"+lnglats[i].jd+"</p>"+"<p>纬度:"+lnglats[i].wd+"</p>"+"<p>车牌号:"+lnglats[i].carid+"</p>"+"<p>单位:"+lnglats[i].orgname+"</p>"+"<p>车辆型号:"+lnglats[i].carmodel+"</p>"+"<p>负责人:"+lnglats[i].fzr+"</p>"
               (function(i){
                   marker.on('click', function(e){
                       console.log(lnglats[i].jd)
                       infoWindow.setContent("<div class='mui-backdrop'style='background:rgba(0,0,0,.7)'><div style='width:100%;height:400px;position:absolute;top:50%;margin-top:-200px;background:#fff'><div class='mui-input-row nb'><label for='' style=''>经度</label><input type='text'name='jd' value="+e.lnglat.getLng()+" class='form-control jd' readonly ></div><div class='mui-input-row nb'><label for='' style=''>纬度</label><input type='text' name='wd' value="+e.lnglat.getLat()+" class='form-control' readonly ></div><div class='mui-input-row nb'><label for='' style=''>单位</label><input type='text' name='orgname'value="+lnglats[i].orgname+" class='form-control' ></div><div class='mui-input-row nb'><label for='' style=''>负责人</label><input type='text' name='fzr' value="+lnglats[i].fzr+" class='form-control'></div><div class='mui-input-row nb'><label for='' style=''>联系方式</label><input type='text' name='telephone'id='telephone' value="+(lnglats[i].telephone?lnglats[i].telephone:'""')+" class='form-control'></div><div class='mui-input-row nb'><label for='' style=''>车牌号</label><input type='text' name='carid' value="+lnglats[i].carid+" class='form-control' ></div><div class='mui-input-row nb'><label for=''style=''>车辆型号</label><input type='text' name='carmodel' value="+lnglats[i].carmodel+" class='form-control' ></div><div style='text-align:center;padding-top: 15px;'><button class='mui-btn'onclick='hide(this)'>关闭</button><button class='mui-btn'data="+lnglats[i].id+" onclick='tijiao(this)'style='margin:0 10px;'>提交</button><button class='mui-btn'onclick='removeOne(this)'data="+lnglats[i].id+">删除此车辆</button></div></div></div>");
                       infoWindow.open(map, e.target.getPosition());
                        console.log('您在[ '+e.lnglat.getLng()+','+e.lnglat.getLat()+' ]的位置点击了地图！')
                  })
               })(i);
            }
        },
        error:function(xhr,type,errorThrown){
            console.log(xhr)
        }
    });
}

    map.setFitView();
showMap()
function showMap(){
    document.getElementById('submit').onclick=function(){
    document.getElementById('mui-backdrop').style.display='none'
    var _lng=document.getElementById('jd').value
    var _lat=document.getElementById('wd').value
    //http://127.0.0.1:10330
    mui.ajax('http://127.0.0.1:10330/cmonitor/servlet/InsertCarGDServlet',{
         data:{"jd":String(_lng),"wd":String(_lat),"carid":document.getElementById('carid').value,"orgname":document.getElementById('orgname').value,"carmodel":document.getElementById('carmodel').value,"fzr":document.getElementById('fzr').value,"telephone":document.getElementById('telephone').value},
         dataType:'text',
         type:'post',//HTTP请求类型
         success:function(data){
            var id=document.getElementById('row')
            var input =id.querySelectorAll('input');
            for(var i=0;i<input.length;i++){
                input[i].value=''
            }
             map.clearMap();
             getAjax()
         },
         error:function(xhr,type,errorThrown){
             console.log(xhr)

         }
     });

}
}
function hide(n){

infoWindow.close()

}
//获取添加
function tijiao(n){
    var input=n.parentNode.parentNode.querySelectorAll('input')
    var obj={}
    for (var i=0;i<input.length;i++){
    obj[input[i].name]=input[i].value

    }
    obj.id=n.getAttribute('data')
        console.log(obj)

    mui.ajax('http://127.0.0.1:10330/cmonitor/servlet/UpdateCarGDServlet',{
         data:obj,
         dataType:'text',
         type:'post',//HTTP请求类型
         success:function(data){
            map.clearMap();
            getAjax()
            infoWindow.close()

         },
         error:function(xhr,type,errorThrown){
             console.log(xhr)
         }
     });

}
//获取删除
function removeOne(n){

    mui.ajax('http://127.0.0.1:10330/cmonitor/servlet/DelCarGDServlet',{
             data:{"id":n.getAttribute('data')},
             dataType:'text',
             type:'post',//HTTP请求类型
             success:function(data){
                 map.clearMap();
                getAjax()
                infoWindow.close()
             },
             error:function(xhr,type,errorThrown){
                 console.log(xhr)
             }
         });


}

function marker(l,e){
    var marker=new AMap.Marker({
        map: map,
        position: [l, e],
        icon: new AMap.Icon({
            size: new AMap.Size(40, 50),  //图标大小
            image: "../../images/ditu.png",
            imageOffset: new AMap.Pixel(0, -60)
        }),
        draggable: true,
        cursor: 'move',
        raiseOnDrag: true,
        clickable:true
     });
    marker.on('click', markerClick);
    marker.on('dragend', function(e){
        console.log('您在[ '+e.lnglat.getLng()+','+e.lnglat.getLat()+' ]的位置点击了地图！')
       // map.remove(marker)
    });

}


function markerClick(e,n) {
   var el=e
   var btnArray = ['否', '是'];
    mui.confirm('是否创建车辆信息?', '', btnArray, function(e) {
        if (e.index == 1) {
            document.getElementById('mui-backdrop').style.display='block';
            console.log(document.getElementById('jd'))
            document.getElementById('jd').value=el.lnglat.getLng()
            document.getElementById('wd').value=el.lnglat.getLat()

        }else{
            map.remove(n)
        }
    })
}
 map.on('click', function(e) {
  //添加点标记，并使用自己的icon

   var marker=new AMap.Marker({
          map: map,
          position: [e.lnglat.getLng(), e.lnglat.getLat()],
          icon: new AMap.Icon({
              size: new AMap.Size(40, 50),  //图标大小
              image: "../../images/ditu.png",
              imageOffset: new AMap.Pixel(0, -60)
          }),
          draggable: true,
          cursor: 'move',
          raiseOnDrag: true,
          clickable:true
       });
      marker.on('click', markerClick(e,marker));
      marker.on('dragend', function(e){
          console.log('您在[ '+e.lnglat.getLng()+','+e.lnglat.getLat()+' ]的位置点击了地图！')
         // map.remove(marker)
      });

   // marker(e.lnglat.getLng(),e.lnglat.getLat())
   // alert('您在[ '+e.lnglat.getLng()+','+e.lnglat.getLat()+' ]的位置点击了地图！');

});

/*})
mui.back = function() {
         // var list = plus.webview.getWebviewById('commissionListview');
      //触发列表界面的自定义事件（refresh）,从而进行数据刷新
         // mui.fire(list,'refresh');
          plus.webview.currentWebview().hide("auto", 300);
          var self = plus.webview.currentWebview();
          //confirm()
          self.addEventListener("hide",function (e) {
              map.clearMap();
          },false);
      }*/