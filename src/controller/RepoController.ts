import { Request, Response } from 'express';
import GithubApi from '../service/github-api/GithubApi';
import Logger from '../util/Logger';
import QualityController from './QualityController';
import SearchLogController from './SearchLogController';

class RepoController {
    public async index(req: Request, res: Response): Promise<Response> {
        Logger.info('Request received for /');
        return res.status(200).json({ message: 'Welcome to LibQuality' });
    }

    public async getRepoQuality(req: Request, res: Response): Promise<Response> {
        Logger.info('Request received for /search');
        const { name } =  req.query;
        
        if (!name) {
            Logger.error('Empty query name');
            return res.status(422).json({ message: 'Unprocessable entity' });
        }

        const repository = await GithubApi.searchRepoByName(name as string);

        if (!repository) {
            Logger.error('No repositories found from query name');
            return res.status(404).json({ message: 'Repository not found' });
        }

        const token = req.headers.authorization;
        await SearchLogController.saveSearchLog(token, name as string, repository.full_name);
        
        const issues = await GithubApi.getRepoIssues(repository.full_name as string);

        const qualityData = await QualityController.getQualityData(issues);
        
        return res.status(200).json({
            name: repository?.name,
            issues: issues.length,
            avg_age: qualityData.avg_age,
            std_age: qualityData.std_age,
            graph_points: qualityData.graph_points,
        });
    }
}


export default new RepoController();