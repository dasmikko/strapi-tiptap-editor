/*
 *
 * HomePage
 *
 */

import React, {memo, Fragment} from 'react'
import {useQuery, useMutation, useQueryClient} from 'react-query'
import {getSettings, updateSettings} from '../../../../utils/api.js'

// Fields and UI
import {Main} from '@strapi/design-system/Main'
import {HeaderLayout, ContentLayout} from '@strapi/design-system/Layout'
import {Button} from '@strapi/design-system/Button'
import {Box} from '@strapi/design-system/Box'
import {Tabs, Tab, TabGroup, TabPanels, TabPanel} from '@strapi/design-system/Tabs'
import {Formik} from 'formik'
import {
  Form,
  LoadingIndicatorPage,
  useNotification,
  useOverlayBlocker
} from '@strapi/helper-plugin'

import defaultSettings from '../../../../utils/defaults.js'

// Icons
import Check from '@strapi/icons/Check'

// Tab contents
import TextTabContent from './Tabs/Text.js'
import LayoutTabContent from './Tabs/Layout.js'
import EmbedsTabContent from './Tabs/Embeds.js'
import OtherTabContent from './Tabs/Other.js'
import { mergeDeep } from "../../utils/merge";

const HomePage = (ctx) => {
  const toggleNotification = useNotification()
  const {lockApp, unlockApp} = useOverlayBlocker()

  const queryClient = useQueryClient()
  const query = useQuery('settings', getSettings)
  const mutation = useMutation(settings => updateSettings(settings), {
    onSuccess: async () => {
      // Refresh after mutation
      await queryClient.invalidateQueries('settings')
      toggleNotification({
        type: 'success',
        message: {id: 'strapi-tiptap-editor-save-success', defaultMessage: 'Saved'}
      })
      unlockApp()
    },
    onError: async () => {
      toggleNotification({
        type: 'warning',
        message: {id: 'strapi-tiptap-editor-save-error', defaultMessage: 'Saved failed'}
      })
      unlockApp()
    }
  })

  if (query.isLoading) {
    return (
      <Main aria-busy="true">
        <HeaderLayout
          title={'Strapi TipTap Editor settings'}
          subtitle={'Change how the editor should behave'}
        />
        <ContentLayout>
          <LoadingIndicatorPage/>
        </ContentLayout>
      </Main>
    )
  }

  // Merge saved settings with default values, in case new ones are added
  const mergedSettings = mergeDeep(defaultSettings, query.data)

  return (
    <Main aria-busy={query.isLoading}>
      <Formik
        initialValues={mergedSettings}
        onSubmit={async (values) => {
          lockApp()
          await mutation.mutateAsync(values)
        }}>
        {({errors, values, handleChange, isSubmitting}) => {
          return (
            <Form>
              <HeaderLayout
                title={'Strapi TipTap Editor settings'}
                subtitle={'Change how the editor should behave'}
                primaryAction={
                  <Button
                    isLoading={mutation.isLoading}
                    type="submit"
                    startIcon={<Check/>}
                    size="L"
                  >
                    Save
                  </Button>
                }
              />
              <ContentLayout>
                <Box
                  background="neutral0"
                  hasRadius
                  shadow="filterShadow"
                  paddingTop={6}
                  paddingBottom={6}
                  paddingLeft={7}
                  paddingRight={7}
                >
                  <TabGroup label="Some stuff for the label" id="tabs" variant="simple">
                    <Tabs>
                      <Tab>Text</Tab>
                      <Tab>Layout</Tab>
                      <Tab>Embeds</Tab>
                      <Tab>Other</Tab>
                    </Tabs>
                    <TabPanels>
                      <TabPanel>
                        <Box color="neutral800" padding={4} background="neutral0">
                          <TextTabContent
                            errors={errors}
                            values={values}
                            handleChange={handleChange}
                            isSubmitting={isSubmitting}
                          />
                        </Box>
                      </TabPanel>
                      <TabPanel>
                        <Box color="neutral800" padding={4} background="neutral0">
                          <LayoutTabContent
                            errors={errors}
                            values={values}
                            handleChange={handleChange}
                            isSubmitting={isSubmitting}
                          />
                        </Box>
                      </TabPanel>
                      <TabPanel>
                        {/* Embeds tab content*/}
                        <Box color="neutral800" padding={4} background="neutral0">
                          <EmbedsTabContent
                            errors={errors}
                            values={values}
                            handleChange={handleChange}
                            isSubmitting={isSubmitting}
                          />
                        </Box>
                      </TabPanel>
                      <TabPanel>
                        {/* Other tab content*/}
                        <Box color="neutral800" padding={4} background="neutral0">
                          <OtherTabContent
                            errors={errors}
                            values={values}
                            handleChange={handleChange}
                            isSubmitting={isSubmitting}
                          />
                        </Box>
                      </TabPanel>
                    </TabPanels>
                  </TabGroup>
                  {/* Main box end*/}
                </Box>
              </ContentLayout>
            </Form>
          )
        }}
      </Formik>
    </Main>
  )
}

export default memo(HomePage)
