package com.ims.filter.criteria.service.impl;

import com.ims.filter.criteria.bean.FilterCriteriaBean;
import com.ims.filter.criteria.constant.FilterOperation;
import com.ims.filter.criteria.service.FilterCriteriaService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class FilterCriteriaServiceImpl<T> implements FilterCriteriaService<T> {

    @Autowired
    private EntityManager em;

    private static final List<String> DATE_FORMATS = Arrays.asList(
            "yyyy-MM-dd",
            "yyyy-MM-dd HH:mm:ss"
    );

    private Object parseValue(String value, Class<?> type) throws ParseException {
        if (type == String.class) return value;
        if (type == Integer.class || type == int.class) return Integer.parseInt(value);
        if (type == Long.class || type == long.class) return Long.parseLong(value);
        if (type == Double.class || type == double.class) return Double.parseDouble(value);
        if (type == Float.class || type == float.class) return Float.parseFloat(value);
        if (type == Boolean.class || type == boolean.class) return Boolean.parseBoolean(value);
        if (type == Date.class) return parseDate(value);
        return value;
    }

    private Date parseDate(String value) throws ParseException {
        for (String f : DATE_FORMATS) {
            try { return new SimpleDateFormat(f).parse(value); }
            catch (ParseException ignored) {}
        }
        throw new ParseException("Invalid date: " + value, 0);
    }

    private Path<?> getPath(Root<?> root, String attribute) {
        Path<?> path = root;
        for (String part : attribute.split("\\.")) {
            path = path.get(part);
        }
        return path;
    }

    @Override
    public List<?> getListOfFilteredData(Class<T> clazz,
                                         List<?> criteriaList,
                                         Integer limit) {

        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<T> cq = cb.createQuery(clazz);
        Root<T> root = cq.from(clazz);

        // ORDER BY mDate DESC IF EXISTS
        try {
            root.get("mDate");
            cq.orderBy(cb.desc(root.get("mDate")));
        } catch (Exception ignored) {}

        List<Predicate> predicates = new ArrayList<>();

        if (criteriaList != null) {
            for (Object obj : criteriaList) {

                FilterCriteriaBean filter = (FilterCriteriaBean) obj;

                String attr = filter.getAttribute();
                String op = filter.getOperation();
                String valueStr = filter.getValue();

                if (valueStr == null || valueStr.isEmpty()) continue;

                try {
                    Path<?> path = getPath(root, attr);
                    Class<?> type = filter.getValueType() != null ? filter.getValueType() : String.class;
                    Object value = parseValue(valueStr, type);

                    Predicate predicate;

                    switch (op) {

                        case FilterOperation.EQUALS:
                            predicate = cb.equal(path, value);
                            break;

                        case FilterOperation.NOT_EQUALS:
                            predicate = cb.notEqual(path, value);
                            break;

                        case FilterOperation.GREATER_THAN:
                            predicate = cb.greaterThan(path.as(Comparable.class), (Comparable) value);
                            break;

                        case FilterOperation.LESS_THAN:
                            predicate = cb.lessThan(path.as(Comparable.class), (Comparable) value);
                            break;

                        case FilterOperation.GREATER_THAN_OR_EQUAL:
                            predicate = cb.greaterThanOrEqualTo(path.as(Comparable.class), (Comparable) value);
                            break;

                        case FilterOperation.LESS_THAN_OR_EQUAL:
                            predicate = cb.lessThanOrEqualTo(path.as(Comparable.class), (Comparable) value);
                            break;

                        case FilterOperation.CONTAINS:
                            predicate = cb.like(path.as(String.class), "%" + valueStr + "%");
                            break;

                        case FilterOperation.STARTS_WITH:
                            predicate = cb.like(path.as(String.class), valueStr + "%");
                            break;

                        case FilterOperation.MATCHES:
                            predicate = cb.like(path.as(String.class), valueStr);
                            break;

                        case FilterOperation.NOT_MATCHES:
                            predicate = cb.notLike(path.as(String.class), valueStr);
                            break;

                        case FilterOperation.AMONG:
                        case FilterOperation.IN:
                            predicate = path.in(Arrays.asList(valueStr.split(",")));
                            break;

                        case FilterOperation.NOT_AMONG:
                            predicate = cb.not(path.in(Arrays.asList(valueStr.split(","))));
                            break;
                        
                        default:
                            throw new RuntimeException("Unsupported operator: " + op);
                    }

                    predicates.add(predicate);

                } catch (Exception e) {
                    throw new RuntimeException("Error applying filter on: " + attr, e);
                }
            }
        }

        if (!predicates.isEmpty()) cq.where(predicates.toArray(new Predicate[0]));

        TypedQuery<T> query = em.createQuery(cq);
        if (limit != null && limit > 0) query.setMaxResults(limit);

        return query.getResultList();
    }
}
