/**
 * Coverage percentage color coding
 */
export const COVERAGE_COLORS = {
  HIGH: '#10B981',      // Green (75-100%)
  MEDIUM: '#F59E0B',    // Orange (50-74%)
  LOW: '#EF4444',       // Red (1-49%)
  NONE: '#6B7280',      // Gray (0%)
};

/**
 * Get coverage color based on percentage
 * @param {number} percentage - Coverage percentage (0-100)
 * @returns {string} Color hex code
 */
export const getCoverageColor = (percentage) => {
  if (percentage === 100) return COVERAGE_COLORS.HIGH;
  if (percentage >= 75) return COVERAGE_COLORS.HIGH;
  if (percentage >= 50) return COVERAGE_COLORS.MEDIUM;
  if (percentage > 0) return COVERAGE_COLORS.LOW;
  return COVERAGE_COLORS.NONE;
};

/**
 * AWS service categories
 */
export const SERVICE_CATEGORIES = {
  COMPUTE: 'Compute',
  STORAGE: 'Storage',
  DATABASE: 'Database',
  NETWORKING: 'Networking',
  ANALYTICS: 'Analytics',
  ML_AI: 'Machine Learning & AI',
  SECURITY: 'Security & Identity',
  DEVELOPER_TOOLS: 'Developer Tools',
  MANAGEMENT: 'Management & Governance',
  OTHER: 'Other',
};

/**
 * Chart colors for visualizations
 */
export const CHART_COLORS = [
  '#FF9900', // AWS Orange (primary)
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316', // Orange
];
