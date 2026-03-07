import type { Attrs, Node } from '@tiptap/pm/model'
import type { Editor } from '@tiptap/react'

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export const isMarkInSchema = (markName: string, editor: Editor | null): boolean => {
  if (!editor?.schema) return false
  return editor.schema.spec.marks.get(markName) !== undefined
}

export const isNodeInSchema = (nodeName: string, editor: Editor | null): boolean => {
  if (!editor?.schema) return false
  return editor.schema.spec.nodes.get(nodeName) !== undefined
}

export function getActiveMarkAttrs(editor: Editor | null, markName: string): Attrs | null {
  if (!editor) return null
  const { state } = editor
  const marks = state.storedMarks || state.selection.$from.marks()
  const mark = marks.find((mark) => mark.type.name === markName)
  return mark?.attrs ?? null
}

export function isEmptyNode(node?: Node | null): boolean {
  return !!node && node.content.size === 0
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function findNodePosition(props: {
  editor: Editor | null
  node?: Node | null
  nodePos?: number | null
}): { pos: number; node: Node } | null {
  const { editor, node, nodePos } = props

  if (!editor || !editor.state?.doc) return null

  const hasValidNode = node !== undefined && node !== null
  const hasValidPos = nodePos !== undefined && nodePos !== null

  if (!hasValidNode && !hasValidPos) {
    return null
  }

  if (hasValidPos) {
    try {
      const nodeAtPos = editor.state.doc.nodeAt(nodePos!)
      if (nodeAtPos) {
        return { pos: nodePos!, node: nodeAtPos }
      }
    } catch (error) {
      console.error('Error checking node at position:', error)
      return null
    }
  }

  let foundPos = -1
  let foundNode: Node | null = null

  editor.state.doc.descendants((currentNode, pos) => {
    if (currentNode === node) {
      foundPos = pos
      foundNode = currentNode
      return false
    }
    return true
  })

  return foundPos !== -1 && foundNode !== null ? { pos: foundPos, node: foundNode } : null
}

/**
 * Creates an image upload handler that uses the admin API.
 * Call this with an auth token to get a configured upload function.
 */
export const createImageUploadHandler = (authToken?: string) => {
  return async (
    file: File,
    onProgress?: (event: { progress: number }) => void,
    abortSignal?: AbortSignal
  ): Promise<string> => {
    if (!file) {
      throw new Error('No file provided')
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds maximum allowed (${MAX_FILE_SIZE / (1024 * 1024)}MB)`)
    }

    const formData = new FormData()
    formData.append('images', file)

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

    const xhr = new XMLHttpRequest()
    
    return new Promise<string>((resolve, reject) => {
      if (abortSignal) {
        abortSignal.addEventListener('abort', () => {
          xhr.abort()
          reject(new Error('Upload cancelled'))
        })
      }

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          onProgress?.({ progress: Math.round((e.loaded / e.total) * 100) })
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)
            const url = response?.urls?.[0]
            if (url) {
              resolve(url)
            } else {
              reject(new Error('Upload succeeded but no URL returned'))
            }
          } catch {
            reject(new Error('Invalid response from upload'))
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      })

      xhr.addEventListener('error', () => reject(new Error('Upload failed')))
      xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')))

      xhr.open('POST', `${apiUrl}/posts/upload-media`)
      if (authToken) {
        xhr.setRequestHeader('Authorization', `Bearer ${authToken}`)
      }
      xhr.send(formData)
    })
  }
}

/**
 * Default image upload handler (for backward compatibility / use in contexts where token is passed differently).
 */
export const handleImageUpload = createImageUploadHandler()

export const convertFileToBase64 = (file: File, abortSignal?: AbortSignal): Promise<string> => {
  if (!file) {
    return Promise.reject(new Error('No file provided'))
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    const abortHandler = () => {
      reader.abort()
      reject(new Error('Upload cancelled'))
    }

    if (abortSignal) {
      abortSignal.addEventListener('abort', abortHandler)
    }

    reader.onloadend = () => {
      if (abortSignal) {
        abortSignal.removeEventListener('abort', abortHandler)
      }

      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to convert File to base64'))
      }
    }

    reader.onerror = (error) => reject(new Error(`File reading error: ${error}`))
    reader.readAsDataURL(file)
  })
}
