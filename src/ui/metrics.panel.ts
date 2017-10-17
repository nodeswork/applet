
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
    name:     string;
    filters:  MetricsPanelDimensionFilter[];
    enabled:  boolean;
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
    title:   string;
    chart:   {
      type:  string;
    };
    metrics: MetricsPanlGraphMetricsConfig[];
  }

  export interface MetricsPanlGraphMetricsConfig {
    name:  string;
  }
}
