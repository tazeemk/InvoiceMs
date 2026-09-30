package com.ims.service.impl;

import com.ims.filter.criteria.bean.FilterCriteriaBean;
import com.ims.filter.criteria.service.FilterCriteriaService;
import com.ims.product.bean.ProductBean;
import com.ims.product.entity.ProductEntity;

import com.ims.productcategory.entity.ProductCategoryEntity;
import com.ims.productcategory.repository.ProductCategoryRepository;
import com.ims.repository.ProductRepository;
import com.ims.service.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductCategoryRepository categoryRepository;

    @Autowired
    private FilterCriteriaService<ProductEntity> productFilterCriteriaService;

    @Autowired
    private FilterCriteriaService<ProductCategoryEntity> categoryFilterCriteriaService;

    private String generateUniqueProductId() {
        String prefix = "PD-";
        String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String fullPrefix = prefix + dateStr + "-";

        List<ProductEntity> todayProducts = productRepository.findByProductIdStartingWith(fullPrefix);

        int maxSeq = todayProducts.stream()
            .map(p -> p.getProductId().substring(fullPrefix.length()))
            .mapToInt(seq -> {
                try {
                    return Integer.parseInt(seq);
                } catch (NumberFormatException e) {
                    return 0;
                }
            })
            .max()
            .orElse(0);

        int nextSeq = maxSeq + 1;
        String formattedSeq = String.format("%03d", nextSeq);

        return fullPrefix + formattedSeq;
    }

    @Override
    public ProductBean createProduct(ProductBean bean) {
        ProductCategoryEntity category = categoryRepository.findById(bean.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Category not found with ID: " + bean.getCategoryId()));

        ProductEntity entity = new ProductEntity();
        entity.setProductId(generateUniqueProductId());
        entity.setProductName(bean.getProductName());
        entity.setProductCode(bean.getProductCode());
        entity.setCategory(category);
        entity.setDescription(bean.getDescription());
        entity.setUnitPrice(bean.getUnitPrice());
        entity.setStockUnit(bean.getStockUnit());
        entity.setTaxRate(bean.getTaxRate());
        entity.setStatus(bean.getStatus());
        entity.setCreatedBy(bean.getCreatedBy());
        entity.setCreatedDate(LocalDateTime.now());
        entity.setLastModifiedBy(bean.getLastModifiedBy());
        entity.setLastModifiedDate(LocalDateTime.now());
        entity.setQuantity(bean.getQuantity());

        ProductEntity saved = productRepository.save(entity);
        return convertToBean(saved);
    }

    @Override
    public ProductBean getProductById(String id) {
        return productRepository.findById(id)
            .map(this::convertToBean)
            .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Override
    public List<ProductBean> getAllProducts() {
        return productRepository.findAll().stream()
            .map(this::convertToBean)
            .collect(Collectors.toList());
    }

    @Override
    public List<ProductBean> getProductsByCategoryId(String categoryId) {
        return productRepository.findByCategory_CategoryId(categoryId).stream()
            .map(this::convertToBean)
            .collect(Collectors.toList());
    }

    @Override
    public ProductBean updateProduct(ProductBean bean) {
        ProductEntity entity = productRepository.findById(bean.getProductId())
            .orElseThrow(() -> new RuntimeException("Product not found with ID: " + bean.getProductId()));

        ProductCategoryEntity category = categoryRepository.findById(bean.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Category not found with ID: " + bean.getCategoryId()));

        entity.setProductCode(bean.getProductCode());
        entity.setProductName(bean.getProductName());
        entity.setCategory(category);
        entity.setDescription(bean.getDescription());
        entity.setUnitPrice(bean.getUnitPrice());
        entity.setStockUnit(bean.getStockUnit());
        entity.setTaxRate(bean.getTaxRate());
        entity.setStatus(bean.getStatus());
        entity.setLastModifiedBy(bean.getLastModifiedBy());
        entity.setLastModifiedDate(LocalDateTime.now());
        entity.setQuantity(bean.getQuantity());

        ProductEntity saved = productRepository.save(entity);
        return convertToBean(saved);
    }

    @Override
    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }

    @Override
    public List<ProductBean> filterProducts(List<FilterCriteriaBean> filters, int limit) {
        try {
            @SuppressWarnings("unchecked")
            List<ProductEntity> filteredEntities = (List<ProductEntity>) productFilterCriteriaService
                .getListOfFilteredData(ProductEntity.class, filters, limit);

            return filteredEntities.stream()
                .map(this::convertToBean)
                .collect(Collectors.toList());

        } catch (Exception e) {
            throw new RuntimeException("Error filtering products: " + e.getMessage(), e);
        }
    }

    private ProductBean convertToBean(ProductEntity entity) {
        ProductBean bean = new ProductBean();
        bean.setProductId(entity.getProductId());
        bean.setProductCode(entity.getProductCode());
        bean.setProductName(entity.getProductName());
        bean.setCategoryId(entity.getCategory().getCategoryId());
        bean.setDescription(entity.getDescription());
        bean.setUnitPrice(entity.getUnitPrice());
        bean.setStockUnit(entity.getStockUnit());
        bean.setTaxRate(entity.getTaxRate());
        bean.setStatus(entity.getStatus());
        bean.setCreatedBy(entity.getCreatedBy());
        bean.setCreatedDate(entity.getCreatedDate());
        bean.setLastModifiedBy(entity.getLastModifiedBy());
        bean.setLastModifiedDate(entity.getLastModifiedDate());
        bean.setQuantity(entity.getQuantity());
        return bean;
    }
}