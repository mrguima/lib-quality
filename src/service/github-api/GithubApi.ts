import api from './instance';
import Issue from '../../type/Issue';
import Logger from '../../util/Logger';

class GithubApi {

    public async searchRepoByName(name: string): Promise<Record<string, string> | null> {
        Logger.info(`Looking for repository with name: ${name}`);
        const response = await api.get(`/search/repositories?q=${name}&order=desc&per_page=1`);
        const { total_count, items } = response.data;

        if ( total_count > 0 ) {
            return items[0];
        } else {
            return null;
        }
    }

    public async getRepoIssues(repoFullName: string): Promise<Issue[]> {
        Logger.info(`Getting issues for repo: ${repoFullName}`);
        const issues: Issue[] = [];        
        let page = 1;
        let fetchingData = true;

        while (fetchingData) {
            const response = await api.get(`/repos/${repoFullName}/issues?state=open&page=${page}&per_page=100`);      

            if (!response.data[0]) {
                fetchingData = false;
                continue;
            }

            response.data.map((item: Issue) => {
                if (item.pull_request) return
                issues.push(item);
            });
            page++;
        }

        Logger.info('All issues parsed successfully');
        return issues;
    }

    public async getUserDetails(token?: string): Promise<string> {
        let userName = 'Unknown user';
        if (token) {
            await api.get(`/user`, {
                    headers: {
                        Authorization: token,
                    },
                })
                .then((response) => {
                    userName = response.data.login;
                })
                .catch((error) => {
                    Logger.warn('Invalid token, user information not available');
                });
        }
        return userName;
    }
}

export default new GithubApi();