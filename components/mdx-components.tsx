// mdx-components.tsx
import type { MDXComponents } from 'mdx/types';

import Link from 'next/link'; // For Next.js optimized links

// This file allows you to provide custom components
// to be used in MDX files.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Headings
    h1: ({ children, ...props }) => (
      <h1 className="mt-2 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight" {...props}>
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4 className="mt-6 scroll-m-20 text-lg font-semibold tracking-tight" {...props}>
        {children}
      </h4>
    ),
    // Paragraph
    p: ({ children, ...props }) => (
      <p className="leading-7 [&:not(:first-child)]:mt-6" {...props}>
        {children}
      </p>
    ),
    // Lists
    ul: ({ children, ...props }) => (
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="my-6 ml-6 list-decimal [&>li]:mt-2" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => <li {...props}>{children}</li>,
    // Links
    a: ({ children, href, ...props }) => {
      if (href && href.startsWith('/')) {
        return (
          <Link href={href} className="font-medium text-primary underline underline-offset-4" {...props}>
            {children}
          </Link>
        );
      }
      if (href && href.startsWith('#')) {
        return <a href={href} className="font-medium text-primary underline underline-offset-4" {...props}>{children}</a>;
      }
      return (
        <a href={href} className="font-medium text-primary underline underline-offset-4" target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      );
    },
    // Blockquotes
    blockquote: ({ children, ...props }) => (
      <blockquote className="mt-6 border-l-2 pl-6 italic" {...props}>
        {children}
      </blockquote>
    ),
    // Inline Code
    code: ({ children, ...props }) => (
      <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold" {...props}>
        {children}
      </code>
    ),
    // Preformatted Code Blocks
    pre: ({ children, ...props }) => (
      <pre className="my-6 overflow-x-auto rounded-lg border bg-muted p-4 font-mono text-sm" {...props}>
        {children}
      </pre>
    ),
    // Images (using next/image for optimization if desired, otherwise basic img)
    // img: (props) => <Image {...(props as ImageProps)} alt={props.alt || ''} />, // Example with next/image
    img: ({ alt, ...props }) => ( // Basic img tag
      <img alt={alt || "MDX image"} className="my-6 rounded-md border" {...props} />
    ),
    // Horizontal Rule
    hr: ({ ...props }) => <hr className="my-4 md:my-8" {...props} />,
    // Table
    table: ({ children, ...props }) => (
      <div className="my-6 w-full overflow-y-auto">
        <table className="w-full" {...props}>{children}</table>
      </div>
    ),
    thead: ({ children, ...props }) => <thead {...props}>{children}</thead>,
    tbody: ({ children, ...props }) => <tbody {...props}>{children}</tbody>,
    tr: ({ children, ...props }) => <tr className="m-0 border-t p-0 even:bg-muted" {...props}>{children}</tr>,
    th: ({ children, ...props }) => (
      <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right" {...props}>
        {children}
      </td>
    ),
    // Pass through any other components
    ...components,
  };
}
