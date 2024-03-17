import {GraphQLClient} from "graphql-request";
import {getSdk} from "../../lib/generated/graphql";

const API_URL = process.env.WORDPRESS_API_URL || ""
const client = new GraphQLClient(API_URL);
const sdk = getSdk(client);

describe('GraphQlQuery', () => {
  it('should do something', async () => {
    const data = await sdk.GetALLPostsWithSlug2();
    expect(data).toBeDefined();
    expect(data?.posts).toBeDefined();
    return data?.posts;
  })
})
