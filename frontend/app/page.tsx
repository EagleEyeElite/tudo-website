import Container from '@/components/ui/container';
import MoreStories from '@/components/blocks/more-stories';
import HeroPost from '@/components/blocks/hero-post';
import Provider from "@/components/blocks/provider";
import Banner from "@/components/blocks/banner-server";

export const experimental_ppr = true

export default async function Home() {
  return <Provider>
    <Banner />
    <Container>
      <HeroPost/>
      <MoreStories/>
    </Container>
  </Provider>;
}
