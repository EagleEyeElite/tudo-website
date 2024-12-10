'use cache'
import Provider from "@/components/blocks/provider";
import Banner from "@/components/blocks/banner-server";
import Container from "@/components/ui/container";
import HeroPost from "@/components/blocks/hero-post";
import MoreStories from "@/components/blocks/more-stories";

export default async function Home() {
  return <Provider>
    <Banner/>
    <Container>
      <HeroPost/>
      <MoreStories/>
    </Container>
  </Provider>;
}
