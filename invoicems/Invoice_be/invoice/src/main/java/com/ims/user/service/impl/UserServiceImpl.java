package com.ims.user.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ims.filter.criteria.bean.FilterCriteriaBean;
import com.ims.filter.criteria.service.FilterCriteriaService;
import com.ims.user.bean.ForgetPasswordBean;
import com.ims.user.bean.UserBean;
import com.ims.user.entity.UserEntity;
import com.ims.user.repository.UserRepository;
import com.ims.user.service.UserService;

@Service
@Transactional
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private JwtService jwtservice;

	private String generateCustomId() {
		// Format: USR + YYYYMMDDHHMMSS + random 3-digit number
		String timestamp = java.time.LocalDateTime.now()
				.format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));

		int random = (int) (Math.random() * 900) + 100; // random number between 100 and 999
		return "USR" + timestamp + random;
	}

	private UserBean convertToBean(UserEntity entity) {
		UserBean bean = new UserBean();
		bean.setId(entity.getId());
		bean.setFirstName(entity.getFirstName());
		bean.setLastName(entity.getLastName());
		bean.setUsername(entity.getUsername());
		bean.setEmail(entity.getEmail());
		bean.setPassword(entity.getPassword());
		bean.setRole(entity.getRole());
		bean.setStatus(entity.getStatus());
		bean.setCreatedBy(entity.getCreatedBy());
		return bean;
	}

	private UserEntity convertToEntity(UserBean bean) {
		UserEntity entity = new UserEntity();
		entity.setId(bean.getId());
		entity.setFirstName(bean.getFirstName());
		entity.setLastName(bean.getLastName());
		entity.setUsername(bean.getUsername());
		entity.setEmail(bean.getEmail());
		entity.setPassword(passwordEncoder.encode(bean.getPassword()));
		entity.setRole(bean.getRole());
		entity.setStatus(bean.getStatus());
		if (bean.getCreatedBy() != null) {
			entity.setCreatedBy(bean.getCreatedBy());
		}
		return entity;
	}

	@Override
	public UserBean createUser(UserBean user) {
		if (user.getId() == null || user.getId().isEmpty()) {
			user.setId(generateCustomId());
		}
		
		UserEntity saved = userRepository.save(convertToEntity(user));
		return convertToBean(saved);
	}

	public List<String> generateToken(UserDetails userDetails) {
		return jwtservice.generateToken(userDetails);
	}

	public void validateToken(String token) {
		jwtservice.validateToken(token);
	}

	@Override
	public List<UserBean> getAllUsers() {
		return userRepository.findAll().stream().map(this::convertToBean).collect(Collectors.toList());
	}

//    @Override
//    public UserBean getUserById(Long id) {
//        return userRepository.findById(id).map(this::convertToBean).orElse(null);
//    }

	@Autowired
	private FilterCriteriaService<UserEntity> filterCriteriaService;

	@Override
	public List<UserBean> filterUser(List<FilterCriteriaBean> filters, int limit) {
		try {
			@SuppressWarnings("unchecked")
			List<UserEntity> filteredEntities = (List<UserEntity>) filterCriteriaService
					.getListOfFilteredData(UserEntity.class, filters, limit);

			return filteredEntities.stream().map(this::convertToBean).collect(Collectors.toList());

		} catch (Exception e) {
			throw new RuntimeException("Error filtering products: " + e.getMessage(), e);
		}
	}

	@Override
	public void deleteUser(String userid) {
		if(userid ==null) {
			throw new IllegalArgumentException("User Not Found ");
		}
		userRepository.deleteById(userid);
	}
	
	@Override
	public void changeUserStatusToInactive(String id) {
	
		if(id==null) {
			throw new IllegalArgumentException("User Not Found ");
		}
		Optional<UserEntity> user=userRepository.findById(id);
	    if(user.isEmpty()) {
	    	throw new IllegalArgumentException("User Not Found ");
	    }
	    UserEntity userUpdate =user.get();
	     userUpdate.setStatus("Inactive");
	     userRepository.save(userUpdate);
	}
	
	@Override
	public UserBean getUserById(Long id) {
		return null;
	}
	
	@Override
	public String resetUserPassword(ForgetPasswordBean forgetpassword) {
		String userEmail =forgetpassword.getEmail();
		if(userEmail.isBlank()) {
			throw new IllegalArgumentException("Please Enter Email ID !");
		}
		Optional<UserEntity>user=userRepository.findByEmail(userEmail);
		 if(user.isEmpty()) {
			 throw new IllegalArgumentException("Email Id Not Found : Please Enter Valid Email");
		 }
		 UserEntity userEntity=user.get();
		 if(userEntity.getEmail().isEmpty()) {
			 throw new IllegalArgumentException("User Not Found --> Please Enter Valid Email : ");
		 }
		 userEntity.setPassword(passwordEncoder.encode(forgetpassword.getPassword()));
		 userRepository.save(userEntity);
		return "Password Changed Successfully :";
	}
}
