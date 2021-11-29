import Statistic from "./Statistic";

/**
 * This type describe the quality information for the LibQuality API
 */
type QualityInfo = {
    avg_age: number;
    std_age: number;
    graph_points: Statistic;
}

export default QualityInfo;