
import { StudentRepository } from "./studentRepository";
import { Student } from "../entity/student";

const mockStudent = () => {
    let entity = new Student();
    entity.email = "";
    return entity;
}

beforeEach(() => {

});


afterEach(() => {
    jest.restoreAllMocks();
});


describe('Student Repository', () => {


    test('GetEntity retrieve exiting student entity correctly', async () => {
        // Setup
        const myMock = jest.fn();
        let email = "student1@hotmail.com";
        let student = mockStudent();
        student.email = email;
        jest.spyOn(StudentRepository, 'LookForEntity').mockImplementation(async () => { return student; });

        // Execute
        let result = await StudentRepository.GetEntity(email);

        // Result
        expect(result.email).toEqual(email);
    });

    test('GetEntity create a new entity if no existing was found', async () => {
        // Setup
        let email = "student1@hotmail.com";
        jest.spyOn(StudentRepository, 'LookForEntity').mockImplementation(async () => { return undefined; });

        // Execute
        let result = await StudentRepository.GetEntity(email);

        // Result
        expect(result.email).toEqual(email);
    });

    test('LookFor should trigger get repo function', async () => {
        // Setup
        let email = "student1@hotmail.com";
        let repository = {
            findOne: async () => { }
        }
        let spy = jest.spyOn(repository, "findOne");
        jest.spyOn(StudentRepository as any, 'GetRepository').mockImplementation(() => { return repository; });

        // Execute
        let result = await StudentRepository.LookForEntity(email);

        // Result
        expect(spy).toBeCalledWith({ email: email }, { relations: ["teachers"] });
    });

    test('Save should save with correct entity', async () => {
        // Setup
        let entity = new Student();
        let repository = {
            save: async () => { }
        }
        let spy = jest.spyOn(repository, "save");
        jest.spyOn(StudentRepository as any, 'GetRepository').mockImplementation(() => { return repository; });

        // Execute
        let result = await StudentRepository.Save(entity);

        // Result
        expect(spy).toBeCalledWith(entity);
    });

})
