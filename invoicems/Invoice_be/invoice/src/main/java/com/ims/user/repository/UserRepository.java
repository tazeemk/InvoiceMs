package com.ims.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ims.user.entity.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, String> {
	
	public Optional<UserEntity>findByUsername(String username);
	
	public Optional<UserEntity>findByEmail(String email);
	
}
