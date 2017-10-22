
export namespace ui.metrics {

  export interface MetricsPanel {
    rangeSelection: MetricsPanelRangeSelection;
    groups:         MetricsPanelGroup[];
  }

  export interface MetricsPanelRangeSelection {
    granularity: number;
    timerange:   Timerange;
  }

  export interface Timerange {
    start:  number;
    end:    number;
  }

  export interface MetricsPanelGroup {
    title:             string;
    dimensionConfigs:  MetricsPanelDimensionConfig[];
    metricsConfigs:    MetricsPanelMetricsConfig[];
    graphs:            MetricsPanelGraphConfig[];
  }

  export interface MetricsPanelDimensionConfig {
    name:          string;
    displayName?:  string;
    filters:       MetricsPanelDimensionFilter[];
    enabled:       boolean;
  }

  export interface MetricsPanelDimensionFilter {
    value:     any;
    selected:  boolean;
  }

  export interface MetricsPanelMetricsConfig {
    name:     string;
    source:   string;
  }

  export interface MetricsPanelGraphConfig {
    title:        string;
    width?:       number;  // 1, 2, 4
    minY?:        number;
    maxY?:        number;
    default?:     number;
    percentage?:  boolean;
    chart:        {
      type:       string;
      stack?:     boolean;
    };
    metrics:      MetricsPanlGraphMetricsConfig[];
  }

  export interface MetricsPanlGraphMetricsConfig {
    name:          string;
    displayName?:  string;
    retrieve?:     string;
    transform?:    string;
  }
}
