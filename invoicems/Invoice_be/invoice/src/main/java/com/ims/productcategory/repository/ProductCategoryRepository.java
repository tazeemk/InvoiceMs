package com.ims.productcategory.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ims.productcategory.entity.ProductCategoryEntity;


public interface ProductCategoryRepository extends JpaRepository<ProductCategoryEntity, String> {
	List<ProductCategoryEntity> findByCategoryIdStartingWith(String prefix);

	boolean existsByCategoryName(String string);
}
