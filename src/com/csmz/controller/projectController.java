
package com.csmz.controller;



import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.csmz.pojo.Project;
import com.csmz.pojo.Result;
import com.csmz.service.ProjectService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;



@Controller
@RequestMapping("test")
public class projectController {
	
	@Autowired
	@Qualifier("projectService")
	private ProjectService projectService;
	@RequestMapping("/index.do")
	public String index3() {
		return "/page/index.html";
	}
	@RequestMapping("/getAllProjectPage2.do")
	@ResponseBody
	public Map<String,Object> getAllProjectPage2(int pageNum,int size) {
		Map<String,Object> map =new HashMap<String,Object>();
		PageHelper.startPage(pageNum, size);
		List<Project> list = projectService.getAllProject();
		PageInfo<Project> page = new PageInfo<Project>(list);
		map.put("pageNum",page.getPageNum());
		map.put("total", page.getTotal());
		map.put("rows", list);
		map.put("code","100");
		return map;
	}
	@RequestMapping("/findOne.do")
	@ResponseBody
	public Map<String,Object> findOne(String id) {
		Map<String,Object> map =new HashMap<String,Object>();
		Project row = projectService.selectProjectById(id);
		map.put("row", row);
		map.put("code","100");
		return map;
	}
	@RequestMapping("/update.do")
	@ResponseBody
	public Result update(@RequestBody Project row) {
		try {
			projectService.updateProject(row);
			return new Result(true,"更新成功");
		} catch (Exception e) {
			
			return new Result(false,"更新失败");
		}
		
		
	}  
	@RequestMapping("/deleteOne.do")
	@ResponseBody
	public Map<String,Object> deleteOne(String id) {
		Map<String,Object> map =new HashMap<String,Object>();
		try {
			projectService.deleteProjectById(id);
			map.put("code","100");
			return map;
		} catch (Exception e) {
			return map;
		}
		
		
	}
	@RequestMapping("/add.do")
	@ResponseBody
	public Result add(@RequestBody Project row) {
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  //设置日期格式
		String currentTime = df.format(new Date());  // new Date()为获取当前系统时间
		row.setBuildDate(currentTime);
		System.out.println(row);
		try {
			projectService.insertProject(row);
			return new Result(true,"新增成功");
		} catch (Exception e) {
			
			return new Result(false,"新增失败");
		}
		
		
	}  
}
