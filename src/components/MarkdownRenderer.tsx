'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import 'highlight.js/styles/github.css'

interface MarkdownRendererProps {
    content: string
    className?: string
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
    return (
        <div className={`markdown-content ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeRaw]}
                components={{          // Custom styling for code blocks
                    code: ({ className, children, ...props }: any) => {
                        const match = /language-(\w+)/.exec(className || '')
                        const isCodeBlock = match && typeof children === 'string'

                        return isCodeBlock ? (
                            <div className="relative my-4">
                                <div className="bg-gray-800 text-gray-300 px-3 py-1 text-xs font-medium rounded-t-lg border-b border-gray-600">
                                    {match[1].toUpperCase()}
                                </div>
                                <pre className="bg-gray-900 text-gray-100 rounded-b-lg p-4 overflow-x-auto">
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                </pre>
                            </div>
                        ) : (
                            <code
                                className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono border"
                                {...props}
                            >
                                {children}
                            </code>
                        )
                    },          // Custom styling for headings
                    h1: ({ children }) => (
                        <h1 className="text-lg font-bold mb-2 text-gray-900 first:mt-0">{children}</h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-md font-semibold mb-2 text-gray-900 first:mt-0">{children}</h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-sm font-medium mb-1 text-gray-900 first:mt-0">{children}</h3>
                    ),// Custom styling for paragraphs
                    p: ({ children }) => (
                        <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
                    ),
                    // Custom styling for lists
                    ul: ({ children }) => (
                        <ul className="list-disc list-inside mb-2 last:mb-0 space-y-1 ml-2">{children}</ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="list-decimal list-inside mb-2 last:mb-0 space-y-1 ml-2">{children}</ol>
                    ),          // Custom styling for blockquotes
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-gray-300 pl-3 italic my-2 text-gray-700 bg-gray-50 py-2 rounded-r">
                            {children}
                        </blockquote>
                    ),
                    // Custom styling for tables
                    table: ({ children }) => (
                        <div className="overflow-x-auto my-4">
                            <table className="min-w-full border border-gray-300 rounded-lg">
                                {children}
                            </table>
                        </div>
                    ),
                    th: ({ children }) => (
                        <th className="border border-gray-300 px-3 py-2 bg-gray-50 font-semibold text-left">
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="border border-gray-300 px-3 py-2">{children}</td>
                    ),
                    // Custom styling for links
                    a: ({ children, href }) => (
                        <a
                            href={href}
                            className="text-blue-600 hover:text-blue-800 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {children}
                        </a>
                    ),
                    // Custom styling for strong/bold text
                    strong: ({ children }) => (
                        <strong className="font-semibold text-gray-900">{children}</strong>
                    ),
                    // Custom styling for emphasis/italic text
                    em: ({ children }) => (
                        <em className="italic text-gray-700">{children}</em>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}
