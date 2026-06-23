import * as types from "@/types/api";

export function normalizeListResponse<T>(
  response: types.BackendListResponse<T>,
): types.ListResponse<T> {
  return {
    data: response.data || [],
    total:
      response.total ??
      response.pagination?.total ??
      response.data?.length ??
      0,
    limit:
      response.limit ??
      response.pagination?.limit ??
      response.data?.length ??
      0,
    offset: response.offset ?? response.pagination?.offset ?? 0,
    pagination: response.pagination,
  };
}

export function unwrapDataResponse<T>(
  response: types.BackendDataResponse<T> | T,
): T {
  if (
    typeof response === "object" &&
    response !== null &&
    "data" in response
  ) {
    return (response as types.BackendDataResponse<T>).data;
  }

  return response as T;
}

export function normalizeSuggestionStats(
  stats: types.BackendWritingSuggestionStats | types.WritingSuggestionStats,
): types.WritingSuggestionStats {
  if ("totalSuggestions" in stats) {
    return stats;
  }

  const byType = stats.byType.reduce<Record<string, number>>((acc, item) => {
    acc[item.type] = item.count;
    return acc;
  }, {});
  const bySeverity = stats.bySeverity.reduce<Record<string, number>>(
    (acc, item) => {
      acc[item.severity] = item.count;
      return acc;
    },
    {},
  );

  return {
    totalSuggestions: stats.total,
    appliedCount: stats.applied,
    appliedPercentage:
      stats.total > 0 ? Math.round((stats.applied / stats.total) * 100) : 0,
    byType,
    bySeverity,
  };
}
