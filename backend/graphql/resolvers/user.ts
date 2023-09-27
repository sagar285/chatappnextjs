import { CreateUsernameResponse, GraphQLContext } from "../../util/types";

const resolvers = {
  Query: {
    searchUsers: () => {},
  },

  Mutation: {
    createUsername:async(
      _: any,
      args: { username: string },
      context: GraphQLContext
    ):Promise<CreateUsernameResponse> => {
      const { username } = args;
      const {session,prisma} =context;
      console.log(session)
      if(!session?.user){
        return {
          error:"Not authorized"
        }
      }

      const {id:userId} =session.user;

      try {

        //  check that username is not already taken
        const existingUser =await prisma.user.findUnique(
          {
            where:{
              username,
            }
          }
        );
        
        if(existingUser){
          return {
            error:"username already taken. Try another",
          }
        }

        await prisma.user.update({
          where:{
            id:userId
          },
          data:{
            username,
          }
        })
        return {success:true};
      } catch (error) {
        console.log("create username error",error)
        return {error:"user create error",}
      }

    },
  },
};

export default resolvers;
