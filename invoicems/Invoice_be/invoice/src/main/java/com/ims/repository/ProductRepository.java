package com.ims.repository;

import com.ims.product.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<ProductEntity, String> {
	List<ProductEntity> findByProductIdStartingWith(String prefix);

	Collection<ProductEntity> findByCategory_CategoryId(String categoryId);
	Optional<ProductEntity> findFirstByProductNameIgnoreCase(String productName);

}
