/*
 *
 * Settings page
 *
 */

import React, {memo, useEffect, useState} from 'react'
import {Layouts, Page, useNotification} from '@strapi/strapi/admin'
import {getSettings, updateSettings} from '../../utils/api'
import {withDefaults} from '../../utils/useSettings'
import {setIn} from '../../utils/helpers'

// Fields and UI
import {Box, Button, Tabs} from '@strapi/design-system'

// Icons
import {Check} from '@strapi/icons'

// Tab contents
import TextTabContent from './Tabs/Text'
import LayoutTabContent from './Tabs/Layout'
import EmbedsTabContent from './Tabs/Embeds'
import OtherTabContent from './Tabs/Other'

const SettingsPage = () => {
  const {toggleNotification} = useNotification()
  const [values, setValues] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    getSettings()
      .then(savedSettings => setValues(withDefaults(savedSettings)))
      .catch(() => {
        toggleNotification({type: 'danger', message: 'Could not load the editor settings'})
        setValues(withDefaults({}))
      })
  }, [])

  // Same signature as Formik's handleChange, which the tabs were written against
  const handleChange = ({target: {name, value}}) => setValues(prev => setIn(prev, name, value))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await updateSettings(values)
      toggleNotification({type: 'success', message: 'Saved'})
    } catch (err) {
      toggleNotification({type: 'warning', message: 'Saved failed'})
    } finally {
      setIsSubmitting(false)
    }
  }

  if (values === null) {
    return <Page.Loading/>
  }

  const tabProps = {values, handleChange, isSubmitting, errors: {}}

  return (
    <Page.Main>
      <Page.Title>Strapi TipTap Editor settings</Page.Title>
      <form onSubmit={handleSubmit}>
        <Layouts.Header
          title={'Strapi TipTap Editor settings'}
          subtitle={'Change how the editor should behave'}
          primaryAction={
            <Button
              loading={isSubmitting}
              type="submit"
              startIcon={<Check/>}
              size="L"
            >
              Save
            </Button>
          }
        />
        <Layouts.Content>
          <Box
            background="neutral0"
            hasRadius
            shadow="filterShadow"
            paddingTop={6}
            paddingBottom={6}
            paddingLeft={7}
            paddingRight={7}
          >
            <Tabs.Root defaultValue="text" variant="simple">
              <Tabs.List aria-label="Editor settings">
                <Tabs.Trigger value="text">Text</Tabs.Trigger>
                <Tabs.Trigger value="layout">Layout</Tabs.Trigger>
                <Tabs.Trigger value="embeds">Embeds</Tabs.Trigger>
                <Tabs.Trigger value="other">Other</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="text">
                <Box color="neutral800" padding={4} background="neutral0">
                  <TextTabContent {...tabProps}/>
                </Box>
              </Tabs.Content>
              <Tabs.Content value="layout">
                <Box color="neutral800" padding={4} background="neutral0">
                  <LayoutTabContent {...tabProps}/>
                </Box>
              </Tabs.Content>
              <Tabs.Content value="embeds">
                <Box color="neutral800" padding={4} background="neutral0">
                  <EmbedsTabContent {...tabProps}/>
                </Box>
              </Tabs.Content>
              <Tabs.Content value="other">
                <Box color="neutral800" padding={4} background="neutral0">
                  <OtherTabContent {...tabProps}/>
                </Box>
              </Tabs.Content>
            </Tabs.Root>
          </Box>
        </Layouts.Content>
      </form>
    </Page.Main>
  )
}

export default memo(SettingsPage)
