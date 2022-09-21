import React, {Fragment} from 'react'
import {Box} from '@strapi/design-system/Box'
import {GridLayout} from '@strapi/design-system/Layout'
import {ToggleInput} from '@strapi/design-system/ToggleInput'
import {TextInput} from '@strapi/design-system/TextInput'
import {Typography} from '@strapi/design-system/Typography'
import { addRemoveFromList } from '../../../../../utils/helpers.js'

export default ({errors, values, handleChange, isSubmitting}) => {
  return (
    <Fragment>
      <Box marginBottom={'1rem'}>
        <Typography variant={'beta'}>Image</Typography>
      </Box>

      <GridLayout>
        <Box>
          <ToggleInput
            label="Images"
            hint="Allow to add images to content"
            size="S"
            name="image.enabled"
            onLabel="Enabled"
            offLabel="Disabled"
            checked={values.image.enabled}
            onChange={e => handleChange({
              target: {
                name: 'image.enabled',
                value: !values.image.enabled
              }
            })}/>
        </Box>
      </GridLayout>

      <Box marginTop={'1rem'} marginBottom={'1rem'}>
        <Typography variant={'delta'}>Settings</Typography>
      </Box>

      <GridLayout>
        <Box>
          <ToggleInput
            label="Inline"
            hint="Renders the image node inline"
            disabled={!values.image.enabled}
            size="S"
            name="image.inline"
            onLabel="Enabled"
            offLabel="Disabled"
            checked={values.image.inline}
            onChange={e => handleChange({
              target: {
                name: 'image.inline',
                value: !values.image.inline
              }
            })}/>
        </Box>

        <Box>
          <ToggleInput
            label="Allow base64 images"
            hint="Allow images to be parsed as base64 strings"
            disabled={!values.image.enabled}
            size="S"
            name="image.allowBase64"
            onLabel="Enabled"
            offLabel="Disabled"
            checked={values.image.allowBase64}
            onChange={e => handleChange({
              target: {
                name: 'image.allowBase64',
                value: !values.image.allowBase64
              }
            })}/>
        </Box>
        <Box></Box>
        <Box></Box>
      </GridLayout>

      <Box marginTop={'2rem'} marginBottom={'1rem'}>
        <Typography variant={'beta'}>Links</Typography>
      </Box>

      <GridLayout>
        <Box>
          <ToggleInput
            label="Enabled"
            hint="Allow to make text into links"
            size="S"
            name="links.enabled"
            onLabel="Enabled"
            offLabel="Disabled"
            checked={values.links.enabled}
            onChange={e => handleChange({
              target: {
                name: 'links.enabled',
                value: !values.links.enabled
              }
            })}/>
        </Box>
      </GridLayout>

      <Box marginTop={'1rem'} marginBottom={'1rem'}>
        <Typography variant={'delta'}>Settings</Typography>
      </Box>

      <GridLayout>
        <Box>
          <ToggleInput
            label="Auto link"
            hint="If enabled, it adds links as you type."
            disabled={!values.links.enabled}
            size="S"
            name="links.autolink"
            onLabel="Enabled"
            offLabel="Disabled"
            checked={values.links.autolink}
            onChange={e => handleChange({
              target: {
                name: 'links.autolink',
                value: !values.links.autolink
              }
            })}/>
        </Box>

        <Box>
          <ToggleInput
            label="Open on click"
            hint="Open the link, when clicking it inside the editor"
            disabled={!values.links.enabled}
            size="S"
            name="links.openOnClick"
            onLabel="Enabled"
            offLabel="Disabled"
            checked={values.links.openOnClick}
            onChange={e => handleChange({
              target: {
                name: 'links.autolink',
                value: !values.links.openOnClick
              }
            })}/>
        </Box>

        <Box>
          <ToggleInput
            label="Link on paste"
            hint="Adds a link to the current selection if the pasted content only contains an url."
            disabled={!values.links.enabled}
            size="S"
            name="links.linkOnPaste"
            onLabel="Enabled"
            offLabel="Disabled"
            checked={values.links.linkOnPaste}
            onChange={e => handleChange({
              target: {
                name: 'links.linkOnPaste',
                value: !values.links.linkOnPaste
              }
            })}/>
        </Box>
        <Box></Box>
      </GridLayout>

      <GridLayout>
        <Box>
          <TextInput
            label="Rel attribute value"
            type="text"
            placeholder="Value of the rel attribute of links"
            name="rel" onChange={e => handleChange({
            target: {
              name: 'links.HTMLAttributes.rel',
              value: e.target.value
            }
          })}
            value={values.links.HTMLAttributes.rel}
            aria-label="Value of the rel attribute of links"/>
        </Box>
        <Box></Box>
        <Box></Box>
        <Box></Box>
      </GridLayout>

      <Box marginTop={'2rem'} marginBottom={'1rem'}>
        <Typography variant={'beta'}>YouTube</Typography>
      </Box>

      <GridLayout>
        <Box>
          <ToggleInput
            label="Enabled"
            hint="Allow to add YouTube video embeds"
            size="S"
            name="youtube.enabled"
            onLabel="Enabled"
            offLabel="Disabled"
            checked={values.youtube.enabled}
            onChange={e => handleChange({
              target: {
                name: 'youtube.enabled',
                value: !values.youtube.enabled
              }
            })}/>
        </Box>

        <Box>
          <TextInput
            label="Default video width"
            type="number"
            placeholder="width of the embed"
            name="width" onChange={e => handleChange({
                target: {
                  name: 'youtube.width',
                  value: e.target.value
                }
              })}
            value={values.youtube.width}
            aria-label="YouTube video width"/>
        </Box>

        <Box>
          <TextInput
            label="Default video height"
            type="number"
            placeholder="height of the embed"
            name="height"
            onChange={e => handleChange({
            target: {
              name: 'youtube.height',
              value: e.target.value
            }
          })}
            value={values.youtube.height}
            aria-label="YouTube video height"/>
        </Box>
      </GridLayout>
    </Fragment>
  )
}
