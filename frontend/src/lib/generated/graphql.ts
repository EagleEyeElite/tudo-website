/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { GraphQLClient, type RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** Identifier types for retrieving a specific Post. Specifies which unique attribute is used to find an exact Post. */
export enum PostIdType {
  /** Identify a resource by the Database ID. */
  DatabaseId = 'DATABASE_ID',
  /** Identify a resource by the (hashed) Global ID. */
  Id = 'ID',
  /** Identify a resource by the slug. Available to non-hierarchcial Types where the slug is a unique identifier. */
  Slug = 'SLUG',
  /** Identify a resource by the URI. */
  Uri = 'URI'
}

type AuthorDetailsFields_MediaItem_Fragment = { author: { node: { name: string | null, firstName: string | null, lastName: string | null, avatar: { url: string | null } | null } } | null };

type AuthorDetailsFields_Page_Fragment = { author: { node: { name: string | null, firstName: string | null, lastName: string | null, avatar: { url: string | null } | null } } | null };

type AuthorDetailsFields_Post_Fragment = { author: { node: { name: string | null, firstName: string | null, lastName: string | null, avatar: { url: string | null } | null } } | null };

export type AuthorDetailsFieldsFragment =
  | AuthorDetailsFields_MediaItem_Fragment
  | AuthorDetailsFields_Page_Fragment
  | AuthorDetailsFields_Post_Fragment
;

type FeaturedImageFields_Page_Fragment = { featuredImage: { node: { sourceUrl: string | null } } | null };

type FeaturedImageFields_Post_Fragment = { featuredImage: { node: { sourceUrl: string | null } } | null };

export type FeaturedImageFieldsFragment =
  | FeaturedImageFields_Page_Fragment
  | FeaturedImageFields_Post_Fragment
;

type ContentFields_MediaItem_Fragment = { slug: string | null, date: string | null };

type ContentFields_Page_Fragment = { title: string | null, content: string | null, slug: string | null, date: string | null, featuredImage: { node: { sourceUrl: string | null } } | null };

type ContentFields_Post_Fragment = { title: string | null, excerpt: string | null, slug: string | null, date: string | null, featuredImage: { node: { sourceUrl: string | null } } | null, author: { node: { name: string | null, firstName: string | null, lastName: string | null, avatar: { url: string | null } | null } } | null };

export type ContentFieldsFragment =
  | ContentFields_MediaItem_Fragment
  | ContentFields_Page_Fragment
  | ContentFields_Post_Fragment
;

export type PostFieldsFragment = { title: string | null, excerpt: string | null, slug: string | null, date: string | null, categories: { nodes: Array<{ name: string | null }> } | null, tags: { nodes: Array<{ name: string | null }> } | null, featuredImage: { node: { sourceUrl: string | null } } | null, author: { node: { name: string | null, firstName: string | null, lastName: string | null, avatar: { url: string | null } | null } } | null };

export type PreviewPostQueryVariables = Exact<{
  id: string | number;
  idType: PostIdType;
}>;


export type PreviewPostQuery = { post: { databaseId: number, slug: string | null, status: string | null } | null };

export type GetAllPostsWithSlugQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllPostsWithSlugQuery = { posts: { nodes: Array<{ slug: string | null }> } | null };

export type GetAllParentPagesAsSlugQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllParentPagesAsSlugQuery = { pages: { nodes: Array<{ slug: string | null }> } | null };

export type PageDetailsByTitleQueryVariables = Exact<{
  title: string;
}>;


export type PageDetailsByTitleQuery = { pages: { nodes: Array<{ id: string, title: string | null, content: string | null, slug: string | null, date: string | null, parent: { node:
          | { __typename: 'MediaItem', slug: string | null }
          | { __typename: 'Page', title: string | null, slug: string | null }
          | { __typename: 'Post', slug: string | null }
         } | null, featuredImage: { node: { sourceUrl: string | null } } | null }> } | null };

export type AllPostsAndWelcomePageQueryVariables = Exact<{ [key: string]: never; }>;


export type AllPostsAndWelcomePageQuery = { welcomePage: { nodes: Array<{ children: { nodes: Array<
          | { __typename: 'MediaItem', slug: string | null, date: string | null }
          | { __typename: 'Page', title: string | null, content: string | null, slug: string | null, date: string | null, featuredImage: { node: { sourceUrl: string | null } } | null }
          | { __typename: 'Post', title: string | null, excerpt: string | null, slug: string | null, date: string | null, featuredImage: { node: { sourceUrl: string | null } } | null, author: { node: { name: string | null, firstName: string | null, lastName: string | null, avatar: { url: string | null } | null } } | null }
        > } | null }> } | null, latestPosts: { nodes: Array<{ title: string | null, excerpt: string | null, slug: string | null, date: string | null, featuredImage: { node: { sourceUrl: string | null } } | null, author: { node: { name: string | null, firstName: string | null, lastName: string | null, avatar: { url: string | null } | null } } | null }> } | null };

export type DraftPostBySlugQueryVariables = Exact<{
  id: string | number;
}>;


export type DraftPostBySlugQuery = { post: { content: string | null, title: string | null, excerpt: string | null, slug: string | null, date: string | null, categories: { nodes: Array<{ name: string | null }> } | null, tags: { nodes: Array<{ name: string | null }> } | null, featuredImage: { node: { sourceUrl: string | null } } | null, author: { node: { name: string | null, firstName: string | null, lastName: string | null, avatar: { url: string | null } | null } } | null } | null };

export type PublishedPostAndMorePostsQueryVariables = Exact<{
  slug: string | number;
}>;


export type PublishedPostAndMorePostsQuery = { post: { content: string | null, title: string | null, excerpt: string | null, slug: string | null, date: string | null, revisions: { nodes: Array<{ content: string | null, title: string | null, excerpt: string | null, slug: string | null, date: string | null, featuredImage: { node: { sourceUrl: string | null } } | null, author: { node: { name: string | null, firstName: string | null, lastName: string | null, avatar: { url: string | null } | null } } | null }> } | null, categories: { nodes: Array<{ name: string | null }> } | null, tags: { nodes: Array<{ name: string | null }> } | null, featuredImage: { node: { sourceUrl: string | null } } | null, author: { node: { name: string | null, firstName: string | null, lastName: string | null, avatar: { url: string | null } | null } } | null } | null, posts: { nodes: Array<{ title: string | null, excerpt: string | null, slug: string | null, date: string | null, categories: { nodes: Array<{ name: string | null }> } | null, tags: { nodes: Array<{ name: string | null }> } | null, featuredImage: { node: { sourceUrl: string | null } } | null, author: { node: { name: string | null, firstName: string | null, lastName: string | null, avatar: { url: string | null } | null } } | null }> } | null };

export type UnpublishedPostsQueryVariables = Exact<{ [key: string]: never; }>;


export type UnpublishedPostsQuery = { posts: { nodes: Array<{ id: string, title: string | null, slug: string | null, status: string | null }> } | null };

export type GetGraphQlTokenMutationVariables = Exact<{
  username: string;
  password: string;
}>;


export type GetGraphQlTokenMutation = { login: { refreshToken: string | null } | null };

export type ChildPagesByParentIdQueryVariables = Exact<{
  parentId: string | number;
}>;


export type ChildPagesByParentIdQuery = { pages: { nodes: Array<{ id: string, title: string | null, content: string | null, slug: string | null, date: string | null, featuredImage: { node: { sourceUrl: string | null } } | null }> } | null };

export type FetchMediaItemsWithBackgroundSetQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchMediaItemsWithBackgroundSetQuery = { mediaItems: { nodes: Array<{ mediaItemUrl: string | null }> } | null };

export const FeaturedImageFieldsFragmentDoc = gql`
    fragment FeaturedImageFields on NodeWithFeaturedImage {
  featuredImage {
    node {
      sourceUrl
    }
  }
}
    `;
export const AuthorDetailsFieldsFragmentDoc = gql`
    fragment AuthorDetailsFields on NodeWithAuthor {
  author {
    node {
      name
      firstName
      lastName
      avatar {
        url
      }
    }
  }
}
    `;
export const ContentFieldsFragmentDoc = gql`
    fragment ContentFields on ContentNode {
  slug
  date
  ... on Page {
    title
    content
    ...FeaturedImageFields
  }
  ... on Post {
    title
    excerpt
    ...FeaturedImageFields
    ...AuthorDetailsFields
  }
}
    ${FeaturedImageFieldsFragmentDoc}
${AuthorDetailsFieldsFragmentDoc}`;
export const PostFieldsFragmentDoc = gql`
    fragment PostFields on Post {
  ...ContentFields
  categories {
    nodes {
      name
    }
  }
  tags {
    nodes {
      name
    }
  }
}
    ${ContentFieldsFragmentDoc}`;
export const PreviewPostDocument = gql`
    query PreviewPost($id: ID!, $idType: PostIdType!) {
  post(id: $id, idType: $idType) {
    databaseId
    slug
    status
  }
}
    `;
export const GetAllPostsWithSlugDocument = gql`
    query GetALLPostsWithSlug {
  posts(first: 10000) {
    nodes {
      slug
    }
  }
}
    `;
export const GetAllParentPagesAsSlugDocument = gql`
    query GetAllParentPagesAsSlug {
  pages(first: 10000, where: {parentIn: ""}) {
    nodes {
      slug
    }
  }
}
    `;
export const PageDetailsByTitleDocument = gql`
    query PageDetailsByTitle($title: String!) {
  pages(where: {name: $title}) {
    nodes {
      id
      ...ContentFields
      parent {
        node {
          __typename
          slug
          ... on Page {
            title
          }
        }
      }
    }
  }
}
    ${ContentFieldsFragmentDoc}`;
export const AllPostsAndWelcomePageDocument = gql`
    query AllPostsAndWelcomePage {
  welcomePage: pages(where: {name: "about-us"}, first: 1) {
    nodes {
      children(first: 1, where: {orderby: {field: MENU_ORDER, order: ASC}}) {
        nodes {
          __typename
          ...ContentFields
        }
      }
    }
  }
  latestPosts: posts(
    first: 100
    where: {orderby: {field: DATE, order: DESC}, stati: [PUBLISH, FUTURE]}
  ) {
    nodes {
      ...ContentFields
    }
  }
}
    ${ContentFieldsFragmentDoc}`;
export const DraftPostBySlugDocument = gql`
    query DraftPostBySlug($id: ID!) {
  post(id: $id, idType: DATABASE_ID) {
    ...PostFields
    content
  }
}
    ${PostFieldsFragmentDoc}`;
export const PublishedPostAndMorePostsDocument = gql`
    query PublishedPostAndMorePosts($slug: ID!) {
  post(id: $slug, idType: SLUG) {
    ...PostFields
    content
    revisions(first: 1, where: {orderby: {field: MODIFIED, order: DESC}}) {
      nodes {
        ...ContentFields
        content
      }
    }
  }
  posts(
    first: 4
    where: {orderby: {field: DATE, order: DESC}, stati: [PUBLISH, FUTURE]}
  ) {
    nodes {
      ...PostFields
    }
  }
}
    ${PostFieldsFragmentDoc}
${ContentFieldsFragmentDoc}`;
export const UnpublishedPostsDocument = gql`
    query UnpublishedPosts {
  posts(first: 100, where: {status: PRIVATE}) {
    nodes {
      id
      title
      slug
      status
    }
  }
}
    `;
export const GetGraphQlTokenDocument = gql`
    mutation GetGraphQLToken($username: String!, $password: String!) {
  login(
    input: {clientMutationId: "uniqueId", username: $username, password: $password}
  ) {
    refreshToken
  }
}
    `;
export const ChildPagesByParentIdDocument = gql`
    query ChildPagesByParentId($parentId: ID!) {
  pages(where: {parent: $parentId, orderby: {field: MENU_ORDER, order: ASC}}) {
    nodes {
      id
      ...ContentFields
    }
  }
}
    ${ContentFieldsFragmentDoc}`;
export const FetchMediaItemsWithBackgroundSetDocument = gql`
    query FetchMediaItemsWithBackgroundSet {
  mediaItems(
    where: {metaQuery: {metaArray: {key: "use-for-landing-page-hero-banner", value: "1"}}}
  ) {
    nodes {
      mediaItemUrl
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    PreviewPost(variables: PreviewPostQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<PreviewPostQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PreviewPostQuery>({ document: PreviewPostDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'PreviewPost', 'query', variables);
    },
    GetALLPostsWithSlug(variables?: GetAllPostsWithSlugQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetAllPostsWithSlugQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAllPostsWithSlugQuery>({ document: GetAllPostsWithSlugDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetALLPostsWithSlug', 'query', variables);
    },
    GetAllParentPagesAsSlug(variables?: GetAllParentPagesAsSlugQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetAllParentPagesAsSlugQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAllParentPagesAsSlugQuery>({ document: GetAllParentPagesAsSlugDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetAllParentPagesAsSlug', 'query', variables);
    },
    PageDetailsByTitle(variables: PageDetailsByTitleQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<PageDetailsByTitleQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PageDetailsByTitleQuery>({ document: PageDetailsByTitleDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'PageDetailsByTitle', 'query', variables);
    },
    AllPostsAndWelcomePage(variables?: AllPostsAndWelcomePageQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AllPostsAndWelcomePageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AllPostsAndWelcomePageQuery>({ document: AllPostsAndWelcomePageDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AllPostsAndWelcomePage', 'query', variables);
    },
    DraftPostBySlug(variables: DraftPostBySlugQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DraftPostBySlugQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DraftPostBySlugQuery>({ document: DraftPostBySlugDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DraftPostBySlug', 'query', variables);
    },
    PublishedPostAndMorePosts(variables: PublishedPostAndMorePostsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<PublishedPostAndMorePostsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PublishedPostAndMorePostsQuery>({ document: PublishedPostAndMorePostsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'PublishedPostAndMorePosts', 'query', variables);
    },
    UnpublishedPosts(variables?: UnpublishedPostsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UnpublishedPostsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<UnpublishedPostsQuery>({ document: UnpublishedPostsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UnpublishedPosts', 'query', variables);
    },
    GetGraphQLToken(variables: GetGraphQlTokenMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetGraphQlTokenMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetGraphQlTokenMutation>({ document: GetGraphQlTokenDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetGraphQLToken', 'mutation', variables);
    },
    ChildPagesByParentId(variables: ChildPagesByParentIdQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ChildPagesByParentIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ChildPagesByParentIdQuery>({ document: ChildPagesByParentIdDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ChildPagesByParentId', 'query', variables);
    },
    FetchMediaItemsWithBackgroundSet(variables?: FetchMediaItemsWithBackgroundSetQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<FetchMediaItemsWithBackgroundSetQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<FetchMediaItemsWithBackgroundSetQuery>({ document: FetchMediaItemsWithBackgroundSetDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'FetchMediaItemsWithBackgroundSet', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;