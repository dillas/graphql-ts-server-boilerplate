import { request } from "graphql-request";
import { User } from "../../entity/User";
import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongNough
} from "./errorMessages";
import { createTypeormConn } from "../../utils/createTypeormConn";

const email = "tom@bob.com";
const password = "dillas";

const mutation = (e: string, p: string) => `
mutation {
  register(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

beforeAll(async () => {
  await createTypeormConn();
});

describe("Register user", async () => {
  it("check for duplicate emails", async () => {
    const respons = await request(
      process.env.TEST_HOST as string,
      mutation(email, password)
    );
    expect(respons).toEqual({ register: null });
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);

    const respons2: any = await request(
      process.env.TEST_HOST as string,
      mutation(email, password)
    );
    expect(respons2.register).toHaveLength(1);
    expect(respons2.register[0]).toEqual({
      path: "email",
      message: duplicateEmail
    });
  });

  it("cath bad email", async () => {
    const respons3: any = await request(
      process.env.TEST_HOST as string,
      mutation("b", password)
    );
    expect(respons3).toEqual({
      register: [
        {
          path: "email",
          message: emailNotLongEnough
        },
        {
          path: "email",
          message: invalidEmail
        }
      ]
    });
  });

  it("cath bad password", async () => {
    const respons4: any = await request(
      process.env.TEST_HOST as string,
      mutation(email, "ad")
    );
    expect(respons4).toEqual({
      register: [
        {
          path: "password",
          message: passwordNotLongNough
        }
      ]
    });
  });

  it("cath bad password and bad email", async () => {
    const respons5: any = await request(
      process.env.TEST_HOST as string,
      mutation("ad", "ad")
    );
    expect(respons5).toEqual({
      register: [
        {
          path: "email",
          message: emailNotLongEnough
        },
        {
          path: "email",
          message: invalidEmail
        },
        {
          path: "password",
          message: passwordNotLongNough
        }
      ]
    });
  });
});
