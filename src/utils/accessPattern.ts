/**
 * page_access 패턴 매칭 (2 depth)
 *
 * 패턴 규칙:
 * - 'dashboard' → dashboard로 시작하는 모든 경로 허용
 * - 'dashboard.home' → dashboard.home 정확히 일치만 허용
 *
 * @example
 * matchesPattern('dashboard.home', ['dashboard']) // true (dashboard 전체 허용)
 * matchesPattern('dashboard.home', ['dashboard.home']) // true (정확히 일치)
 * matchesPattern('dashboard.analytics', ['dashboard.home']) // false
 */
export function matchesPattern(accessKey: string, patterns: string[]): boolean {
  return patterns.some(pattern => {
    // 1 depth 패턴 (예: 'dashboard') → 해당 서비스 전체 허용
    if (!pattern.includes('.')) {
      return accessKey === pattern || accessKey.startsWith(`${pattern}.`);
    }
    // 2 depth 패턴 (예: 'dashboard.home') → 정확히 일치 또는 하위 경로
    return accessKey === pattern || accessKey.startsWith(`${pattern}.`);
  });
}

/**
 * URL path를 accessKey로 변환 (2 depth)
 *
 * @example
 * pathToAccessKey('/dashboard') // 'dashboard'
 * pathToAccessKey('/dashboard/home') // 'dashboard.home'
 * pathToAccessKey('/dashboard/analytics/reports') // 'dashboard.analytics'
 */
export function pathToAccessKey(path: string): string {
  const segments = path.replace(/^\//, '').split('/').filter(Boolean);
  // 최대 2 depth만 사용
  return segments.slice(0, 2).join('.');
}
