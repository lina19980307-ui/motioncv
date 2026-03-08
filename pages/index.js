import { defaultPublishedSlug } from "../data/defaultResumeTemplate";

export default function Home() {
  return null;
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: `/resume/${defaultPublishedSlug}?lang=en`,
      permanent: false,
    },
  };
}
