package io.dcloud;



import cn.com.petrochina.BSMCPBaseUtils;
import io.dcloud.application.DCloudApplication;

/**
 * Created by 冯金琪 on 2017/12/8.
 */


public class GetUserMessage {
   //rivate String name;
    private BSMCPBaseUtils bsmcpBaseUtils;
    /**
     * 获取所有信息
     * @return
     */
    public String getContent(){
        //1. 通过ContentProvider获取单点登录信息
         bsmcpBaseUtils = new BSMCPBaseUtils(DCloudApplication.getInstance());
        return bsmcpBaseUtils.getContent();
    }

    /**
     * 获取用户名
     * @return
     */
    public String getLoginName() {
        //1. 通过ContentProvider获取单点登录信息
         bsmcpBaseUtils = new BSMCPBaseUtils(DCloudApplication.getInstance());
        return bsmcpBaseUtils.getLoginName();
    }

    /**
     * 获取版本大厅
     * @return
     */
    public String getVersion(){
        //1. 通过ContentProvider获取单点登录信息
         bsmcpBaseUtils = new BSMCPBaseUtils(DCloudApplication.getInstance());
        return bsmcpBaseUtils.getVersion();
    }

    /**
     * 获取用户id
     * @return
     */
    public String getLoginId(){
        //1. 通过ContentProvider获取单点登录信息
         bsmcpBaseUtils = new BSMCPBaseUtils(DCloudApplication.getInstance());
        return bsmcpBaseUtils.getLoginId();
    }

    /***
     * 获取域名
     * @return
     */
    public String getDomain(){
        bsmcpBaseUtils = new BSMCPBaseUtils(DCloudApplication.getInstance());
        return bsmcpBaseUtils.getDomain();
    }

    /**
     * 获取子账号
     * @return
     */
    public String getSubAccounts(){
        bsmcpBaseUtils = new BSMCPBaseUtils(DCloudApplication.getInstance());
        return bsmcpBaseUtils.getSubAccounts();
    }




}
