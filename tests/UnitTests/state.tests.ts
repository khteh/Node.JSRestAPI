import config from 'config'
import { Mock, It, Times } from 'moq.ts';
import { DataSource, EntityTarget, Repository } from "typeorm"
import { Database } from 'infrastructure';
import * as chai from 'chai';
import chaiHttp from 'chai-http'
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
import { ILogger, LogLevels, StatusEnum, NewState, StateContext, QuotedState, ApprovedState, RejectedState } from "webapi.core";
var expect = chai.expect
var assert = chai.assert
var should = chai.should()
chai.use(chaiHttp)
//console.log("NODE_ENV: "+config.util.getEnv('NODE_ENV')+ " : "+process.env.NODE_ENV)
expect(config.util.getEnv('NODE_ENV')).to.be.eql('test');
describe('State tests', () => {
    let logger: ILogger;
    beforeEach(() => {
        logger = new Mock<ILogger>().setup(i => i.Log(It.IsAny<number>(), It.IsAny<string>())).returns().object();
    });
    it('Valid state transition should succeed test', async () => {
        // arrange
        let stateContext = new StateContext(logger);
        let state = new NewState(logger, stateContext);

        expect(stateContext.State()).to.be.null;
        expect(state.Name()).to.equal(StatusEnum.NEW);

        stateContext.ChangeState(state);
        expect(stateContext.State()).to.equal(state.Name());

        stateContext.handle();
        expect(stateContext.State()).to.equal(StatusEnum.QUOTED);

        stateContext.handle();
        expect(stateContext.State()).to.equal(StatusEnum.APPROVED);

        stateContext.handle();
        expect(stateContext.State()).to.equal(StatusEnum.APPROVED);
    });
})