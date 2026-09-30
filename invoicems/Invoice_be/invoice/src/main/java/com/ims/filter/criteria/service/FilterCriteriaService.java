package com.ims.filter.criteria.service;

import java.util.List;

public interface FilterCriteriaService<T> {
    List<?> getListOfFilteredData(Class<T> clazz, List<?> criteriaList, Integer limit);
}
