import {GraphQLClient} from "graphql-request";
import {getInitializedSdk} from "../../lib/api";

const sdk = getInitializedSdk();


describe('GraphQlQuery', () => {
  it('should do something', async () => {
    const data = await sdk.GetALLPostsWithSlug();
    expect(data).toBeDefined();
    expect(data?.posts).toBeDefined();
    return data?.posts;
  })
  it('should query unpublished posts', async () => {
    const data = await sdk.UnpublishedPosts();
    expect(data).toBeDefined();
    expect(data?.posts).toBeDefined();
    return data?.posts;
  })
  it('should return a refreshToken when provided with valid credentials', async () => {
    const {WORDPRESS_ADMIN_USER, WORDPRESS_ADMIN_PASSWORD } = process.env;
    const data = await sdk.GetGraphQLToken({
      username: WORDPRESS_ADMIN_USER as string,
      password: WORDPRESS_ADMIN_PASSWORD as string
    });
    const token = data.login?.refreshToken;

    // Assert that the refreshToken is returned
    expect(token).toBeDefined();
  });
})
