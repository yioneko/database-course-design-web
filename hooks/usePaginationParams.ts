import { useState } from "react";
import { PaginationBaseRequest } from "../common/interface";

function usePaginationParams(initialParams?: Partial<PaginationBaseRequest>) {
  const { offset = 0, pageLimit = 10 } = initialParams || {};

  const [paginationParams, setPaginationParams] =
    useState<PaginationBaseRequest>({ offset, pageLimit });

  const onAntdPaginationChange = (page: number, pageSize: number) => {
    setPaginationParams({
      offset: (page - 1) * pageSize,
      pageLimit: pageSize,
    });
  };

  const paginationConfig = (pageCount?: number) => {
    return {
      onChange: onAntdPaginationChange,
      // TODO: the total number of items is not available in the response
      total:
        pageCount === undefined ? 0 : pageCount * paginationParams.pageLimit,
    };
  };

  return {
    paginationParams,
    paginationConfig,
  };
}

export default usePaginationParams;
