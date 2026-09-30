package com.ims.config;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.ims.user.entity.UserEntity;
import com.ims.user.repository.UserRepository;

@Component
public class CustomDetailsService implements UserDetailsService {

	@Autowired
	private UserRepository userRepo;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Optional<UserEntity>userCredentials=userRepo.findByUsername(username);
		return userCredentials.map(CustomUserDetails::new).orElseThrow(()->new UsernameNotFoundException("Invalid UserName :"));
	}

}
