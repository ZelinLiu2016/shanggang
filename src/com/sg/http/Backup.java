/**
 * 
 */
package com.sg.http;

import java.io.BufferedReader;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimerTask;

/**
 * @author yuchang xu
 *
 * 2017-08-17
 */
public class Backup extends TimerTask {

	/* (non-Javadoc)
	 * @see java.util.TimerTask#run()
	 */
	public static String command="C:/Program Files/MySQL/MySQL Server 5.7/bin/mysqldump -h localhost -uroot -p12345 shanggang";
	
	
	@Override
	public void run() {
		// TODO Auto-generated method stub
		back();
	}

	
	public static void back() {
        try {
        	System.out.println("备份数据！！！");
            Runtime rt = Runtime.getRuntime();

            // 调用 调用mysql的安装目录的命令
            Process child = rt
                    .exec(command);
           
            InputStream in = child.getInputStream();

            InputStreamReader xx = new InputStreamReader(in, "utf-8");
            
            String inStr;
            StringBuffer sb = new StringBuffer("");
            String outStr;
            // 组合控制台输出信息字符串
            BufferedReader br = new BufferedReader(xx);
            while ((inStr = br.readLine()) != null) {
                sb.append(inStr + "\r\n");
            }
            outStr = sb.toString();


            SimpleDateFormat format01  = new SimpleDateFormat("yyyy-MM-dd"); 
            String name = format01.format(new Date().getTime());
            String fPath = "f:/backupfile/"+name +".sql";
            FileOutputStream fout = new FileOutputStream(fPath);
            OutputStreamWriter writer = new OutputStreamWriter(fout, "utf-8");
            writer.write(outStr);
            writer.flush();
            in.close();
            xx.close();
            br.close();
            writer.close();
            fout.close();

            System.out.println("Backup successfully");

        } catch (Exception e) {
            e.printStackTrace();
        }

    }

 public static void main(String[] args) {
	back();
}
}
