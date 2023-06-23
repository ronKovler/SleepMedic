package com.purdue.cs407.backend.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.purdue.cs407.backend.dto.UserDTO;

public interface UserDAO extends JpaRepository<UserDTO, Long>{
	
	public UserDTO findById(long id);
	public UserDTO findByEmail(String email);
	public UserDTO findByEmailAndPassword(String email, String password);

}
