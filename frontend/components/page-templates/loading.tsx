import Layout from "../layout/layout";
import PostTitle from "../blocks/post-title";
import Container from "../ui/container";
import {ActivityIndicatorState} from "lib/api/activityIndicator";



const Loading = (activityState: ActivityIndicatorState) => {
  return (
    <Layout activityIndicator={activityState} preview={false}>
      <Container>
        <PostTitle>Loading…</PostTitle>
      </Container>
    </Layout>
  );
};

export default Loading;
