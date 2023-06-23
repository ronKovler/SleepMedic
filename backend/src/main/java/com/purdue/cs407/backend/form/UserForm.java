package com.purdue.cs407.backend.form;


import java.util.Date;


import javax.validation.constraints.NotEmpty;

import com.purdue.cs407.backend.dto.BaseDTO;
import com.purdue.cs407.backend.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserForm extends BaseDTO {
	
	@NotEmpty(message = "First name is required")
	private String firstName;

	@NotEmpty(message = "Last name is required")
	private String lastName;
	
	
	@NotEmpty(message = "First name is required")
	private String gender;
	
	@NotEmpty(message = "First name is required")
	private String email;
	
	@NotEmpty(message = "First name is required")
	private String password;
	
	@NotEmpty(message = "First name is required")
	private String phoneNumber;
	
	@NotEmpty(message = "userRole is required")
	private String userRole;
	
	
	public UserDTO getDTO() {
		UserDTO bean=new UserDTO();
		bean.setId(id);
		bean.setFirstName(firstName);
		bean.setLastName(lastName);
		bean.setGender(gender);
		bean.setEmail(email);
		bean.setPassword(password);
		bean.setPhoneNumber(phoneNumber);
		bean.setUserRole(userRole);

		return bean;
	}

	public void populate(UserDTO bean) {
		id = bean.getId();
		firstName=bean.getFirstName();
		lastName=bean.getLastName();
		gender = bean.getGender();
		email = bean.getEmail();
		password = bean.getPassword();
		phoneNumber = bean.getPhoneNumber();
		userRole = bean.getUserRole();

	}

	@Override
	public String toString() {
		return "UserForm [firstName=" + firstName + ", lastName=" + lastName + ", gender=" + gender
				+ ", email=" + email + ", password=" + password + ", phoneNumber="
				+ phoneNumber + "]";
	}
	
	

	
	

}
