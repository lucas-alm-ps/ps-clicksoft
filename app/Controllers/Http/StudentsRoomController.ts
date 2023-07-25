import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import StudentsController from "./StudentsController";
import Database from "@ioc:Adonis/Lucid/Database";
import { Exception } from "@adonisjs/core/build/standalone";
import httpStatus from "http-status";
import AssignRoomValidator from "App/Validators/AssignRoomValidator";
import Room from "App/Models/Room";
import { TeacherAuthRequest } from "App/Middleware/TeacherAuth";
import Student from "App/Models/Student";

export default class StudentsRoomController extends StudentsController {
  public async index({ request, response, params }: HttpContextContract) {
    await this.checkIdParams(params.room_id);

    const students = await Database.rawQuery(
      `
        SELECT * FROM 
            students 
        JOIN 
            students_rooms 
        ON
            students.enrollment = students_rooms.student_enrollment
        WHERE 
            students_rooms.room_number = ?
    `,
      [params.room_id]
    );

    return response.status(200).json(students);
  }

  public async store({
    request,
    response,
    params,
    teacher,
  }: TeacherAuthRequest) {
    await this.checkIdParams(params.room_id);

    await this.checkIfTeacherOwnsRoom(teacher.enrollment, params.room_id);

    await request.validate(AssignRoomValidator);

    const data = request.only(["studentEnrollment"]);

    await this.checkIfStudentIsAlreadyAssignedToRoom(
      data.studentEnrollment,
      params.room_id
    );

    const room = await Room.findBy("number", params.room_id);
    if (!room) throw new Exception("Room not found", httpStatus.NOT_FOUND);

    const student = await Student.findBy("enrollment", data.studentEnrollment);
    if (!student)
      throw new Exception("Student not found", httpStatus.NOT_FOUND);

    await Database.rawQuery(
      `
              INSERT INTO
                  students_rooms
                  (student_enrollment, room_number)
              VALUES
                  (?, ?)
          `,
      [student.enrollment, Number(room.number)]
    );

    return response.status(201);
  }

  private async checkIfTeacherOwnsRoom(
    teacherEnrollment: string,
    roomId: number
  ) {
    const room = await Room.findBy("number", roomId);

    if (!room) throw new Exception("Room not found", httpStatus.NOT_FOUND);

    if (room.teacherEnrollment !== teacherEnrollment)
      throw new Exception(
        "Teacher does not own this room",
        httpStatus.FORBIDDEN
      );
  }

  private async checkIfStudentIsAlreadyAssignedToRoom(
    enrollment: string,
    roomNumber: number
  ) {
    const student = await Database.rawQuery(
      `
        SELECT * FROM
            students_rooms
        WHERE
            student_enrollment = ?
        AND
            room_number = ?
    `,
      [enrollment, roomNumber]
    );

    if (student.length > 0)
      throw new Exception(
        "Student is already assigned to this room",
        httpStatus.BAD_REQUEST
      );
  }

  private async checkRoomCapacity(roomId: number) {
    const room = await Room.findBy("number", roomId);
    if (!room) throw new Exception("Room not found", httpStatus.NOT_FOUND);
    const a = await Room.query().where("number", roomId);

    const studentsOnRoom = await Database.from("students_rooms")
      .select("*")
      .where("room_number", roomId);

    console.log(a, studentsOnRoom);

    if (studentsOnRoom.length + 1 > room.capacity)
      throw new Exception("Room is full", httpStatus.BAD_REQUEST);
  }

  private async checkIdParams(id: string) {
    if (!id)
      throw new Exception("Missing room number param", httpStatus.BAD_REQUEST);
  }
}
