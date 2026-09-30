package com.ims.config;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.ims.user.entity.UserEntity;

@SuppressWarnings("serial")
public class CustomUserDetails implements UserDetails{

	private String username;
	
	private String password;
	
	private String role;
	
	
	public CustomUserDetails(UserEntity userEntity) {
		this.username = userEntity.getUsername();
		this.password = userEntity.getPassword();
        this.role =userEntity.getRole();
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(new SimpleGrantedAuthority(role));
	}

	@Override
	public String getPassword() {
		
		return password;
	}

	@Override
	public String getUsername() {
		
		return username;
	}
	
	public String getRole() {
		
		return role;
	}

	@Override
	public boolean isAccountNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isEnabled() {
		// TODO Auto-generated method stub
		return true;
	}

	
	
}
