import QualityController from '../../src/controller/QualityController';
import Issue from '../../src/type/Issue';
import Logger from '../../src/util/Logger';
import { ISSUES } from '../mock/issues.json';

describe('Used to test quality info functions', () => {
    console.log = jest.fn();    
    Logger.info = jest.fn();
    Logger.error = jest.fn();
    Logger.warn = jest.fn();
    Logger.debug = jest.fn();
    
    const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    it('should get the correct mean of a list', () => {
        const mean = QualityController.getAverage(nums);

        expect(mean).toEqual(5);    
    });

    it('should get the standard deviation of a list', () => {
        const mean = 5;
        const std = QualityController.getStandardDeviationTime(nums, mean);

        expect(std).toEqual(3);    
    });

    it('should handle list of issues', () => {
        const issues: Issue[] = ISSUES;
        
        const qualityData = QualityController.getQualityData(issues);

        expect(qualityData).toEqual({ 
            avg_age: 55,
            std_age: 5,
            graph_points: {
                x: [
                    "2021-10",
                ],
                y: [
                    2,
                ],
            },
        });    
    });
});