import React, {Fragment} from 'react'
import {Box} from '@strapi/design-system/Box'
import {GridLayout} from '@strapi/design-system/Layout'
import {ToggleInput} from '@strapi/design-system/ToggleInput'
import {Typography} from '@strapi/design-system/Typography'
import {addRemoveFromList} from '../../../../../utils/helpers.js'

export default ({errors, values, handleChange, isSubmitting}) => {
  return (<Fragment>
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
                name: 'columns', value: addRemoveFromList([...values.columns], 'two')
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
                name: 'columns', value: addRemoveFromList([...values.columns], 'three')
              }
            })}/>
        </Box>
        <Box></Box>
        <Box></Box>
      </GridLayout>

      <Box marginTop="2rem" marginBottom={'1rem'}>
        <Typography variant={'beta'}>Table</Typography>
      </Box>

      <GridLayout>
        <Box>
          <ToggleInput
            label="Enable table"
            size="S"
            name="table"
            onLabel="Enabled"
            offLabel="Disabled"
            checked={values.table}
            onChange={e => handleChange({
              target: {
                name: 'table', value: !values.table
              }
            })}/>
        </Box>
        <Box></Box>
        <Box></Box>
        <Box></Box>
      </GridLayout>


    <Box marginTop="2rem" marginBottom={'1rem'}>
      <Typography variant={'beta'}>Horizontal Rule</Typography>
    </Box>

    <GridLayout>
      <Box>
        <ToggleInput
          label="Enable horizontal rule"
          size="S"
          name="horizontal"
          onLabel="Enabled"
          offLabel="Disabled"
          checked={values.horizontal}
          onChange={e => handleChange({
            target: {
              name: 'horizontal', value: !values.horizontal
            }
          })}/>
      </Box>
      <Box></Box>
      <Box></Box>
      <Box></Box>
    </GridLayout>

    <Box marginTop="2rem" marginBottom={'1rem'}>
      <Typography variant={'beta'}>Hardbreak</Typography>
    </Box>

    <GridLayout>
      <Box>
        <ToggleInput
          label="Enable hardbreaks"
          size="S"
          name="hardbreak"
          onLabel="Enabled"
          offLabel="Disabled"
          checked={values.hardbreak}
          onChange={e => handleChange({
            target: {
              name: 'hardbreak', value: !values.hardbreak
            }
          })}/>
      </Box>
      <Box></Box>
      <Box></Box>
      <Box></Box>
    </GridLayout>
    </Fragment>)
}
