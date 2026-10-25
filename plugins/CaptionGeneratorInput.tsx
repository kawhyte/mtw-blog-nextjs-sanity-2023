import { SparklesIcon } from '@sanity/icons'
import { Box, Button, Stack, useToast } from '@sanity/ui'
import { useState } from 'react'
import type { StringInputProps } from 'sanity'
import { set, useFormValue } from 'sanity'

import { postForAi } from './aiRequest'

export function CaptionGeneratorInput(props: StringInputProps) {
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  // One level up from 'caption' gives us the parent image object
  const parentPath = props.path.slice(0, -1)
  const imageValue = useFormValue(parentPath) as any
  const assetRef = imageValue?.asset?._ref as string | undefined

  // Document context for smarter prompting
  const doc = useFormValue([]) as any
  const contentType = doc?._type as string | undefined
  const docTitle = (doc?.title ?? doc?.name) as string | undefined

  const handleGenerate = async () => {
    if (!assetRef) {
      toast.push({ status: 'warning', title: 'Upload an image first' })
      return
    }

    setLoading(true)
    try {
      const data = await postForAi<{ caption: string }>(
        '/api/generate-caption',
        {
          assetRef,
          contentType,
          docTitle,
        },
      )

      props.onChange(set(data.caption))
      toast.push({
        status: 'success',
        title: 'Caption generated',
        description: data.caption,
      })
    } catch (err: any) {
      toast.push({
        status: 'error',
        title: 'Failed to generate caption',
        description: err.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Stack space={2}>
      {props.renderDefault(props)}
      <Box>
        <Button
          icon={SparklesIcon}
          text={loading ? 'Generating…' : 'Generate Caption with AI'}
          tone="primary"
          mode="ghost"
          fontSize={1}
          padding={2}
          disabled={loading || !assetRef}
          onClick={handleGenerate}
        />
      </Box>
    </Stack>
  )
}
