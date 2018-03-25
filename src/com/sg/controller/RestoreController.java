/**
 * 
 */
package com.sg.controller;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.annotation.ResponseStatusExceptionResolver;

import com.sg.domain.Shipinfo;

import net.sf.json.JSONObject;

/**
 * @author yuchang xu
 *
 * 2017-08-17
 */
@Controller
@RequestMapping("/restore")
public class RestoreController {
	@RequestMapping(value="/listbackupfile",method=RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List<String>> listallinfo() throws IOException{
		List<String> filename = listincrement();
		return new ResponseEntity<List<String>>(filename,HttpStatus.OK);
	}
	
	@RequestMapping(value="/dorestore",method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<String> restore(@RequestBody String pro) {
		JSONObject json = JSONObject.fromObject(pro);
		String file = "f:\\backupfile\\" + json.getString("filename");
		String result = null;
        try {
            Runtime runtime = Runtime.getRuntime();
            String databaseName = "shanggang";
            Process process = runtime
                    .exec("C:/Program Files/MySQL/MySQL Server 5.6/bin/mysqldump -h localhost -ushanggang -pshanggang --default-character-set=utf8 "
                            + databaseName);
            OutputStream outputStream = process.getOutputStream();
            BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(file), "utf-8"));
            String str = null;
            StringBuffer sb = new StringBuffer();
            while ((str = br.readLine()) != null) {
                sb.append(str + "\r\n");
            }
            str = sb.toString();
            System.out.println(str);
            OutputStreamWriter writer = new OutputStreamWriter(outputStream,
                    "utf-8");
            writer.write(str);
            writer.flush();
            outputStream.close();
            br.close();
            writer.close();
            System.out.println("还原成功！！！！");
            result = "successfully";
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return new ResponseEntity<String>(result, HttpStatus.OK);
    }

	public List<String> listincrement(){
		String path = "f:\\backupfile";
		 File file = new File(path);
		 String[] filelist = file.list();
		 List<String> filename = new ArrayList<String>();
//		 SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        for (int i = 0; i < filelist.length; i++) {
                File readfile = new File(path + "\\" + filelist[i]);
                if (!readfile.isDirectory()) {
               	 	 String str  = readfile.getName();
//               	 	 str = str.substring(0,10);
                        System.out.println(str);
                        filename.add(str);
                } 
        }
//        System.out.println(filename);
        Collections.sort(filename);
//        System.out.println(filename);
        return filename;
	}
	
}
