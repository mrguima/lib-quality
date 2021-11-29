## LibQuality API

LibQuality is an API to measure the quality of famous open source projects like [React](https://github.com/facebook/react), [Angular](https://github.com/angular/angular), [Vue](https://github.com/vuejs/vue), among others. It collects data from [GitHub API](https://docs.github.com/pt/rest), consolidate, and make them available for the end user.

## Requirements
- First you need [Node 14+](https://nodejs.org/en/) on your environment.
- Then you have to clone this repository or download the latest version available on [releases](https://github.com/mrguima/lib-quality/releases).
- Install the dependecies with `npm install`.
- And boot up the server `npm start`.

Check the swagger documentation for the API visiting `http://localhost:3000/docs`.

## How does it work and how to use it

![API Flow](https://user-images.githubusercontent.com/38497003/144142179-227c462a-f624-477c-b50e-be71a7860210.png)

LibQuality accepts requests through the endpoint `/search`. Use this route with the query **`name`**. Its value should be the name of the respository you want to collet the quality metrics. 

For example: **`http://localhost:3000/search?name=react`**
>To avoiding reaching the maximum amount of requests provided by the GitHub API, it is highly recommended that you add your [GitHub Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) to the `Authorization` header of your requests.

LibQuality will handle the given name and, if a match is found, return the current **amount** of opened issues, the **average days** they are opened,  its **standard deviation** and **two lists of data** to be used in a chart (bar, line, scatter).

LibQuality saves the **searches** in a database (including your public GitHub name from your token). These data will be used later to create new features. You can check the logs by visiting the `/list` endpoint.

## Tests

To execute the unit tests of the application, run **`npm test`**.