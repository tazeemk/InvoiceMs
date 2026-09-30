package com.ims.product.controller;

import com.ims.filter.criteria.bean.FilterRequest;
import com.ims.product.bean.ProductBean;
import com.ims.service.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product")
@CrossOrigin("*")
public class ProductController {

	@Autowired
    ProductService productService;
    
    @PostMapping("/filterProducts")
    public ResponseEntity<List<ProductBean>> filterProducts(@RequestBody FilterRequest request) {
        try {
            int limit = request.getLimit() != null ? request.getLimit() : 100; // default to 100
            List<ProductBean> filterProducts = productService.filterProducts(request.getFilters(), limit);
            return ResponseEntity.ok(filterProducts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }


    @PostMapping("/createProduct")
    public ProductBean createProduct(@RequestBody ProductBean bean) {
        return productService.createProduct(bean);
    }

    @GetMapping("/getProductById/{id}")
    public ProductBean getProductById(@PathVariable String id) {
        return productService.getProductById(id);
    }

    @GetMapping("/getAllProducts")
    public List<ProductBean> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/getProductsByCategoryId/{categoryId}")
    public List<ProductBean> getProductsByCategoryId(@PathVariable String categoryId) {
        return productService.getProductsByCategoryId(categoryId);
    }

    @PutMapping("/updateByProductId/{id}")
    public ResponseEntity<ProductBean> updateByProductId(@PathVariable("id") String id, @RequestBody ProductBean bean) {
        try {
            bean.setProductId(id);  // Set the ID from path variable
            ProductBean updated = productService.updateProduct(bean);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }


    @DeleteMapping("/deleteProduct/{id}")
    public void deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
    }
}