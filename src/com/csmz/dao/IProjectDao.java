package com.csmz.dao;

import java.util.List;

import com.csmz.pojo.Project;

public interface IProjectDao {
	List<Project> selectAllProject(); 
	void insertProject(Project project);
	void deleteProjectById(String prjectId);
	Project selectProjectById(String projectId);
	void updateProject(Project project);
}
