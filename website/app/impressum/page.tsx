import { Metadata } from 'next'
import Content from './message.mdx'
import {CustomLink} from "../../components/links";
import {compile} from "@mdx-js/mdx";
import remarkFrontmatter from "remark-frontmatter";
import fs from 'node:fs/promises'

export const metadata: Metadata = {
  title: 'My Page Title',
}

export default async function Page() {
  console.log(
    await compile(await fs.readFile('./app/impressum/message.mdx'), {
      remarkPlugins: [remarkFrontmatter]
    })
  )

  return <main>
    <CustomLink link={{text: "Öffnungszeiten", highlighted: true}}/>
    <Content/>
  </main>
}
