
/*var vm=new Vue({
    el:"#app",
    data:{
        lng:'',
        lat:'',
        car:'',
        danwei:'',
        carxing:'',
        person:'',
    },
    create:{

    },
    methods:{
        close(){
           document.getElementById('mui-backdrop').style.display='none'
        },
        commmit(){
            document.getElementById('mui-backdrop').style.display='none'
        },
        remove(){
            document.getElementById('mui-backdrop').style.display='none'

        }
    }
})*/
/*
var clickListener,map = new AMap.Map('container', {
    resizeEnable: true,
    zoom:5,
    center: [116.397428, 39.90923]
});

var data=[{"carid":"甘AJG901","carmodel":"依维柯NJ2045","fzr":"曾锋德","jd":"30.55762","orgname":"兰州石化","time":"2018-5-22 10:32:17","wd":"104.074524"},{"carid":"冀R6511M","carmodel":"依维柯NJ2045","fzr":"裴晓峰","jd":"40.110885","orgname":"管道局","time":"2018-5-25 8:47:29","wd":"116.425247"},{"carid":"冀R 7S112","carmodel":"丰田4000","fzr":"李锐","jd":"40.110723","orgname":"管道局","time":"2018-5-24 21:46:49","wd":"116.425312"}]





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
    remove(marker,marker)
}



function remove(b,n){
        document.getElementById('remove').onclick=function(){
        document.getElementById('mui-backdrop').style.display='none'
        map.remove(n)
    }
}
function markerClick(e) {
   var el=e
   var btnArray = ['否', '是'];
    mui.confirm('是否创建车辆信息?', '', btnArray, function(e) {
        if (e.index == 1) {
            document.getElementById('mui-backdrop').style.display='block';
            //vm.lng=el.lnglat.getLng()
            //vm.lat=el.lnglat.getLat()

        }
    })
}
 map.on('click', function(e) {
  //添加点标记，并使用自己的icon
    marker(e.lnglat.getLng(),e.lnglat.getLat())

   // alert('您在[ '+e.lnglat.getLng()+','+e.lnglat.getLat()+' ]的位置点击了地图！');

});
*/

   window.addEventListener('get_detail',function(event){

  var map = new AMap.Map("container", {resizeEnable: true,zoom:5,center: [116.397428, 39.90923]});



    //[{"carid":"甘AJG901","carmodel":"依维柯NJ2045","fzr":"曾锋德","jd":"30.55762","orgname":"兰州石化","time":"2018-5-22 10:32:17","wd":"104.074524"},{"carid":"冀R6511M","carmodel":"依维柯NJ2045","fzr":"裴晓峰","jd":"40.110885","orgname":"管道局","time":"2018-5-25 8:47:29","wd":"116.425247"},{"carid":"冀R 7S112","carmodel":"丰田4000","fzr":"李锐","jd":"40.110723","orgname":"管道局","time":"2018-5-24 21:46:49","wd":"116.425312"}]

    var infoWindow = new AMap.InfoWindow();
     mui.ajax('http://127.0.0.1:10330/cmonitor/servlet/GetCarGDServlet',{
        type:'get',//HTTP请求类型
         dataType:'text',
        success:function(data){
        var lnglats =JSON.parse(data)

           for (var i = 0, marker; i < lnglats.length; i++) {

                   var marker = new AMap.Marker({
                       position: [lnglats[i].jd,lnglats[i].wd],
                       map: map,
                       icon: new AMap.Icon({
                           size: new AMap.Size(40, 35),  //图标大小
                           image: "../../images/ditu.png",
                           imageOffset: new AMap.Pixel(-5, -60)
                        }),
                   });
                    marker.content = "<p>经度:"+lnglats[i].jd+"</p>"+"<p>纬度:"+lnglats[i].wd+"</p>"+"<p>单位:"+lnglats[i].orgname+"</p>"+"<p>负责人:"+lnglats[i].fzr+"</p>"+"<p>联系方式:"+(lnglats[i].telephone?lnglats[i].telephone:'')+"</p>"+"<p>车牌号:"+lnglats[i].carid+"</p>"+"<p>车辆型号:"+lnglats[i].carmodel+"</p>"
                    marker.on('click', markerClick);

            }
        },
        error:function(xhr,type,errorThrown){
            console.log(xhr)

        }
    });

    mui.ajax('http://127.0.0.1:10330/cmonitor/servlet/GetBganServlet',{
            type:'get',//HTTP请求类型
             dataType:'text',
            success:function(data){
            var lnglats =JSON.parse(data)

               for (var i = 0, marker; i < lnglats.length; i++) {

                       var marker = new AMap.Marker({
                           position: [lnglats[i].jd,lnglats[i].wd],
                           map: map,
                           icon: new AMap.Icon({
                               size: new AMap.Size(40, 25),  //图标大小
                               image: "../../images/ditu.png",
                               imageOffset: new AMap.Pixel(-5, -90)
                            }),
                       });
                        marker.content = "<p>经度:"+lnglats[i].jd+"</p>"+"<p>纬度:"+lnglats[i].wd+"</p>"+"<p>单位:"+lnglats[i].orgname+"</p>"+"<p>负责人:"+lnglats[i].fzr+"</p>"+"<p>联系方式:"+(lnglats[i].telephone?lnglats[i].telephone:'')+"</p>"
                        marker.on('click', markerClick);

                }
            },
            error:function(xhr,type,errorThrown){
                console.log(xhr)

            }
        });



    function markerClick(e) {
        infoWindow.setContent(e.target.content);
        infoWindow.open(map, e.target.getPosition());

    }
    map.setFitView();
  })
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
      }