import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { FlexBox } from "@/styles/FlexStyle";
import hoveredFilter from "@/assets/images/icon-filter-gr.png";
import defaultFilter from "@/assets/images/icon-filter.png";

const filterLabels = {
  type: "문의 유형",
  types: "신고 유형",
  needsAnswer: "답변 여부",
  createdAt: "정렬"
};

const Filter = ({ filterOptions, selectedFilterOptions, setSelectedFilterOptions }) => {
  const [isClicked, setIsClicked] = useState(
    filterOptions?.reduce((acc, key) => ({ ...acc, [key]: false }), {})
  );
  const [isChecked, setIsChecked] = useState(
    filterOptions
      ?.filter((option) => option.key === "types")
      ?.reduce(
        (acc, option) => ({
          ...acc,
          [option.key]: option.values.reduce(
            (obj, value) => ({ ...obj, [value]: false }),
            {}
          )
        }),
        {}
      )
  );

  const onApplyFilter = (key, item) => {
    const newFilterOptions = { ...selectedFilterOptions, [key]: item };
    setSelectedFilterOptions(newFilterOptions);
    if (key !== "types") {
      setIsClicked((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const onCheckboxChange = (key, item) => {
    setSelectedFilterOptions((prev) => ({
      ...prev,
      [key]: { ...prev[key], [item]: !prev[key][item] }
    }));

    setIsChecked((prev) => ({
      ...prev,
      [key]: { ...prev[key], [item]: !prev[key][item] }
    }));
  };

  return (
    <FilterListWrapper>
      {filterOptions?.map(({ key, values }, idx) => (
        <FilterItemWrapper col="center" key={key}>
          <span>{getFilterLabel(key)}</span>
          <FilterImage
            src={defaultFilter}
            onClick={() => setIsClicked((prev) => ({ ...prev, [key]: !prev[key] }))}
            onMouseOver={(e) => e.target.setAttribute("src", hoveredFilter)}
            onMouseOut={(e) => e.target.setAttribute("src", defaultFilter)}
          />
          {isClicked[key] && (
            <FilterList left={idx === 1 ? "26px" : ""} dir="col" col="center">
              {values?.map((item, idx) => (
                <FilterListItem
                  key={idx}
                  value={item}
                  onClick={() => onApplyFilter(key, item)}
                >
                  {key === "types" ? (
                    <>
                      <input
                        type="checkbox"
                        checked={isChecked[key][item]}
                        onChange={() => onCheckboxChange(key, item)}
                      />
                      {getFilterItemText(key, item)}
                    </>
                  ) : (
                    getFilterItemText(key, item)
                  )}
                </FilterListItem>
              ))}
            </FilterList>
          )}
        </FilterItemWrapper>
      ))}
    </FilterListWrapper>
  );
};

const getFilterLabel = (key) => {
  return filterLabels[key] || "";
};

const getFilterItemText = (key, item) => {
  switch (key) {
    case "type":
      switch (item) {
        case 0:
          return <span>{"시스템 문의"}</span>;
        case 1:
          return <span>{"계정 관련 문의"}</span>;
        case 2:
          return <span>{"서비스 문의"}</span>;
        case 3:
          return <span>{"순서 테스트"}</span>;
        default:
          return "";
      }
    case "needsAnswer":
      switch (item) {
        case true:
          return <span>{"NO"}</span>;
        case false:
          return <span>{"YES"}</span>;
        default:
          return "";
      }
    case "types":
      switch (item) {
        case "isOffensive":
          return <span>{"공격적인 언어 사용"}</span>;
        case "isCheating":
          return <span>{"사기 행위"}</span>;
        case "isPoorManner":
          return <span>{"비매너 행위"}</span>;
        default:
          return "";
      }
    case "createdAt":
      switch (item) {
        case "oldest":
          return <span>{"과거순"}</span>;
        case "latest":
          return <span>{"최신순"}</span>;
      }
  }
};

Filter.propTypes = {
  filterOptions: PropTypes.array,
  selectedFilterOptions: PropTypes.object,
  setSelectedFilterOptions: PropTypes.func
};

const FilterListWrapper = styled(FlexBox)`
  & > * + * {
    margin-left: 1.75rem;
  }
`;

const FilterItemWrapper = styled(FlexBox)``;

const FilterImage = styled.img`
  width: 19px;
  margin-left: 6px;

  &:hover {
    cursor: pointer;
  }
`;

const FilterList = styled(FlexBox).attrs({ as: "ul" })`
  position: absolute;
  top: 165px;
  width: max-content;
  align-self: baseline;
  margin-top: 10px;
  margin-left: ${(props) => props.left || ""};
  background-color: ${({ theme }) => theme.colors.content};
  border: 2px solid #a2a2a2;
  border-radius: 1px;
  box-shadow: 0 1px 4px #00000019;
  text-align: center;
`;

const FilterListItem = styled.li`
  width: 100%;
  min-width: 60px;
  padding: 3px 10px;

  &:hover {
    background-color: #ebeae6;
    font-weight: 700;
    cursor: pointer;
  }
`;

export default Filter;
