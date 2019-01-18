package io.dcloud;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.IBinder;
import android.os.PowerManager;
import android.util.Log;

import java.util.concurrent.TimeUnit;

import io.reactivex.Observable;
import io.reactivex.disposables.Disposable;


public class MyService extends Service {
    public MyService() {

    }

    @Override
    public void onCreate() {
        backGround();
        Log.e("ser","ok0");
        super.onCreate();

    }
    @Override
    public IBinder onBind(Intent intent) {
        // TODO: Return the communication channel to the service.
        throw new UnsupportedOperationException("Not yet implemented");
    }
    private PowerManager.WakeLock wakeLock = null;
    public static Disposable sDisposable;
    int count=0;
    public void backGround(){
        sDisposable= Observable.interval(30, TimeUnit.SECONDS)
                .subscribe(count -> {
                    wakeCPU();
                    Log.e("周期任务","每 30 秒采集一次数据... count = " + count);
                });
    }
    public void wakeCPU(){
        PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
        wakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK,"admin");
        wakeLock.acquire();
    }
}
