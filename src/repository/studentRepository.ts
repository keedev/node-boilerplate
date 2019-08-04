import { Student } from "../entity/student";
import { BaseRepository } from "./baseRepository";

class StudentRepository extends BaseRepository<Student>{

    async GetEntity(email: string) {

        let entity = await this.LookForEntity(email);

        let student: Student;
        if (entity) {
            student = entity;
        } else {
            student = new Student();
            student.email = email;
        }
        return student;
    }

    async LookForEntity(email: string) {

        let repository = this.GetRepository();
        let entity = await repository.findOne({ email: email });
        return entity;
    }
}

const repository = new StudentRepository(Student);

export { repository as StudentRepository }
