package com.csmz.service;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.csmz.dao.IProjectDao;
import com.csmz.pojo.Project;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
@Service("projectService")
public class ProjectServiceImpl implements ProjectService {
	@Autowired
	private IProjectDao dao;
	
	public void setDao(IProjectDao dao) {
		this.dao = dao;
	}

	@Override
	public List<Project> getAllProject() {
		List<Project> selectAllProject = dao.selectAllProject();
		return selectAllProject;
	}
	
	@Override
	public void insertProject(Project prj) {
		dao.insertProject(prj);
	}

	@Override
	public void deleteProjectById(String prjId) {
		dao.deleteProjectById(prjId);
	}

	@Override
	public Project selectProjectById(String prjId) {
		return dao.selectProjectById(prjId);
	}

	@Override
	public void updateProject(Project prj) {
		dao.updateProject(prj);
	}
 
	

}
