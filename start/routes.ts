import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.resource("rooms", "RoomsController")
    .except(["index"])
    .middleware({ "*": "teacherAuth" })
    .apiOnly();
  Route.resource("teachers", "TeachersController").except(["index"]).apiOnly();
  Route.resource("students", "StudentsController").except(["index"]).apiOnly();
  Route.resource("rooms.students", "StudentsRoomController")
    .except(["show", "update"])
    .middleware({ "*": "teacherAuth" })
    .apiOnly();
  Route.get("students/:enrollment/info", "StudentsController.getStudentInfo");
}).prefix("/api/");
