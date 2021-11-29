import _ from 'lodash';
import GithubApi from "../service/github-api/GithubApi";
import Issue from "../type/Issue";
import QualityInfo from "../type/Quality";
import Statistic from "../type/Statistic";
import Search from "../model/Search";
import Logger from '../util/Logger';

class QualityController {
    public getQualityData(issues: Issue[]): QualityInfo {
        Logger.info('Getting quality information from issues');
        if (issues.length == 0) return { avg_age: 0, std_age: 0, graph_points: { x: [], y: [] }};

        const today = Date.now();
        const issuesOpenedSinceInDays = issues.map((issue: Issue) =>
            (today - new Date(issue.created_at).getTime())/(1000*60*60*24)
        );

        const averageOpenedDays = this.getAverage(issuesOpenedSinceInDays);
        const stdDeviationDays = this.getStandardDeviationTime(
            issuesOpenedSinceInDays, averageOpenedDays,
        );

        const graphPoints = this.getStatistics(issues);

        return { 
            avg_age: averageOpenedDays,
            std_age: stdDeviationDays,
            graph_points: graphPoints,
        };
    }

    public getAverage(data: number[]): number {
        const total = data.reduce((acc: number, current: number) => acc += current);
        return Math.round(total/data.length);
    }

    public getStandardDeviationTime(data: number[], mean: number): number {
        const size = data.length;
        const std = Math.sqrt(
            data.map(current => Math.pow(current - mean, 2)
        ).reduce((acc, curr) => acc + curr) / size);

        return Math.round(std);
    }

    public getStatistics(issues: Issue[]): Statistic {
        const dates: any[] = issues.map((issue: Issue) => {
            const fullDate = new Date(issue.created_at);
            return { date: `${fullDate.getFullYear()}-${fullDate.getMonth()+1}`};
        });

        const grouped = _.groupBy(dates, 'date');
        const graphData: Statistic = { x: [], y: [] };
        Object.entries(grouped).map(([key, value]) => {
            graphData.x.push(key);
            graphData.y.push(value.length);
        });

        return graphData;
    }

    public async saveSearchLog(token: string | undefined, name: string, repoFullName: string) {
        let userName;

        if (token) {
            userName = await GithubApi.getUserDetails(token);
        }

        await Search.create({
            userName: userName,
            searchQuery: name,
            matchedRepository: repoFullName,
        });
    }
}


export default new QualityController();