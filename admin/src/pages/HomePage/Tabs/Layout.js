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
        <Typography variant={'beta'}>Columns</Typography>
      </Box>

      <GridLayout>
        <Box>
          <ToggleInput
            label="2 Columns"
            size="S"
            name="columns"
            onLabel="Enabled"
            offLabel="Disabled"
            checked={values.columns.includes('two')}
            onChange={e => handleChange({
              target: {
                name: 'columns',
                value: addRemoveFromList([...values.columns], 'two')
              }
            })}/>
        </Box>

        <Box>
          <ToggleInput
            label="3 Columns"
            size="S"
            name="columns"
            onLabel="Enabled"
            offLabel="Disabled"
            checked={values.columns.includes('three')}
            onChange={e => handleChange({
              target: {
                name: 'columns',
                value: addRemoveFromList([...values.columns], 'three')
              }
            })}/>
        </Box>
        <Box></Box>
        <Box></Box>
      </GridLayout>
    </Fragment>
  )
}
