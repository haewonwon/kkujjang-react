import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { FlexBox } from "@/styles/FlexStyle";
import hoveredFilter from "@/assets/images/icon-filter-gr.png";
import defaultFilter from "@/assets/images/icon-filter.png";

const Filter = ({ filterOptions, setSelectedFilterOptions }) => {
  // 각 key에 대해 false로 초기화
  const [isClicked, setIsClicked] = useState(
    filterOptions?.reduce((acc, key) => ({ ...acc, [key]: false }), {})
  );

  const onApplyFilter = (key, item) => {
    setSelectedFilterOptions((prev) => ({ ...prev, [key]: item }));
    setIsClicked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <FlexBox>
      {filterOptions?.map(({ key, values }, idx) => (
        <FilterWrapper col="center" key={key}>
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
                  {getFilterItemText(key, item)}
                </FilterListItem>
              ))}
            </FilterList>
          )}
        </FilterWrapper>
      ))}
    </FlexBox>
  );
};

const filterLabels = {
  type: "문의 유형",
  needsAnswer: "답변 여부"
};

const getFilterLabel = (key) => {
  return filterLabels[key] || "";
};

const getFilterItemText = (key, item) => {
  switch (key) {
    case "type":
      switch (item) {
        case 0:
          return "시스템 문의";
        case 1:
          return "계정 관련 문의";
        case 2:
          return "서비스 문의";
        case 3:
          return "순서 테스트";
        default:
          return "";
      }
    case "needsAnswer":
      switch (item) {
        case true:
          return "NO";
        case false:
          return "YES";
        default:
          return "";
      }
  }
};

Filter.propTypes = {
  filterOptions: PropTypes.array,
  setSelectedFilterOptions: PropTypes.func
};

const FilterWrapper = styled(FlexBox)`
  margin-right: 44px;
`;

const FilterImage = styled.img`
  width: 19px;
  margin-left: 6px;

  &:hover {
    cursor: pointer;
  }
`;

const FilterList = styled(FlexBox).attrs({ as: "ul" })`
  position: absolute;
  top: 147px;
  width: max-content;
  align-self: baseline;
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
