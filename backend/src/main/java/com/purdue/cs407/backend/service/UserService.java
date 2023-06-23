package com.purdue.cs407.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.purdue.cs407.backend.dao.UserDAO;
import com.purdue.cs407.backend.dto.UserDTO;
import com.purdue.cs407.backend.exception.RecordNotFoundException;



@Service
public class UserService {

	@Autowired
	public UserDAO dao;
	
	public void add(UserDTO dto) {		
		dao.save(dto);		
	}
	
	public UserDTO login(String email, String password) {		
		return dao.findByEmailAndPassword(email, password);		
	}

	public UserDTO findUserById(long id) {
		return dao.findById(id);
	}
	
	public UserDTO findUserByEmail(String email) {
		return dao.findByEmail(email);
	}
	
	
}
