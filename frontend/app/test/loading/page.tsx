async function SlowData() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return "Data loaded after 3 seconds!";
}

export default async function TestLoadingPage() {
  const data = await SlowData();
  return <div>{data}</div>;
}
