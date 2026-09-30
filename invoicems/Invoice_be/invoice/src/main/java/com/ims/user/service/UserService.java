package com.ims.user.service;

import com.ims.filter.criteria.bean.FilterCriteriaBean;
import com.ims.user.bean.ForgetPasswordBean;
import com.ims.user.bean.UserBean;

import java.util.List;

public interface UserService {
    UserBean createUser(UserBean user);
    List<UserBean> getAllUsers();
    UserBean getUserById(Long id);
	List<UserBean> filterUser(List<FilterCriteriaBean> filters, int limit);
	public void deleteUser(String userid);
	public void changeUserStatusToInactive(String id);
	
	public String resetUserPassword(ForgetPasswordBean forgetpassword);
}
