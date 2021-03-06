import { Connection } from "typeorm";
import { User } from "../../entity/User";
import { confirmEmailError, invalidLogin } from "./errorMessages";
import { TestClient } from "../../utils/TestClient";
import { createTestConn } from "../../testUtils/createTestConn";

const email = "tom@bob.com";
const password = "jalksdf";

const loginExpectError = async (client: TestClient, e: string, p: string, errMsg: string) => {
  const response = await client.login(e, p);

  expect(response.data).toEqual({
    login: [
      {
        path: "email",
        message: errMsg
      }
    ]
  });
};

let conn: Connection;
beforeAll(async () => {
  conn = await createTestConn();
});

afterAll(async () => {
  conn.close();
});

describe("login", () => {
  test("email not found send back error", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    await loginExpectError(client, "bob@bob.com", "whatever", invalidLogin);
  });

  test("email not confirmed", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    await client.register(email, password);

    await loginExpectError(client, email, password, confirmEmailError);

    await User.update({ email }, { confirmed: true });

    await loginExpectError(client, email, "afsdfsdfsfdsdf", invalidLogin);

    const response = await client.login(email, password);

    expect(response.data).toEqual({ login: null });
  });
});
