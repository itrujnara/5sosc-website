import { readdir, readFile } from "fs/promises"
import path from "path"
import matter from "gray-matter"

export interface Post {
  slug: string
  key: string
  title: string
  description: string
  date: string
  image: string
  audio?: string
  video?: string
  sense: string
  content?: string
}

// Fetch all posts for a given category and locale
export async function getPostsByCategory(
  locale: string,
  category: string
): Promise<Array<Promise<Post>>> {
  const directory = path.join(process.cwd(), "src", "content", locale, category)
  const files = await readdir(directory)

  return files.map(async (filename: string) => {
    const filePath = path.join(directory, filename)
    const fileContents = await readFile(filePath, "utf-8")
    const { data } = matter(fileContents)

    return {
      slug: filename.replace(".md", ""),
      key: data.key,
      title: data.title,
      description: data.description,
      date: data.date,
      image: data.image,
      audio: data.audio,
      video: data.video,
      sense: data.sense,
    } as Post
  })
}

// Fetch a single post by slug
export async function getPost(
  locale: string,
  category: string,
  key: string
): Promise<Post | null> {
  const posts = await Promise.all(await getPostsByCategory(locale, category))
  const post = posts.find((p) => p.key === key)
  if (!post) return null
  const filePath = path.join(
    process.cwd(),
    "src",
    "content",
    locale,
    category,
    `${post!.slug}.md`
  )
  const fileContents = await readFile(filePath, "utf-8")
  const { data, content } = matter(fileContents)

  return {
    key: data.key,
    title: data.title,
    description: data.description,
    date: data.date,
    image: data.image,
    audio: data.audio,
    video: data.video,
    sense: data.sense,
    content,
  } as Post
}
