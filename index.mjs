import { ApolloServer, gql } from 'apollo-server';


const typeDefs = gql`
    type Query
    {
        cached: Float
        notCached: Float
    }
`;

const resolvers =
{
    Query:
    {
        cached: (obj, args, ctx) =>
        {
            console.log('Generating a random number to be cached');
            ctx.expiresIn(60);
            return Math.random();
        },
        notCached: Math.random
    },
};

const server = new ApolloServer(
    {
        typeDefs,
        resolvers,
        csrfPrevention: false,
        context({res})
        {
            return {
                expiresIn(seconds)
                {
                    res.setHeader('Expires', new Date(Date.now() + (seconds * 1000)).toUTCString())
                }
            }
        }
    }
);

server.listen({port: 4000}).then(({ url }) => { console.log(`Server ready at ${url}`); });