// import { describe } from 'jasmine';

// .spec.ts file are read by protractor
// if you donot want to run the test then put x before describe method
// and sometimes if you only want to run this test not all test then add 'f' before describe
xdescribe('hellotest',() => {

    let expected = '';
    let notExpected = '';
    let expectMatch = null;
    // this method is run before each test 

    beforeEach( () => {
        expected = 'hellotest';
        notExpected = 'hellotest123';
        expectMatch = new RegExp(/^hello/);
    });
    // this test is run after each test is run . we are cleaning let declarations
    afterEach( () => {
        expected = '';
        notExpected = '';
    });
    it('check if hellotest is hellotest',
        () => expect('hellotest').toBe(expected));
    it('check if hellotest is not hellotest',
        () => expect('hellotest').not.toBe(notExpected));
    it('check if hellotest start with hello',
        () => expect('hellotest').toMatch(expectMatch));
});
