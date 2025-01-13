import Providers from "@/components/blocks/providers";
import Banner from "@/components/blocks/banner-server";
import Container from "@/components/ui/container";
import HeroPost from "@/components/blocks/hero-post";
import MoreStories from "@/components/blocks/more-stories";

export const revalidate = 1

export default function Home() {
  return (
    <Providers>
      <Banner />
      <Container>
        <HeroPost />
        <MoreStories home={true} />
      </Container>
    </Providers>
  );
}
