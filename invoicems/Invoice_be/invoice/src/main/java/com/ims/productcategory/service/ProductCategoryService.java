package com.ims.productcategory.service;

import com.ims.filter.criteria.bean.FilterCriteriaBean;
import com.ims.productcategory.bean.ProductCategoryBean;

import java.util.List;

public interface ProductCategoryService {
    ProductCategoryBean createCategory(ProductCategoryBean bean);
    ProductCategoryBean getCategoryById(String id);
    List<ProductCategoryBean> getAllCategories();
    ProductCategoryBean updateCategory(ProductCategoryBean bean);
    void deleteCategory(String id);
	List<ProductCategoryBean> filteredProductCategorys(List<FilterCriteriaBean> filters, int limit);
	ProductCategoryBean updateCategorybyId(ProductCategoryBean productCategoryBean);
}
