import { AppController } from "./controller";
import { TeacherRepository } from "./repository/teacherRepository";
import { StudentRepository } from "./repository/studentRepository";
import { Teacher } from "./entity/teacher";
import { Student } from "./entity/student";

const mockRequest = (body: any, query?: any) => ({
    body,
    query
});

const mockResponse = () => {
    const res: {
        status?: any,
        json?: any
    } = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockTeacher = () => {
    let entity = new Teacher();
    entity.email = "";
    entity.students = [];
    return entity;
}

const mockStudent = () => {
    let entity = new Student();
    entity.email = "";
    entity.teachers = [];
    return entity;
}

const controller = AppController;


beforeEach(() => {

    jest.spyOn(TeacherRepository, 'GetEntity').mockImplementation(async () => { return mockTeacher(); });

    jest.spyOn(TeacherRepository, 'LookForEntity').mockImplementation(async () => { return mockTeacher(); });

    jest.spyOn(TeacherRepository, 'Save').mockImplementation(async () => { });

    jest.spyOn(StudentRepository, 'GetEntity').mockImplementation(async () => { return mockStudent(); });

    jest.spyOn(StudentRepository, 'LookForEntity').mockImplementation(async () => { return mockStudent(); });

    jest.spyOn(StudentRepository, 'Save').mockImplementation(async () => { });
});

afterEach(() => {
    jest.restoreAllMocks();
});


describe('Register Student', () => {
    test('should 400 if teacher email is missing from body', async () => {
        // Setup
        const body = { teacher: "", students: ["student1@hotmail.com", "student2@hotmail.com"] }
        const req = mockRequest(body);
        const res = mockResponse();

        // Execute
        await controller.RegisterStudents(req as any, res as any);

        // Result
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Both teacher and students email are required!'
        });
    });

    test('should 400 if students email is missing from body', async () => {
        // Setup
        const body = { teacher: "teacher@hotmail.com", students: [] }
        const req = mockRequest(body);
        const res = mockResponse();

        // Execute
        await controller.RegisterStudents(req as any, res as any);

        // Result
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Both teacher and students email are required!'
        });
    });

    test('should 400 if students email are empty string from body', async () => {
        // Setup
        const body = { teacher: "teacher@hotmail.com", students: ["", "", ""] }
        const req = mockRequest(body);
        const res = mockResponse();

        // Execute
        await controller.RegisterStudents(req as any, res as any);

        // Result
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Both teacher and students email are required!'
        });
    });

    test('should 400 if no body is provided', async () => {
        // Setup
        const body = { teacher: '', students: [] }
        const req = mockRequest(body);
        const res = mockResponse();

        // Execute
        await controller.RegisterStudents(req as any, res as any);

        // Result
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Both teacher and students email are required!'
        });
    });
    
    test('should not register any empty student email', async () => {
        // Setup
        const body = { teacher: 'teacher@hotmail.com', students: ["student1@hotmail.com", ""] }
        const req = mockRequest(body);
        const res = mockResponse();

        jest.spyOn(StudentRepository, 'GetEntity').mockImplementation(async (email: string) => {
            let student = mockStudent();
            student.email = email;
            return student
        });

        let spy = jest.spyOn(TeacherRepository, 'Save').mockImplementation(async () => { });

        // Execute
        await controller.RegisterStudents(req as any, res as any);

        // Result
        let result:Teacher = spy.mock.calls[0][0];
        expect(result.students.length).toEqual(1);
    });

    test('should 204 with teacher and student email provided', async () => {
        // Setup
        const body = { teacher: 'teacher@hotmail.com', students: ["student1@hotmail.com", "student2@hotmail.com"] }
        const req = mockRequest(body);
        const res = mockResponse();

        // Execute
        await controller.RegisterStudents(req as any, res as any);

        // Result
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.json).toHaveBeenCalledWith(null);
    });
});

describe('GetCommonStudent', () => {
    test('should 400 if no teacher email is provided', async () => {
        // Setup
        const query = {}
        const req = mockRequest({}, query);
        const res = mockResponse();

        // Execute
        await controller.GetCommonStudents(req as any, res as any);

        // Result
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Teacher email is required!'
        });
    });

    test('should 400 if no teacher email is empty string', async () => {
        // Setup
        const query = { teacher: ["", ""] }
        const req = mockRequest({}, query);
        const res = mockResponse();

        // Execute
        await controller.GetCommonStudents(req as any, res as any);

        // Result
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Teacher email is required!'
        });
    });

    test('should 200 with teacher email provided', async () => {
        // Setup
        const query = { teacher: ["teacher@hotmail.com"] }
        const req = mockRequest({}, query);
        const res = mockResponse();

        // Execute
        await controller.GetCommonStudents(req as any, res as any);

        // Result
        expect(res.status).toHaveBeenCalledWith(200);
    });

    test('should 200 with atleast one teacher email provided', async () => {
        // Setup
        const query = { teacher: ["teacher@hotmail.com", "", ""] }
        const req = mockRequest({}, query);
        const res = mockResponse();

        // Execute
        await controller.GetCommonStudents(req as any, res as any);

        // Result
        expect(res.status).toHaveBeenCalledWith(200);
    });

    test('should 200 with correct common email results with multiple teachers', async () => {
        // Setup
        let email1 = "teacher@hotmail.com";
        let email2 = "teacher2@hotmail.com";

        const query = { teacher: [email1, email2] }
        const req = mockRequest({}, query);
        const res = mockResponse();
        jest.spyOn(TeacherRepository, "LookForEntity").mockImplementation(async (email: string) => {
            let student1 = mockStudent(); student1.email = "john@hotmail.com";
            let student2 = mockStudent(); student2.email = "steve@hotmail.com";
            let student3 = mockStudent(); student3.email = "hang@hotmail.com";
            let teacher1 = mockTeacher(); teacher1.students = [student1, student2];
            let teacher2 = mockTeacher(); teacher2.students = [student1, student3];
            if (email === email1) return teacher1;
            if (email === email2) return teacher2;
            return undefined;
        })

        // Execute
        await controller.GetCommonStudents(req as any, res as any);

        // Result
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            students: ["john@hotmail.com"]
        });

        // Post reset the mock for other test
        TeacherRepository.LookForEntity = jest.fn().mockImplementation(() => { return mockTeacher(); })
    });

    test('should 200 with correct common email results with single teacher', async () => {
        // Setup
        let email1 = "teacher@hotmail.com";

        const query = { teacher: [email1] }
        const req = mockRequest({}, query);
        const res = mockResponse();
        jest.spyOn(TeacherRepository, "LookForEntity").mockImplementation(async (email: string) => {
            let student1 = mockStudent(); student1.email = "john@hotmail.com";
            let student2 = mockStudent(); student2.email = "steve@hotmail.com";
            let teacher1 = mockTeacher(); teacher1.students = [student1, student2];
            if (email === email1) return teacher1;
        })

        // Execute
        await controller.GetCommonStudents(req as any, res as any);

        // Result
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            students: ["john@hotmail.com", "steve@hotmail.com"]
        });
    });
});


describe('Suspend Student', () => {
    test('should 400 if student email is missing from body', async () => {
        // Setup
        const body = { students: "" }
        const req = mockRequest(body);
        const res = mockResponse();

        // Execute
        await controller.SuspendStudent(req as any, res as any);

        // Result
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Student email is required!'
        });
    });

    test('should 400 if body is null', async () => {
        // Setup
        const body = null;
        const req = mockRequest(body);
        const res = mockResponse();

        // Execute
        await controller.SuspendStudent(req as any, res as any);

        // Result
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Student email is required!'
        });
    });

    test('should 404 if student email is not found', async () => {
        // Setup
        const body = { student: "student@hotmail.com" };
        const req = mockRequest(body);
        const res = mockResponse();
        jest.spyOn(StudentRepository, "LookForEntity").mockImplementation(async (email: string) => {
            return undefined;
        })
        // Execute
        await controller.SuspendStudent(req as any, res as any);

        // Result
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Student record is not found!" });
    });

    test('should 200 if student email is provided correctly', async () => {
        // Setup
        const body = { student: "student@hotmail.com" };
        const req = mockRequest(body);
        const res = mockResponse();

        // Execute
        await controller.SuspendStudent(req as any, res as any);

        // Result
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.json).toHaveBeenCalledWith(null);
    });
});



describe('Get Notification Recipients', () => {
    test('should 400 if teacher email is missing', async () => {
        // Setup
        const body = { teacher: "", notification: "hi all" }
        const req = mockRequest(body);
        const res = mockResponse();

        // Execute
        await controller.GetNotificationRecipients(req as any, res as any);

        // Result
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Both teacher email and notification content are required!'
        });
    });


    test('should 400 if notification is not provided', async () => {
        // Setup
        const body = { teacher: "teacher@hotmail.com", notification: "" }
        const req = mockRequest(body);
        const res = mockResponse();

        // Execute
        await controller.GetNotificationRecipients(req as any, res as any);

        // Result
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Both teacher email and notification content are required!'
        });
    });

    test('should 400 if both teacher and notification is not provided', async () => {
        // Setup
        const body = { teacher: null, notification: "" }
        const req = mockRequest(body);
        const res = mockResponse();

        // Execute
        await controller.GetNotificationRecipients(req as any, res as any);

        // Result
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Both teacher email and notification content are required!'
        });
    });

    test('should 404 if teacher record is not found', async () => {
        // Setup
        const body = { teacher: "teacher@hotmail.com", notification: "hi all, good day!" }
        const req = mockRequest(body);
        const res = mockResponse();
        jest.spyOn(TeacherRepository, "LookForEntity").mockImplementation(async (email: string) => {
            return undefined;
        })
        jest.spyOn(StudentRepository, "LookForEntity").mockImplementation(async (email: string) => {
            let student = mockStudent(); student.email = "student10@hotmail.com";
            return student;
        })

        // Execute
        await controller.GetNotificationRecipients(req as any, res as any);

        // Result
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: "Teacher record is not found!"
        });
    });

    test('should 200 with teacher email and no student email in notification', async () => {
        // Setup
        const body = { teacher: "teacher@hotmail.com", notification: "hi all, good day!" }
        const req = mockRequest(body);
        const res = mockResponse();
        jest.spyOn(TeacherRepository, "LookForEntity").mockImplementation(async (email: string) => {
            let student1 = mockStudent(); student1.email = "john@hotmail.com";
            let student2 = mockStudent(); student2.email = "steve@hotmail.com";
            let teacher1 = mockTeacher(); teacher1.email = "teacher@hotmail.com";
            teacher1.students = [student1, student2];
            return teacher1;
        })
        jest.spyOn(StudentRepository, "LookForEntity").mockImplementation(async (email: string) => {
            let student = mockStudent(); student.email = "student10@hotmail.com";
            return student;
        })

        // Execute
        await controller.GetNotificationRecipients(req as any, res as any);

        // Result
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            recipients: ["john@hotmail.com", "steve@hotmail.com"]
        });
    });


    test('should 200 with teacher email and student email in notification', async () => {
        // Setup
        const body = { teacher: "teacher@hotmail.com", notification: "hi @student10@hotmail.com @@" }
        const req = mockRequest(body);
        const res = mockResponse();
        jest.spyOn(TeacherRepository, "LookForEntity").mockImplementation(async (email: string) => {
            let student1 = mockStudent(); student1.email = "john@hotmail.com";
            let student2 = mockStudent(); student2.email = "steve@hotmail.com";
            let teacher1 = mockTeacher(); teacher1.email = "teacher@hotmail.com";
            teacher1.students = [student1, student2];
            return teacher1;
        })

        jest.spyOn(StudentRepository, "LookForEntity").mockImplementation(async (email: string) => {
            let student = mockStudent(); student.email = "student10@hotmail.com";
            return student;
        })

        // Execute
        await controller.GetNotificationRecipients(req as any, res as any);

        // Result
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            recipients: ["john@hotmail.com", "steve@hotmail.com", "student10@hotmail.com"]
        });
    });

    test('should 200 with duplicates input', async () => {
        // Setup
        const body = { teacher: "teacher@hotmail.com", notification: "hi @student10@hotmail.com @@" }
        const req = mockRequest(body);
        const res = mockResponse();
        jest.spyOn(TeacherRepository, "LookForEntity").mockImplementation(async (email: string) => {
            let student1 = mockStudent(); student1.email = "student10@hotmail.com";
            let student2 = mockStudent(); student2.email = "steve@hotmail.com";
            let teacher1 = mockTeacher(); teacher1.email = "teacher@hotmail.com";
            teacher1.students = [student1, student2];
            return teacher1;
        })

        jest.spyOn(StudentRepository, "LookForEntity").mockImplementation(async (email: string) => {
            let student = mockStudent(); student.email = "student10@hotmail.com";
            return student;
        })

        // Execute
        await controller.GetNotificationRecipients(req as any, res as any);

        // Result
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            recipients: ["student10@hotmail.com", "steve@hotmail.com"]
        });
    });

    test('should 200 with suspended student from teacher', async () => {
        // Setup
        const body = { teacher: "teacher@hotmail.com", notification: "hi @student999@hotmail.com @@" }
        const req = mockRequest(body);
        const res = mockResponse();
        jest.spyOn(TeacherRepository, "LookForEntity").mockImplementation(async (email: string) => {
            let student1 = mockStudent(); student1.email = "student10@hotmail.com";
            let student2 = mockStudent(); student2.email = "steve@hotmail.com"; student2.suspended = true;
            let teacher1 = mockTeacher(); teacher1.email = "teacher@hotmail.com";
            teacher1.students = [student1, student2];
            return teacher1;
        })

        jest.spyOn(StudentRepository, "LookForEntity").mockImplementation(async (email: string) => {

            let student1 = mockStudent(); student1.email = "student10@hotmail.com";
            let student2 = mockStudent(); student2.email = "student999@hotmail.com";
            if (email === student1.email)
                return student1;
            if (email === student2.email)
                return student2;

            return undefined;
        })

        // Execute
        await controller.GetNotificationRecipients(req as any, res as any);

        // Result
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            recipients: ["student10@hotmail.com", "student999@hotmail.com"]
        });
    });

    test('should 200 with suspended student from notification', async () => {
        // Setup
        const body = { teacher: "teacher@hotmail.com", notification: "hi @student999@hotmail.com @@" }
        const req = mockRequest(body);
        const res = mockResponse();
        jest.spyOn(TeacherRepository, "LookForEntity").mockImplementation(async (email: string) => {
            let student1 = mockStudent(); student1.email = "student10@hotmail.com";
            let student2 = mockStudent(); student2.email = "steve@hotmail.com";
            let teacher1 = mockTeacher(); teacher1.email = "teacher@hotmail.com";
            teacher1.students = [student1, student2];
            return teacher1;
        })

        jest.spyOn(StudentRepository, "LookForEntity").mockImplementation(async (email: string) => {

            let student1 = mockStudent(); student1.email = "student10@hotmail.com";
            let student2 = mockStudent(); student2.email = "student999@hotmail.com"; student2.suspended = true;
            if (email === student1.email)
                return student1;
            if (email === student2.email)
                return student2;

            return undefined;
        })

        // Execute
        await controller.GetNotificationRecipients(req as any, res as any);

        // Result
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            recipients: ["student10@hotmail.com", "steve@hotmail.com"]
        });
    });
});
