import { z, defineCollection } from "astro:content";

const blog = defineCollection({
	schema: z.object({
		title: z.string(),
		publishDate: z.date(),
		tags: z.array(z.string()),
		summary: z.string(),
	})
})

export const collections = {
	blog
}
