import { Request, Response } from 'express';
import GithubApi from "../service/github-api/GithubApi";
import Search from "../model/Search";
import Logger from '../util/Logger';

class SearchLogController {
    public async saveSearchLog(token: string | undefined, name: string, repoFullName: string) {
        const userName = await GithubApi.getUserDetails(token);
        await Search.create({
            userName: userName,
            searchQuery: name,
            matchedRepository: repoFullName,
        });
        Logger.info('Search log saved successfully');
    }

    public async listSearches(req: Request, res: Response): Promise<Response> {
        Logger.info('Request received for /list');
        const result = await Search.find();
        return res.status(200).json(result);
    }
}


export default new SearchLogController();