"use client"
import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import {
  Bold, Italic, Underline as UnderlineIcon,
  List, ListOrdered, Quote, Code, LinkIcon, Heading1, Heading2, ImagePlus
} from "lucide-react"
import { Button } from "@/components/ui/button"

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null
  }

  const addImage = () => {
    const url = window.prompt('Image URL')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)
    
    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-card p-2">
      <Button
        variant="ghost" size="sm" className="h-8 w-8 p-0"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        data-active={editor.isActive('bold') ? 'is-active' : undefined}
      >
        <Bold className={`h-4 w-4 ${editor.isActive('bold') ? 'text-primary' : ''}`} />
      </Button>
      <Button
        variant="ghost" size="sm" className="h-8 w-8 p-0"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
      >
        <Italic className={`h-4 w-4 ${editor.isActive('italic') ? 'text-primary' : ''}`} />
      </Button>
      <Button
        variant="ghost" size="sm" className="h-8 w-8 p-0"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleUnderline().run(); }}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className={`h-4 w-4 ${editor.isActive('underline') ? 'text-primary' : ''}`} />
      </Button>
      
      <div className="mx-1 h-6 w-px bg-border" />
      
      <Button
        variant="ghost" size="sm" className="h-8 w-8 p-0"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 1 }).run(); }}
      >
        <Heading1 className={`h-4 w-4 ${editor.isActive('heading', { level: 1 }) ? 'text-primary' : ''}`} />
      </Button>
      <Button
        variant="ghost" size="sm" className="h-8 w-8 p-0"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}
      >
        <Heading2 className={`h-4 w-4 ${editor.isActive('heading', { level: 2 }) ? 'text-primary' : ''}`} />
      </Button>

      <div className="mx-1 h-6 w-px bg-border" />

      <Button
        variant="ghost" size="sm" className="h-8 w-8 p-0"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
      >
        <List className={`h-4 w-4 ${editor.isActive('bulletList') ? 'text-primary' : ''}`} />
      </Button>
      <Button
        variant="ghost" size="sm" className="h-8 w-8 p-0"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
      >
        <ListOrdered className={`h-4 w-4 ${editor.isActive('orderedList') ? 'text-primary' : ''}`} />
      </Button>
      <Button
        variant="ghost" size="sm" className="h-8 w-8 p-0"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run(); }}
      >
        <Quote className={`h-4 w-4 ${editor.isActive('blockquote') ? 'text-primary' : ''}`} />
      </Button>
      <Button
        variant="ghost" size="sm" className="h-8 w-8 p-0"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleCodeBlock().run(); }}
      >
        <Code className={`h-4 w-4 ${editor.isActive('codeBlock') ? 'text-primary' : ''}`} />
      </Button>

      <div className="mx-1 h-6 w-px bg-border" />

      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => { e.preventDefault(); setLink(); }}>
        <LinkIcon className={`h-4 w-4 ${editor.isActive('link') ? 'text-primary' : ''}`} />
      </Button>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => { e.preventDefault(); addImage(); }}>
        <ImagePlus className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default function RichTextEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] leading-relaxed',
      },
    },
  })

  // Prevent circular updates by checking if editor content matches props content
  useEffect(() => {
    if (editor && content !== undefined) {
      if (editor.getHTML() !== content) {
        // Handle case where Draft loaded content on mount
        editor.commands.setContent(content)
      }
    }
  }, [editor])

  return (
    <div className="text-foreground mt-8">
      <MenuBar editor={editor} />
      <div className="mt-4 border-0">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
