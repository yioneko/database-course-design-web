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

  const paginationConfig = (total?: number) => {
    return {
      onChange: onAntdPaginationChange,
      total: total,
    };
  };

  return {
    paginationParams,
    paginationConfig,
  };
}

export default usePaginationParams;
