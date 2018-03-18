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
            obj.value =rs.y.value+"-"+rs.m.value+"-"+rs.d.value+' '+rs.h.value+':'+rs.i.value;
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