import * as bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import { ResolverMap } from "../../types/graphql-utils";
import { confirmEmailError, invalidLogin } from "./errorMessages";

const errorRasponse = [
  {
    path: "email",
    message: invalidLogin
  }
];

export const resolvers: ResolverMap = {
  Query: {
    bye2: () => "bye"
  },
  Mutation: {
    login: async (
      _,
      { email, password }: GQL.ILoginOnMutationArguments,
      { session }
    ) => {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return errorRasponse;
      }

      if (!user.confirmed) {
        return [
          {
            path: "email",
            message: confirmEmailError
          }
        ];
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return errorRasponse;
      }

      session.userId = user.id;

      return null;
    }
  }
};
