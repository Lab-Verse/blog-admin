'use client'

import { EditorContent, EditorContext, useEditor } from '@tiptap/react'
import * as React from 'react'

// --- Tiptap Core Extensions ---
import { Highlight } from '@tiptap/extension-highlight'
import { Image } from '@tiptap/extension-image'
import { Subscript } from '@tiptap/extension-subscript'
import { Superscript } from '@tiptap/extension-superscript'
import { TaskItem } from '@tiptap/extension-task-item'
import { TaskList } from '@tiptap/extension-task-list'
import { Text } from '@tiptap/extension-text'
import { TextAlign } from '@tiptap/extension-text-align'
import { Typography } from '@tiptap/extension-typography'
import { Underline } from '@tiptap/extension-underline'
import { StarterKit } from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

// --- Custom Extensions ---
import { Link } from '@/components/tiptap-extension/link-extension'
import { Selection } from '@/components/tiptap-extension/selection-extension'
import { TrailingNode } from '@/components/tiptap-extension/trailing-node-extension'
import { OnlyOneHeading, SingleHeadingDocument } from '@/components/tiptap-extension/single-heading-document'
import { SingleImageDocument } from '@/components/tiptap-extension/single-image-document'

// --- UI Primitives ---
import { Button } from '@/components/tiptap-ui-primitive/button'
import { Spacer } from '@/components/tiptap-ui-primitive/spacer'
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '@/components/tiptap-ui-primitive/toolbar'

// --- Tiptap Node ---
import '@/components/tiptap-node/image-node/image-node.scss'
import { ImageUploadNode } from '@/components/tiptap-node/image-upload-node/image-upload-node-extension'
import '@/components/tiptap-node/paragraph-node/paragraph-node.scss'

// --- Tiptap UI ---
import { BlockQuoteButton } from '@/components/tiptap-ui/blockquote-button'
import { CodeBlockButton } from '@/components/tiptap-ui/code-block-button'
import {
  ColorHighlightPopover,
  ColorHighlightPopoverButton,
  ColorHighlightPopoverContent,
} from '@/components/tiptap-ui/color-highlight-popover'
import { HeadingDropdownMenu } from '@/components/tiptap-ui/heading-dropdown-menu'
import { ImageUploadButton } from '@/components/tiptap-ui/image-upload-button'
import { LinkButton, LinkContent, LinkPopover } from '@/components/tiptap-ui/link-popover'
import { ListDropdownMenu } from '@/components/tiptap-ui/list-dropdown-menu'
import { MarkButton } from '@/components/tiptap-ui/mark-button'
import { TextAlignButton } from '@/components/tiptap-ui/text-align-button'
import { UndoRedoButton } from '@/components/tiptap-ui/undo-redo-button'

// --- Icons ---
import { ArrowLeftIcon } from '@/components/tiptap-icons/arrow-left-icon'
import { HighlighterIcon } from '@/components/tiptap-icons/highlighter-icon'
import { LinkIcon } from '@/components/tiptap-icons/link-icon'

// --- Hooks ---
import { useMobile } from '@/hooks/use-mobile'

// --- Lib ---
import { createImageUploadHandler, MAX_FILE_SIZE } from '@/lib/tiptap-utils'

// --- Styles ---
import '@/styles/simple-editor.scss'

// --- Redux ---
import { useAppSelector } from '@/redux/hooks'
import { selectAccessToken, selectCurrentUser } from '@/redux/selectors/auth/authSelectors'
import { useGetUsersQuery } from '@/redux/api/user/usersApi'
import { useGetCategoriesQuery } from '@/redux/api/category/categoriesApi'
import { useGetTagsQuery, useCreateTagMutation } from '@/redux/api/tags/tagsApi'
import { useCreatePostMutation, useUpdatePostMutation, useGetPostByIdQuery } from '@/redux/api/post/posts.api'
import { PostStatus, PostType, type Post } from '@/redux/types/post/posts.types'
import type { User } from '@/redux/types/user/users.types'
import type { AuthUser } from '@/redux/types/auth/types'

// --- UI Components ---
import { DatePicker } from '@/components/ui/date-picker'
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

// --- Router ---
import { useRouter } from 'next/navigation'

// ─── Toolbar ────────────────────────────────────────────────────────────────────

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
}: {
  onHighlighterClick: () => void
  onLinkClick: () => void
  isMobile: boolean
}) => (
  <>
    <Spacer />
    <ToolbarGroup>
      <UndoRedoButton action="undo" />
      <UndoRedoButton action="redo" />
    </ToolbarGroup>
    <ToolbarSeparator />
    <ToolbarGroup>
      <HeadingDropdownMenu levels={[1, 2, 3, 4]} />
      <ListDropdownMenu types={['bulletList', 'orderedList', 'taskList']} />
      <BlockQuoteButton />
      <CodeBlockButton />
    </ToolbarGroup>
    <ToolbarSeparator />
    <ToolbarGroup>
      <MarkButton type="bold" />
      <MarkButton type="italic" />
      <MarkButton type="strike" />
      <MarkButton type="code" />
      <MarkButton type="underline" />
      {!isMobile ? <ColorHighlightPopover /> : <ColorHighlightPopoverButton onClick={onHighlighterClick} />}
      {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
    </ToolbarGroup>
    <ToolbarSeparator />
    <ToolbarGroup>
      <MarkButton type="superscript" />
      <MarkButton type="subscript" />
    </ToolbarGroup>
    <ToolbarSeparator />
    <ToolbarGroup>
      <TextAlignButton align="left" />
      <TextAlignButton align="center" />
      <TextAlignButton align="right" />
      <TextAlignButton align="justify" />
    </ToolbarGroup>
    <ToolbarSeparator />
    <ToolbarGroup>
      <ImageUploadButton text="Add" />
    </ToolbarGroup>
    <Spacer />
  </>
)

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: 'highlighter' | 'link'
  onBack: () => void
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === 'highlighter' ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>
    <ToolbarSeparator />
    {type === 'highlighter' ? <ColorHighlightPopoverContent /> : <LinkContent />}
  </>
)

// ─── Author Combobox ────────────────────────────────────────────────────────────

function AuthorCombobox({
  selectedUserId,
  onSelect,
}: {
  selectedUserId: string
  onSelect: (userId: string, user: User) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')

  const { data: usersData } = useGetUsersQuery(
    { search: search || undefined, limit: 50 },
    { refetchOnMountOrArgChange: false }
  )

  const users = usersData?.items || []
  const selectedUser = users.find((u) => u.id === selectedUserId)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-9 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm ring-offset-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
        >
          {selectedUser
            ? selectedUser.display_name || selectedUser.username || selectedUser.email
            : 'Select author...'}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-2 opacity-50"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search authors..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No authors found.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.id}
                  onSelect={() => {
                    onSelect(user.id, user)
                    setOpen(false)
                    setSearch('')
                  }}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {user.display_name || user.username}
                    </span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                  {user.id === selectedUserId && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-auto"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// ─── Main Editor ────────────────────────────────────────────────────────────────

interface AdminPostEditorProps {
  /** For edit mode — pass an existing post id */
  editPostId?: string
}

export default function AdminPostEditor({ editPostId }: AdminPostEditorProps) {
  const router = useRouter()
  const isEditMode = Boolean(editPostId)

  // --- Auth ---
  const currentUser = useAppSelector(selectCurrentUser) as AuthUser | null
  const accessToken = useAppSelector(selectAccessToken) || ''
  const userId = currentUser?.id || ''
  const isAdmin =
    currentUser?.role === 'admin' || currentUser?.role === 'super_admin'

  // --- API hooks ---
  const [createPost, { isLoading: isCreating }] = useCreatePostMutation()
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation()
  const [createTag] = useCreateTagMutation()
  const { data: categoriesData } = useGetCategoriesQuery()
  const { data: tagsData = [] } = useGetTagsQuery()
  const { data: existingPost, isLoading: isLoadingPost } = useGetPostByIdQuery(
    editPostId || '',
    { skip: !editPostId }
  )
  const isSubmitting = isCreating || isUpdating
  const categories = categoriesData?.items || []

  // --- Image upload handler w/ auth token ---
  const imageUploadHandler = React.useMemo(
    () => createImageUploadHandler(accessToken),
    [accessToken]
  )

  // --- State ---
  const isMobile = useMobile()
  const [mobileView, setMobileView] = React.useState<'main' | 'highlighter' | 'link'>('main')
  const toolbarRef = React.useRef<HTMLDivElement>(null)

  const [selectedTags, setSelectedTags] = React.useState<{ id: string; name: string }[]>([])
  const [tagInput, setTagInput] = React.useState('')
  const [featuredImageUrl, setFeaturedImageUrl] = React.useState('')
  const [isPublishDialogOpen, setIsPublishDialogOpen] = React.useState(false)
  const [selectedCategories, setSelectedCategories] = React.useState<{ id: string; name: string }[]>([])
  const [categoryQuery, setCategoryQuery] = React.useState('')
  const [postType, setPostType] = React.useState<string>('standard')
  const [excerpt, setExcerpt] = React.useState('')
  const [editPopulated, setEditPopulated] = React.useState(false)

  // --- Admin-only fields ---
  const [publishedAt, setPublishedAt] = React.useState<Date | undefined>(undefined)
  const [assignedUserId, setAssignedUserId] = React.useState<string>('')
  const [statusMessage, setStatusMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // --- Editors ---
  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        'aria-label': 'Main content area, start typing to enter text.',
        class: 'prose mx-auto max-w-screen-md dark:prose-invert lg:prose-lg',
      },
    },
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      Placeholder.configure({
        placeholder: () => 'Write, type "/" for commands...',
      }),
      ImageUploadNode.configure({
        accept: 'image/*',
        maxSize: MAX_FILE_SIZE,
        limit: 5,
        upload: imageUploadHandler,
        onError: (error: Error) => console.error('Upload failed:', error),
      }),
      TrailingNode,
      Link.configure({ openOnClick: false }),
    ],
    content: '',
  })

  const featuredImageEditor = useEditor({
    immediatelyRender: false,
    editable: false,
    editorProps: {
      attributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        'aria-label': 'Featured image area.',
        class: 'prose mx-auto max-w-screen-md dark:prose-invert lg:prose-lg featuredImageEditor',
      },
    },
    extensions: [
      SingleImageDocument,
      StarterKit,
      Image,
      ImageUploadNode.configure({
        accept: 'image/*',
        maxSize: MAX_FILE_SIZE,
        limit: 1,
        upload: imageUploadHandler,
        onError: (error: Error) => {
          console.error('Upload failed:', error)
          setFeaturedImageUrl('')
        },
        onSuccess: (url: string) => {
          setFeaturedImageUrl(url)
        },
      }),
    ],
    onUpdate: ({ editor: ed }) => {
      const content = ed.getJSON()
      if (content.content?.some((node) => node.type === 'imageUpload')) {
        setFeaturedImageUrl('')
      }
    },
  })

  const titleEditor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        'aria-label': 'Title area, start typing to enter text.',
        class: 'prose mx-auto max-w-screen-md dark:prose-invert lg:prose-lg titleEditor',
      },
      handleKeyDown: (_view, event) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          return true
        }
        return false
      },
    },
    extensions: [
      SingleHeadingDocument,
      OnlyOneHeading.configure({ levels: [1] }),
      Placeholder.configure({
        placeholder: () => 'Write a title...',
      }),
      Text,
    ],
    onUpdate: ({ editor: ed }) => {
      const content = ed.getJSON()
      if (content.content && content.content.length > 1) {
        const firstNode = content?.content?.[0] as any
        ed.commands.setContent('<h1>' + (firstNode?.content?.[0]?.text || '') + '</h1>')
      }
    },
    content: '<h1></h1>',
  })

  // --- Populate editors in edit mode ---
  React.useEffect(() => {
    if (!isEditMode || !existingPost || editPopulated) return
    if (!editor || !titleEditor) return

    if (existingPost.title) {
      titleEditor.commands.setContent(`<h1>${existingPost.title}</h1>`)
    }
    if (existingPost.content) {
      editor.commands.setContent(existingPost.content)
    }
    if (existingPost.featured_image) {
      setFeaturedImageUrl(existingPost.featured_image)
      if (featuredImageEditor) {
        featuredImageEditor.commands.setContent(
          `<img src="${existingPost.featured_image}" alt="Featured image" />`
        )
      }
    }
    if (existingPost.tags && existingPost.tags.length > 0) {
      const mapped = existingPost.tags
        .filter((t: any) => t.tag || t.name)
        .map((t: any) => ({ id: t.tag?.id || t.id, name: t.tag?.name || t.name }))
      setSelectedTags(mapped)
    }
    if (existingPost.category) {
      setSelectedCategories([{ id: existingPost.category.id, name: existingPost.category.name }])
    }
    if (existingPost.excerpt) setExcerpt(existingPost.excerpt)
    if (existingPost.post_type) setPostType(existingPost.post_type)
    if (existingPost.published_at) setPublishedAt(new Date(existingPost.published_at))
    if (existingPost.user_id) setAssignedUserId(existingPost.user_id)

    setEditPopulated(true)
  }, [isEditMode, existingPost, editor, titleEditor, featuredImageEditor, editPopulated])

  // --- Helpers ---
  const getTitle = () => {
    if (!titleEditor) return ''
    const content = titleEditor.getJSON()
    const firstNode = content.content?.[0] as any
    return firstNode?.content?.[0]?.text || ''
  }

  const slugify = (text: string) =>
    text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '')

  // --- Tag helpers ---
  const tagSuggestions = React.useMemo(
    () => tagsData.map((t: any) => ({ id: t.id, name: t.name })),
    [tagsData]
  )

  const filteredTagSuggestions = React.useMemo(
    () =>
      tagSuggestions.filter(
        (t) =>
          t.name.toLowerCase().includes(tagInput.toLowerCase()) &&
          !selectedTags.some((st) => st.id === t.id)
      ),
    [tagSuggestions, tagInput, selectedTags]
  )

  const addTag = (tag: { id: string; name: string }) => {
    if (selectedTags.length >= 5) return
    if (!selectedTags.some((t) => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag])
    }
    setTagInput('')
  }

  const removeTag = (id: string) => {
    setSelectedTags(selectedTags.filter((t) => t.id !== id))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      const existing = tagSuggestions.find(
        (t) => t.name.toLowerCase() === tagInput.toLowerCase()
      )
      if (existing) {
        addTag(existing)
      } else {
        // Create new tag with temporary id
        addTag({ id: `new-${Date.now()}`, name: tagInput.trim() })
      }
    }
    if (e.key === 'Backspace' && !tagInput && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1].id)
    }
  }

  // --- Category filter ---
  const filteredCategories = categories.filter((cat) => {
    const isAlreadySelected = selectedCategories.some((s) => s.id === cat.id)
    const matchesQuery = cat.name.toLowerCase().includes(categoryQuery.toLowerCase())
    return !isAlreadySelected && matchesQuery
  })

  // --- Publish ---
  const handlePublish = async (status: PostStatus = PostStatus.DRAFT) => {
    setStatusMessage(null)
    const title = getTitle()
    if (!title) {
      setStatusMessage({ type: 'error', text: 'Please add a title for your post.' })
      return
    }
    const htmlContent = editor?.getHTML() || ''
    if (!htmlContent || htmlContent === '<p></p>') {
      setStatusMessage({ type: 'error', text: 'Please add some content to your post.' })
      return
    }
    if (selectedCategories.length === 0) {
      setStatusMessage({ type: 'error', text: 'Please select at least one category.' })
      return
    }
    if (!userId) {
      setStatusMessage({ type: 'error', text: 'You must be logged in to publish.' })
      return
    }

    const isUUID = (id: string) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('slug', slugify(title))
    formData.append('content', htmlContent)
    formData.append('category_id', selectedCategories[0].id)
    formData.append('status', status)

    // Admin-only: assign to a different author
    if (isAdmin && assignedUserId) {
      formData.append('user_id', assignedUserId)
    }

    // Admin-only: set published date (past date)
    if (isAdmin && publishedAt) {
      formData.append('published_at', publishedAt.toISOString())
    }

    if (excerpt.trim()) {
      formData.append('excerpt', excerpt.trim())
    }
    if (postType && postType !== 'standard') {
      formData.append('post_type', postType)
    }

    // Multi-category support
    for (const cat of selectedCategories) {
      formData.append('category_ids[]', cat.id)
    }

    // Featured image
    if (featuredImageUrl) {
      if (featuredImageUrl.startsWith('data:')) {
        try {
          const res = await fetch(featuredImageUrl)
          const blob = await res.blob()
          const file = new File([blob], 'featured-image.jpg', { type: blob.type })
          formData.append('featured_image', file)
        } catch {
          formData.append('featured_image', featuredImageUrl)
        }
      } else {
        if (!isEditMode || featuredImageUrl !== existingPost?.featured_image) {
          formData.append('featured_image', featuredImageUrl)
        }
      }
    }

    // Tags
    if (selectedTags.length > 0) {
      for (const tag of selectedTags) {
        if (isUUID(tag.id)) {
          formData.append('tag_ids[]', tag.id)
        } else {
          try {
            const created = await createTag({ name: tag.name, slug: slugify(tag.name) }).unwrap()
            if (created?.id) {
              formData.append('tag_ids[]', created.id)
            }
          } catch {
            const existing = tagsData.find(
              (t: any) => t.name.toLowerCase() === tag.name.toLowerCase()
            )
            if (existing?.id) {
              formData.append('tag_ids[]', existing.id)
            }
          }
        }
      }
    }

    try {
      if (isEditMode && editPostId) {
        await updatePost({ id: editPostId, body: formData }).unwrap()
        setStatusMessage({ type: 'success', text: 'Post updated successfully!' })
      } else {
        const result = await createPost(formData).unwrap()
        const resultStatus = (result as any)?.status as string | undefined
        if (status === PostStatus.PUBLISHED) {
          if (resultStatus === 'pending' || resultStatus === PostStatus.PENDING) {
            setStatusMessage({
              type: 'success',
              text: 'Your post has been submitted for review.',
            })
          } else {
            setStatusMessage({ type: 'success', text: 'Post published successfully!' })
          }
        } else {
          setStatusMessage({ type: 'success', text: 'Post saved as draft!' })
        }
      }
      setTimeout(() => router.push('/posts'), 1500)
    } catch (err: any) {
      const message =
        err?.data?.message || err?.error || 'Failed to submit post. Please try again.'
      setStatusMessage({ type: 'error', text: message })
    }
  }

  React.useEffect(() => {
    if (!isMobile && mobileView !== 'main') {
      setMobileView('main')
    }
  }, [isMobile, mobileView])

  if (isEditMode && isLoadingPost) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Loading post...</p>
      </div>
    )
  }

  return (
    <EditorContext.Provider value={{ editor }}>
      <>
        {/* ─── Top Bar ─────────────────────────────────────────────────────── */}
        <div className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b border-gray-200 bg-white/95 px-4 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/95">
          <div className="flex items-center gap-2">
            <Button data-style="ghost" onClick={() => router.push('/posts')}>
              <ArrowLeftIcon className="tiptap-button-icon" />
              <span className="text-nowrap text-sm font-medium">Exit editor</span>
            </Button>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {statusMessage && (
              <span
                className={`text-sm ${
                  statusMessage.type === 'error' ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {statusMessage.text}
              </span>
            )}
            <Button
              data-style="ghost"
              onClick={() => handlePublish(PostStatus.DRAFT)}
              disabled={isSubmitting}
              className="text-sm!"
            >
              {isSubmitting ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button
              data-style="ghost"
              onClick={() => setIsPublishDialogOpen(true)}
              className="text-sm! rounded-lg! bg-gray-900! text-white! hover:bg-gray-800! dark:bg-white! dark:text-gray-900! dark:hover:bg-gray-200! px-4! py-1.5!"
            >
              {isEditMode ? 'Update' : 'Publish'}
            </Button>
          </div>
        </div>

        {/* ─── Title + Featured Image + Excerpt ──────────────────────────── */}
        <div className="title-wrapper container mt-10 sm:mt-14">
          <div className="mx-auto max-w-screen-md">
            <ImageUploadButton
              className="h-10! rounded-lg! ring-1! ring-gray-300! hover:ring-gray-400! dark:ring-gray-600! dark:hover:ring-gray-500! transition-all"
              text={featuredImageUrl ? 'Update featured image' : 'Add featured image'}
              editor={featuredImageEditor}
            />
          </div>
          <EditorContent editor={featuredImageEditor} role="presentation" />
          <EditorContent editor={titleEditor} role="presentation" />

          <div className="mx-auto mt-4 max-w-screen-md sm:mt-6">
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Write a brief excerpt or summary of your post..."
              rows={2}
              maxLength={500}
              className="w-full resize-none rounded-lg border border-gray-200 bg-transparent px-4 py-3 text-base text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 focus:ring-0 dark:border-gray-700 dark:text-gray-300 dark:placeholder:text-gray-500 dark:focus:border-gray-500"
            />
          </div>

          {/* Tags input */}
          <div className="mx-auto mt-5 max-w-screen-md sm:mt-8">
            <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-gray-300 px-2 py-1.5 focus-within:ring-2 focus-within:ring-blue-500 dark:border-gray-600 dark:bg-gray-800">
              {selectedTags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {tag.name}
                  <button
                    type="button"
                    onClick={() => removeTag(tag.id)}
                    className="hover:text-red-600 focus:outline-none"
                  >
                    &times;
                  </button>
                </span>
              ))}
              <div className="relative flex-1">
                <input
                  type="text"
                  className="min-w-32 w-full flex-1 border-none bg-transparent px-0 py-0.5 text-sm outline-none placeholder:text-gray-500 focus:ring-0 dark:text-white dark:placeholder:text-gray-400"
                  placeholder={selectedTags.length >= 5 ? 'Max tags reached' : 'Add a topic...'}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  disabled={selectedTags.length >= 5}
                />
                {tagInput && filteredTagSuggestions.length > 0 && (
                  <ul className="absolute left-0 z-50 mt-1 max-h-40 w-56 overflow-auto rounded-lg border bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    {filteredTagSuggestions.slice(0, 10).map((t) => (
                      <li
                        key={t.id}
                        className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => addTag(t)}
                      >
                        {t.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Toolbar ────────────────────────────────────────────────────── */}
        <Toolbar ref={toolbarRef} className="my-6 sm:my-10">
          {mobileView === 'main' ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView('highlighter')}
              onLinkClick={() => setMobileView('link')}
              isMobile={isMobile}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === 'highlighter' ? 'highlighter' : 'link'}
              onBack={() => setMobileView('main')}
            />
          )}
        </Toolbar>

        {/* ─── Editor Content ─────────────────────────────────────────────── */}
        <div className="content-wrapper container pb-20">
          <EditorContent editor={editor} role="presentation" className="simple-editor-content" />
        </div>
      </>

      {/* ─── Publish Dialog ──────────────────────────────────────────────── */}
      {isPublishDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-lg font-semibold">
              {isEditMode ? 'Review & Update' : 'Review & Publish'}
            </h2>

            <div className="mt-4 flex flex-col gap-5 text-sm">
              {/* Categories */}
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 dark:text-gray-300">
                  Categories *
                </label>
                <div className="relative">
                  <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-gray-300 px-2 py-1.5 focus-within:ring-2 focus-within:ring-blue-500 dark:border-gray-600 dark:bg-gray-800">
                    {selectedCategories.map((cat) => (
                      <span
                        key={cat.id}
                        className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                      >
                        {cat.name}
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedCategories(selectedCategories.filter((c) => c.id !== cat.id))
                          }
                          className="hover:text-red-600 focus:outline-none"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      className="min-w-32 flex-1 border-none bg-transparent px-0 py-0.5 text-sm outline-none placeholder:text-gray-500 focus:ring-0 dark:text-white dark:placeholder:text-gray-400"
                      placeholder={
                        selectedCategories.length > 0 ? 'Add more...' : 'Search categories...'
                      }
                      value={categoryQuery}
                      onChange={(e) => setCategoryQuery(e.target.value)}
                    />
                  </div>
                  {categoryQuery && filteredCategories.length > 0 && (
                    <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-lg border bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                      {filteredCategories.map((cat) => (
                        <li
                          key={cat.id}
                          className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => {
                            setSelectedCategories([
                              ...selectedCategories,
                              { id: cat.id, name: cat.name },
                            ])
                            setCategoryQuery('')
                          }}
                        >
                          {cat.name}
                        </li>
                      ))}
                    </ul>
                  )}
                  {categoryQuery && filteredCategories.length === 0 && (
                    <div className="absolute z-50 mt-1 w-full rounded-lg border bg-white p-2 text-sm text-gray-500 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                      No categories found
                    </div>
                  )}
                </div>
              </div>

              {/* Post Type */}
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 dark:text-gray-300">
                  Post Type
                </label>
                <select
                  value={postType}
                  onChange={(e) => setPostType(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value="standard">Standard</option>
                  <option value="opinion">Opinion</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="gallery">Gallery</option>
                </select>
              </div>

              <hr className="border-gray-200 dark:border-gray-700" />

              {/* Admin-only: Assign Author */}
              {isAdmin && (
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-gray-700 dark:text-gray-300">
                    Assign Author{' '}
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-normal text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                      Admin only
                    </span>
                  </label>
                  <AuthorCombobox
                    selectedUserId={assignedUserId || userId}
                    onSelect={(id) => setAssignedUserId(id)}
                  />
                  <p className="text-xs text-gray-500">
                    Leave as-is to assign to yourself, or select a different author.
                  </p>
                </div>
              )}

              {/* Admin-only: Published Date */}
              {isAdmin && (
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-gray-700 dark:text-gray-300">
                    Published Date{' '}
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-normal text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                      Admin only
                    </span>
                  </label>
                  <DatePicker
                    date={publishedAt}
                    onDateChange={setPublishedAt}
                    placeholder="Pick a date (optional, defaults to now)"
                  />
                  <p className="text-xs text-gray-500">
                    Set a past date to backdate the post. Only admins can set past dates.
                  </p>
                  {publishedAt && (
                    <button
                      type="button"
                      onClick={() => setPublishedAt(undefined)}
                      className="self-start text-xs text-red-600 hover:underline"
                    >
                      Clear date
                    </button>
                  )}
                </div>
              )}

              <hr className="border-gray-200 dark:border-gray-700" />

              {/* Preview */}
              <div className="flex flex-wrap gap-2.5">
                <span className="text-gray-600 dark:text-gray-400">Title:</span>
                <span className="font-medium">{getTitle() || 'No title'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-gray-600 dark:text-gray-400">Excerpt:</span>
                <span className="text-sm">
                  {excerpt || (
                    <span className="italic text-gray-400">
                      No excerpt (will auto-generate from content)
                    </span>
                  )}
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <span className="text-gray-600 dark:text-gray-400">Tags:</span>
                <span>
                  {selectedTags.map((t) => t.name).join(', ') || 'No tags'}
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                <span className="text-gray-600 dark:text-gray-400">Featured image:</span>
                <span>{featuredImageUrl ? 'Uploaded' : 'No featured image'}</span>
              </div>
              <div className="flex flex-col gap-2.5">
                <span className="text-gray-600 dark:text-gray-400">Content preview:</span>
                <div
                  className="prose prose-sm max-h-40 overflow-y-auto rounded border border-gray-200 p-3 dark:prose-invert dark:border-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: editor?.getHTML() || '<p>No content</p>',
                  }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsPublishDialogOpen(false)}
                disabled={isSubmitting}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handlePublish(PostStatus.DRAFT)}
                disabled={isSubmitting}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
              >
                {isSubmitting ? 'Saving...' : 'Save as Draft'}
              </button>
              <button
                type="button"
                onClick={() => handlePublish(PostStatus.PUBLISHED)}
                disabled={isSubmitting}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                {isSubmitting
                  ? isEditMode
                    ? 'Updating...'
                    : 'Publishing...'
                  : isEditMode
                    ? 'Update'
                    : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </EditorContext.Provider>
  )
}
