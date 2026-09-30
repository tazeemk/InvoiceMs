package com.ims.productcategory.service.impl;

import com.ims.filter.criteria.bean.FilterCriteriaBean;
import com.ims.filter.criteria.service.FilterCriteriaService;
import com.ims.productcategory.bean.ProductCategoryBean;
import com.ims.productcategory.entity.ProductCategoryEntity;
import com.ims.productcategory.repository.ProductCategoryRepository;
import com.ims.productcategory.service.ProductCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductCategoryServiceImpl implements ProductCategoryService {

	@Autowired
	private ProductCategoryRepository categoryRepository;


	@Autowired
	private FilterCriteriaService<ProductCategoryEntity> filterCriteriaService;

	// Custom ID generator for Product Category
	private String generateCategoryId() {
		String prefix = "PDCT-";
		String dateStr = java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"));
		String fullPrefix = prefix + dateStr + "-";

		List<ProductCategoryEntity> todayCategories = categoryRepository.findByCategoryIdStartingWith(fullPrefix);

		int maxSeq = todayCategories.stream().map(c -> c.getCategoryId().substring(fullPrefix.length()))
				.mapToInt(seq -> {
					try {
						return Integer.parseInt(seq);
					} catch (NumberFormatException e) {
						return 0;
					}
				}).max().orElse(0);

		int nextSeq = maxSeq + 1;
		String formattedSeq = String.format("%03d", nextSeq);

		return fullPrefix + formattedSeq;
	}

	@Override
	public ProductCategoryBean createCategory(ProductCategoryBean bean) {
		ProductCategoryEntity entity = new ProductCategoryEntity();

		// Generate and set custom category ID
		String generatedId = generateCategoryId();
		entity.setCategoryId(generatedId);

		// Set fields from bean
		entity.setCategoryName(bean.getCategoryName());
		entity.setDescription(bean.getDescription());
		entity.setCreatedBy(bean.getCreatedBy());
		entity.setStatus(bean.getStatus());
		entity.setCreatedDate(LocalDateTime.now());
		entity.setLastModifiedBy(bean.getLastModifiedBy());
		entity.setLastModifiedDate(LocalDateTime.now());
		

		// Save to DB
		entity = categoryRepository.save(entity);

		// Set fields back to bean
		bean.setCategoryId(entity.getCategoryId());
		bean.setCategoryName(entity.getCategoryName());

		return bean;
	}

	@Override
	public ProductCategoryBean getCategoryById(String id) {
		ProductCategoryEntity entity = categoryRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Category not found"));
		return convertToBean(entity);
	}

	@Override
	public List<ProductCategoryBean> getAllCategories() {
		return categoryRepository.findAll().stream().map(this::convertToBean).collect(Collectors.toList());
	}

	@Override
	public ProductCategoryBean updateCategory(ProductCategoryBean bean) {
		return createCategory(bean); // Assumes ID is set
	}

	@Override
	public void deleteCategory(String id) {
		categoryRepository.deleteById(id);
	}

	private ProductCategoryBean convertToBean(ProductCategoryEntity entity) {
		ProductCategoryBean bean = new ProductCategoryBean();
		bean.setCategoryId(entity.getCategoryId());
		bean.setCategoryName(entity.getCategoryName());
		bean.setDescription(entity.getDescription());
		bean.setStatus(entity.getStatus());
		return bean;
	}

	@Override
	public List<ProductCategoryBean> filteredProductCategorys(List<FilterCriteriaBean> filters, int limit) {
		try {
			@SuppressWarnings("unchecked")
			List<ProductCategoryEntity> filteredEntities = (List<ProductCategoryEntity>) filterCriteriaService
					.getListOfFilteredData(ProductCategoryEntity.class, filters, limit);

			return filteredEntities.stream().map(this::convertToBean).collect(Collectors.toList());

		} catch (Exception e) {
			throw new RuntimeException("Error filtering product categories: " + e.getMessage(), e);
		}
	}

	@Override
	public ProductCategoryBean updateCategorybyId(ProductCategoryBean productCategoryBean) {
		try {
			Optional<ProductCategoryEntity> optionalEntity = categoryRepository
					.findById(productCategoryBean.getCategoryId());

			if (!optionalEntity.isPresent()) {
				throw new RuntimeException("Catagory not found with ID: " + productCategoryBean.getCategoryId());
			}

			ProductCategoryEntity productCategoryEntity = optionalEntity.get();
			productCategoryEntity.setCategoryName(productCategoryBean.getCategoryName());
			productCategoryEntity.setDescription(productCategoryBean.getDescription());
			productCategoryEntity.setCategoryId(productCategoryBean.getCategoryId());
			productCategoryEntity.setStatus(productCategoryBean.getStatus());
			productCategoryEntity = categoryRepository.save(productCategoryEntity);
			return convertToBean(productCategoryEntity);

		} catch (Exception e) {
			throw new RuntimeException("Error updating Catagory: " + e.getMessage());
		}
	}

}

