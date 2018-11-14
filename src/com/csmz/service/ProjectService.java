package com.csmz.service;

import java.util.List;

import com.csmz.pojo.Project;

public interface ProjectService {
	List<Project> getAllProject();
	void insertProject(Project project);
	void deleteProjectById(String projectId);
	Project selectProjectById(String projectId);
	void updateProject(Project project);
	
}
