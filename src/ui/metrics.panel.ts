
export namespace ui.metrics {

  export interface MetricsPanel {
    rangeSelection: MetricsPanelRangeSelection;
    groups:         MetricsPanelGroup[];
  }

  export interface MetricsPanelRangeSelection {
    granularity: string;
    timeRange:   TimeRange;
  }

  export interface TimeRange {
    start:  Date;
    end:    Date;
  }

  export interface MetricsPanelGroup {
    title:             string;
    dimensionConfigs:  MetricsPanelDimensionConfig[];
    metricsConfigs:    MetricsPanelMetricsConfig[];
    graphs:            MetricsPanelGraphConfig[];
  }

  export interface MetricsPanelDimensionConfig {
    name:     string;
    filters:  MetricsPanelDimensionFilter[];
    enabled:  boolean;
    split:    boolean;
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
    title: string;
  }
}
