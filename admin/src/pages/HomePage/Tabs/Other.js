import React, {Fragment} from 'react'
import {Box} from '@strapi/design-system/Box'
import {GridLayout} from '@strapi/design-system/Layout'
import {ToggleInput} from '@strapi/design-system/ToggleInput'
import {Typography} from '@strapi/design-system/Typography'
import { addRemoveFromList } from '../../../../../utils/helpers.js'

export default ({errors, values, handleChange, isSubmitting}) => {
  return (
    <Fragment>
      <Box marginBottom={'1rem'}>
        <Typography variant={'beta'}>Other</Typography>
      </Box>

      <GridLayout>
        <Box>
          <ToggleInput
            label="Word count"
            hint="Show a word counter under the editor"
            size="S"
            name="other.wordcount"
            onLabel="Enabled"
            offLabel="Disabled"
            checked={values.other.wordcount}
            onChange={e => handleChange({
              target: {
                name: 'other.wordcount',
                value: !values.other.wordcount
              }
            })}/>
        </Box>
      </GridLayout>
    </Fragment>
  )
}
