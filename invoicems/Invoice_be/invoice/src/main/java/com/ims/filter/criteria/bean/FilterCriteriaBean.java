package com.ims.filter.criteria.bean;

public class FilterCriteriaBean {

    private String attribute;
    private String operation;
    private String value;
    private Class<?> valueType;

    public FilterCriteriaBean() { }

    public String getAttribute() { return attribute; }
    public void setAttribute(String attribute) { this.attribute = attribute; }

    public String getOperation() { return operation; }
    public void setOperation(String operation) { this.operation = operation; }

    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }

    public Class<?> getValueType() { return valueType; }
    public void setValueType(Class<?> valueType) { this.valueType = valueType; }
}
