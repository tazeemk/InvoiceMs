package com.ims.repository;

import com.ims.product.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface ProductRepository extends JpaRepository<ProductEntity, String> {
	List<ProductEntity> findByProductIdStartingWith(String prefix);

	Collection<ProductEntity> findByCategory_CategoryId(String categoryId);

}
