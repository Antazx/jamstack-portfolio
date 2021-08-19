import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";

const root = process.cwd();

export const getFiles = () => fs.readdirSync(path.join(root, "data"));
export const getFilesBySlug = async ( slug ) => {
	const mdxSource = fs.readFileSync(path.join(root, "data", `${slug}.mdx`), "utf-8");
	const { data, content } = await matter(mdxSource);
	//If at some point we need to add code to our mdx we can use mdxPrism to format it
	//In this situation we need to pass the plugin to serlize
	const source = await serialize(content, {});
	return {
		source,
		frontMatter: {
			slug,
			...data
		}
	};
};
export const getAllFilesMetadata = async () => {
	const files = getFiles();
	return files.reduce((allPosts, currentPost) => {
		const mdxSource = fs.readFileSync(path.join(root, "data", currentPost), "utf-8");
		const { data } = matter(mdxSource);

		return [
			{
				...data,
				slug: currentPost.replace(".mdx", "")
			},
			...allPosts
		];
	}, []);
};
