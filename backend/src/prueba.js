import UsersModel from "./conecSql.js";

console.log("Prueba");

console.log(
  await UsersModel.createUser({
    name: "Juan Amti",
    phoneNumber: "1234567890",
    email: "juan.perez@example.com",
    password: "ll11",
  })
);
